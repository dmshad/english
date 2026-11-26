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
const inline=E.check('Oh, I need to sprock the glorp way.',direction);
assert.equal(inline.status,'unknown');
assert.equal(inline.annotations.find(t=>t.text==='need').color,'correct');
assert.equal(inline.annotations.find(t=>t.text==='sprock').color,'neutral');
assert.equal(inline.annotations.find(t=>t.text==='glorp').color,'neutral');
assert.equal(inline.annotations.find(t=>t.text==='way').color,'neutral');
const several=E.check('Blorven!I am in the wrong bus.\nI need go the other way. Glorp.',direction);
assert.equal(several.status,'unknown');
assert.deepEqual(Array.from(several.annotations.filter(t=>t.color==='neutral'),t=>t.text),['Blorven','Glorp']);
assert.equal(several.annotations.find(t=>t.text==='in').color,'acceptable');
assert.equal(several.annotations.find(t=>t.text==='go').color,'error');
assert.equal(several.annotations.find(t=>t.text==='bus').color,'correct');
assert.equal(several.diagnostics.length,2);
const chairs=batch.find(d=>d.id==='batch-event').turns[1];
const chairTypo=E.check("  There're only eigth.  ",chairs);
assert.equal(chairTypo.status,'error');
assert.equal(chairTypo.code,'spelling');
assert.deepEqual(Array.from(chairTypo.annotations,t=>[t.text,t.start,t.end,t.color]),[
  ["There're",2,10,'correct'],['only',11,15,'correct'],['eigth',16,21,'error']
]);
assert.match(chairTypo.note,/eigth.*eight/);
const chairMixed=E.check("There’re only eigth. Blorven.",chairs);
assert.equal(chairMixed.status,'unknown');
assert.equal(chairMixed.diagnostics[0].code,'spelling');
assert.deepEqual(Array.from(chairMixed.annotations,t=>t.color),['correct','correct','error','neutral']);
assert.equal(E.check('Eigth. Blorven.',chairs).annotations[0].color,'error');
const unknownCount=E.check("There’re only sprog.",chairs);
assert.equal(unknownCount.status,'unknown');
assert.deepEqual(Array.from(unknownCount.annotations,t=>t.color),['correct','correct','neutral']);
assert.equal(E.check("There’re only eight.",direction).status,'unknown');
const door=batch.find(d=>d.id==='batch-event').turns[3];
const shortDoor=E.check("  Can't open the door.  ",door);
assert.equal(shortDoor.status,'correct');
assert.deepEqual(Array.from(shortDoor.annotations,t=>[t.text,t.start,t.color]),[
  ["Can't",2,'correct'],['open',8,'correct'],['the',13,'correct'],['door',17,'correct']
]);
assert.equal(shortDoor.insertions.length,0);
for(const answer of ['Can’t open it.','Cannot get through that door.','I can’t open it.']){
  assert.equal(E.check(answer,door).status,'correct',answer);
}
for(const answer of ["Can't.",'Can open the door.',"Can't open the window.","Can't you open the door?","Can't open the door and I’m going home."]){
  assert.equal(E.check(answer,door).status,'unknown',answer);
}
assert.equal(E.check('Yep, but can’t see you yet.',park.turns[7]).status,'correct');
assert.equal(E.check('Yep, but can’t see the lake.',park.turns[7]).status,'unknown');
assert.equal(E.check('Can’t see the screen from the back.',batch.find(d=>d.id==='batch-event').turns[5]).status,'unknown');
const mixedDoor=E.check("Can't open the door. Blorven.",door);
assert.equal(mixedDoor.status,'unknown');
assert.deepEqual(Array.from(mixedDoor.annotations,t=>t.color),['correct','correct','correct','correct','neutral']);
for(const answer of ['Oh, need to go the other way.','Going the wrong way.','On the wrong bus.']){
  const result=E.check(answer,direction);
  assert.equal(result.status,'correct',answer);
  assert.ok(result.annotations.every(t=>t.color==='correct'),answer);
}
for(const answer of ['Need to go downtown.','Going the right way.','Need to go the other way?']){
  assert.equal(E.check(answer,direction).status,'unknown',answer);
}
assert.equal(E.check('In the wrong bus.',direction).status,'acceptable');
assert.equal(E.check('Already have a ticket.',batch.find(d=>d.id==='batch-bus').turns[5]).status,'correct');
assert.equal(E.check('Looking for comfortable walking shoes.',batch.find(d=>d.id==='batch-shoes').turns[0]).status,'correct');
const notReady={natural:['I’m not ready.'],assessment:{kind:'conversation',patterns:['i am not ready']}};
assert.equal(E.check('Not ready.',notReady).status,'correct');
assert.equal(E.check('Ready.',notReady).status,'unknown');
assert.equal(E.check('Not ready?',notReady).status,'unknown');
const noCheese={natural:['I don’t like cheese.'],assessment:{kind:'conversation',patterns:['i do not like cheese']}};
assert.equal(E.check("Don't like cheese.",noCheese).status,'correct');
assert.equal(E.check('Like cheese.',noCheese).status,'unknown');
assert.ok(E.check('Not ready? Blorven.',notReady).annotations.every(t=>t.color==='neutral'));
console.log('Partial annotations passed: ordered matches, unknown words, neutral omissions, verified diagnostics and context.');
