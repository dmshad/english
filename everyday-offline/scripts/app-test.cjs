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
    window:{scrollTo(){},location:{protocol:'https:',href:'https://dmshad.github.io/english/',assign(url){this.href=url;}}}, document:{getElementById:el, querySelectorAll:()=>[], querySelector:()=>el('query'), body:{append(){}}},
    localStorage:{getItem(key){if (blocked) throw Error('blocked'); return store.get(key) || null;},setItem(key,value){if(blocked)throw Error('blocked');store.set(key,value);}},
    navigator:{onLine:true}, URL, setTimeout:()=>1, clearTimeout(){}, console
  });
  for (const file of ['engine.js','content.js','content-stage1.js','content-ten.js','content-answers.js','structured.js','content-pilot.js','content-friend.js','content-library.js','content-intros.js','app.js']) vm.runInContext(fs.readFileSync(path.join(__dirname,'..',file),'utf8'),context);
  const click = (data) => el('app').handlers.click({target:{closest:()=>({dataset:data,hasAttribute:name=>name==='data-copy-turn' && 'copyTurn' in data})}});
  const change = (id,value) => el('app').handlers.change({target:{id,value}});
  const answer = text => {el('answer').value = text; el('app').handlers.input({target:{id:'answer',value:text}}); el('app').handlers.submit({target:{id:'answer-form'},preventDefault(){}});};
  return {el,click,change,answer,store,state:()=>JSON.parse(store.get(KEY)),html:()=>el('app').innerHTML,all:context.window.DIALOGUES.filter(d=>d.checking==='construction'),window:context.window,navigator:context.navigator};
}

