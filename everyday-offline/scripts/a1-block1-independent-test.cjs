// Independent probes derived from whole-scene readings, outside the author cases.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const context = {globalThis: {DIALOGUES: []}};
const files = [
  'engine.js', 'structured.js', 'content-a1-batch.js',
  'content-a1-block1-a.js', 'content-a1-block1-b.js', 'content-a1-block1-c.js'
];
for (const file of files) {
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '..', file), 'utf8'), context, {filename: file});
}
const {DIALOGUES, OfflineEngine} = context.globalThis;
const failures = [];
let checks = 0;

function probe(id, number, expected, answers) {
  const dialogue = DIALOGUES.find(dialogue => dialogue.id === id);
  assert.ok(dialogue, id);
  const turn = dialogue.turns[number - 1];
  for (const answer of answers) {
    const result = OfflineEngine.check(answer, turn);
    checks++;
    const matches = expected === 'reject' ? ['error', 'unknown'].includes(result.status) : result.status === expected;
    if (!matches) failures.push({id, number, answer, expected, actual: result.status, note: result.note});
  }
}

function spans(id, number, answer, expected) {
  const turn = DIALOGUES.find(dialogue => dialogue.id === id).turns[number - 1];
  const result = OfflineEngine.check(answer, turn);
  const actual = {
    status: result.status,
    annotations: Array.from(result.annotations, token => [token.text, token.start, token.end, token.color]),
    insertions: Array.from(result.insertions, item => [item.at, item.label]),
    diagnostics: Array.from(result.diagnostics || [], item => item.code)
  };
  checks++;
  try {
    assert.deepEqual(actual, expected);
  } catch {
    failures.push({id, number, answer, expected, actual});
  }
}

function spelling(id, number, answer, status, hasNote) {
  const turn = DIALOGUES.find(dialogue => dialogue.id === id).turns[number - 1];
  const result = OfflineEngine.check(answer, turn);
  const actual = {status: result.status, hasNote: Boolean(result.orthographyNote)};
  checks++;
  if (actual.status !== status || actual.hasNote !== hasNote) {
    failures.push({id, number, answer, expected: {status, hasNote}, actual});
  }
}

// PROBES
probe('a1-laundry', 1, 'correct', ['Yes, please. I’ve never been here before.', 'My first time here. A hand would be great.']);
probe('a1-laundry', 1, 'reject', ['No, thanks. I’ve been here before.']);
probe('a1-laundry', 2, 'correct', ['Nothing but colors.', 'I only brought colored clothes.']);
probe('a1-laundry', 2, 'reject', ['Just whites.', 'A mix of whites and colors.']);
probe('a1-laundry', 3, 'correct', ['A small washer will do.', 'I just need a small one.']);
probe('a1-laundry', 3, 'reject', ['I just need a big one.']);
probe('a1-laundry', 4, 'correct', ['No change. Do you take cards?', 'I don’t have any coins. Will a card work?']);
probe('a1-laundry', 4, 'reject', ['I have some coins. Can I pay by card?', 'I don’t have any coins. Can I pay in cash?']);
probe('a1-laundry', 5, 'correct', ['Forgot my detergent.', 'I left my laundry detergent at home.']);
probe('a1-laundry', 5, 'reject', ['Yes, I forgot my laundry soap.', 'I forgot my clothes.']);
probe('a1-laundry', 6, 'correct', ['Where does the soap go?', 'Thank you! Where should I pour it?']);
probe('a1-laundry', 6, 'reject', ['How much soap do I need?', 'Where should I put my bag?']);
probe('a1-laundry', 7, 'correct', ['Cold, please. I’ve got a new red T-shirt.', 'New red T-shirt, so cold water.']);
probe('a1-laundry', 7, 'reject', ['Hot water. I’ve got a new red T-shirt.', 'Cold, please. I’ve got a new white T-shirt.', 'Cold water.']);
probe('a1-laundry', 8, 'correct', ['How long is the wash?', 'How much time will it take?']);
probe('a1-laundry', 8, 'reject', ['How much does it cost?', 'What time do you close?']);
probe('a1-laundry', 9, 'correct', ['Then I’ll grab a coffee.', 'Think I’ll go get some coffee.']);
probe('a1-laundry', 9, 'reject', ['I’ll stay here, then.', 'Then I’ll grab a tea.']);
probe('a1-laundry', 10, 'correct', ['I’ll come back in twenty minutes, then.', 'Back in 20 minutes.']);
probe('a1-laundry', 10, 'reject', ['I’ll come back in thirty minutes.', 'I’ll be back at twenty past.']);

