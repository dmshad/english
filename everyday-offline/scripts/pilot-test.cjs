// Independent paraphrases and adversarial minimal pairs, beyond the display shortlist.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const context={globalThis:{}};
for(const f of ['engine.js','content.js','content-stage1.js','content-ten.js','content-answers.js','structured.js','content-pilot.js'])vm.runInNewContext(fs.readFileSync(path.join(__dirname,'..',f),'utf8'),context);
const {DIALOGUES,OfflineEngine:E}=context.globalThis;
const home=DIALOGUES.find(d=>d.id==='pilot-friend-evening'),library=DIALOGUES.find(d=>d.id==='pilot-library');
let checks=0;const failures=[];
function group(d,index,status,answers){for(const answer of answers){const result=E.check(answer,d.turns[index]);checks++;if(result.status!==status)failures.push({dialogue:d.id,index,answer,expected:status,actual:result});if(result.status==='error'){assert.ok(result.code&&result.note&&result.fragment&&result.correction);checks++;}}}
for(const d of [home,library]){assert.equal(d.turns.length,10);for(let i=0;i<10;i++)group(d,i,'correct',d.turns[i].natural);}
group(home,0,'correct',[
  'Yep, could you please get me some water? Thanks.', 'Yeah, can I please have water?',
  'Sure, I would love a glass of water, please.', 'I would appreciate some water.',
  'I was hoping you could bring me a bottle of water.', 'Would you mind getting me some cold water?',
  'Could you fetch me a glass of water, please?', 'Can you bring some water?',
  'May I have the water, please?', 'Might I have some water, please?',
  'I would appreciate it if you could bring me water.', 'Please give me some water.',
  'A water, thanks.', 'Two waters, please.', 'A glass of cold water, please.', 'A cup of water, please.',
  'Yes, I could use some water.', 'Some water would be lovely.', 'Could I please get the water?',
  'Okay, please pass me some water.', 'Sure, please, can I get a glass of water?',
  'Absolutely! Thank you.', 'Yes, thanks so much.', 'I would prefer some still water.'
]);
group(home,0,'correct',['Give me water.','Pass me some water.']);
group(home,0,'acceptable',['I request that you give me some water.']);
group(home,0,'error',[
  'Can I have an water?', 'Could I have glass of water?', 'Can I have a glass water?',
  'Can I have a my glass of water?', 'Can I have an glass of water?',
  'Can I have two glass of water?', 'Can I have a glasses of water?',
  'Can I have a glass of waters?', 'Can I have a few water?', 'Can I have two water?', 'Can I have a little waters?', 'Can I has some water?',
  'Would you mind to bring me some water?', 'No water.', 'I do not want water.', 'Can I have some milk?'
]);
group(home,0,'unknown',[
  'Can I have water but not water?', 'Can I have water and three fish?', 'Water because we saw a whale.',
  'I had liked water.', 'Could I borrow some water?', 'May he have some water?',
  'No, can I have some water?', 'Can I have water без сахара?', 'Воды пожалуйста', '!!!'
]);
group(home,1,'correct',['Could I have a glass of water, please?','Give me a glass, please.','The glass, thanks.','This glass, please.']);
group(home,1,'error',['In a bottle.','Can I have glass?','Can I have an glass?','Can I have an empty glass?']);
group(home,1,'unknown',['Yes, please.','An extraordinarily ornate goblet.']);
group(home,2,'correct',['Could you give me a little water?','I would like a little bit of water, thanks.','Just not much, please.']);
group(home,2,'unknown',['Some water, please.','A generous amount, please.']);
group(home,2,'error',['A little milk.','A lot of water.','Can I have lots of water?']);
group(home,3,'correct',['No ice, thank you very much.','No, thanks so much.','I would rather have no ice, thank you.','Can I have the water without ice, please?']);
group(home,3,'error',['Some ice, please.','I want ice.','Can I have ice?']);
group(home,3,'unknown',['No ice unless we go outside.','No, I would like ice.']);
group(home,4,'correct',['Could I please have a couple of plates?','Can you give us two plates, please?','I would love two clean plates.','Pass me two plates, please.','A pair of plates, thanks.']);
group(home,4,'error',['Two plate, please.','A plate, please.','Three plates, thanks.','A plates, please.','Much plates, please.']);
group(home,4,'unknown',['Two plates and three bowls.','Some plates.']);
group(home,5,'correct',['My knife, please.','This knife, please.','A clean knife would be nice.','Could you please pass me the knife?']);
group(home,5,'error',['Can I have knife, please?','An knife, please.','Two knife, please.','Two knives, please.']);
group(home,6,'correct',['Please put my plate on the table.','You can put it on the table, thanks.','On this table, thanks.']);
group(home,6,'error',['On table.','Under the table.','In the table.']);
group(home,6,'unknown',['The table is made of wood.','On the table if Sam comes.']);
group(home,7,'correct',['I would love to watch some television.','Could we watch the TV for a bit?','I feel like watching the television.','Let us watch some TV.','How about watching TV for a while?']);
group(home,7,'error',['I want watch TV.','I am want to watch TV.','I want to see TV.','I want to look TV.','I want to watching TV.','I feel like watch TV.']);
group(home,7,'unknown',['I can see the TV.','I want to see the movie.','I do not want to watch TV.','I would like to see what is on TV.']);
group(home,8,'correct',['Yeah, eight is fine.','Sure, that is perfect.','Yes, that works for me.','Eight would be fine for me.']);
group(home,8,'error',['No.','Eight is not fine.']);
group(home,8,'unknown',['Eight is fine, but I cannot come.','Nine would be fine.']);
group(home,9,'correct',['Yes, ready now!','I am already ready.','Sure, we are ready to start.','Ready to start, thanks.']);
group(home,9,'error',['I is ready.','I are ready.','I am not ready.','Not yet.']);
group(library,0,'correct',[
  'Would it be possible for me to borrow an English textbook?',
  'I was hoping I could borrow a book for learning English.',
  'Could you help me find a textbook for learning English?',
  'I would like to borrow an English language textbook, please.',
  'Could you please lend me an English textbook?', 'An English coursebook, please.',
  'I could use an English textbook.', 'I would appreciate an English textbook.'
]);
group(library,0,'acceptable',['Give me an English textbook, please.','Gimme an English textbook.','I request that you give me an English textbook.']);
group(library,0,'error',['I need a English textbook.','Could I borrow English textbook?','I need an English textbooks.','Can I have a my English textbook?','Can I have two English textbooks?','I need a bottle of water.']);
group(library,0,'unknown',['I need an English textbook that explains the subjunctive.','I would like a book in English.']);
group(library,1,'correct',['It is for myself, thank you.','For me, thanks so much.','The book is for me, please.']);
group(library,1,'error',['For I.','For my.','To me.','For my child.']);
group(library,2,'correct',['Just one textbook, thanks.','1 book, please.','An English textbook.']);
group(library,2,'error',['Two books.','One books.','Three.']);
group(library,3,'correct',['I am called Anna, thank you.','Sure, Anna is my name.','You can call me Anna.']);
group(library,3,'error',['My name are Anna.','My name Anna.','I is Anna.','I am Ana.']);
group(library,3,'unknown',['Anna knows me.','I am Anna’s sister.']);
group(library,4,'correct',['A, N, N, A.','Yes, A double N A.','It is A N N A.','ANNA']);
group(library,4,'error',['A-N-A.','A-N-N-E.']);
group(library,4,'unknown',['A B C.']);
group(library,5,'correct',['For 14 days, thanks.','Can I keep it for a fortnight?','I would like it for two weeks.']);
group(library,5,'error',['Two week.','In two weeks.','During two weeks.','For one week.']);
group(library,5,'unknown',['For two weeks unless I need more.','For several weeks.']);
group(library,6,'correct',['I will return it on Tuesday, thank you.','Tuesday would be great.','I can come back on Tuesday.']);
group(library,6,'error',['At Tuesday.','In Tuesday.','On Monday.']);
group(library,6,'unknown',['By Tuesday.','Tuesday, unless I am away.']);
group(library,7,'correct',['No, I have got my own bag, thanks.','I have a bag, thanks.','No, I have my own.','I do not need a bag.']);
group(library,7,'error',['I have own bag.','I have bag.','I have a my own bag.','I has my own bag.','I need a bag.']);
group(library,7,'unknown',['No thanks, but perhaps later.']);
group(library,8,'correct',['May I sit somewhere?','Where should I sit down?','Where can we sit?','Is there somewhere where I can sit?']);
group(library,8,'error',['Where I can sit?','Where can I to sit?']);
group(library,8,'unknown',['I know where I can sit.','Where can I sit if I bring my dog?']);
group(library,9,'correct',['Yes, that would be great, thanks.','Absolutely, perfect.','That sounds fine, thank you.']);
group(library,9,'error',['No.']);
// Independently selected legal blocks: combination coverage rather than enumerating whole answers.
for(const ack of ['', 'Yep, ', 'Sure, ', 'Okay, '])
for(const prefix of ['Could you please bring me ', 'Would you mind getting me ', 'I was hoping I could have ', 'May I have '])
for(const object of ['some water', 'a glass of cold water', 'a little water', 'a bottle of water'])
for(const polite of ['?', ', thanks.', ', please.'])group(home,0,'correct',[ack+prefix+object+polite]);
group(home,0,'correct',['Could you please pour me some water?','Would you mind pouring me a glass of water?','Do you mind if I have some water?','Would you mind if I had some water?']);
group(library,0,'unknown',['Could you pour me an English textbook?']);
group(home,0,'error',['No, thank you.']);
group(home,4,'correct',['Two clean white plates, please.']);
group(home,2,'correct',['Not much water, please.']);
group(library,7,'correct',['No thanks, I already have my own bag.','I have got my own bag with me.']);
group(home,3,'correct',['No, I do not need any ice, thanks.','Please do not add ice.','Leave the ice out, please.','I would like it with no ice, please.']);
group(library,7,'error',['No, thanks, I have own bag.']);
group(library,9,'correct',['Yes, thanks, that is great.']);
for(const d of [home,library])for(let i=0;i<10;i++)group(d,i,'correct',E.preferred(d.turns[i]));
if(failures.length){console.log(JSON.stringify(failures,null,2));throw new Error(failures.length+' pilot verdict failures');}
console.log(checks+' pilot checks passed: independent paraphrases, known errors, protected exceptions and unknowns.');
// New story regressions and original mobile reports.
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../content-friend.js'),'utf8'),context);
const revised=DIALOGUES.find(d=>d.id==='pilot-friend-evening');
for(let i=0;i<10;i++)for(const answer of revised.turns[i].natural)assert.equal(E.check(answer,revised.turns[i]).status,'correct',answer);
assert.equal(E.check('Wanna watch TV',revised.turns[7]).status,'correct');
const ice={assessment:{kind:'no-ice',example:'No ice, thanks.'},natural:[]};
assert.equal(E.check('No, no ice, thanks',ice).status,'correct');
const water=home.turns[0]; // Construct a stable independent water frame after story replacement.
const requestTurn={assessment:{kind:'object',noun:'water',objectLabel:'вода',register:'close',allowYes:true,example:'Water, please.'},natural:[]};
const red=E.check('Can I have an water?',requestTurn);
assert.equal(red.status,'error');assert.equal(red.annotations.find(t=>t.text==='an').color,'error');assert.equal(red.annotations.find(t=>t.text==='water').color,'correct');
const gap=E.check('Can I have glass of water?',requestTurn);assert.equal(gap.insertions.length,1);assert.equal(gap.annotations.find(t=>t.text==='glass').color,'correct');
const unparsed=E.check('Could a flying whale bring water?',requestTurn);assert.equal(unparsed.status,'unknown');assert.ok(unparsed.annotations.every(t=>t.color==='neutral'));
const partialRequest=E.check('I was hoping I could get a splorf of glorp.',requestTurn);
assert.equal(partialRequest.status,'unknown');
assert.deepEqual(Array.from(partialRequest.annotations.filter(t=>t.color==='correct'),t=>t.text),['I','was','hoping','I','could','get']);
assert.ok(partialRequest.annotations.filter(t=>['splorf','glorp'].includes(t.text)).every(t=>t.color==='neutral'));
const yellow=E.check('Give me an English textbook.',library.turns[0]);assert.equal(yellow.annotations.find(t=>t.text==='Give').color,'acceptable');assert.equal(yellow.annotations.find(t=>t.text==='textbook').color,'correct');
console.log('Rewritten story, mobile examples and token annotations passed.');
const wannaError=E.check('Wanna see TV',revised.turns[7]);assert.equal(wannaError.status,'error');assert.equal(wannaError.annotations.find(t=>t.text==='see').color,'error');
// Feedback batch: families, not just the four screenshots.
function expect(index,status,answers){for(const a of answers)assert.equal(E.check(a,revised.turns[index]).status,status,a);}
expect(4,'correct',['Two are enough','Two is enough','Two plates are enough','Two plates is enough','Two would be enough','I think two are enough','We just need two','Two will do it']);
expect(4,'error',['Three are enough','Two are not enough','Two plate']);
expect(5,'correct',["No, don't like cheese","Don't really like cheese","I don't enjoy cheese at all","No thanks, I'm not into cheese","Cheese isn't my thing"]);
expect(5,'error',['I love cheese','I does not like cheese']);
expect(5,'unknown',["I don't like cheese but I want it today"]);
expect(9,'correct',["Let's watch a comedy","Let's watch the comedy","How about watching a comedy?","I'd rather watch the comedy","I want to watch a comedy","I think a comedy would be fun"]);
expect(9,'error',['How about watch a comedy','I would rather to watch the comedy','I want watch a comedy']);
expect(9,'unknown',["Let's not watch a comedy","Let's watch a comedy and then fly to Mars"]);
expect(7,'correct',['Lets watch TV',"Let's watch TV"]);
assert.ok(E.check('Lets watch TV',revised.turns[7]).orthographyNote);
expect(0,'correct',['My bus was delayed','The bus ran late']);expect(1,'correct',["I'm a bit hungry",'I could eat something']);
expect(2,'correct',['What could I help with?','What would you like me to do?']);
expect(3,'correct',['Where are your knives?']);expect(3,'error',['Where is knife']);
expect(6,'correct',['That smells wonderful']);expect(8,'correct',["It's right under that book",'Check beneath the book']);
console.log('Expanded conversational families and screenshot regressions passed.');
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../content-library.js'),'utf8'),context);
const lib=DIALOGUES.find(d=>d.id==='pilot-library');
for(const t of lib.turns)for(const a of [...t.natural,...E.preferred(t)])assert.equal(E.check(a,t).status,'correct',a);
function libCase(i,status,values){for(const a of values)assert.equal(E.check(a,lib.turns[i]).status,status,a);}
libCase(2,'correct',["I'm just getting started","I've just started learning English",'A complete beginner']);
libCase(2,'error',['I beginner']);
libCase(3,'correct',['May I borrow this book?','Is it okay to take it home?','Could I take it with me?']);
libCase(3,'error',['Can I takes it home']);
libCase(4,'correct',["No, this is my first visit","I haven't got one. It's my first time here","No, not yet. This is my first visit"]);
libCase(6,'correct',['No, can I borrow yours?',"I don't have a pen. Could I use yours?",'Could you let me use your pen?','May I borrow a pen?']);
libCase(6,'error',['Can I borrow pen?','Can I use your?','May I lend your pen?']);
libCase(6,'unknown',['No','I have a blue pen','Can I borrow your book?']);
libCase(7,'correct',['May I keep it a bit longer?','Can I keep this book for more than two weeks?','Could I renew the loan?','Would it be okay if I keep it longer?']);
libCase(7,'error',['Can I keep it more longer?','Could I keeping the book longer?']);
libCase(7,'unknown',['Two weeks?','Can I keep it for one week?','I cannot keep it longer']);
libCase(8,'correct',['Is there somewhere quiet to read?','Can I sit somewhere quiet?','Could you tell me where I can read quietly?']);
libCase(8,'error',['Where I can read quietly']);
libCase(8,'unknown',['Is there a quiet place where my dog can fly?']);
libCase(9,'correct',["I'll read here for a while","Then I'll read here","I think I'll read here for a bit"]);
libCase(9,'error',['I will reading here']);
assert.equal(E.check('Lets watch TV',revised.turns[7]).status,'correct');
assert.ok(E.check('Lets watch TV',revised.turns[7]).orthographyNote);
console.log('Reworked library story and current pilot examples passed.');

