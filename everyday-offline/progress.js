/* Completion rounds are per dialogue and per practice mode, independent of history. */
(function(root){
  const modes=['text','speech'];
  const count=n=>Number.isSafeInteger(n)&&n>=0?n:0;
  function migrate(saved,revision,migrations){
    const out={text:{},speech:{}};
    if(saved.completionCounts&&typeof saved.completionCounts==='object'){
      for(const mode of modes)for(const [id,n] of Object.entries(saved.completionCounts[mode]||{}))if(!['__proto__','constructor','prototype'].includes(id))out[mode][id]=count(n);
    }else for(const id of Array.isArray(saved.completedIds)?saved.completedIds:[])if(typeof id==='string'&&!['__proto__','constructor','prototype'].includes(id))out.text[id]=1;
    for(const m of migrations||[])if(Number(saved.progressRevision||0)<m.revision)for(const id of m.ids||[])for(const mode of modes)delete out[mode][id];
    return out;
  }
  function eligible(dialogues,counts,mode){
    if(!dialogues.length)return [];
    const min=Math.min(...dialogues.map(d=>count(counts[mode]?.[d.id])));
    return dialogues.filter(d=>count(counts[mode]?.[d.id])===min);
  }
  root.OfflineProgress={migrate,eligible,count};
})(typeof window!=='undefined'?window:globalThis);
