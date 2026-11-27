const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const context = {globalThis: {}};
for (const file of ['engine.js','content.js','content-stage1.js','content-ten.js','content-answers.js','structured.js','content-pilot.js','content-friend.js','content-library.js','content-intros.js','content-batch-a.js','content-batch-b.js','content-a1-batch.js','content-a1-block1-a.js','content-a1-block1-b.js','content-a1-block1-c.js', 'content-a1-block1-expansion.js']) vm.runInNewContext(fs.readFileSync(path.join(__dirname,'..',file),'utf8'), context);
const beforeRefinement = structuredClone(context.globalThis.DIALOGUES.filter(d => d.id.startsWith('a1-')));
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'..','content-a1-block1-refinement.js'),'utf8'), context);
const all = context.globalThis.DIALOGUES;
const E = context.globalThis.OfflineEngine;
let checks = 0;
const verify = (value, expected) => { assert.equal(value, expected); checks++; };
verify(all.length, 34);
const current = all.filter(dialogue => dialogue.checking === 'construction');
verify(current.length, 14);
verify(new Set(current.map(dialogue => dialogue.topic)).size, 14);
verify(new Set(all.map(d => d.id)).size, all.length);
for (const d of all) {
  verify(d.turns.length, 10);
  verify(d.length, 'long');
  assert.ok(d.context && d.ending.en && d.ending.ru);
  for (const t of d.turns) {
    assert.ok(t.en && t.ru && t.task && t.best);
    verify(E.check(t.best, t).status, 'correct');
    verify(new Set(t.natural.map(E.normalize)).size, t.natural.length);
    verify(E.preferred(t).length <= 10, true);
    for (const value of E.naturalForms(t)) {
      verify(E.check(value, t).status, 'correct');
      verify(E.check('  ' + value.toUpperCase().replace(/’/g,"'") + '!!  ', t).status, 'correct');
    }
    for (const value of t.acceptable) { assert.ok(value.note); verify(E.check(value.text,t).status, 'acceptable'); }
  }
}
const newDialogues = current.filter(dialogue => dialogue.id.startsWith('a1-'));
verify(newDialogues.length, 6);
const crossCases = require('./a1-block1-cross-cases.cjs');
let crossChecks = 0;
for (const d of newDialogues) {
  assert.ok(d.context && d.authorSynopsis && d.tone);
  verify(d.reviewFunctions.length, 10);
  assert.equal(crossCases[d.id].length, d.turns.length);
  for (const [index, turn] of d.turns.entries()) {
    const label = `${d.id} / ${index + 1}`;
    const {intent, required, ellipsis, cases, patterns} = turn.assessment;
    assert.ok(intent && required && ellipsis, label);
    assert.ok(/[а-яё]/i.test(turn.task), label);
    assert.ok(cases.correct.length >= 3 && cases.error.length && cases.unknown.length, label);
    for (const pattern of patterns) new RegExp(`^(?:${pattern})$`);
    for (const [status, examples] of Object.entries(cases)) {
      for (const example of examples) {
        const result = E.check(example, turn);
        assert.equal(result.status, status, `${label} · ${example}`);
        checks++;
        if (status === 'error') {
          assert.ok(result.note && result.correction && result.fragment, label);
          assert.ok(result.insertions.length || result.annotations.some(part => part.color === 'error'), label);
        }
      }
    }
    verify(E.check(turn.best + ' Blorven is glimming.', turn).status, 'unknown');
    const [natural, rejected] = crossCases[d.id][index];
    for (const example of natural) {
      assert.equal(E.check(example, turn).status, 'correct', `${label} · ${example}`);
      crossChecks++;
    }
    for (const example of rejected) {
      assert.ok(['error', 'unknown'].includes(E.check(example, turn).status), `${label} · ${example}`);
      crossChecks++;
    }
  }
}
console.log(`${crossChecks} A1 block 1 cross-review checks passed.`);
require('./a1-block1-expansion-test.cjs')(newDialogues,E);
require('./a1-block1-refinement-test.cjs')(newDialogues,beforeRefinement,E);
const coffee = all[0].turns[0];
verify(E.check('Can I get a small coffee to go, please?', coffee).status, 'correct');
verify(E.check('I would like a small coffee to go, please.', coffee).status, 'correct');
verify(E.check('I want a small coffee to go, please.', coffee).status, 'acceptable');
verify(E.check('Can I have a large coffee to go, please?', coffee).status, 'unknown');
verify(E.check('Can I have a small tea to go, please?', coffee).status, 'unknown');
verify(E.check('Can I not have a small coffee to go, please?', coffee).status, 'unknown');
verify(E.check('Can have I a small coffee to go please', coffee).status, 'unknown');
verify(E.check('   ', coffee).status, 'empty');
const wait = all[5].turns[0];
verify(E.check('Not yet. I am waiting for a friend.', wait).status, 'correct');
verify(E.check('Not yet. Waiting for a friend.', wait).status, 'correct');
verify(E.check('Not yet. I am not waiting for a friend.', wait).status, 'unknown');
verify(E.check('Not yet. I was waiting for a friend.', wait).status, 'unknown');
verify(E.check('Not yet. Waiting for friend.', wait).status, 'unknown');
const forks = all[5].turns[5];
verify(E.check('And three forks, please.', forks).status, 'unknown');
verify(E.check('Two fork, please.', forks).status, 'unknown');
const black = all[0].turns[1];
verify(E.check('Milk, thanks.', black).status, 'unknown');
verify(E.check('No milk thank you', black).status, 'correct');
// Pragmatic equivalents are allowed locally, not as a blanket yes/no rule.
verify(E.check('That would be great, thanks.', all[1].turns[9]).status, 'correct');
verify(E.check('We would like a table for two, please.', all[1].turns[0]).status, 'correct');
verify(E.check('Can we get a table for two, please?', all[1].turns[0]).status, 'correct');
verify(E.check('We had like a table for two, please.', all[1].turns[0]).status, 'unknown');
verify(E.check('Can we have a table for three, please?', all[1].turns[0]).status, 'unknown');
verify(E.check('No, thanks.', all[1].turns[9]).status, 'unknown');
verify(E.check('Yes, please.', black).status, 'unknown');
verify(E.check('A lot of milk, please.', all[2].turns[2]).status, 'unknown');
verify(E.check('Cash, please.', all[0].turns[2]).status, 'unknown');
verify(E.check('Is that twenty dollars?', all[4].turns[8]).status, 'unknown');
verify(E.check('One, please.', all[5].turns[8]).status, 'unknown');
verify(E.check('I’m all set, thanks.', all[3].turns[3]).status, 'correct');
verify(E.check('You too!', all[0].turns[9]).status, 'correct');
verify(E.normalize("I'd"), "i'd"); // Ambiguous contraction is not expanded globally.
verify(E.check('Can I get the salt, please?', all[4].turns[4]).method, 'grammar');
verify(E.pick(['a','b'], ['a'], () => 0), 'b');
verify(E.pick(['a','b'], ['a','b'], () => 0), 'a');
verify(E.pick([], [], () => 0), null);
verify(E.pick(['a'], ['stale-id'], () => 0), 'a');
const find = id => all.find(d => d.id === id);
const cases = [
  ['school-snacks',0,'Three, please.','unknown'],
  ['school-snacks',1,'One bag, please.','unknown'],
  ['birthday-cake',9,'Seven candles, please.','unknown'],
  ['hold-last-loaf',2,'I’ll be there in fifty minutes.','unknown'],
  ['bakery-morning-pickup',2,'At eight in the evening.','unknown'],
  ['bakery-morning-pickup',3,'Anna. A-N-A.','unknown'],
  ['bakery-outside-table',0,'Can we sit inside?','unknown'],
  ['takeout-pickup-name',2,'Seventy.','unknown'],
  ['takeout-pickup-name',9,'No, I haven’t paid.','unknown'],
  ['takeout-napkins',2,'Three, please.','unknown'],
  ['takeout-sandwich',2,'Yes, cheese, please.','unknown'],
  ['takeout-sandwich',3,'Just tomato, please.','unknown'],
  ['takeout-sandwich',9,'For here, please.','unknown'],
  ['takeout-wrong-counter',0,'I’m waiting for order twelve.','unknown'],
  ['takeout-second-bag',0,'Sorry, the burgers are missing.','unknown'],
  ['takeout-lunch-friend',1,'Two large pizzas.','unknown'],
  ['takeout-phone-pizza',1,'One medium and one large.','unknown'],
  ['takeout-phone-pizza',2,'Two cheese pizzas.','unknown'],
  ['takeout-phone-pizza',5,'Six a.m., please.','unknown'],
  ['takeout-delivery-door',2,'Twenty.','unknown'],
  ['takeout-delivery-door',5,'The third floor.','unknown'],
  ['takeout-delivery-door',7,'No, I’m not Alex.','unknown'],
  ['takeout-napkins',0,'Can I get some napkins, please?','correct'],
  ['takeout-lunch-friend',0,'Pizza sounds good.','correct'],
  ['bread-sliced',1,'That would be great, thanks.','correct'],
  ['takeout-second-bag',9,'Thanks so much.','correct']
];
for (const [id,index,answer,status] of cases) verify(E.check(answer,find(id).turns[index]).status,status);
verify(E.eligible(['a','b'], ['a']).join(','), 'b');
verify(E.eligible(['a','b'], ['a','b']).join(','), 'a,b');
verify(all.reduce((n,d)=>n+d.turns.reduce((n,t)=>n+E.naturalForms(t).length,0),0)>=2240,true);
verify(E.check('Could I please have a small coffee to go?',coffee).status,'correct');
verify(E.check('Could I please get a small coffee to go?',coffee).status,'correct');
verify(E.check('Could I please have a large coffee to go?',coffee).status,'unknown');
verify(E.check('Could I not have a small coffee to go?',coffee).status,'unknown');
console.log(`${checks} checks passed: authored answers, grammar, meaning boundaries, random selection.`);
require('./app-test.cjs');

require('./pilot-test.cjs');

require('./batch-test.cjs');
require('./batch-independent-test.cjs');
require('./a1-block1-independent-test.cjs');

require('./update-test.cjs');
