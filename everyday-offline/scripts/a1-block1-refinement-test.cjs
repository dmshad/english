const assert=require('node:assert/strict');

const styles={
  laundry:{
    1:['This is my first time using this facility.'],
    3:['I’ll make do with a small machine.'],
    4:['I don’t have any coins. Can I make a card payment?'],
    6:['I would like to know where the detergent goes.'],
    7:['I have a new red T-shirt, so I shall use cold water.'],
    8:['How much time will be required?'],
    9:['I’ll go out in order to get some coffee, then.']
  },
  cinema:{
    1:['I failed to take my scarf with me after the movie. It’s still in there.'],
    3:['In the last row, in the vicinity of the door.'],
    4:['The scarf is blue with stripes of white.','It’s predominantly blue with white stripes.'],
    5:['It has a resemblance to mine, but mine is longer.'],
    6:['Do I have your permission to look under my seat?'],
    7:['Please allow me a moment. I’ve got the scarf in a picture here.'],
    8:['Yes! I know it by that little hole.'],
    9:['Can I take this door out?'],
    10:['I appreciate your assistance in locating my scarf.']
  },
  bike:{
    1:['Please wait while I stop.'],
    3:['There is a loss of air in the rear tire.'],
    4:['Did you bring a pump for inflating the tires?'],
    5:['Then I’ll go by foot.','I’ll continue my journey on foot, then.'],
    7:['How distant is the shop?'],
    8:['Let’s place a call to the shop first.'],
    9:['Could you call them? I’ll supervise the bikes.']
  },
  video:{
    1:['I receive audio but no video.'],
    2:['I have a visual of you now. Can you see me?'],
    3:['Would you like to view my room?'],
    5:['The person in the photo is you.'],
    7:['Has the visibility improved?'],
    8:['I have a further photograph from our trip.'],
    9:['I will transmit the photo to you tonight.'],
    10:['Enjoy your food! Will you call me tomorrow?','Enjoy the food! Let’s talk tomorrow. Give me a call.']
  },
  parcel:{
    1:['I intend to send this to my sister.'],
    2:['A sweater. I produced it myself.'],
    4:['A box of small dimensions is enough.'],
    5:['It must be in her possession by Saturday.'],
    6:['What is the monetary charge for the faster option?'],
    7:['It costs a bit much, but I’ll take the faster one.'],
    8:['I have the address in my phone’s memory.'],
    9:['How do I monitor the location of my package?'],
    10:['Can I execute the payment with my phone?']
  },
  class:{
    1:['I’m listed as a participant in the Monday class.'],
    2:['My workday terminates at seven every Monday.'],
    3:['Can I attend on an alternative day?'],
    4:['What are your offerings on Wednesday?'],
    5:['When is the commencement of class?'],
    6:['That time is suitable for me. I’m Anna Lee.'],
    8:['What do I need to come with?'],
    10:['Could you indicate the entrance?']
  }
};

// Alternative combinations outside the examples shown to the learner and the authored error cases.
const heldOut=[
  ['laundry',1,'I’ve never used the laundromat before.','correct'],
  ['laundry',2,'It’s only my colored stuff today.','correct'],
  ['laundry',3,'No, the smaller washer should do it.','correct'],
  ['laundry',4,'No quarters on me. Could I use a credit card?','correct'],
  ['laundry',4,'I’ve got only my debit card. Can I use it?','correct'],
  ['laundry',4,'I don’t have any coins. Could I use credit card?','error'],
  ['laundry',5,'Oops, I just realized I left my laundry detergent at home.','correct'],
  ['laundry',7,'I’ll set it to cold. I’ve got a brand new red tee with me.','correct'],
  ['laundry',8,'Could you tell me how long the cycle will run?','correct'],
  ['laundry',9,'Then I’ll step out for a cup of coffee while it runs.','correct'],
  ['laundry',10,'I’ll come back for twenty minutes.','error'],
  ['cinema',1,'I’m pretty sure my scarf is still in the screening room.','correct'],
  ['cinema',2,'The show was at four p.m.','error'],
  ['cinema',3,'I was sitting at the back of the theater, right beside the door.','correct'],
  ['cinema',4,'The stripes are white and it’s blue.','correct'],
  ['cinema',5,'This one looks a lot like mine, except my scarf is a bit longer.','correct'],
  ['cinema',6,'May I have a quick look underneath the seat where I sat?','correct'],
  ['cinema',7,'Hang on. I can pull up a picture of my scarf on my phone.','correct'],
  ['cinema',8,'That one’s mine. Do you see that tiny hole right here?','correct'],
  ['cinema',9,'Would it be all right to leave by this door?','correct'],
  ['cinema',10,'Thank you so much for getting it back to me.','correct'],
  ['bike',1,'Hang on a minute. I’ve got to pull over.','correct'],
  ['bike',2,'I’m finding it difficult to ride right now.','correct'],
  ['bike',3,'Looks like my rear tire is totally flat.','correct'],
  ['bike',4,'Do you happen to have a tire pump with you?','correct'],
  ['bike',5,'In that case I’ll walk the bike from here.','correct'],
  ['bike',6,'Any idea whether the bike shop is still open right now?','correct'],
  ['bike',7,'How many minutes does it take to walk to that shop?','correct'],
  ['bike',8,'We should give them a quick call before we head over.','correct'],
  ['bike',9,'Would you call the bike shop? I’ll hold on to both bikes.','correct'],
  ['bike',10,'No, I’d prefer to walk there with you.','correct'],
  ['video',1,'I’m getting your audio, just no picture.','correct'],
  ['video',2,'Now I’ve got you on my screen. Can you see me on your end?','correct'],
  ['video',3,'Would you like a quick peek around my room?','correct'],
  ['video',4,'The bed’s over there, just beside the window.','correct'],
  ['video',5,'It’s you in that picture up there.','correct'],
  ['video',6,'It’s the picture we took on the beach.','correct'],
  ['video',7,'Can you see the photo a little better now?','correct'],
  ['video',8,'I’ve still got a second shot from the same vacation too.','correct'],
  ['video',9,'I can message the picture to your phone later this evening.','correct'],
  ['video',10,'Have a great dinner, Grandma. Will you ring me tomorrow?','correct'],
  ['parcel',1,'I’d like to ship this present out to my sister.','correct'],
  ['parcel',2,'A sweater I knitted for my sister myself.','correct'],
  ['parcel',3,'All I brought was the paper bag.','correct'],
  ['parcel',4,'This little box has enough room for it.','correct'],
  ['parcel',5,'It has to be delivered to her on or before Saturday.','correct'],
  ['parcel',6,'Would you tell me what the quicker shipping costs?','correct'],
  ['parcel',7,'That’s a little steep, though I’ll go with the Friday option.','correct'],
  ['parcel',8,'I’ve got her address in a message on my phone.','correct'],
  ['parcel',9,'How can I keep track of this parcel once it’s been sent?','correct'],
  ['parcel',10,'Would it be all right if I paid with my phone?','correct'],
  ['class',1,'You have me down for your Monday drawing group.','correct'],
  ['class',2,'Every Monday I’m stuck at work till 7 p.m.','correct'],
  ['class',3,'Is there a different day that I could take the class?','correct'],
  ['class',4,'Is there a group on Wednesday that I could join?','correct'],
  ['class',5,'Can you tell me when that group gets started?','correct'],
  ['class',6,'I can make that time. The name’s Anna Lee.','correct'],
  ['class',7,'No, I haven’t had a lesson with you yet.','correct'],
  ['class',8,'What materials should I take with me?','correct'],
  ['class',9,'I have a pen at home, but no paper or pencil.','correct'],
  ['class',10,'Would you tell me where your door is?','correct']
];

