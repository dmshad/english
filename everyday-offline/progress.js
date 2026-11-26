/* Unified completion rounds, independent of history and text visibility. */
(function(root){
  const count=n=>Number.isSafeInteger(n)&&n>=0?n:0;
  const safe=id=>!['__proto__','constructor','prototype'].includes(id);
  function migrate(saved,revision,migrations){
    const out={};
    if(saved.progressFormat===2){
      for(const [id,n] of Object.entries(saved.completionCounts||{}))if(safe(id))out[id]=count(n);
    }else if(saved.completionCounts&&typeof saved.completionCounts==='object'){
      for(const mode of ['text','speech'])for(const [id,n] of Object.entries(saved.completionCounts[mode]||{}))if(safe(id))out[id]=Math.min(Number.MAX_SAFE_INTEGER,count(out[id])+count(n));
    }else for(const id of Array.isArray(saved.completedIds)?saved.completedIds:[])if(typeof id==='string'&&safe(id))out[id]=1;
    for(const m of migrations||[])if(Number(saved.progressRevision||0)<m.revision)for(const id of m.ids||[])delete out[id];
    return out;
  }
  function eligible(dialogues,counts){
    if(!dialogues.length)return [];
    const min=Math.min(...dialogues.map(d=>count(counts[d.id])));
    return dialogues.filter(d=>count(counts[d.id])===min);
  }
  function balanced(dialogues,counts,order=[],random=Math.random){
    const pool=eligible(dialogues,counts),topics=[...new Set(pool.map(d=>d.topic))];
    if(!topics.length)return [];
    const oldest=Math.min(...topics.map(t=>order.indexOf(t)));
    const next=topics.filter(t=>order.indexOf(t)===oldest);
    const topic=next[Math.floor(random()*next.length)];
    return pool.filter(d=>d.topic===topic);
  }
  function dayKey(date){
    return [date.getFullYear(),date.getMonth()+1,date.getDate()].map(n=>String(n).padStart(2,'0')).join('-');
  }
  function restoreActivity(saved,session,history){
    const days={};
    if(saved.activity){
      for(const [day,n] of Object.entries(saved.activity.days||{}))if(/^\d{4}-\d{2}-\d{2}$/.test(day)&&count(n))days[day]=n;
      return {days,undated:count(saved.activity.undated)};
    }
    // Legacy counts have no dates. Only the last saved session can prove
    // that its closing screen was passed, rather than merely reached.
    const counts=migrate(saved);
    let undated=Object.values(counts).reduce((sum,n)=>Math.min(Number.MAX_SAFE_INTEGER,sum+n),0);
    const h=history.find(h=>h.runId===session?.runId);
    if(session?.phase==='done'&&session.completedRecorded&&session.practiceReplay===false&&
        count(counts[session.id])&&h?.dialogue.id===session.id&&typeof h.updatedAt==='string'){
      const date=new Date(h.updatedAt);
      if(!Number.isNaN(date.getTime())){days[dayKey(date)]=1;undated--;}
    }
    return {days,undated};
  }
  function dateFor(day){
    const [year,month,date]=day.split('-').map(Number);
    return new Date(year,month-1,date,12);
  }
  function shift(date,days){
    return new Date(date.getFullYear(),date.getMonth(),date.getDate()+days,12);
  }
  function monday(date){return shift(date,-((date.getDay()+6)%7));}
  function summarizeActivity({days,undated},now=new Date()){
    const today=dayKey(now),start=monday(now),current=dayKey(start),past=new Map();
    const week=Array.from({length:7},(_,i)=>{
      const date=shift(start,i),key=dayKey(date);
      return {date,count:days[key]||0,today:key===today,future:key>today};
    });
    let total=undated;
    for(const [day,n] of Object.entries(days)){
      total+=n;
      if(day>=current)continue;
      const key=dayKey(monday(dateFor(day)));
      past.set(key,(past.get(key)||0)+n);
    }
    const previous=[...past.keys()].sort().reverse().map(key=>{
      const start=dateFor(key);
      return {start,end:shift(start,6),count:past.get(key)};
    });
    return {total,undated,week,previous,weekTotal:week.reduce((sum,day)=>sum+day.count,0)};
  }
  root.OfflineProgress={migrate,eligible,balanced,count,dayKey,restoreActivity,summarizeActivity};
})(typeof window!=='undefined'?window:globalThis);
