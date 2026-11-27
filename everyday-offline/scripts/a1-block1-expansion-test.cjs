const assert=require('node:assert/strict');

const styleCases={
  'a1-laundry':[
    'Sure, I am a first-time patron.',
    'Just nonwhite garments.',
    'A small one will suffice. | I just need a compact washing machine.',
    'I am without coins. Can I remit payment by card?',
    'No, I neglected to bring detergent.',
    'Thanks. Which slot do I deposit the detergent in? | Thank you. Into which compartment should I put the detergent?',
    'I would prefer to utilize cold water. I am in possession of a new red T-shirt.',
    'What is the duration of the wash?',
    'I’ll go to obtain some coffee, then.',
    'I’ll be back upon the expiration of twenty minutes.'
  ],
  'a1-cinema':[
    'I inadvertently left my scarf in the theater.',
    'It was the fifteen hundred hours screening.',
    'In the back row, adjacent to the door.',
    'It’s blue in color with white striping.',
    'It is similar in appearance to mine, but mine is longer.',
    'I request permission to inspect the area under my seat.',
    'One second. I possess a photograph of it.',
    'Yes, it’s mine! Observe the small hole.',
    'Can I exit via this door?',
    'I wish to express my gratitude for helping me find it.'
  ],
  'a1-bike':[
    'Wait! I must come to a halt.',
    'I’m experiencing difficulty pedaling.',
    'The rear tire has deflated.',
    'Are you in possession of a pump?',
    'I’ll proceed on foot, then.',
    'Is the shop operating today?',
    'What is the distance to the bike shop?',
    'Let’s contact them by telephone first.',
    'You can make the telephone call. I’ll assume responsibility for our bikes.',
    'No, let’s proceed on foot together.'
  ],
  'a1-video':[
    'I can audibly hear you, but I am unable to see you.',
    'I am now able to see you. Can you see me?',
    'Would you care to see my room?',
    'My bed is situated beside the window.',
    'It’s a photographic image of you.',
    'Yes, the photograph was captured at the beach.',
    'Is the image now more legible?',
    'I possess an additional photograph from our trip.',
    'I will forward it to you tonight.',
    'Enjoy your meal! Contact me by telephone tomorrow.'
  ],
  'a1-parcel':[
    'I wish to dispatch this to my sister.',
    'A sweater. I fabricated it myself.',
    'No, I have no other packaging materials.',
    'A small box will suffice.',
    'Can you deliver it to her no later than the close of Saturday?',
    'What is the charge for expedited delivery? | Tell me the price of the faster option.',
    'That is somewhat costly, but I consent to that option.',
    'Her address is stored on my mobile device.',
    'How can I determine the current whereabouts of my package?',
    'Can I remit payment with my phone?'
  ],
  'a1-class':[
    'I’m presently enrolled in the Monday class.',
    'My shift concludes at seven every Monday.',
    'Could I request a transfer to another day?',
    'Do you have availability for Wednesday?',
    'At what hour does it start?',
    'That is acceptable to me. My name for registration is Anna Lee.',
    'No, I have not previously attended a class here.',
    'What am I required to bring?',
    'All I have at my residence is a pen.',
    'Where is the point of entry?'
  ]
};

// Additional combinations that are exercised without adding them to whole-answer references.
const familyCases=[
  ['laundry',1,'I’ve never washed clothes at this laundromat before.','I’ve washed clothes at this laundromat before.'],
  ['laundry',3,'No, the whole load will fit in a small washing machine.','The whole load won’t fit in a small washing machine.'],
  ['laundry',4,'I didn’t bring any change. Do you accept debit cards instead?','I brought some change. Do you accept debit cards instead?'],
  ['laundry',4,'I didn’t bring any change. Can I put it on my card instead?','I didn’t bring any change. Can I put it by card instead?'],
  ['laundry',6,'Thanks, what tray should I pour it into?','Thanks, what tray should I buy?'],
  ['laundry',7,'I’ve got a brand new red tee in the load, so I’ll wash them on cold.','I’ve got a brand new red tee in the load, so I’ll wash them on hot.'],
  ['laundry',8,'How many minutes will this cycle run?','How many dollars will this cycle run?'],
  ['laundry',10,'In about twenty minutes I’ll come back here.','I’ll come back here.'],
  ['cinema',1,'I found out I forgot my scarf in the screening room.','I found out I forgot my hat in the screening room.'],
  ['cinema',3,'My seat was right by the door in the last row.','My seat was right by the door in the front row.'],
  ['cinema',4,'A blue one with white stripes on it.','A blue with white stripes on it.'],
  ['cinema',6,'Would you mind if I took a quick look beneath the seat I was in?','Would you mind if I took a quick look beneath your seat?'],
  ['cinema',9,'Would it be all right if I left through this door?','Would it be all right if I opened this door?'],
  ['cinema',10,'Thank you very much for taking the time to help me get my scarf back.','Thank you for taking the time to help me get my hat back.'],
  ['bike',2,'It’s getting a bit harder to ride.','It’s getting a bit easier to ride.'],
  ['bike',3,'The back tire has lost all its air.','The back tire has went flat.'],
  ['bike',4,'Did you happen to bring a bike pump?','Did you brought a bike pump?'],
  ['bike',6,'Any idea if the shop is still open right now?','Any idea if the shop is still open tomorrow?'],
  ['bike',8,'Before we leave, we should give the shop a call.','After we leave, we should give the shop a call.'],
  ['bike',9,'Would you make the call while I hang on to both bikes?','Should I make the call while you hang on to both bikes?'],
  ['video',1,'I can hear your voice loud and clear, but I still can’t see you yet.','I can hear your voice, and I can see you.'],
  ['video',4,'The bed’s right over beside the window.','The bed’s right over beside the door.'],
  ['video',6,'That one was shot on the beach.','That one was shot at the pool.'],
  ['video',8,'I saved a second shot from that vacation.','I saved a second shot from a different vacation.'],
  ['video',9,'I can message you the picture later this evening.','I can message Mom the picture later this evening.'],
  ['parcel',1,'Would you help me ship this parcel to my sister?','Would you help my sister ship this parcel to me?'],
  ['parcel',2,'There’s a sweater in here that I knitted by hand for my sister.','There’s a sweater in here that my sister knitted by hand.'],
  ['parcel',5,'She needs to get it on or before Saturday.','She needs to get it before Sunday afternoon.'],
  ['parcel',6,'What would it cost for this Friday delivery?','What would it cost for the Monday service?'],
  ['parcel',8,'I’ve got her address written down on my phone.','I’ve got her phone number written down.'],
  ['parcel',9,'How can I look up where the parcel is while it’s on its way?','How can I look up when the parcel is due?'],
  ['class',1,'I’m already registered in your Monday drawing group.','I’m already registered in your Wednesday drawing group.'],
  ['class',2,'On Mondays I’m still on the clock till 7 p.m.','On Mondays I’m still on the clock till 7 a.m.'],
  ['class',3,'Would you put me in a group that meets on some other day?','Would you put me in a group that meets on the same day?'],
  ['class',4,'Do you have any spots in a Wednesday group?','Do you have any spots in a Tuesday group?'],
  ['class',5,'Could you tell me what the starting time is on Wednesday?','Could you tell me what is the starting time on Wednesday?'],
  ['class',8,'Should I take some art supplies with me?','Should you bring some art supplies with you?']
];

