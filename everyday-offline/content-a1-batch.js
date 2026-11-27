(function(root){
  // Shared forms for the new A1 turns. The object and intent stay in each scene.
  root.A1BatchForms={
    ask: '(?:can|could|may) i',
    request: '(?:can|could|would) you',
    have: '(?:have|have got)',
    enough: '(?:is enough|will do|will work|is fine)'
  };

  root.A1BatchTurn=function(en,ru,task,best,examples,patterns,cases,options={}){
    const {stage='',...assessment}=options;
    const natural=[best,...examples];
    return {
      en,ru,task,best,natural,displayExamples:natural.slice(0,10),acceptable:[],rules:[],stage,
      assessment:{kind:'conversation',example:best,patterns,cases,...assessment}
    };
  };
})(typeof window!=='undefined'?window:globalThis);