const ui=setup();equal(ui.all.length,2);ok(!ui.html().includes('Кафе</option>'));
ok(!ui.html().includes('по прежней базе'));
for(const d of ui.all){const run=setup();run.click({pilot:d.id});equal(run.state().session.id,d.id);
for(const t of d.turns){run.answer(t.best);run.click({action:'next'});}equal(run.state().session.index,10);ok(run.html().includes('Диалог пройден'));run.click({action:'copy-all'});ok(run.el('copy-text').value.includes(d.ending.en));}
const error=setup();error.click({pilot:'pilot-library'});error.answer('I need a English textbook.');equal(error.state().session.answers[0].status,'error');ok(error.html().includes('word-error'));error.click({action:'retry'});error.answer('Could I borrow an English textbook?');equal(error.state().session.answers[0].status,'correct');
const restored=setup(error.store.get(KEY));restored.click({action:'resume'});equal(restored.state().session.answers[0].status,'correct');
const arch=setup(JSON.stringify({progressRevision:6,completedIds:ui.all.map(d=>d.id)}));
for(let i=0;i<7;i++){arch.click({action:'home'});arch.click({pilot:'pilot-library'});for(const t of arch.all[1].turns){arch.answer(t.best);arch.click({action:'next'});}}
equal(arch.state().history.length,6);equal(new Set(arch.state().history.map(h=>h.runId)).size,6);
const before=JSON.stringify(arch.state().session),latest=arch.state().history.at(-1);arch.click({historyView:latest.runId});arch.click({historyCopy:latest.runId});equal(JSON.stringify(arch.state().session),before);ok(arch.el('copy-text').value.includes(latest.answers[0].answer));
const migration=setup(JSON.stringify({progressRevision:4,completedIds:['pilot-friend-evening','pilot-library'],journal:[{answer:'old',task:'task'}]}));ok(migration.state().completedIds.includes('pilot-friend-evening'));ok(!migration.state().completedIds.includes('pilot-library'));equal(migration.state().journal.length,1);
const old=setup(JSON.stringify({session:{id:'coffee-to-go',contentRevision:5,index:0,answers:[]}}));equal(old.state().session,null);
const unknown=setup();unknown.click({pilot:'pilot-library'});unknown.answer('Can a flying whale bring a book?');equal(unknown.state().session.answers[0].status,'unknown');equal(unknown.state().journal.length,1);
const injection=setup();injection.click({pilot:'pilot-library'});injection.answer('<img src=x onerror=alert(1)>');ok(!injection.html().includes('<img src=x'));
const update=setup();update.click({action:'update'});ok(update.window.location.href.includes('update='));
const file=setup();file.window.location.protocol='file:';file.click({action:'update'});equal(file.window.location.href,'https://dmshad.github.io/english/');
const noStorage=setup(null,true);ok(noStorage.html().includes('Хранилище браузера недоступно'));noStorage.click({pilot:'pilot-library'});noStorage.click({action:'reveal'});noStorage.click({action:'next'});ok(noStorage.html().includes('2 из 10'));
// General application behavior remains covered after retiring the old content.
const emptyLevel=setup();emptyLevel.click({level:'B2'});ok(emptyLevel.html().includes('data-action="start" disabled'));
const draft=setup();draft.click({pilot:'pilot-library'});
ok(draft.html().includes('<details><summary>Показать перевод</summary>'));draft.answer('');equal(draft.state().session.answers.length,0);
draft.el('answer').value='My draft';draft.el('app').handlers.input({target:{id:'answer',value:'My draft'}});
const resumeDraft=setup(draft.store.get(KEY));resumeDraft.click({action:'resume'});ok(resumeDraft.html().includes('>My draft</textarea>'));
const journal=setup();journal.click({pilot:'pilot-library'});journal.answer('Unrecognised answer');journal.click({action:'retry'});journal.answer(journal.all[1].turns[0].best);
equal(journal.state().journal.length,1);journal.click({action:'home'});journal.el('journal-button').handlers.click();ok(journal.el('journal-dialog').open);
journal.el('clear-journal').handlers.click();equal(journal.el('clear-confirm').hidden,false);journal.el('confirm-clear').handlers.click();equal(journal.state().journal.length,0);
const latestRun=arch.state().history.at(-1);arch.all[1].turns[0].best='NEW REFERENCE MUST NOT APPEAR';arch.click({historyView:latestRun.runId});ok(!arch.html().includes('NEW REFERENCE MUST NOT APPEAR'));
const loaded=setup(arch.store.get(KEY));equal(loaded.state().history.length,6);equal(loaded.state().completedIds.length,2);
const unseen=setup(JSON.stringify({progressRevision:6,completedIds:['pilot-friend-evening']}));unseen.change('dialogue-choice','pilot-friend-evening');unseen.click({action:'start'});equal(unseen.state().session.id,'pilot-library');
unseen.answer(unseen.all[1].turns[0].best);ok(!unseen.state().completedIds.includes('pilot-library'));equal(unseen.state().history.length,1);
const repeat=setup(JSON.stringify({progressRevision:6,completedIds:ui.all.map(d=>d.id)}));repeat.change('topic','visiting');repeat.change('dialogue-choice','pilot-friend-evening');repeat.click({action:'start'});equal(repeat.state().session.id,'pilot-friend-evening');
const oldSeen=setup(JSON.stringify({seen:{'A1:random:long':ui.all.map(d=>d.id)}}));equal(oldSeen.state().completedIds.length,0);
const incompatible=setup(JSON.stringify({progressRevision:4,session:{id:'pilot-library',contentRevision:4,index:3,answers:[]},journal:[{answer:'retained',task:'old'}],history:arch.state().history}));equal(incompatible.state().session,null);equal(incompatible.state().history.length,6);equal(incompatible.state().journal.length,1);
const colors=setup();colors.click({pilot:'pilot-library'});colors.answer('Can I have a English textbook?');ok(colors.html().includes('word-error'));ok(colors.html().includes('word-correct'));colors.click({action:'home'});colors.click({historyView:colors.state().history.at(-1).runId});ok(colors.html().includes('word-error'));
const cap=setup();cap.click({pilot:'pilot-library'});cap.answer(cap.all[1].turns[0].best);for(const match of cap.html().matchAll(/<details class="variants">([\s\S]*?)<\/details>/g))ok((match[1].match(/<li>/g)||[]).length<=10);
const disconnected=setup();disconnected.navigator.onLine=false;disconnected.click({action:'update'});equal(disconnected.window.location.href,'https://dmshad.github.io/english/');
const corrupt=setup('{bad-json');ok(corrupt.html().includes('Твой следующий разговор'));


const fromV08=setup(JSON.stringify({progressRevision:5,completedIds:['pilot-friend-evening','pilot-library'],session:{id:'pilot-library',contentRevision:5,index:7,answers:[]},journal:[{answer:'kept',task:'kept'}]}));
equal(fromV08.state().session,null);ok(fromV08.state().completedIds.includes('pilot-friend-evening'));ok(!fromV08.state().completedIds.includes('pilot-library'));equal(fromV08.state().journal.length,1);

console.log(checks+' application-state checks passed (mock DOM; visual browser check still required).');
