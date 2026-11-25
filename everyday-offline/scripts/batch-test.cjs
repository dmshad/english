// Authored batch contract and whole-utterance boundaries. Independent probes live separately.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const context={globalThis:{}};
for(const f of ['engine.js','content.js','content-stage1.js','content-ten.js','content-answers.js','structured.js','content-pilot.js','content-friend.js','content-library.js','content-intros.js','content-batch-a.js','content-batch-b.js'])vm.runInNewContext(fs.readFileSync(path.join(__dirname,'..',f),'utf8'),context);
const {DIALOGUES,OfflineEngine:E}=context.globalThis;
const batch=DIALOGUES.filter(d=>d.id.startsWith('batch-'));
assert.equal(batch.length,6);assert.equal(new Set(batch.map(d=>d.topic)).size,6);
let checks=0;const failures=[];
const probe=(d,i,input,expected)=>{const r=E.check(input,d.turns[i]);checks++;if(r.status!==expected)failures.push({id:d.id,turn:i+1,input,expected,actual:r.status,note:r.note});return r;};
for(const d of batch){
  assert.equal(d.turns.length,10);assert.equal(d.level,'A1');assert.equal(d.checking,'construction');
  assert.equal(d.reviewFunctions.length,10);assert.ok(d.context&&d.tone&&d.ending.en&&d.ending.ru);
  for(const [i,t] of d.turns.entries()){
    assert.ok(/[а-яё]/i.test(t.task));assert.ok(t.en&&t.ru&&t.best&&d.reviewFunctions[i]);
    assert.ok(E.preferred(t).length<=10);
    for(const p of t.assessment.patterns||[])new RegExp('^(?:'+p+')$');
    for(const a of t.natural){probe(d,i,a,'correct');probe(d,i,a+' and a purple elephant can fly','unknown');}
    for(const a of t.acceptable||[])probe(d,i,a.text,'acceptable');
    const cases=t.assessment.cases;assert.ok(cases&&cases.correct.length>=3,d.id+' '+i+' needs unseen paraphrases');
    for(const status of ['correct','acceptable','error','unknown'])for(const input of cases[status]||[]){
      const r=probe(d,i,input,status);
      if(r.status==='error'){assert.ok(r.note&&r.correction&&r.fragment);assert.ok(r.annotations.some(a=>a.color==='error')||r.insertions.length,'error must locate a fragment: '+input);}
    }
    if(t.assessment.allowLets){const candidate=t.natural.find(a=>/^let['’]s /i.test(a));assert.ok(candidate);const r=probe(d,i,candidate.replace(/^let['’]s /i,'Lets '),'correct');assert.ok(r.orthographyNote);}
  }
}
if(failures.length){console.error(JSON.stringify(failures,null,2));throw Error(failures.length+' batch assessment failures');}
console.log(`${checks} new-batch checks passed (six stories, authored alternatives, errors, whole-answer boundaries).`);

const direction=batch.find(d=>d.id==='batch-bus').turns[1];
const partial=E.check('  Oh, I need to sprock the other way.  ',direction);
assert.equal(partial.status,'unknown');
assert.deepEqual(Array.from(partial.annotations.filter(t=>t.color==='neutral'),t=>[t.text,t.start,t.end]),[['sprock',16,22]]);
assert.equal(partial.annotations.find(t=>t.text==='way').color,'correct');
const mixedScript=E.check('Oh, I need to go the other путь',direction);
assert.equal(mixedScript.annotations.at(-1).color,'neutral');
assert.equal(mixedScript.annotations.at(-1).text,'путь');
const incomplete=E.check('Oh, I need to go the way',direction);
assert.equal(incomplete.status,'unknown');
assert.ok(incomplete.annotations.some(t=>t.color==='neutral'));
const chanceWords=E.check('Purple elephants know the other way.',direction);
assert.ok(chanceWords.annotations.every(t=>t.color==='neutral'));
const park=batch.find(d=>d.id==='batch-park');
const partialClause=E.check('I see you! I’m sprocking.',park.turns[8]);
assert.equal(partialClause.status,'unknown');
assert.equal(partialClause.annotations.find(t=>t.text==='see').color,'correct');
assert.equal(partialClause.annotations.find(t=>t.text==='sprocking').color,'neutral');
const hotel=batch.find(d=>d.id==='batch-hotel');
const withOmission=E.check('I have reservation under Anna. Blorven.',hotel.turns[0]);
assert.equal(withOmission.status,'unknown');
assert.equal(withOmission.insertions[0].label,'a');
assert.equal(withOmission.annotations.find(t=>t.text==='reservation').color,'correct');
const usualRegister=E.check('I am in the wrong bus. Blorven.',direction);
assert.equal(usualRegister.status,'unknown');
assert.equal(usualRegister.annotations.find(t=>t.text==='in').color,'acceptable');
console.log('Partial annotations passed: ordered matches, unknown words, neutral omissions, verified diagnostics and context.');