module.exports=function expansionTest(dialogues,engine){
  const turn=(id,number)=>dialogues.find(dialogue=>dialogue.id==='a1-'+id).turns[number-1];
  const check=(id,number,answer)=>engine.check(answer,turn(id,number));
  let count=0,ruleCount=0;
  for(const dialogue of dialogues){
    for(const [index,samples] of styleCases[dialogue.id].entries()){
      const target=dialogue.turns[index];
      const covered=new Set();
      for(const input of samples.split(' | ')){
        const result=engine.check(input,target);
        assert.equal(result.status,'acceptable',dialogue.id+' · '+input);
        assert.ok(result.annotations.some(part=>part.color==='acceptable'&&part.note),input);
        assert.equal(engine.preferred(target).includes(input),false,input);
        for(const diagnostic of result.diagnostics)covered.add(diagnostic.source);
        const extended=engine.check(input+' Blorven.',target);
        assert.equal(extended.status,'unknown',input);
        assert.equal(extended.annotations.at(-1).color,'neutral',input);
        assert.ok(extended.annotations.some(part=>part.color==='acceptable'),input);
        count+=2;
      }
      ruleCount+=covered.size;
    }
  }
  assert.equal(ruleCount,71);
  for(const [id,number,positive,negative] of familyCases){
    assert.equal(check(id,number,positive).status,'correct',positive);
    assert.ok(['error','unknown'].includes(check(id,number,negative).status),negative);
    count+=2;
  }

  const colors=(result,color)=>Array.from(result.annotations.filter(part=>part.color===color),part=>part.text);
  const mixed=check('cinema',4,'It is got white striping on a blue background.');
  assert.equal(mixed.status,'error');
  assert.deepEqual(colors(mixed,'error'),['is']);
  assert.deepEqual(colors(mixed,'acceptable'),['white','striping']);
  assert.deepEqual(Array.from(mixed.diagnostics,item=>item.status),['error','acceptable']);

  const partial=check('cinema',4,'It is got white striping on a blue background. Blorven.');
  assert.equal(partial.status,'unknown');
  assert.deepEqual(colors(partial,'error'),['is']);
  assert.deepEqual(colors(partial,'acceptable'),['white','striping']);
  assert.deepEqual(colors(partial,'neutral'),['Blorven']);
  assert.equal(partial.diagnostics.length,2);

  const fragments=check('laundry',7,'I would prefer to UTILIZE cold water. I am in possession of a new red T-shirt. Blorven.');
  assert.equal(fragments.status,'unknown');
  assert.deepEqual(colors(fragments,'acceptable'),['UTILIZE','in','possession','of']);
  assert.deepEqual(colors(fragments,'neutral'),['Blorven']);
  assert.ok(fragments.annotations.find(part=>part.text==='cold'&&part.color==='correct'));

  for(const [id,number,input,marked=[]] of [
    ['cinema',4,'It’s red in color with white striping.'],
    ['cinema',6,'I request permission to inspect the area under your seat.'],
    ['laundry',7,'I would prefer to utilize hot water. I am in possession of a new red T-shirt.',['in','possession','of']],
    ['parcel',10,'Can I remit payment with my sister’s phone?'],
    ['class',6,'That is acceptable to me. My name for registration is Anna Green.',['acceptable','to','me']]
  ]){
    const result=check(id,number,input);
    assert.equal(result.status,'unknown',input);
    assert.deepEqual(colors(result,'acceptable'),marked,input);
  }
  console.log(`${count+8} A1 expansion probes passed, including ${ruleCount} style alternatives and mixed colors.`);
};
