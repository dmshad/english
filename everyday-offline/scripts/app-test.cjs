// Application-state unit tests. Minimal fake DOM, not a browser or visual QA.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const KEY = 'everyday-offline-v1';
let checks = 0;
function ok(value) { assert.ok(value); checks++; }
function equal(value, expected) { assert.equal(value, expected); checks++; }
function setup(initial, blocked = false) {
  const elements = new Map();
  const store = new Map(initial ? [[KEY,initial]] : []);
  function el(id) {
    if (!elements.has(id)) elements.set(id, {
      id, value:'', innerHTML:'', textContent:'', hidden:false, handlers:{},
      addEventListener(name,fn) { this.handlers[name] = fn; }, focus(){}, scrollIntoView(){}, select(){},
      showModal(){this.open = true;}, close(){this.open = false;}
    });
    return elements.get(id);
  }
  const context = vm.createContext({
    window:{scrollTo(){}}, document:{getElementById:el, querySelectorAll:()=>[], querySelector:()=>el('query'), body:{append(){}}},
    localStorage:{getItem(key){if (blocked) throw Error('blocked'); return store.get(key) || null;},setItem(key,value){if(blocked)throw Error('blocked');store.set(key,value);}},
    navigator:{}, setTimeout:()=>1, clearTimeout(){}, console
  });
  for (const file of ['content.js','content-stage1.js','engine.js','app.js']) vm.runInContext(fs.readFileSync(path.join(__dirname,'..',file),'utf8'),context);
  const click = (data) => el('app').handlers.click({target:{closest:()=>({dataset:data,hasAttribute:name=>name==='data-copy-turn' && 'copyTurn' in data})}});
  const change = (id,value) => el('app').handlers.change({target:{id,value}});
  const answer = text => {el('answer').value = text; el('app').handlers.input({target:{id:'answer',value:text}}); el('app').handlers.submit({target:{id:'answer-form'},preventDefault(){}});};
  return {el,click,change,answer,store,state:()=>JSON.parse(store.get(KEY)),html:()=>el('app').innerHTML,all:context.window.DIALOGUES};
}
let ui = setup();
ok(ui.html().includes('Твой следующий разговор'));
ui.click({level:'B2'}); ok(ui.html().includes('Для B2 в этом выборе диалогов пока нет')); ok(ui.html().includes('data-action="start" disabled'));
ui.click({level:'A1'});
ui.change('topic','cafe');
ui.change('dialogue-choice','coffee-to-go'); ui.click({action:'start'});
equal(ui.state().session.id,'coffee-to-go');
ok(ui.html().includes('<details><summary>Показать перевод</summary>'));
ok(!ui.html().includes('Как можно сказать'));
ui.answer(''); equal(ui.state().session.answers.length,0);
ui.answer('Can I get a small coffee to go, please?'); equal(ui.state().session.answers[0].status,'correct');
ui.click({action:'next'}); equal(ui.state().session.index,1);
ui.el('answer').value = 'No milk'; ui.el('app').handlers.input({target:{id:'answer',value:'No milk'}});
const restored = setup(ui.store.get(KEY));
ok(restored.html().includes('Продолжить'));
restored.click({action:'resume'}); ok(restored.html().includes('>No milk</textarea>'));
restored.answer('Milk, please.'); equal(restored.state().session.answers[1].status,'unknown'); equal(restored.state().journal.length,1);
restored.click({action:'retry'}); equal(restored.state().session.answers.length,1);
restored.answer('No milk, thanks.'); equal(restored.state().session.answers[1].status,'correct'); equal(restored.state().journal.length,1);
restored.click({action:'next'}); equal(restored.state().session.index,2);
restored.answer('Card, please.'); restored.click({action:'next'});
restored.answer('Thanks, you too!'); restored.click({action:'next'});
equal(restored.state().session.index,4); ok(restored.html().includes('Диалог пройден'));
restored.click({action:'another'}); equal(restored.state().session.id,'window-table');
restored.click({action:'reveal'}); equal(restored.state().session.answers[0].status,'revealed'); equal(restored.state().journal.length,1);
restored.click({action:'home'}); restored.el('journal-button').handlers.click(); ok(restored.el('journal-dialog').open); ok(restored.el('journal-content').innerHTML.includes('Milk, please.'));
restored.el('clear-journal').handlers.click(); equal(restored.el('clear-confirm').hidden,false);
restored.el('confirm-clear').handlers.click(); equal(restored.state().journal.length,0);
// Every authored conversation can run to completion through the UI event handlers.
for (const d of ui.all) {
  const run = setup(); run.click({length:d.length}); run.change('topic',d.topic); run.change('dialogue-choice',d.id); run.click({action:'start'});
  for (const t of d.turns) {run.answer(t.best); run.click({action:'next'});}
  equal(run.state().session.index,d.turns.length); ok(run.html().includes('Диалог пройден'));
  equal(run.state().session.answers.filter(a=>a.status==='correct').length,d.turns.length);
  run.click({action:'copy-all'}); ok(run.el('copy-dialog').open); ok(run.el('copy-text').value.includes(d.ending.en));
}
const injection = setup(); injection.click({action:'start'}); injection.answer('<img src=x onerror=alert(1)>');
ok(!injection.html().includes('<img src=x')); ok(injection.html().includes('&lt;img src=x'));
const noStorage = setup(null,true); ok(noStorage.html().includes('Хранилище браузера недоступно'));
noStorage.click({action:'start'}); noStorage.click({action:'reveal'}); noStorage.click({action:'next'}); ok(noStorage.html().includes('Твоя реплика 2 из 4'));
const corrupt = setup('{bad-json'); ok(corrupt.html().includes('Твой следующий разговор'));
const invalidSession = setup(JSON.stringify({session:{id:'coffee-to-go',index:99,answers:[]}})); ok(!invalidSession.html().includes('Продолжить'));
const oldVersion = setup(JSON.stringify({session:{id:'breakfast',index:5,answers:[]},journal:[{answer:'my old answer',task:'old task'}]}));
equal(oldVersion.state().session,null); equal(oldVersion.state().journal.length,1);
ok(oldVersion.html().includes('Журнал нераспознанных ответов сохранен'));
ok(ui.html().includes('из 4'));
// History keeps six runs, while lifetime completion flags survive eviction.
const archive = setup();
for (const d of archive.all.slice(0,7)) {
  archive.click({action:'home'}); archive.click({length:d.length}); archive.change('topic',d.topic);
  archive.change('dialogue-choice',d.id); archive.click({action:'start'});
  equal(archive.state().completedIds.includes(d.id),false); // Opening is not completing.
  for (const t of d.turns) { archive.answer(t.best); archive.click({action:'next'}); }
  equal(archive.state().completedIds.includes(d.id),true);
}
equal(archive.state().history.length,6); equal(archive.state().completedIds.length,7);
ok(!archive.state().history.some(h=>h.dialogue.id==='coffee-to-go'));
const activeBeforeHistory = JSON.stringify(archive.state().session);
const latest = archive.state().history.at(-1);
archive.click({action:'history'}); ok(archive.html().includes('История')); ok(archive.html().includes('Посмотреть ответы'));
archive.click({historyView:latest.runId}); ok(archive.html().includes(latest.answers[0].answer));
archive.click({historyCopy:latest.runId}); ok(archive.el('copy-text').value.includes(latest.dialogue.turns[0].en));
ok(archive.el('copy-text').value.includes(latest.answers[0].answer));
equal(JSON.stringify(archive.state().session),activeBeforeHistory);
archive.all.find(d=>d.id===latest.dialogue.id).turns[0].best = 'NEW REFERENCE SHOULD NOT APPEAR';
archive.click({historyView:latest.runId}); ok(!archive.html().includes('NEW REFERENCE SHOULD NOT APPEAR'));
const loadedArchive = setup(archive.store.get(KEY)); equal(loadedArchive.state().history.length,6); equal(loadedArchive.state().completedIds.length,7);
// Lifetime flags apply across topic/random changes, and stale explicit selection cannot bypass them.
const shortIds = ui.all.filter(d=>d.length==='short').map(d=>d.id);
const unseenId = 'bread-sliced';
const onlyOne = setup(JSON.stringify({completedIds:shortIds.filter(id=>id!==unseenId)}));
onlyOne.change('dialogue-choice','coffee-to-go'); onlyOne.click({action:'start'}); equal(onlyOne.state().session.id,unseenId);
onlyOne.answer(onlyOne.all.find(d=>d.id===unseenId).turns[0].best);
equal(onlyOne.state().completedIds.includes(unseenId),false);
equal(onlyOne.state().history.length,1);
onlyOne.click({action:'home'}); onlyOne.change('topic','bakery'); onlyOne.click({action:'start'}); equal(onlyOne.state().session.id,unseenId);
// When all matching dialogues are completed, repetition is available.
const repeat = setup(JSON.stringify({completedIds:shortIds})); repeat.change('topic','cafe'); repeat.change('dialogue-choice','coffee-to-go'); repeat.click({action:'start'}); equal(repeat.state().session.id,'coffee-to-go');
// Old per-filter "seen" meant opened, so it must not mark untouched dialogues as completed.
const oldSeen = setup(JSON.stringify({seen:{'A1:random:short':shortIds}})); equal(oldSeen.state().completedIds.length,0);
// A saved completed v0.2 session migrates into history without resetting it.
const oldComplete = ui.state();
oldComplete.session = {id:'coffee-to-go',contentRevision:2,index:4,answers:ui.all[0].turns.map(t=>({status:'correct',answer:t.best})),startedAt:new Date().toISOString()};
delete oldComplete.history; delete oldComplete.completedIds;
const migrated = setup(JSON.stringify(oldComplete)); equal(migrated.state().history.length,1); ok(migrated.state().completedIds.includes('coffee-to-go'));
// Repeated runs of the same dialogue are separate history records, not one overwritten record.
const repeats = setup(JSON.stringify({completedIds:shortIds}));
for (let i=0;i<7;i++) {
  repeats.click({action:'home'}); repeats.change('topic','cafe'); repeats.change('dialogue-choice','coffee-to-go'); repeats.click({action:'start'});
  for(const t of repeats.all[0].turns){repeats.answer(t.best);repeats.click({action:'next'});}
}
equal(repeats.state().history.length,6); equal(new Set(repeats.state().history.map(h=>h.runId)).size,6);
console.log(`${checks} application-state checks passed (mock DOM; visual browser check still required).`);
