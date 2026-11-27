(function(root){
  const {ask,request}=root.A1BatchForms;
  const error=(pattern,input,fragment,note,correction,code)=>({pattern,input,fragment,note,correction,code});

  function extend(id,turns){
    const dialogue=root.DIALOGUES.find(item=>item.id==='a1-'+id);
    for(const [number,{green='',patterns=[],yellow=[],red=[],remove=[],narrow=[],be=[],allowHasBeen}] of Object.entries(turns)){
      const turn=dialogue.turns[number-1];
      turn.natural=turn.natural.filter(answer=>!remove.includes(answer));
      if(green)turn.natural.push(...green.split(' | '));
      turn.displayExamples=turn.natural.slice(0,10);

      const frame=turn.assessment;
      if(be.length)frame.beContractions=[...(frame.beContractions||[]),...be];
      if(allowHasBeen)frame.allowHasBeen=true;
      for(const [from,to] of narrow)frame.patterns=frame.patterns.map(pattern=>pattern.replace(from,to));
      frame.patterns.push(...patterns);
      frame.styleAlternatives.push(...yellow.map(([from,to,note,focus])=>({from,to,note,focus})));
      for(const {input,...diagnostic} of red){
        (frame.errors??=[]).push(diagnostic);
        (frame.cases.error??=[]).push(input);
        frame.cases.unknown=frame.cases.unknown.filter(answer=>answer!==input);
      }
    }
  }

  extend('laundry',{
    1:{
      green:'Yes, thanks. This is my first time using a laundromat. | I’d love some help. I’ve never done this here before. | Could you show me what to do? I’ve never been here. | Yeah, it’s my first time at this laundromat. | I’m not sure where to start. I haven’t been here before.',
      patterns:['(?:it is|this is) my first (?:visit|time) (?:here|at this laundromat)',
        'i have never (?:used (?:this|the) laundromat|been (?:here|to this laundromat))(?: before)?'],
      yellow:[['this is my first time using this facility','this is my first time here','Facility звучит официально для обычного разговора в прачечной. Проще сказать This is my first time here.','this facility']],
      red:[error('(?:it|this) is the my first time here','This is the my first time here.','the my','Перед first time здесь нужна одна форма определения: my first time.','This is my first time here.')],
    },
    2:{
      green:'It’s all colors. | Only the colored stuff today. | I didn’t bring anything white. Just my colored clothes.',
      patterns:['(?:it is )?(?:all|only|just) (?:my |the )?colored (?:stuff|clothes|laundry|items)(?: today)?'],
      red:[error('the clothes is all colored','The clothes is all colored.','is','Clothes употребляется во множественном числе: the clothes are.','The clothes are all colored.'),
        error('only a colored clothes','Only a colored clothes.','a','Clothes — множественное число. В таком ответе артикль a не нужен.','Only colored clothes.')],
    },
    3:{
      green:'No, a small washer should do it. | It’s a small load. The smaller machine should work. | I’ll be fine with a small machine. | The little washer is plenty big. | I can get it all into the small one.',
      patterns:['(?:no )?(?:a|the) (?:small|smaller|little) (?:machine|washer|one) (?:should do(?: it| fine)?|should work(?: for me)?|is plenty big)'],
      yellow:[['i will make do with','i will be fine with','Make do звучит так, будто маленькая машина — вынужденный компромисс. Здесь её достаточно: I’ll be fine with a small machine.','make do']],
      red:[error('(?:no )?i just need small (?:washer|washing machine)','I just need small washer.','small washer','В полном предложении нужна форма a small washer.','I just need a small washer.','missing-determiner'),
        error('a small (?:one|washer) will works','A small washer will works.','works','После will используется начальная форма work.','A small washer will work.')],
    },
    4:{
      green:'I didn’t bring any quarters. Is paying with a card an option? | I’m short on change. Can I pay with my debit card? | Can I pay by card if I don’t have any coins? | I don’t have cash on me. Do you take cards? | Will my credit card work? I don’t have any coins. | The only thing I have on me is a card. Can I pay with that?',
      patterns:[`(?:no (?:quarters|coins|change)|i (?:am out of|did not bring any|do not have any) (?:quarters|coins|change))(?: on me)? (?:${ask} (?:pay with|use) (?:my|a) (?:debit |credit )?card|will (?:my|a) (?:debit |credit )?card work)`,
        'i (?:have|have got) (?:only|just) (?:my|a) (?:debit |credit )?card (?:can|could) i (?:use it|pay with (?:it|that))'],
      yellow:[['make a card payment','pay by card','Make a card payment понятно, но у машины это звучит как формулировка из инструкции. В разговоре обычнее pay by card.','make a card payment']],
      red:[error('i do not have any coins (?:can|could) i (?:pay with|use) (?:debit |credit )?card','I don’t have any coins. Can I use card?','card','После use и pay with здесь нужен определитель: a card или my card. В сочетании by card артикль не требуется.','I don’t have any coins. Can I use a card?','missing-determiner'),
        error('i do not have a coins can i pay by card','I don’t have a coins. Can I pay by card?','a','Перед coins во множественном числе артикль a не употребляется. Здесь естественно any coins.','I don’t have any coins. Can I pay by card.')],
    },
    5:{
      green:'Oh, I forgot to bring in the detergent. | My detergent’s still at home. I forgot to bring it. | I just realized I left the soap at home. | No, I left the stuff for the wash at home. | I don’t have the soap with me. I left it at home.',
      patterns:['(?:no |oops )?i (?:just realized i )?(?:forgot to (?:bring|pack)|left) (?:my|the) (?:laundry soap|laundry detergent|detergent|soap)(?: at home)?'],
      red:[error('i forget to bring (?:the|my) (?:soap|detergent)','I forget to bring the detergent.','forget','Речь об уже случившемся пропуске. В этой реплике нужен прошедший forgot.','I forgot to bring the detergent.'),
        error('i left (?:the|my) (?:laundry )?(?:soap|detergent) in home','I left the detergent in home.','in','Про то, что оставили дома, обычно говорят at home.','I left the detergent at home.')],
    },
    6:{
      green:'Thanks. Which tray is for the soap? | Thank you. Where in the machine does this go? | I appreciate it. Does the soap go right in the drum? | Thanks! Is there a separate slot for the detergent? | Thank you. Which opening do I pour it into?',
      patterns:['(?:what|which) (?:slot|tray|compartment|opening) (?:does (?:this|it|the (?:soap|detergent)) go|should i (?:put|pour) (?:it|this|the (?:soap|detergent))) (?:in|into)',
        'where (?:in the machine )?(?:does (?:it|this|the detergent) go|do i (?:put|add|pour) (?:this|the detergent|it))'],
      yellow:[['i would like to know where the detergent goes','where does the detergent go','Вопрос грамматически правильный. Перед машиной проще спросить прямо: Where does the detergent go?','i would like to know']],
      red:[error('where i (?:put|pour) (?:it|the detergent)','Where I put the detergent?','i put','В прямом вопросе с I нужен do: Where do I put…?','Where do I put the detergent?'),
        error('where does (?:it|the detergent) goes','Where does the detergent goes?','goes','После does нужна начальная форма go.','Where does the detergent go?')],
    },
    7:{
      green:'I’ll set it to cold. There’s a new red T-shirt in there. | I’d better set it to cold. One of my T-shirts is new and it’s red. | I’m washing a new red tee, so I’m going with cold water. | I’ve got a new red T-shirt in this load. Let’s do a cold wash. | I think cold water is safer for my new red T-shirt.',
      patterns:['(?:i will|i am going to) (?:set it to cold|go with a cold wash|wash it on cold) (?:i (?:have|have got)|there is) a (?:brand )?new red (?:t shirt|tee)(?: (?:in (?:there|here|this load)|with me))?',
        'i (?:have|have got|am washing) a (?:brand )?new red (?:tee|t shirt)(?: in (?:the|this) load)? so i (?:will|am going to) (?:wash (?:it|them) on cold|go with cold water|set it to cold)'],
      yellow:[['i shall use cold water','i will use cold water','I shall звучит официально при выборе режима стирки. В разговоре обычно скажут I’ll use cold water.','shall']],
      red:[error('i will wash (?:them|it) with hot water i have a new red t shirt','I’ll wash them with hot water. I have a new red T-shirt.','hot','В задании выбрана холодная вода. Hot water означает горячую.','I’ll wash them in cold water. I have a new red T-shirt.'),
        error('cold water i have an new red t shirt','Cold water. I have an new red T-shirt.','an','Перед new, которое начинается с согласного звука, нужен a.','Cold water. I have a new red T-shirt.')],
    },
    8:{
      green:'How long will it be before the wash is done? | About how long for this load? | How long does this setting usually take? | Any idea how long this wash will take? | How soon can I get my clothes out?',
      patterns:[`(?:do you know|any idea|${request} tell me) how long (?:it|the wash|the cycle|this setting) (?:will take|takes|will run)`],
      yellow:[['how much time will be required','how long will it take','Will be required грамматически верно, но звучит как вопрос об инструкции. У машины обычнее How long will it take?','will be required']],
      red:[error('how many time (?:does it take|will it take)','How many time will it take?','many','О длительности говорят how much time или how long. Many используется с единицами, например how many minutes.','How long will it take?'),
        error('how long it will take','How long it will take?','it will','В прямом вопросе порядок такой: How long will it take?','How long will it take?')],
    },
    9:{
      green:'Then I’ll go grab a cup of coffee. | I’ll use the time to get coffee. | Okay, I’m going out for a cup of coffee. | I’ll get a coffee while I wait. | I’ll have time to run out for coffee, then.',
      patterns:['(?:then )?i (?:will|am going to) (?:head out|step out|run out|go out) for (?:some coffee|a coffee|a cup of coffee)(?: then| while (?:i wait|it runs))?'],
      yellow:[['go out in order to get','go get','In order to правильно выражает цель, но в обычном разговоре о кофе естественнее короткое go get.','in order to']],
      red:[error('i will to (?:go get|get) (?:some coffee|a coffee)(?: then)?','I’ll to get some coffee then.','to','После will следующая форма глагола не требует to.','I’ll get some coffee then.')],
    },
    10:{
      green:'I’ll come back and check on it in twenty minutes. | I should be back in about twenty. | I’ll step back in here in twenty minutes. | I’ll be back twenty minutes from now.',
      patterns:['i (?:will|should|plan to) (?:be|get|come) back(?: here)? in about (?:twenty|20)(?: minutes)?'],
      red:[error('i will (?:come|be) back after twenty minute','I’ll come back after twenty minute.','minute','После twenty здесь нужна форма minutes.','I’ll come back after twenty minutes.'),
        error('i will come back for twenty minutes','I’ll come back for twenty minutes.','for','For twenty minutes обозначает длительность пребывания. Через двадцать минут — in twenty minutes.','I’ll come back in twenty minutes.')],
    }
  });

  extend('cinema',{
    1:{
      green:'I think my scarf is still in the room where the movie was. | I left my scarf behind after the movie. It’s still in there. | I came out of the theater without my scarf. I left it inside. | I realized on my way out that my scarf was still in the theater. | I forgot to take my scarf with me when I left the theater.',
      patterns:['i (?:think|am pretty sure) (?:that )?(?:i (?:left|forgot) my scarf|my scarf is still) (?:in (?:the theater|the screening room|there)|inside)',
        'my scarf is still (?:inside|in) the (?:screening room|theater|movie theater)'],
      yellow:[['i failed to take my scarf with me','i left my scarf behind','Failed to take звучит как отчёт об упущении. Сотруднику кинотеатра привычнее услышать I left my scarf behind.','failed to take']],
      red:[error('i have leaved my scarf (?:inside|in the theater)','I have leaved my scarf in the theater.','leaved','Третья форма leave — left.','I have left my scarf in the theater.'),
        error('i left my scarf into the (?:movie )?theater','I left my scarf into the theater.','into','О месте, где осталась вещь, говорят in the theater. Into обозначает движение внутрь.','I left my scarf in the theater.')],
    },
    2:{
      green:'I went to the three o’clock showing.',
      patterns:['(?:i (?:went to|saw)|it was) the (?:show|showing|screening|movie) at (?:three|3)(?: (?:pm|p m|this afternoon))?'],
      red:[error("(?:it was |it started |the show was )?(?:at )?four(?: (?:pm|p m|o'clock))?",'At four.','four','В задании сеанс был в три. Four означает четыре.','At three.'),
        error('(?:it started )?in three o.clock','It started in three o’clock.','in','Перед временем на часах используется at: at three o’clock.','It started at three o’clock.')],
    },
    3:{
      green:'I was sitting in the very last row, on the end by the door. | Last row, the seat next to the door. | My seat was all the way at the back, right next to the door. | Near the door, in the very back row. | I sat at the back of the theater, by the door.',
      patterns:['(?:my seat was |i (?:sat|was sitting|was) )?(?:in (?:the|that) (?:very )?(?:last|back) row|(?:right |all the way )?at the back(?: of the theater)?) (?:right )?(?:by|next to|beside|near) the door'],
      yellow:[['in the vicinity of the door','near the door','In the vicinity of звучит как описание места в протоколе. В разговоре обычнее near the door.','in the vicinity of']],
      red:[error('(?:i sat )?at the front (?:right )?(?:by|next to) the door','I sat at the front by the door.','front','В задании место было в последнем ряду, то есть сзади. Front означает переднюю часть.','I sat at the back by the door.'),
        error('in last row by the door','In last row by the door.','last row','О конкретном последнем ряду в этой фразе говорят the last row.','In the last row, by the door.','missing-determiner')],
    },
    4:{
      green:'A blue scarf. It’s got white stripes on it. | It’s blue with a white striped pattern. | The main color is blue and the stripes are white. | It’s the blue scarf with the white stripes. | The stripes are white, and the scarf itself is blue.',
      remove:['The scarf is blue with stripes of white.'],
      patterns:['(?:it is|mine is|the scarf is) blue with (?:the )?white stripes(?: on it)?',
        '(?:the )?stripes are white and (?:it|the scarf) is blue'],
      yellow:[['stripes of white','white stripes','Stripes of white грамматически возможно, но звучит книжно. При поиске вещи привычнее white stripes.'],
        ['predominantly blue with white stripes','blue with white stripes','Predominantly формально звучит для простого описания. Здесь достаточно blue with white stripes.','predominantly']],
      red:[error('(?:it is |the scarf is )?white with blue stripes','It’s white with blue stripes.','white with blue stripes','Цвета поменялись местами. Сам шарф синий, полоски белые.','It’s blue with white stripes.'),
        error('(?:it is|the scarf is) blue with a white stripes','It’s blue with a white stripes.','a','Перед stripes во множественном числе артикль a не ставится.','It’s blue with white stripes.')],
    },
    5:{
      green:'Same colors, but mine is a little longer. | It could almost be mine, but mine’s longer. | It’s pretty close. My scarf is longer, though. | This one looks like my scarf, but it’s shorter. | Yes, they look alike, but mine’s longer than that one. | That’s not quite it. Mine’s a longer version of that.',
      patterns:['(?:it|that|this one|that one) (?:looks (?:a lot )?like mine|looks (?:pretty |very )?similar|is (?:a lot )?like mine) (?:but|except) (?:mine|my scarf) is (?:a little |a bit )?longer(?: than (?:that|this) one)?'],
      yellow:[['has a resemblance to','looks like','Has a resemblance to звучит формально для быстрого сравнения двух вещей. Обычно говорят looks like.']],
      red:[error('it looks like mine but (?:mine|my scarf) is more longer','It looks like mine, but mine is more longer.','more','Longer уже сравнительная форма. More перед longer не нужно.','It looks like mine, but mine is longer.'),
        error('it looks like mine scarf but mine is longer','It looks like mine scarf, but mine is longer.','mine','Перед существительным scarf используется my. Mine употребляется самостоятельно.','It looks like my scarf, but mine is longer.')],
    },
    6:{
      green:'Could I go back and see if it’s under my seat? | Is it okay if I check under the seat I was sitting in? | Could I see for myself if it fell under my seat? | Would you let me look beneath my seat? | Can I have a look under my own seat first? | Could I try looking under the seat where I sat?',
      patterns:[`(?:${ask}|would you let me) (?:take|have) a (?:quick )?look (?:under|underneath|beneath) (?:my (?:own )?seat|the seat (?:i was sitting in|where i sat))(?: first| myself)?`,
        '(?:is it (?:okay|all right|ok)|would it be (?:okay|all right|ok)) if i (?:look(?:ed)?|check(?:ed)?) (?:under|underneath|beneath) (?:my seat|the seat i was sitting in)'],
      yellow:[['do i have your permission to','can i','Разрешение сформулировано грамматически верно, но слишком официально для этого разговора. Обычно достаточно Can I…?','have your permission']],
      red:[error('can i looking under my seat','Can I looking under my seat?','looking','После can нужна начальная форма look.','Can I look under my seat?'),
        error('would you mind if i to look under my seat','Would you mind if I to look under my seat?','to look','После if I здесь нужна личная форма глагола: if I looked.','Would you mind if I looked under my seat?')],
    },
    7:{
      green:'Hang on. I can bring up a photo of the scarf. | Oh, wait, I’ve got a photo where you can see it. | Just a moment, I have a picture with the scarf in it. | One second. Let me show you a photo of me wearing it. | Give me a minute. I know I have a picture of the scarf on my phone.',
      patterns:['(?:wait(?: a (?:second|moment))?|hold on|hang on|(?:just )?a (?:second|moment)|one sec(?:ond)?|give me a (?:second|minute)) i (?:have|have got|can (?:pull up|show you|bring up)) a (?:photo|picture) of (?:it|(?:the|my) scarf)(?: on my phone)?'],
      yellow:[['please allow me a moment','just a moment','Please allow me a moment звучит церемонно, когда просто нужно открыть фото. Just a moment естественнее.','allow me']],
      red:[error('(?:wait |one second )?i have photo of my scarf','Wait, I have photo of my scarf.','photo','Перед исчисляемым photo в единственном числе нужен a.','Wait, I have a photo of my scarf.','missing-determiner'),
        error('wait i have a (?:picture|photo) from my scarf','Wait, I have a picture from my scarf.','from','То, что изображено, вводится через of: a picture of my scarf.','Wait, I have a picture of my scarf.')],
    },
    8:{
      be:['one'],
      green:'Yes, that’s the one with the little hole. It’s mine. | Mine, definitely. You can see the little hole right here. | Look at that small hole. That’s how I can tell it’s mine. | Yes, I can tell by that little hole. | Yes, this is mine. There’s a small hole right here.',
      remove:['Yes! I know it by that little hole.'],
      patterns:['(?:it is|that is|that one is) mine (?:look at|(?:can you |do you )?see) (?:the|that) (?:small|little|tiny) hole(?: (?:there|right here))?'],
      yellow:[['i know it by that little hole','i can tell by that little hole','Смысл понятен, но для узнавания вещи по примете естественнее I can tell by…','know it']],
      red:[error('it is my (?:see|can you see) the little hole','Yes, it’s my. See the little hole?','my','My требует существительного после себя. Самостоятельно используется mine.','Yes, it’s mine. See the little hole?'),
        error('it is mine can you see the little whole','It’s mine. Can you see the little whole?','whole','Hole — отверстие, а whole означает «целый». Для дырочки нужен hole.','It’s mine. Can you see the little hole?')],
    },
    9:{
      green:'Can I leave by this door? | Would it be okay to head out this way? | Does this door lead to the exit? | Will this door get me outside? | Is it okay to use this door to leave?',
      remove:['Can I take this door out?'],
      patterns:[`(?:${ask}|would it be (?:okay|all right) to) (?:leave|head out|go out) (?:by|through) this door`],
      yellow:[['take this door out','use this door to get out','Take this door out может прозвучать как просьба вынести саму дверь. Для выхода яснее use this door to get out.']],
      red:[error('can i go out across this door','Can I go out across this door?','across','Через дверной проём проходят through the door. Across значит «поперёк» поверхности или пространства.','Can I go out through this door?'),
        error('is this a exit','Is this a exit?','a','Перед exit, которое начинается с гласного звука, нужен an.','Is this an exit?')],
    },
    10:{
      green:'I really appreciate your help with the scarf. | Thanks so much for getting my scarf back to me. | Thanks. I couldn’t have found it without your help. | I appreciate you checking for it with me. Thanks! | Thanks for helping me get my scarf back. I really appreciate it.',
      patterns:['(?:thanks|thank you)(?: so much| very much)? for (?:your help (?:finding|getting back) (?:it|my scarf)|getting (?:it|my scarf) back to me)',
        'i (?:really )?appreciate your help with (?:it|the scarf)'],
      yellow:[['i appreciate your assistance in locating my scarf','i appreciate your help with the scarf','Assistance in locating звучит как формальная благодарность в письме. В фойе проще сказать Thanks for helping me find it.','assistance in locating']],
      red:[error('(?:thanks|thank you) for help me find (?:it|my scarf)','Thanks for help me find it.','help','После for нужна форма helping, если дальше идёт me find.','Thanks for helping me find it.'),
        error('thank you for helping me to found (?:it|my scarf)','Thank you for helping me to found it.','found','После to ставится начальная форма find. Found — прошедшая форма.','Thank you for helping me to find it.')],
    }
  });

  extend('bike',{
    1:{
      green:'Give me a second. I need to stop the bike. | Wait for me! I’ve got to pull over. | Hold on a second. I’m going to have to stop. | I can’t keep going. Let’s stop for a second.',
      patterns:['(?:wait(?: up| for me)?|hang on|hold (?:on|up))(?: (?:a sec(?:ond)?|a minute))? i (?:need to|have to|have got to) (?:stop(?: the bike| here)?|pull over)'],
      yellow:[['please wait while i stop','wait i need to stop','Please wait while I stop понятно, но для срочной короткой реплики другу обычнее Wait! I need to stop.','please wait while']],
      red:[error('(?:wait )?i needs to (?:stop|pull over)','Wait! I needs to stop.','needs','С I употребляется need.','Wait! I need to stop.'),
        error('wait i need stop','Wait! I need stop.','need stop','После need перед глаголом в этой фразе нужен to: need to stop.','Wait! I need to stop.')],
    },
    2:{
      green:'I’m struggling to pedal all of a sudden. | The bike’s much harder to pedal than it was. | I’m having trouble getting the bike to move. | It takes a lot more effort to pedal now. | It feels like I have to pedal a lot harder now. | This bike’s suddenly a lot harder to ride.',
      patterns:['i am (?:really )?(?:struggling|finding it (?:hard|difficult)) to (?:pedal|ride)(?: (?:now|right now|all of a sudden))?',
        '(?:the bike|my bike|this bike|it) is (?:suddenly )?(?:much|a lot|a bit) harder to (?:ride|pedal)(?: (?:now|than it was|all of a sudden))?'],
      red:[error('(?:it|my bike) is hard to pedaling','It’s hard to pedaling.','pedaling','После hard to нужна начальная форма pedal.','It’s hard to pedal.'),
        error('i have trouble to pedal','I have trouble to pedal.','to pedal','В конструкции have trouble используется форма с -ing: have trouble pedaling.','I have trouble pedaling.')],
    },
    3:{
      green:'I’ve got a flat tire on the back. | Looks like the tire on the back is flat. | My rear tire is completely flat. | All the air’s gone out of the back tire. | It’s the back wheel. The tire’s flat.',
      patterns:['(?:looks like )?(?:my|the) (?:rear|back) tire is (?:completely |totally )?flat',
        'i (?:have|have got) a flat (?:tire )?(?:on|in) the (?:back|rear)'],
      yellow:[['there is a loss of air in the rear tire','the rear tire has gone flat','Loss of air звучит как описание в акте осмотра. В такой ситуации обычно говорят The rear tire has gone flat.','a loss of air in']],
      red:[error('my (?:rear|back) tire have (?:gone flat|lost all its air)','My rear tire have gone flat.','have','С одним колесом нужна форма has.','My rear tire has gone flat.'),
        error('i have flat (?:rear|back) tire','I have flat rear tire.','flat rear tire','В полном предложении перед flat rear tire нужен артикль a.','I have a flat rear tire.','missing-determiner')],
    },
    4:{
      green:'Do you happen to have a bike pump on you? | Did you bring a pump along? | You wouldn’t happen to have a pump, would you? | Can I borrow your pump if you have one? | Got anything I can pump it up with?',
      patterns:['(?:do you have|do you happen to have|have you got|did you bring) a (?:bike|tire|air) pump(?: (?:along|on you|with you))?'],
      yellow:[['did you bring a pump for inflating the tires','did you bring a pump','У спустившего колеса уточнение for inflating the tires избыточно. Другу достаточно спросить Did you bring a pump?','for inflating the tires']],
      red:[error('do you have bike pump(?: with you)?','Do you have bike pump with you?','bike pump','Перед исчисляемым bike pump в единственном числе нужен a.','Do you have a bike pump with you?','missing-determiner'),
        error('do you has a (?:bike )?pump','Do you has a pump?','has','После do нужна начальная форма have.','Do you have a pump?')],
    },
    5:{
      green:'Okay, I’ll walk it from here. | I’ll walk the rest of the way, then. | In that case, I’m going to walk and push the bike. | I can’t ride it like this. I’ll walk. | I’ll get off and take the bike on foot.',
      patterns:['(?:then |in that case )?i (?:will|am going to|have to) (?:walk (?:it|the bike)(?: from here)?|walk the rest of the way|go the rest of the way on foot)(?: then)?'],
      yellow:[['go by foot','go on foot','В этой реплике нейтральное разговорное сочетание — go on foot.','by foot'],['continue my journey on foot','go on foot','Continue my journey звучит торжественно для короткого решения с велосипедом. Другу достаточно сказать I’ll go on foot.','continue my journey']],
      red:[error('(?:then )?i will go on feet(?: then)?','Then I’ll go on feet.','feet','В устойчивом сочетании «пешком» используется on foot.','Then I’ll go on foot.'),
        error('then i will walking','Then I’ll walking.','walking','После will нужна начальная форма walk.','Then I’ll walk.')],
    },
    6:{
      green:'Will it still be open if we go now? | Can you check if it’s open today? | Is today one of the days they’re open? | Are the doors still open over there?',
      patterns:['(?:do you happen to know|do you know|any idea) whether (?:the (?:bike )?shop is|it is|they are) (?:still )?open (?:today|right now|now)'],
      red:[error('does (?:it|the bike shop) is open today','Does it is open today?','does','В вопросе с is не нужен does: Is it open today?','Is it open today?'),
        error('do you know (?:if|whether) is it open today','Do you know if is it open today?','is it','Внутри вопроса после if порядок обычного утверждения: if it is open today.','Do you know if it’s open today?')],
    },
    7:{
      green:'Are we close to it? | Is it much of a walk from here? | How far are we from the bike shop? | How many minutes away is it on foot? | Is that shop within walking distance from here?',
      patterns:['how far (?:are we from|do we have to walk to) (?:it|the (?:bike )?shop)',
        'how many minutes (?:away is it on foot|does it take to walk (?:there|to (?:the|that) (?:bike )?shop))'],
      yellow:[['how distant is the shop','how far away is the shop','How distant понятно, но в вопросе о пешем пути обычно говорят How far away…?','distant']],
      red:[error('how far it is(?: from here)?','How far it is from here?','it is','В прямом вопросе is ставится перед it: How far is it?','How far is it from here?'),
        error('how much far is it','How much far is it?','much','Вопрос «как далеко» строится с how far без much.','How far is it?')],
    },
    8:{
      green:'Let’s see what they say on the phone before we head over. | We should call the bike shop first and see if they can help. | Why don’t we call from here before we go? | Let’s give the shop a quick call before walking over. | I’d say we call first, just to be sure.',
      patterns:['(?:let us|we (?:should|could)|why do not we) (?:call|phone) (?:them|the (?:bike )?shop)(?: from here)? (?:first|before we (?:go|leave|head over))',
        '(?:let us|we (?:should|could)) give (?:them|the (?:bike )?shop) a (?:quick )?call before (?:walking over|we (?:go|leave|head over))'],
      yellow:[['place a call to the shop','call the shop','Place a call звучит официальнее обычного предложения другу. Здесь хватает call the shop.','place a call']],
      red:[error('let us to call (?:them|the shop) first','Let’s to call them first.','to','После let’s используется call без to.','Let’s call them first.'),
        error('how about call (?:them|the shop) first','How about call the shop first?','call','После How about подойдёт форма calling или конструкция we call.','How about calling the shop first?')],
    },
    9:{
      green:'Would you do the calling? I’ll hold on to the bikes. | Could you talk to the shop? I’ve got the bikes. | You call the shop, and I’ll keep the bikes from falling over. | Do you mind calling? I’ll take care of the bikes. | I can hold them both. Would you call the shop?',
      patterns:[`(?:${request}) (?:call (?:them|the (?:bike )?shop)|make the call) i (?:will|can) (?:hold(?: on to)?|watch|look after) (?:both bikes|the bikes|our bikes)`,
        '(?:do|would) you mind calling(?: (?:them|the shop))? i (?:will|can) (?:hold|watch|take care of) (?:both bikes|the bikes|our bikes)'],
      yellow:[['i will supervise the bikes','i will watch the bikes','Supervise обычно говорят о присмотре за людьми или процессом. Для велосипедов здесь естественнее I’ll watch the bikes.','supervise']],
      red:[error('can you call (?:them|the shop) i will holds the bikes','Can you call them? I’ll holds the bikes.','holds','После will нужна начальная форма hold.','Can you call them? I’ll hold the bikes.'),
        error('could you to call (?:them|the shop) i will hold (?:the|both) bikes','Could you to call the shop? I’ll hold both bikes.','to call','После could нужен call без to.','Could you call the shop? I’ll hold both bikes.')],
    },
    10:{
      green:'No, I’d rather walk there with you. | Let’s just walk side by side. | No need to go ahead. Let’s walk there together. | How about we stay together and walk? | Why don’t we both go on foot?',
      patterns:['(?:no )?i would (?:rather walk|prefer to walk)(?: there)? with you',
        '(?:no )?(?:let us|how about we|why do not we) (?:both )?(?:walk there together|stay together and walk|both go on foot|walk side by side)'],
      red:[error('(?:no )?let us walked(?: there)? together','No, let’s walked together.','walked','После let’s нужна начальная форма walk.','No, let’s walk together.'),
        error('no i will walk (?:there )?on my own','No, I’ll walk there on my own.','on my own','В задании предлагается пойти вместе. On my own означает «один».','No, let’s walk there together.')],
    }
  });

  extend('video',{
    1:{
      green:'I’ve got your audio, but not your video. | Your sound is coming through, but your picture isn’t. | I can hear you just fine. I can’t see your face, though. | I can hear you. Your picture hasn’t come on yet. | The audio’s working, but your video isn’t on my screen.',
      patterns:['(?:i have got|i am getting) (?:your )?(?:sound|audio)(?: but| just)? (?:not (?:your )?video|no (?:picture|video))',
        'i (?:can )?hear you(?: (?:fine|just fine|okay))? (?:but|though) i (?:do not|cannot|still cannot) see (?:you|your face)(?: yet)?'],
      yellow:[['i receive audio but no video','i have got sound just no video','I receive audio звучит как описание связи в техподдержке. Бабушке проще сказать I’ve got sound, just no video.','receive audio']],
      red:[error('i can heard you but i cannot see you','I can heard you, but I can’t see you.','heard','После can нужна начальная форма hear.','I can hear you, but I can’t see you.'),
        error('(?:but )?i do not can see you','I don’t can see you.','do not can','Can образует отрицание самостоятельно: can’t или cannot.','I can’t see you.')],
    },
    2:{
      green:'Your picture just came on. Can you see mine? | I’ve got you on my screen now. Am I on yours? | That fixed it. I can see you. Can you see me too? | You’re back on my screen now. Do you see me? | Okay, I can see you now. Is my picture showing up for you?',
      patterns:['(?:now )?i (?:can see you|have got your picture|have got you on my screen)(?: now)? (?:can|do) you (?:see me|have my picture)(?: (?:now|too|on your end))?'],
      yellow:[['i have a visual of you','i can see you','A visual of you звучит как язык оператора связи. В семейном звонке естественнее I can see you.','a visual of you']],
      red:[error('i can see you now can you sees me(?: too)?','I can see you now. Can you sees me too?','sees','После can используется see без -s.','I can see you now. Can you see me too?'),
        error('i see you now are you see me','I see you now. Are you see me?','are you see','Чтобы спросить, видно ли тебя, скажи Can you see me?','I see you now. Can you see me?')],
    },
    3:{
      green:'Do you feel like seeing my room? | Should I give you a little tour of my room? | Want a peek at my room? | I can show you my room if you’d like. | How about a quick look around my room? | Can I show you what my room looks like?',
      patterns:['(?:do you want|would you like|want) (?:a (?:quick )?(?:look|peek) (?:at|around) my room|me to (?:show you my room|give you a tour of my room))'],
      yellow:[['would you like to view my room','would you like to see my room','View my room звучит как показ помещения при осмотре. Бабушке естественнее предложить see my room.','view']],
      red:[error('do you want see my room','Do you want see my room?','want see','После want перед другим глаголом нужен to: want to see.','Do you want to see my room?'),
        error('(?:can i|should i) show to you my room','Can I show to you my room?','show to you','В таком порядке после show ставится you без to. Возможен и порядок show my room to you.','Can I show you my room?')],
    },
    4:{
      green:'That’s my bed over there, right by the window. | Right beside the window, that’s my bed. | It’s right up next to the window. | See the window? My bed’s right by it. | The bed you see by the window is mine.',
      patterns:['(?:the|my) bed is (?:over there )?(?:just |right )?(?:by|beside|next to) the window',
        'i sleep (?:right |over there )?(?:by|next to|beside) the window'],
      red:[error('my bed are by the window','My bed are by the window.','are','С bed в единственном числе используется is.','My bed is by the window.'),
        error('my bed is beside of the window','My bed is beside of the window.','of','Предлог beside в этом значении употребляется без of.','My bed is beside the window.')],
    },
    5:{
      green:'That’s you, in the photo up there. | That’s a photo with you in it. | I put up a picture of you. | You’re in that photo on the wall. | That’s you on the wall, in the picture.',
      remove:['The person in the photo is you.'],
      patterns:['(?:it is|that is) (?:you in (?:the|that) (?:photo|picture)(?: on the wall| up there)?|a (?:photo|picture) with you in it)'],
      yellow:[['the person in the photo is you','that is you in the picture','Грамматически верно. В живом звонке, показывая фото, носитель скорее скажет That’s you in the picture.','the person in the photo']],
      red:[error('(?:it|that) is a (?:picture|photo) of your','It’s a photo of your.','your','Your требует существительного. Здесь на фото сама бабушка: a photo of you.','It’s a photo of you.'),
        error('that are you in the (?:photo|picture)','That are you in the picture.','are','С указательным that здесь нужна форма is.','That’s you in the picture.')],
    },
    6:{
      green:'Yep, that’s the one we took at the beach. | Right, we were on the beach when we took it. | Yes, it’s from our day on the beach. | Yeah, we took it while we were at the beach.',
      patterns:['(?:it|that one) is (?:the one|the (?:photo|picture)) (?:that )?we took (?:on|at) the beach',
        'we (?:took (?:it|that|that one)|were) (?:right )?(?:on|at) the beach(?: when we took it)?'],
      red:[error('we take it at the beach last summer','We take it at the beach last summer.','take','С last summer о сделанном снимке употребляется прошедшее took.','We took it at the beach last summer.'),
        error('it was took at the beach','It was took at the beach.','took','В пассивной форме используется was taken.','It was taken at the beach.')],
    },
    7:{
      green:'Can you see the picture more clearly now? | Is it easier to see like this? | Is that a little better? | Is that close enough to see it? | Can you see it if I hold it like this? | Did that help?',
      patterns:['is (?:it|that|this) (?:any |a little )?(?:better|clearer)(?: (?:now|like this))?',
        'can you see (?:it|the (?:picture|photo)) (?:more clearly|a little better)(?: now)?'],
      yellow:[['has the visibility improved','is that better','Has the visibility improved звучит как проверка оборудования. В звонке естественно спросить Is that better?','the visibility improved']],
      red:[error('(?:is that|is this|is it) more better(?: now)?','Is that more better?','more','Better уже сравнительная форма, more не требуется.','Is that better?'),
        error('can you see better it(?: now)?','Can you see better it now?','better it','В этой фразе порядок такой: see it better.','Can you see it better now?')],
    },
    8:{
      green:'I’ve still got one more picture from the same trip. | I took another picture on that trip. I’ve got it here. | There’s another one from that trip that I can show you. | I kept a second photo from that trip too. | I have another photo we took on that vacation.',
      patterns:['(?:i have got|i still have|i have still got|i kept) (?:another|a second|one more) (?:shot|picture|photo) (?:from|we took on) (?:our|that|the same) (?:trip|vacation)(?: too)?'],
      yellow:[['i have a further photograph','i have another photo','A further photograph уместно в формальном перечислении. В семейном звонке естественнее another photo.','a further photograph']],
      red:[error('i have (?:one more|a second) photos from that trip','I have one more photos from that trip.','photos','One more означает ещё один снимок, поэтому нужна форма photo.','I have one more photo from that trip.'),
        error('i have one more photo of that trip ago','I have one more photo of that trip ago.','ago','Ago употребляется после периода времени, например two years ago. Здесь речь о снимке с той поездки: from that trip.','I have one more photo from that trip.')],
    },
    9:{
      green:'I’ll send you a copy when I get a chance this evening. | I’ll get the picture to you tonight. | I can text you the photo this evening. | I’ll send it to your phone later tonight. | I’ll send it when we’re off the call, later this evening.',
      patterns:['i (?:will|can) (?:send|text|message) (?:it|the (?:photo|picture)) (?:over|your way|to your phone) (?:later )?(?:tonight|this evening)',
        'i (?:will|can) get (?:it|the (?:photo|picture)) to you (?:later )?(?:tonight|this evening)'],
      yellow:[['i will transmit the photo to you','i will send the photo to you','Transmit описывает техническую передачу данных. В этой реплике естественнее send the photo.','transmit']],
      red:[error('i will sent (?:it|the photo)(?: to you)? (?:tonight|this evening)','I’ll sent it to you tonight.','sent','После will нужен send. Sent — прошедшая форма.','I’ll send it to you tonight.'),
        error('i will send it to you in tonight','I’ll send it to you in tonight.','in','Перед tonight предлог не нужен.','I’ll send it to you tonight.')],
    },
    10:{
      green:'Enjoy your dinner! Let’s talk tomorrow. Give me a call. | Have a great dinner. Can you give me a call tomorrow? | Hope you enjoy dinner! Call me tomorrow, okay? | Enjoy your meal. Could you ring me tomorrow? | Enjoy dinner, Grandma. Call me tomorrow!',
      remove:['Enjoy your food! Will you call me tomorrow?','Enjoy the food! Let’s talk tomorrow. Give me a call.'],
      narrow:[['(?:dinner|meal|food)','(?:dinner|meal)']],
      patterns:['(?:enjoy (?:your )?(?:dinner|meal)|have a (?:good|great|nice) dinner)(?: grandma)? (?:can you|would you|could you|will you) (?:ring me|give me a call|call me) tomorrow'],
      yellow:[['enjoy your food','enjoy your meal','Enjoy your food грамматически верно, но когда бабушка идёт ужинать, естественнее Enjoy your dinner или Enjoy your meal.','your food'],
        ['enjoy the food','enjoy your dinner','О предстоящем ужине обычно говорят Enjoy your dinner. Enjoy the food звучит как пожелание насладиться самой едой.','the food']],
      red:[error('enjoy (?:your )?dinner call me in tomorrow','Enjoy dinner! Call me in tomorrow.','in','Перед tomorrow предлог не нужен.','Enjoy dinner! Call me tomorrow.'),
        error('enjoy your dinner i will call you tomorrow','Enjoy your dinner! I’ll call you tomorrow.','i will call you','По заданию бабушка позвонит ученику. I’ll call you меняет местами того, кто звонит.','Enjoy your dinner! Call me tomorrow.')],
    }
  });

  extend('parcel',{
    1:{
      green:'I have a package for my sister. I’d like to mail it to her. | I need to get this package in the mail to my sister. | I brought this in to mail to my sister. | Can you help me send this gift to my sister? | I’d like to ship this to my sister, please.',
      patterns:[`(?:${ask}|${request}|i (?:want|would like|need) to) (?:send|mail|ship) (?:it|this|this (?:parcel|gift|package|present)) (?:out )?to my sister`,
        'i (?:brought|have brought|have got) this (?:in )?to (?:send|mail|ship) to my sister'],
      yellow:[['i intend to send','i want to send','Intend to грамматически верно, но для обычной просьбы в отделении звучит официально. Естественнее I’d like to send или I want to send.','intend to']],
      red:[error('i would like send this to my sister','I’d like send this to my sister.','like send','После would like перед глаголом нужна форма to send.','I’d like to send this to my sister.'),
        error('i want to sends this to my sister','I want to sends this to my sister.','sends','После to нужна начальная форма send.','I want to send this to my sister.')],
    },
    2:{
      green:'I made the sweater that’s in the bag. | A sweater. I knit it myself. | It’s a sweater I made for her myself. | A sweater I made with my own hands. | What’s in there is a sweater I knitted.',
      patterns:['(?:it is |there is )?a sweater i (?:made|knitted|knit) (?:for her myself|for my sister myself|with my own hands)',
        'i (?:made|knitted|knit) the sweater(?: myself)? (?:that is|that i put) in the bag'],
      yellow:[['i produced it myself','i made it myself','Produced понятно, но звучит как описание выпуска изделия. Про личный подарок обычнее I made it myself.','produced']],
      red:[error('it is a sweater i maked it myself','It’s a sweater. I maked it myself.','maked','Прошедшая форма make — made.','It’s a sweater. I made it myself.'),
        error('(?:it is )?a sweater i made him myself','A sweater. I made him myself.','him','Свитер — предмет. О нём здесь говорят it.','A sweater. I made it myself.')],
    },
    3:{
      green:'No, that’s the only thing I brought to put it in. | I didn’t bring a box or anything. Just the bag. | Nothing else with me. Only this bag. | All I brought with me was this paper bag.',
      patterns:['(?:no )?(?:all i (?:have|brought)(?: with me)? (?:is|was)|i (?:have got|brought) only) (?:this|the) (?:paper )?bag'],
      red:[error('no i have only these bag','No, I have only these bag.','these','С bag в единственном числе употребляется this.','No, I only have this bag.'),
        error('no i did not brought (?:a box|anything else)','No, I didn’t brought anything else.','brought','После didn’t используется начальная форма bring.','No, I didn’t bring anything else.')],
    },
    4:{
      green:'A small one should fit it just fine. | The little box is big enough for the sweater. | The small box has enough room. | I can get it into one of the small boxes. | The small one looks like the right size.',
      patterns:['(?:the|a|this) (?:small|little) (?:one|box) (?:has enough room(?: for it)?|is (?:big|large) enough(?: for (?:it|the sweater))?)'],
      yellow:[['a box of small dimensions','a small box','A box of small dimensions звучит как описание размера в документах. Здесь обычно говорят a small box.','of small dimensions']],
      red:[error('(?:the|a) small box is enough big(?: for it)?','The small box is enough big.','enough big','После прилагательного enough ставится в конце: big enough.','The small box is big enough.'),
        error('it will fits in the small box','It will fits in the small box.','fits','После will нужна форма fit.','It will fit in the small box.')],
    },
    5:{
      green:'She has to get it by Saturday at the latest. | It needs to be in her hands by Saturday. | Can we make sure she has it by Saturday? | I need it delivered to her on or before Saturday. | It can’t get there later than Saturday.',
      patterns:['(?:i need it delivered|it (?:must|has to|needs to) be (?:delivered|in her hands))(?: to her)? (?:by|on or before|no later than) saturday',
        '(?:it (?:cannot|must not) (?:get there|arrive)|she cannot get it) (?:any )?later than saturday'],
      yellow:[['must be in her possession','needs to be with her','In her possession формально звучит для подарка. В разговоре достаточно She needs to have it или It needs to be with her.','in her possession']],
      red:[error('it need to get there by saturday','It need to get there by Saturday.','need','С it в настоящем времени нужна форма needs.','It needs to get there by Saturday.'),
        error('it has to be there by on saturday','It has to be there by on Saturday.','by on','Для крайнего срока нужен один предлог by: by Saturday.','It has to be there by Saturday.')],
    },
    6:{
      green:'What’s the Friday rate? | How much would the faster shipping cost me? | If we send it the faster way, what’s the price? | Can you tell me what the Friday option costs? | What’s the total if I want it there by Friday? | What’s the price to get it there by Friday?',
      patterns:[`${request} tell me what the (?:friday|faster|quicker) (?:option|service|delivery|shipping) costs`,
        'how much (?:would|will) the (?:friday|fast(?:er)?|quicker) (?:option|shipping|service|delivery) cost(?: me)?'],
      yellow:[['what is the monetary charge','what is the price','Monetary charge звучит как официальный термин. Для обычной цены достаточно price или How much…?','monetary charge']],
      red:[error('how much (?:the faster delivery|the faster one) cost','How much the faster delivery cost?','the faster delivery cost','В прямом вопросе о цене нужен does: How much does the faster delivery cost?','How much does the faster delivery cost?'),
        error('what is the (?:price|cost) of the monday option','What’s the price of the Monday option?','monday','Доставка в понедельник идёт дольше. В задании спрашивают о быстрой доставке к пятнице.','What’s the price of the Friday option?')],
    },
    7:{
      green:'Hmm, that’s a bit more than I’d hoped, but I’ll take it. | That’s a little pricey, but yes, I’ll go with Friday. | It’s a bit more than I expected. Go ahead and send it. | That’s not cheap, but I’ll pay for the faster delivery. | I wish it were cheaper, but let’s do Friday.',
      remove:['It costs a bit much, but I’ll take the faster one.'],
      narrow:[['it costs (?:a bit|a little) much but ', 'it is (?:a bit|a little) much but ']],
      patterns:['(?:that is|it is) (?:a (?:little|bit) )?(?:pricey|pricey for me|expensive|steep|more than i (?:hoped|expected)) (?:but|though) (?:i will (?:take it|go with (?:it|friday|the friday option)|pay for the faster delivery)|let us (?:do it|do friday|send it that way))'],
      yellow:[['it costs a bit much','it is a bit much','Смысл ясен, но о только что названной цене естественнее It’s a bit much.','costs a bit much']],
      red:[error('it is a little expensive but i will to take it','It’s a little expensive, but I’ll to take it.','to','После will нужна форма take без to.','It’s a little expensive, but I’ll take it.'),
        error('it is a bit expensive but i will go with monday','It’s a bit expensive, but I’ll go with Monday.','monday','По заданию человек соглашается на быструю доставку. В разговоре она должна прибыть в пятницу.','It’s a bit expensive, but I’ll go with Friday.')],
    },
    8:{
      green:'It’s right here on my phone. | I can get it for you from my phone. I saved it there. | I have her address in a text on my phone. | It’s in her contact info on my phone. | I’ll pull it up. I’ve got the address on my phone.',
      patterns:['(?:it|(?:her|the) address) is (?:right )?here on my phone',
        'i (?:have|have got) (?:it|(?:the|her) address) in (?:a (?:text|message)|the contacts) on my phone'],
      yellow:[['in my phone’s memory','on my phone','In my phone’s memory звучит как описание места хранения данных. У почтового окна проще сказать on my phone.']],
      red:[error('(?:it|her address) are saved on my phone','Her address are saved on my phone.','are','Address в единственном числе: her address is saved.','Her address is saved on my phone.'),
        error('i has the address on my phone','I has the address on my phone.','has','С I используется have.','I have the address on my phone.')],
    },
    9:{
      allowHasBeen:true,
      green:'How do I go about tracking it? | Where can I go to track this package? | How will I be able to check where it is? | Do I get a tracking number? How do I use it? | How do I keep track of it after it’s been sent? | What’s the best way to check on my package?',
      patterns:['(?:how do i go about tracking|where can i go to track|what (?:can|do) i use to track) (?:it|(?:this|my|the) (?:parcel|package))',
        'how (?:do|can) i keep track of (?:it|(?:this|my|the) (?:parcel|package))(?:(?: after| once) (?:it is sent|it has been sent|i send it))?'],
      yellow:[['monitor the location of my package','track my package','Monitor the location понятно, но для посылки обычно употребляют track.','monitor the location']],
      red:[error('how can i to track (?:it|my package)','How can I to track it?','to','После can используется track без to.','How can I track it?'),
        error('how i can (?:track my package|track it)','How I can track my package?','i can','В прямом вопросе can ставится перед I.','How can I track my package?'),
        error('how (?:can|do) i keep track of (?:it|(?:my|the|this) (?:parcel|package)) (?:once|after) it is been sent','How can I keep track of this parcel once it is been sent?','is','Перед been в этой форме нужна форма has. Сокращённое it’s been означает it has been.','How can I keep track of this parcel once it has been sent?')],
    },
    10:{
      green:'Does this reader work with my phone? | Does the machine take mobile payments? | Am I able to pay by tapping my phone? | Can I use the card on my phone? | Would it work if I paid with my phone? | Can you take contactless payment from my phone?',
      patterns:[`(?:${ask}|am i able to) pay by (?:tapping|using) my phone`,
        'would it (?:work|be (?:okay|all right)) if i (?:paid with|used) my phone(?: to pay)?'],
      yellow:[['execute the payment with my phone','pay with my phone','Execute the payment звучит как команда из банковского интерфейса. Вопрос у терминала обычно формулируют pay with my phone.','execute the payment']],
      red:[error('can i pay with phone','Can I pay with phone?','phone','Перед phone здесь нужен определитель, например my phone.','Can I pay with my phone?','missing-determiner'),
        error('can i paid with my phone','Can I paid with my phone?','paid','После can нужна начальная форма pay.','Can I pay with my phone?')],
    }
  });

  extend('class',{
    1:{
      green:'I have a spot in your Monday art class. | I’m one of the people who signed up for Mondays. | I’m scheduled to take the class on Mondays. | You have me down for the Monday class. | I already have a place in the group that meets on Mondays.',
      patterns:['(?:you have me down|my name is on the list|i am on the list) for (?:your|the) monday (?:(?:art|drawing) )?(?:class|group)',
        'i (?:have|have got) (?:a place|a spot) in (?:your|the) monday (?:(?:art|drawing) )?(?:class|group)'],
      yellow:[['i am listed as a participant in','i am in','Listed as a participant звучит как фраза из реестра. В начале звонка естественнее I’m in the Monday class.','listed as a participant']],
      red:[error('i am signed up for the class in mondays','I’m signed up for the class in Mondays.','in','С днями недели говорят on Mondays.','I’m signed up for the class on Mondays.'),
        error('i am in the class of the monday','I’m in the class of the Monday.','of the monday','Группа по понедельникам — the Monday class или the class on Mondays.','I’m in the Monday class.')],
    },
    2:{
      green:'I’m at my job until seven every Monday. | I can’t leave work before seven on Mondays. | I’m stuck at work until seven on Mondays. | I work till seven Monday evenings. | I’ll still be at work at six. I don’t get off till seven on Mondays.',
      patterns:['(?:on mondays |every monday )?i (?:cannot leave work before|am stuck at work (?:until|till)|am at my job (?:until|till)) (?:seven|7)(?: (?:pm|p m))?(?: on mondays| every monday)?'],
      yellow:[['my workday terminates','my shift ends','Terminates звучит канцелярски для времени окончания смены. Привычнее My shift ends.','terminates']],
      red:[error('i work by seven on mondays','I work by seven on Mondays.','by','By seven обозначает срок «к семи». Здесь работа продолжается до семи, поэтому нужно until seven.','I work until seven on Mondays.'),
        error('i am work until seven(?: on mondays)?','I’m work until seven on Mondays.','am work','Здесь можно сказать I work или I’m working, если дальше идёт until seven.','I work until seven on Mondays.')],
    },
    3:{
      green:'Is there a different day I can come? | Would it be possible to move my class to another day? | Can I change to a group that meets on a different day? | Can I take the course on a day that isn’t Monday? | Could we find another day for my class? | Could you find me a spot on another day? | Could I come in another day?',
      patterns:['(?:is there|do you have) (?:another|a different) day (?:that )?i (?:can|could) (?:come|take the class)',
        'would it be possible to (?:switch|move my class|change my class) to (?:another|a different) day',
        `${ask} come in (?:another|a different) day(?: instead)?`],
      yellow:[['attend on an alternative day','come on a different day','Attend on an alternative day грамматически верно, но для обычного звонка звучит как заявление. Естественнее come on a different day.','an alternative day']],
      red:[error('can i coming on (?:a different|another) day','Can I coming on a different day?','coming','После can используется начальная форма come.','Can I come on a different day?'),
        error('could i come at another day','Could I come at another day?','at','Для дня занятия здесь нужен on: on another day.','Could I come on another day?')],
    },
    4:{
      green:'What’s available on Wednesdays? | Do you have anything with room on Wednesday? | Is there a Wednesday group I could join? | Are there classes on Wednesday too? | Would Wednesday work? Do you have a class that day?',
      patterns:['(?:what is|is anything) (?:open|available) on wednesdays?',
        'is there (?:a wednesday (?:class|group)|a (?:class|group) on wednesday) (?:that )?i (?:could|can) join'],
      yellow:[['what are your offerings on wednesday','what is available on wednesday','Offerings звучит как язык каталога, когда нужен простой вопрос о свободной группе. Естественнее What’s available on Wednesday?','your offerings']],
      red:[error('(?:is there a class|are there any classes|do you have a class) in wednesday','Do you have a class in Wednesday?','in','У дня недели используется предлог on: on Wednesday.','Do you have a class on Wednesday?'),
        error('is there (?:any|some) classes on wednesday','Is there any classes on Wednesday?','is there','С classes во множественном числе нужен вопрос Are there any classes…?','Are there any classes on Wednesday?')],
    },
    5:{
      green:'When does that group start? | Do you know when it gets started? | What’s the start time for that group? | And what time would we start? | Could you tell me what time that class starts?',
      patterns:[`(?:do you know|can you tell me|could you tell me) (?:what time|when) (?:it|the (?:class|group)|that (?:class|group)) (?:starts|begins|gets started)`,
        'what time (?:do|would) (?:we|they) (?:start|begin)(?: on wednesday)?'],
      yellow:[['when is the commencement of class','when does the class start','Commencement звучит официально и может ассоциироваться с выпускной церемонией. Про время обычного занятия говорят start.','the commencement of class']],
      red:[error('what time do it start','What time do it start?','do','В вопросе с it здесь нужна форма does.','What time does it start?'),
        error('when does it starting','When does it starting?','starting','После does используется начальная форма start.','When does it start?')],
    },
    6:{
      green:'That’s a good time for me. My name’s Anna Lee. | I’m free then. Anna Lee. | I can make that. It’s Anna Lee. | Yes, that time is good. Anna Lee here. | That suits me. I’m Anna Lee.',
      patterns:['(?:i am free then|i can make that|that (?:suits me|is a good time(?: for me)?|time is good))(?: (?:i am|my name is|it is))? anna lee(?: here)?',
        '(?:that time works|i can make seven|that will work|i can make that time) (?:the name is|my name is|it is|i am) anna lee'],
      yellow:[['that time is suitable for me','that works for me','Suitable for me понятно, но звучит формально при простой записи на занятие. Обычно говорят That works for me.','suitable for me']],
      red:[error('that work for me my name is anna lee','That work for me. My name is Anna Lee.','work','С that в настоящем времени нужно works.','That works for me. My name is Anna Lee.'),
        error('that works for me my name are anna lee','That works for me. My name are Anna Lee.','are','Name стоит в единственном числе, поэтому My name is…','That works for me. My name is Anna Lee.')],
    },
    7:{
      green:'This is my first time with your studio. | No, I’m a first-time student here. | No, I haven’t done a class here before. | I haven’t taken a class with you yet. This will be my first one. | No, I’m new to the studio.',
      patterns:['(?:no )?i have not (?:done|taken|had|been to) (?:a|one) (?:class|lesson) (?:here|with you)(?: (?:before|yet))?'],
      red:[error('no i have not took a class here before','No, I haven’t took a class here before.','took','После have здесь нужна третья форма taken.','No, I haven’t taken a class here before.'),
        error('no it is my one class here','No, it’s my one class here.','one','Первое по счёту занятие — my first class. One class обозначает количество.','No, it’s my first class here.')],
    },
    8:{
      green:'What will I need for the first class? | Is there anything I’m supposed to bring with me? | What kinds of supplies do I need to bring? | What should I have with me for class? | Do I need to bring my own things for drawing?',
      remove:['What do I need to come with?'],
      patterns:['what (?:do|will) i (?:need|have) (?:to bring|to take|to have) (?:for (?:the first |the )?class|when i come)',
        'what (?:kinds of (?:supplies|materials)|supplies|materials) (?:should i|do i need to|do i have to) (?:bring|take)(?: with me)?'],
      yellow:[['what do i need to come with','what do i need to bring','Come with здесь грамматически возможно, но вопрос о материалах яснее и естественнее с bring.','come with']],
      red:[error('what i should bring(?: for class)?','What I should bring?','i should','В прямом вопросе should идёт перед I: What should I bring?','What should I bring?'),
        error('what should i to bring(?: with me)?','What should I to bring?','to','После should перед bring не ставится to.','What should I bring?')],
    },
    9:{
      green:'I’ve got a pen, but no pencil or paper. | A pen is the only thing I have at home. | I don’t have either of those. There’s just a pen at home. | There’s no pencil or paper at home, just a pen. | I only have a pen I can bring.',
      patterns:['(?:i have got|i have) a pen(?: at home)? but no (?:pencil or paper|paper or pencil)',
        'a pen is (?:all|the only thing) i (?:have|have got)(?: at home)?'],
      red:[error('i have only one pens(?: at home)?','I have only one pens at home.','pens','После one употребляется единственное число pen.','I have only one pen at home.'),
        error('only a pen in home','Only a pen in home.','in','О том, что есть дома, говорят at home.','Only a pen at home.')],
    },
    10:{
      green:'Which door is the way in? | Is there a door on the street I should use? Where is it? | How do I get into the building? | Where do I find the door for the class? | Which door do I use when I get there?',
      patterns:['where (?:can|do) i find (?:the|your) (?:door|entrance)(?: (?:to the studio|for (?:the )?class))?',
        `${request} tell me where (?:the|your) (?:entrance|door) is`,
        `${request} tell me which door (?:i should use|i go through)(?: (?:for class|when i get there))?`],
      yellow:[['could you indicate the entrance','could you tell me where the entrance is','Indicate the entrance уместно в официальном запросе или на схеме. По телефону естественнее Could you tell me where the entrance is?','indicate the entrance']],
      red:[error('where is entrance to the studio','Where is entrance to the studio?','entrance','Вопрос о конкретном входе требует the: the entrance to the studio.','Where is the entrance to the studio?','missing-determiner'),
        error('which door i should use','Which door I should use?','i should','В прямом вопросе should ставится перед I.','Which door should I use?')],
    }
  });
})(typeof window!=='undefined'?window:globalThis);
