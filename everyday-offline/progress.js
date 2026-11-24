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
  root.OfflineProgress={migrate,eligible,balanced,count};
})(typeof window!=='undefined'?window:globalThis);