const nearMisses=[
  ['laundry',4,'No quarters on me. Could I pay cash instead?'],
  ['laundry',7,'I’ll set it to warm. I’ve got a brand new red tee with me.'],
  ['cinema',3,'I was sitting at the back, right beside the window.'],
  ['cinema',9,'Would it be all right to leave by the door we came in?'],
  ['bike',6,'Any idea whether the shop is open tomorrow?'],
  ['bike',7,'How many minutes were we cycling for?'],
  ['bike',9,'I’ll call the bike shop. Would you hold the bikes?'],
  ['video',5,'It’s the picture you took of me.'],
  ['video',8,'I’ve got a second shot from another vacation.'],
  ['video',9,'I can message Mom the picture later this evening.'],
  ['parcel',3,'All I brought with me was a small box.'],
  ['parcel',5,'It has to be delivered to her on Sunday at the latest.'],
  ['parcel',6,'Would you tell me what the Monday service costs?'],
  ['parcel',9,'How can I keep track of this parcel once it is been sent?'],
  ['class',1,'You have me down for the Tuesday drawing group.'],
  ['class',6,'I can make that time. The name’s Anna Green.'],
  ['class',9,'I have a pencil at home, but no paper or pen.']
];

module.exports=function refinementTest(dialogues,before,engine){
  const turns=(list,id)=>list.find(dialogue=>dialogue.id==='a1-'+id).turns;
  const check=(id,number,input)=>engine.check(input,turns(dialogues,id)[number-1]);
  const prior=(id,number,input)=>engine.check(input,turns(before,id)[number-1]);
  let stylesChecked=0;
  for(const [id,turnSamples] of Object.entries(styles)){
    for(const [number,samples] of Object.entries(turnSamples)){
      for(const input of samples){
        const turn=turns(dialogues,id)[number-1];
        const result=check(id,number,input);
        assert.equal(result.status,'acceptable',input);
        assert.ok(result.annotations.some(part=>part.color==='acceptable'&&part.note),input);
        assert.ok(!engine.preferred(turn).includes(input),input);
        stylesChecked++;
      }
    }
  }
  const styleTotal=items=>items.flatMap(d=>d.turns).reduce((total,t)=>total+t.assessment.styleAlternatives.length,0);
  assert.equal(stylesChecked,styleTotal(dialogues)-styleTotal(before));

  let unknownBefore=0,unknownAfter=0;
  for(const [id,number,input,status] of heldOut){
    unknownBefore+=Number(prior(id,number,input).status==='unknown');
    const result=check(id,number,input);
    unknownAfter+=Number(result.status==='unknown');
    assert.equal(result.status,status,input);
    if(status==='error')assert.ok(result.insertions.length||result.annotations.some(part=>part.color==='error'),input);
  }
  for(const [id,number,input] of nearMisses){
    const result=check(id,number,input);
    assert.ok(['unknown','error'].includes(result.status),input);
  }

  const source='It is got stripes of white on a blue background. Blorven.';
  const mixed=check('cinema',4,source);
  assert.equal(mixed.status,'unknown');
  const fragments=color=>Array.from(mixed.annotations.filter(part=>part.color===color),part=>source.slice(part.start,part.end));
  assert.deepEqual(fragments('error'),['is']);
  assert.deepEqual(fragments('acceptable'),['stripes','of','white']);
  assert.deepEqual(fragments('neutral'),['Blorven']);
  assert.equal(mixed.diagnostics.length,2);

  console.log(`${stylesChecked} new contextual style checks and ${heldOut.length+nearMisses.length+1} separate refinement probes passed. Unknown on the targeted ${heldOut.length} inputs: ${unknownBefore} → ${unknownAfter}.`);
};
