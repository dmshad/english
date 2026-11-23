// Optional real Chrome smoke check. Run Chrome with an isolated profile and --remote-debugging-port=9337.
// Uses only Node built-ins; tests file:// rather than a development server.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
(async()=>{
const port=Number(process.env.ENGLISH_QA_PORT||9337);
const targets=await(await fetch(`http://127.0.0.1:${port}/json/list`)).json();
const target=targets.find(t=>t.type==='page');assert.ok(target,'No Chrome page available');
const ws=new WebSocket(target.webSocketDebuggerUrl);await new Promise((resolve,reject)=>{ws.onopen=resolve;ws.onerror=reject;});
let seq=0;const pending=new Map(),errors=[],requests=[];
ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.id){const job=pending.get(m.id);pending.delete(m.id);if(m.error)job.reject(Error(JSON.stringify(m.error)));else job.resolve(m.result);}if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails);if(m.method==='Network.requestWillBeSent'&&/^https?:/.test(m.params.request.url))requests.push(m.params.request.url);};
const send=(method,params={})=>new Promise((resolve,reject)=>{const id=++seq;pending.set(id,{resolve,reject});ws.send(JSON.stringify({id,method,params}));});
const run=async expression=>{const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value;};
try{
await send('Page.enable');await send('Runtime.enable');await send('Network.enable');await send('Network.emulateNetworkConditions',{offline:true,latency:0,downloadThroughput:0,uploadThroughput:0});
await send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
await send('Page.navigate',{url:'file://'+path.resolve(__dirname,'../../index.html')});
for(let i=0;i<50;i++){if(await run('document.readyState==="complete" && Boolean(document.querySelector("[data-action=start]"))'))break;await new Promise(r=>setTimeout(r,100));}
assert.ok(await run('Boolean(document.querySelector("[data-action=start]"))'),'Home did not load');
// This is an isolated temporary Chrome profile, not the user's browser storage.
await run('localStorage.clear(); location.reload();');await new Promise(r=>setTimeout(r,300));
assert.equal(await run('document.querySelectorAll("[data-pilot]").length'),8);
assert.equal(await run('document.documentElement.scrollWidth<=innerWidth'),true,'Mobile horizontal overflow');
const ids=await run('DIALOGUES.filter(d=>d.id.startsWith("batch-")).map(d=>d.id)');assert.equal(ids.length,6);
for(const id of ids){
  await run(`document.querySelector('[data-pilot="${id}"]').click()`);
  assert.equal(await run('document.querySelector("#answer").readOnly'),false);
  assert.equal(await run('document.querySelector("#active-turn details").open'),false,'Translation visible by default');
  for(let i=0;i<10;i++){
    const status=await run(`(()=>{const d=DIALOGUES.find(d=>d.id===${JSON.stringify(id)}),a=document.querySelector('#answer');a.value=d.turns[${i}].best;a.dispatchEvent(new Event('input',{bubbles:true}));document.querySelector('#answer-form').dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));return JSON.parse(localStorage.getItem('everyday-offline-v1')).session.answers[${i}].status;})()`);
    assert.equal(status,'correct',id+' '+i);
    assert.equal(await run('document.documentElement.scrollWidth<=innerWidth'),true,id+' mobile overflow');
    await run('document.querySelector("[data-action=next]").click()');
  }
  assert.ok(await run('document.body.innerText.includes("Диалог пройден")'));
  await run('document.querySelector("[data-action=home]").click()');
}
const state=await run('JSON.parse(localStorage.getItem("everyday-offline-v1"))');assert.equal(state.history.length,6);assert.equal(state.completedIds.length,6);
await run('document.querySelector("[data-action=history]").click()');assert.equal(await run('document.querySelectorAll("[data-history-view]").length'),6);
await send('Emulation.setDeviceMetricsOverride',{width:1280,height:900,deviceScaleFactor:1,mobile:false});
assert.equal(await run('document.documentElement.scrollWidth<=innerWidth'),true,'Desktop overflow');
assert.deepEqual(errors,[],'Browser JavaScript exceptions');assert.deepEqual(requests,[],'Application made network requests');
console.log('Real Chrome file:// passed: six complete conversations, hidden translation, mobile/desktop overflow, six history records, no JS errors or network requests.');
if(process.env.ENGLISH_QA_SCREENSHOT){await run('document.querySelector("[data-action=home]").click()');await send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});const shot=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});fs.writeFileSync(process.env.ENGLISH_QA_SCREENSHOT,Buffer.from(shot.data,'base64'));}
}finally{ws.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