libCase(2,'error',['I am beginner','I am total beginner']);
libCase(3,'error',['Could I takes this book home','May I take it to home','Could I to borrow it']);
libCase(4,'unknown',['No','No not yet','I have not got one','Yes this is my tenth visit']);
libCase(8,'error',['Is there quiet place to read','Is there a somewhere quiet to read']);
libCase(8,'correct',['May I read somewhere quiet','Is there anywhere quiet where I can read','Do you have a quiet corner to read']);
libCase(9,'error',['I will reading here for a while','I am going read here']);

libCase(8,'correct',['Can I find a quiet place to read here?','Could I find somewhere quiet to read in this library?','May I find a quiet corner here to read?']);
libCase(8,'acceptable',['Can I find here a quiet place to read?','Could I find here a quiet corner to read?']);
libCase(8,'unknown',['Can I find here a quiet place to read and have a party?','Can I not find a quiet place to read here?','Can I find a noisy place to read here?']);
const placed=E.check('Can I find here a quiet place to read?',lib.turns[8]);
assert.deepEqual(Array.from(placed.annotations.filter(t=>t.color==='acceptable'),t=>t.text),['here']);
assert.ok(placed.annotations.filter(t=>t.text!=='here').every(t=>t.color==='correct'));
assert.ok(placed.note&&placed.correction);
assert.ok(lib.turns.every(t=>!/^a[- ]n[- ]n[- ]a[.!]?$/i.test(t.task)&&t.task!=='Две недели?'));

for(const d of DIALOGUES.filter(d=>d.checking==='construction'))for(const t of d.turns)assert.ok(/[а-яё]/i.test(t.task),'Translation task must contain Russian: '+t.task);
console.log('Editorial regressions, screenshot wording, style spans and revised library turns passed.');