probe('a1-cinema', 1, 'correct', ['I forgot my scarf inside.', 'My scarf’s still in the movie theater.']);
probe('a1-cinema', 1, 'reject', ['I forgot my hat inside.', 'I left my scarf at home.']);
probe('a1-cinema', 2, 'correct', ['The three o’clock show.', 'It started at three in the afternoon.']);
probe('a1-cinema', 2, 'reject', ['The four o’clock show.', 'It started at three in the morning.']);
probe('a1-cinema', 3, 'correct', ['Back row, next to the door.', 'I was in the last row near the door.']);
probe('a1-cinema', 3, 'reject', ['In the front row near the door.', 'I was at the back.', 'By the door.']);
probe('a1-cinema', 4, 'correct', ['Blue with white lines.', 'It has white stripes on a blue background.']);
probe('a1-cinema', 4, 'reject', ['White with blue stripes.', 'Blue with white dots.', 'White stripes.']);
probe('a1-cinema', 5, 'correct', ['Mine’s like that, only longer.', 'Not mine. Mine’s longer.']);
probe('a1-cinema', 5, 'reject', ['Mine’s like that, only shorter.', 'Looks like mine.']);
probe('a1-cinema', 6, 'correct', ['Could I check under my seat myself?', 'Would it be okay if I looked under my seat?']);
probe('a1-cinema', 6, 'reject', ['Could you check under my seat?', 'Could I check next to my seat?']);
probe('a1-cinema', 7, 'correct', ['Hang on, I’ve got a picture of it on my phone.', 'I can show you a photo of it.']);
probe('a1-cinema', 7, 'reject', ['I can show you a picture of my seat.']);
probe('a1-cinema', 8, 'correct', ['That’s mine. There’s a little hole in it.', 'Yes! Notice that small hole?']);
probe('a1-cinema', 8, 'reject', ['Yes, that’s mine.', 'No, it’s not mine. There’s a little hole in it.']);
probe('a1-cinema', 9, 'correct', ['Can I get out this way?', 'Does this door go outside?', 'Can I get out through the other door?']);
probe('a1-cinema', 9, 'reject', ['Can I go back in this way?', 'Can I get out through the door we came in?']);
probe('a1-cinema', 10, 'correct', ['I appreciate you helping me find it.', 'Thanks for finding it for me.']);
probe('a1-cinema', 10, 'reject', ['Thanks for giving me your scarf.']);

probe('a1-bike', 1, 'correct', ['Hold on, I have to stop.', 'Can we stop for a second?']);
probe('a1-bike', 1, 'reject', ['Wait! I don’t need to stop.']);
probe('a1-bike', 2, 'correct', ['Hard to pedal right now.', 'I’m having a hard time pedaling.']);
probe('a1-bike', 3, 'correct', ['I’ve got a flat in the back.', 'The rear one’s flat.']);
probe('a1-bike', 3, 'reject', ['I’ve got a flat in the front.', 'A flat tire.']);
probe('a1-bike', 4, 'correct', ['Any chance you have a pump?', 'Have you got a pump with you?']);
probe('a1-bike', 4, 'reject', ['Have you got a spare tire?']);
probe('a1-bike', 5, 'correct', ['I’ll just walk, then.', 'I’ll go on foot, then.']);
probe('a1-bike', 5, 'reject', ['I’ll just ride, then.']);
probe('a1-bike', 6, 'correct', ['Are they open today?', 'Is that shop open now?']);
probe('a1-bike', 6, 'reject', ['Are they open tomorrow?']);
probe('a1-bike', 7, 'correct', ['Is it a long walk?', 'How far away is the shop?']);
probe('a1-bike', 8, 'correct', ['Why don’t we give them a call first?']);
probe('a1-bike', 8, 'reject', ['Let’s go there first.', 'Let’s call them later.']);
spelling('a1-bike', 8, 'Lets call the shop first.', 'correct', true);
probe('a1-bike', 9, 'correct', ['Could you make the call? I can hold the bikes.', 'You call and I’ll hold both bikes.']);
probe('a1-bike', 9, 'reject', ['I’ll call and you can hold the bikes.', 'Could you make the call?']);
probe('a1-bike', 10, 'correct', ['No, come with me.', 'Let’s go on foot together.']);
probe('a1-bike', 10, 'reject', ['Yes, go on ahead.', 'Yes, let’s walk together.']);
spans('a1-bike', 4, 'Do you have bike pump? Blorven.', {
  status: 'unknown',
  annotations: [
    ['Do', 0, 2, 'correct'], ['you', 3, 6, 'correct'], ['have', 7, 11, 'correct'],
    ['bike', 12, 16, 'correct'], ['pump', 17, 21, 'correct'], ['Blorven', 23, 30, 'neutral']
  ],
  insertions: [[12, 'a']],
  diagnostics: ['missing-determiner']
});

