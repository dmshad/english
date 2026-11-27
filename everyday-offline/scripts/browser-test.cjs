// Real Chrome file:// UI regression. Separate temporary profile, CDP port 9337.
// Speech calls are stubbed (no audio); actual iPhone voice quality requires device testing.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
(async()=>{
const port=Number(process.env.ENGLISH_QA_PORT||9337),targets=await(await fetch(`http://127.0.0.1:${port}/json/list`)).json();
const target=targets.find(t=>t.type==='page');assert.ok(target);const ws=new WebSocket(target.webSocketDebuggerUrl);await new Promise((r,j)=>{ws.onopen=r;ws.onerror=j;});
let seq=0;const pending=new Map(),errors=[],requests=[];
ws.onclose=()=>{for(const job of pending.values())job.reject(Error('Test browser disconnected'));pending.clear();};
ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.id){const job=pending.get(m.id);pending.delete(m.id);m.error?job.reject(Error(JSON.stringify(m.error))):job.resolve(m.result);}if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails);if(m.method==='Network.requestWillBeSent'&&/^https?:/.test(m.params.request.url))requests.push(m.params.request.url);};
const send=(method,params={})=>new Promise((resolve,reject)=>{const id=++seq;pending.set(id,{resolve,reject});ws.send(JSON.stringify({id,method,params}));});
const run=async expression=>{const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value;};
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const click=sel=>run(`document.querySelector(${JSON.stringify(sel)}).click()`);
const state=()=>run('JSON.parse(localStorage.getItem("everyday-offline-v1"))');
const fits=async name=>{assert.equal(await run('document.documentElement.scrollWidth<=innerWidth'),true,name+' horizontal overflow');assert.equal(await run('document.documentElement.scrollHeight<=innerHeight+1'),true,name+' page needs vertical scrolling');};
const choose=async d=>{await run('document.querySelector("[data-action=home]")?.click()');await click('[data-action=catalog]');await click('[data-dialogue="'+d.id+'"]');await click('[data-action=start-selected]');};
const answer=async text=>run(`(()=>{const a=document.querySelector('#answer');a.value=${JSON.stringify(text)};a.dispatchEvent(new Event('input',{bubbles:true}));document.querySelector('#answer-form').dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));})()`);
const shot=async name=>{if(process.env.ENGLISH_QA_SCREENSHOT){const s=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});fs.writeFileSync(process.env.ENGLISH_QA_SCREENSHOT+'-'+name+'.png',Buffer.from(s.data,'base64'));}};
try{
await send('Page.enable');await send('Runtime.enable');await send('Network.enable');await send('Network.emulateNetworkConditions',{offline:true,latency:0,downloadThroughput:0,uploadThroughput:0});
await send('Page.addScriptToEvaluateOnNewDocument',{source:`window.__speechCalls=[];Object.defineProperty(window,'speechSynthesis',{value:{getVoices:()=>[{name:'Ava (Premium)',voiceURI:'com.apple.voice.premium.en-US.Ava',lang:'en-US',localService:true}],cancel(){},addEventListener(){},speak(u){window.__speechCalls.push({text:u.text,rate:u.rate,voice:u.voice?.voiceURI});}}});window.SpeechSynthesisUtterance=class{constructor(text){this.text=text;}};Object.defineProperty(navigator,'clipboard',{value:undefined,configurable:true});`});
await send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
await send('Page.navigate',{url:'file://'+path.resolve(__dirname,'../../index.html')});
for(let i=0;i<50;i++){if(await run('document.readyState==="complete"&&Boolean(document.querySelector("[data-action=start]"))'))break;await wait(100);}
await run('localStorage.clear();location.reload()');await wait(300);
assert.equal(await run('document.querySelector("[data-level=B2]").disabled'),true);await fits('home390');await shot('home-light');
const all=await run('DIALOGUES.filter(d=>d.checking==="construction").map(d=>({id:d.id,topic:d.topic,title:d.title,context:d.context,turns:d.turns,ending:d.ending}))');assert.equal(all.length,14);
const bus=all.find(d=>d.id==='batch-bus');
await choose(bus);await click('[data-action=intro-next]');
await answer(bus.turns[0].best);await click('[data-action=next]');
await answer('Going the wrong way.');
assert.equal(await run('document.querySelector(".status.correct").textContent'),'Верно');
assert.equal(await run('document.querySelectorAll(".annotated-answer .word-correct").length'),4);
for(const d of all){
  await choose(d);assert.equal(await run('Boolean(document.querySelector(".intro"))'),true);await fits(d.id+' intro');
  await click('[data-action=intro-next]');assert.equal(await run('Boolean(document.querySelector(".translation"))'),false);
  const before=await run('[...document.querySelectorAll(".work-grid>.panel")].map(e=>e.getBoundingClientRect().height)');assert.equal(before.length,3);
  await click('[data-action=translation]');const after=await run('[...document.querySelectorAll(".work-grid>.panel")].map(e=>e.getBoundingClientRect().height)');assert.deepEqual(after,before,'Translation moved panels');await click('[data-action=translation]');
  for(let i=0;i<10;i++){if((await state()).session.phase==='stage'){assert.equal(await run('Boolean(document.querySelector("#answer"))'),false);await fits(d.id+' stage');await shot('stage');await click('[data-action=stage-next]');}await fits(d.id+' work'+i);await answer(d.turns[i].best);assert.equal((await state()).session.answers[i].status,'correct',d.id+' '+i);await fits(d.id+' review'+i);if(i===0){await click('[data-action=variants]');assert.ok(await run('document.querySelectorAll(".variants li").length<=10'));await fits('variants');}await click('[data-action=next]');}
  assert.equal((await state()).session.phase,'ending');assert.equal((await state()).session.completedRecorded,false);assert.equal(await run('Boolean(document.querySelector(".stats"))'),false);await fits(d.id+' ending');await shot('ending');await click('[data-action=ending-next]');
  assert.equal((await state()).completionCounts[d.id],1);assert.equal(await run('document.querySelector(".stat.correct strong").textContent'),'10');await fits(d.id+' done');
}
assert.equal((await state()).history.length,6);assert.equal(Object.keys((await state()).completionCounts).length,14);
await click('[data-action=home]');await click('[data-action=statistics]');
assert.equal(await run('document.querySelector(".activity-total strong").textContent'),'14');
assert.equal(await run('document.querySelector(".activity-days [aria-current=date] strong").textContent'),'14');
assert.equal(await run('document.querySelectorAll(".activity-days li").length'),7);
await fits('statistics390');await shot('statistics-light');
await click('[data-action=home]');await click('[data-action=catalog]');await fits('catalog');await shot('catalog');
assert.equal(await run('document.querySelectorAll(".catalog-topic").length'),14);assert.equal(await run('document.querySelectorAll(".completion-dot").length'),14);
await click('[data-mark="'+all[0].id+'"]');assert.equal(await run('document.querySelector("#mark-dialog").open'),true);assert.equal((await state()).completionCounts[all[0].id],1);await shot('mark-confirmation');await click('#cancel-mark');assert.equal((await state()).completionCounts[all[0].id],1);
await click('[data-mark="'+all[0].id+'"]');await click('#confirm-mark');assert.equal((await state()).completionCounts[all[0].id],0);assert.equal((await state()).history.length,6);
await click('[data-mark="'+all[0].id+'"]');await click('#confirm-mark');assert.equal((await state()).completionCounts[all[0].id],1);
await click('[data-dialogue="'+all[0].id+'"]');assert.equal(await run('[...document.querySelectorAll(".last-stats span")].map(e=>e.textContent).join(",")'),'10,0,0,0');await fits('dialogue stats');await shot('last-stats');
await click('[data-action=home]');await run('document.querySelector("#home-link").click()');
// Restore completed result through persisted session for copy/replay checks.
await run('document.querySelector("[data-action=catalog]").click()');await click('[data-dialogue="'+all.at(-1).id+'"]');
// Existing completed session remains untouched by catalogue browsing; resume is deliberately absent on home.
await run('document.querySelector("#home-link").click()');
// Copy the latest complete archive without starting another attempt.
await click('[data-action=history]');await run('document.querySelector("[data-history-copy]").click()');
await wait(50);assert.equal(await run('document.querySelector("#copy-dialog").open'),true);assert.ok((await run('document.querySelector("#copy-text").value')).includes(all.at(-1).ending.en));await click('#close-copy');
await click('[data-action=home]');await click('[data-theme=dark]');assert.equal(await run('document.documentElement.dataset.theme'),'dark');await fits('dark home');await shot('home-dark');
const d=all.find(d=>d.id==='batch-shoes');await choose(d);await click('[data-action=intro-next]');await click('[data-action=toggle-text]');
assert.equal(await run('document.querySelector("#answer").disabled'),true);assert.equal(await run('Boolean(document.querySelector(".english"))'),false);assert.equal(await run('Boolean(document.querySelector(".task"))'),false);
const audioSize=await run('[...document.querySelectorAll(".work-grid>.panel")].map(e=>e.getBoundingClientRect().height)');
await click('[data-action=listen]');await click('[data-action=listen]');assert.equal(await run('window.__speechCalls.length'),2);assert.equal(await run('window.__speechCalls.at(-1).rate'),1);assert.equal(await run('window.__speechCalls[0].voice'),'com.apple.voice.premium.en-US.Ava');assert.equal(await run('document.querySelectorAll("[data-speed]").length'),0);
await click('[data-action=toggle-text]');assert.equal(await run('Boolean(document.querySelector(".task"))'),true);await click('[data-action=translation]');assert.deepEqual(await run('[...document.querySelectorAll(".work-grid>.panel")].map(e=>e.getBoundingClientRect().height)'),audioSize);await click('[data-action=toggle-text]');assert.equal(await run('Boolean(document.querySelector(".translation"))'),false);
await click('[data-action=show-task]');await fits('speech work dark');await shot('work-dark');
for(let i=0;i<10;i++){if((await state()).session.phase==='stage')await click('[data-action=stage-next]');if(i>0)await click('[data-action=show-task]');await answer(d.turns[i].best);await click('[data-action=next]');}
assert.equal((await state()).session.phase,'ending');assert.equal(await run('Boolean(document.querySelector(".english"))'),false);await click('[data-action=listen-ending]');assert.equal(await run('window.__speechCalls.at(-1).text'),d.ending.en);await click('[data-action=toggle-text]');assert.equal(await run('document.querySelector(".english").textContent'),d.ending.en);await click('[data-action=ending-next]');
assert.equal((await state()).completionCounts[d.id],2);
await click('[data-action=home]');await click('[data-action=history]');assert.equal(await run('document.querySelectorAll("[data-history-view]").length'),6);await fits('history');await click('[data-action=journal]');assert.equal(await run('document.querySelector("[data-action=copy-journal]").disabled'),true);await click('[data-action=home]');
// iPhone SE proportions, then keyboard-sized viewport with focused answer.
await send('Emulation.setDeviceMetricsOverride',{width:375,height:667,deviceScaleFactor:1,mobile:true});await wait(100);await fits('home375');await fits('home375-fixed');await choose(d);await click('[data-action=home]');await fits('speech-home375-resume');assert.equal(await run('document.querySelector("[data-action=history]").getBoundingClientRect().top>document.querySelector("[data-action=start]").getBoundingClientRect().bottom'),true);await choose(d);await click('[data-action=intro-next]');await fits('work375');await shot('work-small');
await click('[data-action=home]');await click('[data-action=statistics]');await fits('statistics375');
assert.equal(await run('document.querySelector(".activity-total strong").textContent'),'15');
await shot('statistics-dark');await click('[data-action=home]');await click('[data-action=resume]');
await run('document.querySelector("#answer").focus()');await send('Emulation.setDeviceMetricsOverride',{width:375,height:380,deviceScaleFactor:1,mobile:true});await wait(150);assert.equal(await run('document.body.classList.contains("keyboard-open")'),true);assert.equal(await run('document.documentElement.scrollHeight>innerHeight'),true);
await run('document.querySelector("#answer").blur()');await send('Emulation.setDeviceMetricsOverride',{width:375,height:667,deviceScaleFactor:1,mobile:true});await wait(150);
await answer('<img src=x onerror=alert(1)>');assert.equal(await run('Boolean(document.querySelector("#app img"))'),false);assert.equal((await state()).journal.length,1);await click('[data-action=home]');await click('[data-action=history]');await click('[data-action=journal]');await click('[data-action=copy-journal]');await wait(40);assert.ok((await run('document.querySelector("#copy-text").value')).startsWith('Нераспознанные ответы из приложения Everyday'));assert.equal((await state()).journal.length,1);await click('#close-copy');assert.equal((await state()).journal.length,1);
await click('[data-action=copy-journal]');await wait(40);await run('(()=>{const t=document.querySelector("#copy-text");t.select();t.dispatchEvent(new ClipboardEvent("copy",{bubbles:true,cancelable:true,clipboardData:new DataTransfer()}));})()');assert.equal((await state()).journal.length,0);
// Successful Clipboard API writes consume the exported batch and preserve full conversation history.
await choose(d);await click('[data-action=intro-next]');await answer('Another unusual unrecognized sentence');await click('[data-action=home]');await click('[data-action=history]');await click('[data-action=journal]');await run('Object.defineProperty(navigator,"clipboard",{configurable:true,value:{writeText:async text=>{window.__copied=text;}}})');const historyBefore=(await state()).history.length;await click('[data-action=copy-journal]');await wait(40);assert.equal((await state()).journal.length,0);assert.equal((await state()).history.length,historyBefore);assert.ok((await run('window.__copied')).includes('Another unusual unrecognized sentence'));

const hotel=all.find(d=>d.id==='batch-hotel');
await choose(hotel);await click('[data-action=intro-next]');
await answer('I has a reservation under Anna!Blorven.\nI have a reservation under Anna.');
assert.equal(await run('document.querySelector(".status.unknown").textContent'),'Не распознано');
assert.equal(await run('document.querySelector(".word-error").textContent'),'has');
assert.equal(await run('document.querySelector(".word-neutral").textContent'),'Blorven');
assert.equal(await run('document.querySelector(".word-correct").textContent'),'I');
assert.equal(await run('[...document.querySelectorAll(".word-correct")].at(-1).textContent'),'Anna');
assert.equal((await state()).latestResults[hotel.id].counts.unknown,1);
assert.equal((await state()).latestResults[hotel.id].counts.error,0);
await fits('mixed review375');await shot('mixed-review');
await click('[data-action=home]');await click('[data-action=history]');
await click('[data-history-view="'+(await state()).history.at(-1).runId+'"]');
assert.equal(await run('document.querySelector(".word-error").textContent'),'has');
assert.equal(await run('document.querySelector(".word-neutral").textContent'),'Blorven');
const event=all.find(d=>d.id==='batch-event');
await choose(event);await click('[data-action=intro-next]');
await answer(event.turns[0].best);await click('[data-action=next]');
await answer("There're only eigth");
assert.equal(await run('document.querySelector(".status.error").textContent'),'Ошибка');
assert.equal(await run('document.querySelector(".word-error").textContent'),'eigth');
assert.equal(await run('[...document.querySelectorAll(".word-correct")].map(e=>e.textContent).join(" ")'),"There're only");
assert.match(await run('document.querySelector(".explanation").textContent'),/eigth.*eight/);
await fits('chair typo375');
await click('[data-action=next]');
assert.equal(await run('document.querySelector(".task").textContent'),event.turns[2].task);
await answer(event.turns[2].best);await click('[data-action=next]');
assert.equal((await state()).session.phase,'stage');
assert.match(await run('document.querySelector(".stage-screen .context").textContent'),/Миа показывает на синюю дверь/);
assert.equal(await run('Boolean(document.querySelector(".english, #answer"))'),false);
await click('[data-action=stage-next]');
assert.equal(await run('document.querySelector(".english").textContent'),'Can you get the two chairs?');
assert.equal(await run('document.querySelector(".task").textContent'),'Я не могу открыть дверь.');
await answer("Can't open the door");
assert.equal((await state()).session.answers[3].status,'correct');
assert.equal(await run('document.querySelector(".status.correct").textContent'),'Верно');
assert.equal(await run('document.querySelectorAll(".annotated-answer .word-correct").length'),4);

const cinema=all.find(item=>item.id==='a1-cinema');
await choose(cinema);await click('[data-action=intro-next]');
for(let i=0;i<3;i++){await answer(cinema.turns[i].best);await click('[data-action=next]');}
await answer('It is got stripes of white on a blue background. Blorven.');
assert.equal(await run('document.querySelector(".status.unknown").textContent'),'Не распознано');
assert.equal(await run('document.querySelector(".annotated-answer .word-error").textContent'),'is');
assert.equal(await run('[...document.querySelectorAll(".annotated-answer .word-acceptable")].map(word=>word.textContent).join(" ")'),'stripes of white');
assert.equal(await run('document.querySelector(".annotated-answer .word-neutral").textContent'),'Blorven');
assert.equal(await run('document.querySelector(".annotated-answer .word-correct").textContent'),'It');
assert.equal(await run('document.querySelectorAll(".explanation").length'),2);
assert.ok((await state()).history.at(-1).answers[3].annotations.some(part=>part.color==='acceptable'));
await fits('mixed four colors375');

await run(`(() => {
  const key='everyday-offline-v1';
  const saved=JSON.parse(localStorage.getItem(key));
  for (const [offset,count] of [[7,16],[14,24]]) {
    const day=new Date();
    day.setDate(day.getDate()-offset);
    saved.activity.days[OfflineProgress.dayKey(day)]=count;
  }
  saved.activity.undated=3;
  localStorage.setItem(key,JSON.stringify(saved));
  location.reload();
})()`);
for(let i=0;i<50;i++){if(await run('Boolean(document.querySelector("[data-action=statistics]"))'))break;await wait(100);}
await click('[data-action=statistics]');
assert.equal(await run('document.querySelector(".activity-total strong").textContent'),'58');
assert.equal(await run('[...document.querySelectorAll(".activity-weeks strong")].map(e=>e.textContent).join(",")'),'16,24');
await fits('statistics archive375');await shot('statistics-archive');
await send('Emulation.setDeviceMetricsOverride',{width:1280,height:900,deviceScaleFactor:1,mobile:false});await wait(100);await fits('desktop');
assert.deepEqual(errors,[],'JS exceptions');assert.deepEqual(requests,[],'Unexpected network requests');
console.log('Chrome file:// OFFLINE passed: fourteen full text runs, one speech run with stubbed audio, unified counters, completion statistics, catalogue and confirmation, intro/scenes/review/ending/result, mixed feedback, Ava Premium selection, fixed panels, 390×844/375×667/desktop, keyboard viewport, themes, history/copy/journal, no JS exceptions or network requests.');
}finally{ws.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
