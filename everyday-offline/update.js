/* User-triggered update check. Normal offline practice never accesses the network. */
(function(root){
  function newer(remote,current){
    if(!/^\d+(?:\.\d+)*$/.test(remote)||!/^\d+(?:\.\d+)*$/.test(current))return false;
    const a=remote.split('.').map(Number),b=current.split('.').map(Number);
    for(let i=0;i<Math.max(a.length,b.length);i++){if((a[i]||0)!==(b[i]||0))return (a[i]||0)>(b[i]||0);}return false;
  }
  async function check(href,current,online=true,request=root.fetch?.bind(root)){
    const url=new URL(href);
    if(!['http:','https:'].includes(url.protocol))return {status:'file'};
    if(!online)return {status:'offline'};
    url.searchParams.set('update',String(Date.now()));
    const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),10000);
    try{
      const response=await request(url.href,{cache:'no-store',credentials:'same-origin',signal:controller.signal});
      if(!response.ok)throw Error('Update unavailable');
      const html=await response.text(),match=html.match(/<meta\s+name=["']application-version["']\s+content=["']([\d.]+)["']\s*\/?\s*>/i);
      if(!match)throw Error('Missing application version');
      return newer(match[1],current)?{status:'available',version:match[1],url:url.href}:{status:'current'};
    }catch(_){return {status:'error'};}finally{clearTimeout(timer);}
  }
  root.OfflineUpdate={check,newer};
})(typeof window!=='undefined'?window:globalThis);