probe('a1-video', 1, 'correct', ['I hear you, but can’t see you yet.', 'Can hear you, but there’s no picture.']);
probe('a1-video', 1, 'reject', ['No, I can’t see you.', 'I can see you, but I can’t hear you.', 'Yes, I can hear you.']);
probe('a1-video', 2, 'correct', ['I see you now. What about me?', 'I can see you. Do you see me too?']);
probe('a1-video', 2, 'reject', ['I see you now.', 'Can you see me?', 'I still can’t see you. Can you see me?']);
probe('a1-video', 3, 'correct', ['Can I show you my room?', 'Would you like a look at my room?']);
probe('a1-video', 3, 'reject', ['Can you show me your room?']);
probe('a1-video', 4, 'correct', ['Right by the window.', 'My bed’s next to the window.']);
probe('a1-video', 4, 'reject', ['Right by the door.', 'My desk is next to the window.']);
probe('a1-video', 5, 'correct', ['That’s you in the photo.', 'It’s a picture of you up there.']);
probe('a1-video', 5, 'reject', ['A picture you took.', 'It’s a picture of me.']);
probe('a1-video', 6, 'correct', ['Yes, we took it at the beach.', 'It was taken on the beach.']);
probe('a1-video', 6, 'reject', ['Yes, from the mountains.', 'No, from the beach.']);
probe('a1-video', 7, 'correct', ['Can you see it any better now?', 'How’s that now?']);
probe('a1-video', 7, 'reject', ['I can see it better now.', 'Can you hear me better now?']);
probe('a1-video', 8, 'correct', ['I’ve got another one from that trip.', 'Got one more from the trip.']);
probe('a1-video', 8, 'reject', ['I’ve got another one from a different trip.', 'Got three more from the trip.']);
probe('a1-video', 9, 'correct', ['I’ll text it to you this evening.', 'I can send it over tonight.']);
probe('a1-video', 9, 'reject', ['I’ll text it to you tomorrow.', 'Can you send it to me tonight?']);
probe('a1-video', 10, 'correct', ['Have a good dinner! Give me a call tomorrow.', 'Enjoy dinner, and call me tomorrow.']);
probe('a1-video', 10, 'reject', ['Enjoy dinner! I’ll call you tomorrow.', 'Enjoy dinner! Call me tonight.', 'Enjoy dinner!']);
spans('a1-video', 1, '  Can’t see you. Blorven.', {
  status: 'unknown',
  annotations: [
    ['Can’t', 2, 7, 'correct'], ['see', 8, 11, 'correct'], ['you', 12, 15, 'correct'],
    ['Blorven', 17, 24, 'neutral']
  ],
  insertions: [],
  diagnostics: []
});

probe('a1-parcel', 1, 'correct', ['I’d like to mail this to my sister.', 'Could you send this to my sister?']);
probe('a1-parcel', 1, 'reject', ['I’d like to mail this to my brother.']);
probe('a1-parcel', 2, 'correct', ['A sweater. Made it myself.', 'It’s a sweater I made myself.']);
probe('a1-parcel', 2, 'reject', ['A sweater.', 'It’s a sweater my sister made.']);
probe('a1-parcel', 3, 'correct', ['No, that’s all I brought.', 'Nothing but this bag.']);
probe('a1-parcel', 3, 'reject', ['Yes, I only have this bag.', 'No, I have another bag.']);
probe('a1-parcel', 4, 'correct', ['The small one should do.', 'A small one’s fine.']);
probe('a1-parcel', 4, 'reject', ['The large one should do.']);
probe('a1-parcel', 5, 'correct', ['No later than Saturday.', 'She has to have it by Saturday.']);
probe('a1-parcel', 5, 'reject', ['After Saturday.', 'She has to have it by Sunday.']);
probe('a1-parcel', 6, 'correct', ['What’s the price for the Friday delivery?', 'How much to get it there by Friday?']);
probe('a1-parcel', 6, 'reject', ['How much is the Monday delivery?', 'When is the faster delivery?']);
probe('a1-parcel', 7, 'correct', ['It’s a bit pricey, but I’ll go with that.', 'A little steep, but okay.']);
probe('a1-parcel', 7, 'reject', ['It’s a bit pricey, so I’ll take the slower one.']);
spelling('a1-parcel', 7, 'That is a bit much, but lets do it.', 'correct', true);
spelling('a1-parcel', 7, 'A bit pricey, but let’s do it.', 'correct', false);
spelling('a1-parcel', 7, 'That is a bit much, but it lets us track it.', 'unknown', false);
probe('a1-parcel', 8, 'correct', ['Got her address right here on my phone.', 'It’s saved on my phone.']);
probe('a1-parcel', 8, 'reject', ['It’s saved on my sister’s phone.']);
probe('a1-parcel', 9, 'correct', ['Where do I check on my package?', 'How do I find out where it is?']);
probe('a1-parcel', 9, 'reject', ['Where is the package now?', 'When will it get there?']);
probe('a1-parcel', 10, 'correct', ['Do you take phone payments?', 'Can I tap to pay with my phone?']);
probe('a1-parcel', 10, 'reject', ['Can I pay in cash?']);

probe('a1-class', 1, 'correct', ['I signed up for the class on Mondays.', 'I’m taking the Monday class.']);
probe('a1-class', 1, 'reject', ['I’d like to sign up for Monday.', 'I’m taking the Tuesday class.']);
probe('a1-class', 2, 'correct', ['I’m at work till seven.', 'I don’t get off work until seven on Mondays.']);
probe('a1-class', 2, 'reject', ['I’m at work till five.', 'I start work at seven on Mondays.']);
spans('a1-class', 2, 'I works until seven on Mondays. Blorven.', {
  status: 'unknown',
  annotations: [
    ['I', 0, 1, 'correct'], ['works', 2, 7, 'error'], ['until', 8, 13, 'correct'],
    ['seven', 14, 19, 'correct'], ['on', 20, 22, 'correct'], ['Mondays', 23, 30, 'correct'],
    ['Blorven', 32, 39, 'neutral']
  ],
  insertions: [],
  diagnostics: ['conversation-grammar']
});
probe('a1-class', 3, 'correct', ['Could I switch to another day?', 'Do you have a class on another day?']);
probe('a1-class', 3, 'reject', ['Could I stay in the Monday class?']);
probe('a1-class', 4, 'correct', ['Anything on Wednesday?', 'Do you have any space on Wednesdays?', 'Is there class on Wednesday?']);
probe('a1-class', 4, 'reject', ['Anything on Thursday?', 'I’ll come on Wednesday.']);
probe('a1-class', 5, 'correct', ['What time is the class?', 'When does the Wednesday class begin?']);
probe('a1-class', 5, 'reject', ['What time does it end?', 'What time do you open?']);
probe('a1-class', 6, 'correct', ['That should work. It’s Anna Lee.', 'Seven is good. Name’s Anna Lee.']);
probe('a1-class', 6, 'reject', ['Six works for me. It’s Anna Lee.', 'Seven works for me. I’m Anna Green.', 'I can’t make it at seven. I’m Anna Lee.']);
probe('a1-class', 7, 'correct', ['No, never.', 'No, I’ve never taken a class here.']);
probe('a1-class', 7, 'reject', ['Yes, it’s my first class here.', 'I took a class there last year.']);
probe('a1-class', 8, 'correct', ['Anything I should bring?', 'What materials should I bring with me?']);
probe('a1-class', 8, 'reject', ['What should I draw?']);
probe('a1-class', 9, 'correct', ['All I’ve got at home is a pen.', 'A pen is all I have.']);
probe('a1-class', 9, 'reject', ['All I’ve got at home is a pencil.', 'I have a pen and paper.']);
probe('a1-class', 10, 'correct', ['Which door do I go in?', 'How do I find the studio entrance?']);
probe('a1-class', 10, 'reject', ['What time do you open?', 'How do I get to the bank?']);

assert.equal(failures.length, 0, JSON.stringify(failures, null, 2));
console.log(`${checks} independent A1 block 1 checks passed`);
