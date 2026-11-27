(function(root){
  // Extra references feed recognition and partial feedback. The display order starts with the original editors' choices.
  function expand(id,examples,styleByTurn){
    const dialogue=root.DIALOGUES.find(item=>item.id===id);
    for(const [index,text] of examples.entries()){
      const turn=dialogue.turns[index];
      turn.natural.push(...text.split(' | '));
      turn.displayExamples=turn.natural.slice(0,10);
      turn.assessment.styleAlternatives=(styleByTurn[index+1]||[]).map(([from,to,note,focus])=>({from,to,note,focus}));
    }
  }

  expand('a1-laundry',[
    'Sure! I haven’t used this place before. | Yes, please. I’ve never been to this laundromat. | I could use a hand. It’s my first time here. | Yes, this is my first load here. | I’m new to this place. A hand would be great. | Yeah, I’ve never done laundry here before.',
    'Nothing white, just the colored stuff. | I just brought my colors today. | Only my colored laundry. | Everything in the bag is colored. | A bag of colors, no whites. | It’s just my colored laundry.',
    'No, it should fit in a small washer. | No, the smallest one will work for me. | I don’t need a big one. A small one will do. | It’s not a big load. I can use a small washer. | The little machine should be fine. | No, I can fit it all in a small one.',
    'Do you take credit cards? I don’t have change. | I didn’t bring any coins. Can I use a card instead? | I’m out of quarters. Is there a way to pay by card? | Can I put it on my card? I’ve got no change. | I have a card, but no coins. Can I pay with that? | All I have is my card. Can I use it?',
    'No, I forgot to bring detergent. | I left the laundry detergent at home. | No, I didn’t bring any. I forgot the soap. | I forgot to pack the detergent. | Oops, I left the detergent at home. | No, I forgot to bring the laundry soap.',
    'Thanks. Which slot do I put the detergent in? | Thank you. Does it go in the tray or in with the clothes? | Thanks. Where should the detergent go? | Thanks! Where do I add the soap? | Thanks. Can you show me where it goes? | Thank you. Which compartment should I put the detergent in?',
    'I’ll go with cold water. I’ve got a new red T-shirt in the bag. | There’s a new red shirt in the load, so I’ll wash it on cold. | Cold wash, please. One of the shirts is new and red. | Cold is best. I’ve got a brand-new red tee. | I want to wash these in cold water. I’ve got a new red shirt in there. | I have a new red shirt in here. I’d better use cold water.',
    'How much time does this cycle take? | How long is this cycle going to run? | When should the clothes be done? | What’s the wash time on this setting? | How long should I give it? | How many minutes until the load is done?',
    'Okay, I’ll pop out for coffee. | I think I’ll get myself a cup of coffee, then. | In that case, I’ll head out for a coffee. | Sounds like I have time to get coffee. I’ll do that. | Then I’m off to get some coffee. | I’ll step out and get some coffee while it runs.',
    'I’ll be here again in twenty minutes. | I’m coming back in about 20 minutes. | Give me twenty minutes. I’ll be right back. | I’ll get back here in twenty. | I’ll see you here in twenty minutes. | I’m planning to be back twenty minutes from now.'
  ],{
    1:[['i am a first time patron','i am new here','First-time patron звучит как описание посетителя в анкете. В ответ на предложение помочь естественнее I’m new here.']],
    2:[['nonwhite garments','colored clothes','Nonwhite garments звучит как категория на ярлыке. У машины привычнее colored clothes или colors.']],
    3:[['will suffice','is enough','Will suffice звучит официально для разговора о стирке. Is enough или will do проще.'],['compact washing machine','small washer','Compact washing machine больше похоже на описание модели. При выборе свободной машины обычно достаточно small washer.','compact washing machine']],
    4:[['i am without coins','i do not have any coins','I am without coins понятно, но для обычного разговора естественнее I don’t have any coins.','am without'],['remit payment by card','pay by card','Remit payment характерно для платежных инструкций. У считывателя обычно говорят pay by card.','remit payment']],
    5:[['neglected to bring','forgot to bring','Neglected to bring звучит как признание упущения в официальном объяснении. Здесь достаточно forgot to bring.']],
    6:[['deposit the detergent','put the detergent','Deposit звучит как инструкция на машине. Когда спрашиваешь сотрудника, проще сказать put the detergent.'],['into which compartment should i put the detergent','which compartment should i put the detergent in','Оборот into which звучит официально для устного вопроса. В разговоре in естественно поставить в конце.']],
    7:[['i am in possession of a','i have a','In possession of — формальный оборот о владении. Для вещи в сумке достаточно I have.','in possession of'],['i would prefer to utilize','i would like to use','Utilize здесь утяжеляет простой выбор режима. Обычно говорят use.','utilize']],
    8:[['what is the duration of the wash','how long is the wash','What is the duration звучит как вопрос о характеристиках. У машины привычнее How long…?']],
    9:[['go to obtain','go get','Obtain звучит официально для похода за кофе. В разговоре говорят go get.']],
    10:[['upon the expiration of twenty minutes','in twenty minutes','Upon the expiration of twenty minutes напоминает инструкцию с таймером. В разговоре достаточно in twenty minutes.']]
  });

  expand('a1-cinema',[
    'My scarf’s still inside the theater. | I just realized I left my scarf in the screening room. | I must’ve left my scarf in the theater. | I left a scarf behind when I came out of the theater. | I came back for the scarf I left in there. | I walked out and left my scarf in the theater.',
    'The one that started at three. | It was the three o’clock screening. | Three this afternoon. | It started at three p.m. | I was at the three o’clock show. | It was the afternoon show, at three.',
    'Next to the door, right at the back. | I was by the door, all the way in the back row. | I sat in the last row, right by the door. | Right at the back, next to the door. | My seat was near the door in the back row. | The row at the very back, by the door.',
    'It’s blue and has white stripes on it. | A blue one with white stripes. | White stripes on blue. | It’s got a blue background and white stripes. | The scarf is blue with stripes of white. | Blue, with white stripes on it.',
    'It’s a lot like mine, except mine is longer. | It’s similar to mine, but not as long. | Mine looks like that, just longer. | It looks right apart from the length. Mine is longer. | Same look, but mine’s longer. | That one looks like mine, only shorter.',
    'Do you mind if I check under my seat? | Would you mind if I took a look under my seat? | Could I have a quick look beneath my seat? | Can I go look under the seat where I was sitting? | Would it be all right if I checked underneath my seat? | Could I check for it under my seat before the show?',
    'Hold on. I can pull up a picture of it. | Give me a second. There’s a photo of it on my phone. | Just a moment. I’ve got the scarf in a picture here. | Wait a second. I can show you what it looks like in a photo. | One sec. I have a photo where I’m wearing it. | Hang on. Here’s a picture of me with the scarf on.',
    'Yes, that’s my scarf. Do you see that tiny hole? | That one’s mine. See where there’s a little hole? | You see that little hole? That’s mine. | Yes! I know it by that little hole. | That’s definitely mine. It has that small hole. | Yep, mine. Look at that tiny hole there.',
    'Is it okay to go out this door? | Can I get outside through here? | Can I take this door out? | Can I head out through this door? | Will this door take me out? | Is it all right if I leave this way?',
    'Thank you so much for helping me find it. | I’m grateful you helped me get my scarf back. | Thanks. I really appreciate you helping me find it. | I appreciate the help getting it back. | Thanks for taking the time to help me find it. | You helped me find it. Thank you so much.'
  ],{
    1:[['i inadvertently left','i left','Inadvertently подчеркивает случайность в официальном стиле. В фойе обычно достаточно I left.']],
    2:[['the fifteen hundred hours screening','the three o’clock screening','Fifteen hundred hours характерно для служебного времени. В кинотеатре проще сказать the three o’clock show.','fifteen hundred hours']],
    3:[['adjacent to the door','by the door','Adjacent to звучит как описание на схеме. В устном рассказе by the door естественнее.','adjacent to']],
    4:[['blue in color','blue','In color избыточно, когда сразу назван конкретный цвет. Обычно достаточно it’s blue.','in color'],['white striping','white stripes','White striping похоже на описание узора в каталоге. При поиске шарфа проще white stripes.']],
    5:[['is similar in appearance to','looks like','Similar in appearance to точно описывает сходство, но звучит официально. Здесь обычно говорят looks like.']],
    6:[['i request permission to','can i','I request permission to подходит для формального обращения. В кинотеатре Can I…? достаточно вежливо.','request permission'],['inspect the area under my seat','check under my seat','Inspect the area звучит как служебный осмотр. Для поиска шарфа обычно говорят check under my seat.','inspect the area']],
    7:[['i possess a photograph of it','i have a picture of it','Possess a photograph звучит официально, когда человек просто показывает снимок с телефона. Естественнее I have a picture of it.','possess a photograph']],
    8:[['observe the small hole','see the little hole','Observe звучит как указание при осмотре. В разговоре привычнее See the little hole?']],
    9:[['exit via this door','go out through this door','Exit via характерно для указателей. В устном вопросе обычно говорят go out through.']],
    10:[['i wish to express my gratitude for','thanks for','I wish to express my gratitude звучит как формальное выступление. У выхода естественнее короткое Thanks for.']]
  });

  expand('a1-bike',[
    'Hang on a sec, I need to pull over. | Wait for me. I need to stop here. | Hold up a minute. I have to stop. | Just a second. I need to pull over. | Can we pull over for a second? | Wait! I’ve got to stop for a moment.',
    'The bike’s getting hard to ride. | It’s getting harder to pedal. | I’m having trouble pedaling. | It’s gotten a lot harder to ride. | My bike isn’t easy to pedal right now. | Pedaling’s really hard all of a sudden.',
    'I’ve got a flat rear tire. | The tire in the back went flat. | Looks like I have a flat in the back. | It’s the rear tire. It’s flat. | My back tire’s lost all its air. | The rear tire’s got no air in it.',
    'Did you bring a bike pump? | Have you got a pump on you? | Is there any chance you brought a pump? | Did you happen to pack a pump? | You don’t have a pump, do you? | What about a pump? Do you have one?',
    'I’ll just walk the bike, then. | Looks like I’m walking from here. | Okay, I’ll go the rest of the way on foot. | In that case, I’ll go on foot. | I guess I’ll have to push the bike. | All right. I’ll get off and walk.',
    'Do you happen to know if they’re open today? | Is the shop open right now? | Are they open at this hour? | Do you think the bike shop is still open? | Any idea if they’re open today? | Can we still go there today? Are they open?',
    'How far do I have to walk? | Is it nearby? | How long a walk is it? | Do you know how far it is from here? | Is the shop close enough to walk to? | Are we more than a few minutes away?',
    'Before we head over, let’s call them. | Let’s phone ahead. | How about we give them a call before we go? | I think we should give the shop a call first. | Maybe we ought to call before we walk over. | Can we check with them by phone first?',
    'Can you talk to them? I’ll hang on to the bikes. | Could you call while I hold both bikes? | You can make the call. I’ll look after our bikes. | Would you mind calling them? I’ll hold the bikes for us. | I’ll hold both bikes if you make the call. | You want to call them? I can keep the bikes steady.',
    'No thanks. I’d rather we went together. | How about we both walk over? | No, let’s stick together and walk. | I’d rather walk with you. | Let’s both go on foot, okay? | No, I want us to walk there together.'
  ],{
    1:[['i must come to a halt','i need to stop','Come to a halt звучит официально для быстрого предупреждения другу. Короткое I need to stop понятнее.']],
    2:[['i am experiencing difficulty pedaling','i am having trouble pedaling','Experiencing difficulty похоже на описание проблемы в отчете. Другу проще сказать I’m having trouble pedaling.']],
    3:[['the rear tire has deflated','the rear tire has gone flat','Has deflated понятно, но о спустившей велосипедной шине в разговоре обычно говорят has gone flat.']],
    4:[['are you in possession of','do you have','In possession of уместно в формальном опросе. У друга достаточно спросить Do you have…?','in possession of']],
    5:[['proceed on foot','go on foot','Proceed характерно для инструкции о движении. В разговоре с другом естественнее walk или go on foot.']],
    6:[['is the shop operating today','is the shop open today','Is the shop operating звучит как вопрос о работе предприятия. Об открытых дверях проще спросить Is the shop open today?']],
    7:[['what is the distance to the bike shop','how far away is the shop','What is the distance звучит как запрос точного расстояния. О коротком пешем пути проще спросить How far…?']],
    8:[['contact them by telephone','call them','Contact them by telephone звучит формально для предложения другу. Достаточно call them.']],
    9:[['make the telephone call','make the call','Telephone call звучит формально, когда друг уже протягивает телефон. Можно сказать make the call.'],['i will assume responsibility for','i will look after','Assume responsibility for напоминает распределение служебных обязанностей. Здесь речь о простой помощи — I’ll hold.']],
    10:[['proceed on foot together','walk together','Proceed on foot together звучит как распоряжение группе. Другу обычно говорят Let’s walk together.']]
  });

  expand('a1-video',[
    'I hear you loud and clear. I just can’t see you. | Yeah, I can hear you. Your video isn’t showing up. | I’ve got sound, just no video. | I can hear your voice, but I’m not getting a picture. | I hear you okay. No picture on my end, though. | The sound’s fine, but I can’t see you yet.',
    'There you are! Am I on your screen too? | I’ve got your picture now. Do you have mine? | I can see you now. How’s my video? | Oh, I see you! Can you see me on your end? | I finally have a picture. Can you see me too? | I see you now. Is my camera working for you?',
    'Up for a quick tour of my room? | Want a quick look at my room? | Should I show you around my room? | Would you like me to show you my room? | Want to take a look at my room? | Should I turn the camera around and show you my room?',
    'Right over there by the window. | The bed’s the one beside the window. | My bed’s over by the window. | I put my bed next to the window. | That’s my bed right next to the window. | The bed’s on the window side of the room.',
    'Look, that’s you in the photo. | The photo on the wall? That’s you. | That’s a picture with you in it. | See? You’re the one in the picture. | The person in the photo is you. | It’s you in that photo up there.',
    'Yeah, that’s the beach photo. | It’s from when we were at the beach. | Yes, that one was taken at the beach. | That’s from our day at the beach. | Yep, we took that one on the beach. | Yeah, the one from the beach trip.',
    'Can you make it out any better now? | How about now? | Any clearer now? | Does it look better from here? | Is this close enough for you to see it? | Do you have a better view now?',
    'I’ve got a second picture from that trip. | I have one other shot from the same trip. | I saved one more shot from that trip. | I’ve got another one from when we were there. | I still have another picture from that trip. | There’s another photo from our trip on my phone.',
    'I’ll send it over this evening. | I’ll text you a copy tonight. | You’ll get it from me this evening. | I’ll pass it along to you tonight. | I’ll send it your way later this evening. | I’ll send you that one tonight.',
    'Enjoy dinner! Can you ring me tomorrow? | Have a good dinner. Give me a call tomorrow. | Enjoy your meal, and call me tomorrow, okay? | Enjoy! Will you give me a call tomorrow? | Have a nice dinner. Do you think you could call me tomorrow? | Enjoy the food! Let’s talk tomorrow. Give me a call.'
  ],{
    1:[['i can audibly hear you','i can hear you','Audibly повторяет смысл hear. Бабушке достаточно сказать I can hear you.','audibly'],['i am unable to see you','i cannot see you','Unable to звучит как отчет о сбое. В семейном звонке обычнее I can’t see you.','unable to']],
    2:[['i am now able to see you','i can see you now','I am now able to звучит формально для реакции на заработавшую камеру. Обычно говорят I can see you now.']],
    3:[['would you care to see','would you like to see','Would you care to звучит церемоннее обычного приглашения в семейном разговоре. Обычная форма — Would you like to…?']],
    4:[['is situated beside the window','is beside the window','Situated beside звучит как описание плана комнаты. При показе комнаты естественно сказать is beside the window.','situated']],
    5:[['is a photographic image of you','is a picture of you','Photographic image — техническое обозначение. Для снимка на стене достаточно picture или photo.','photographic image']],
    6:[['the photograph was captured','that one was taken','The photograph was captured звучит как подпись к снимку. В звонке естественнее That one was taken…']],
    7:[['is the image now more legible','is that better','Legible часто относится к тому, можно ли прочитать надпись. Для фотографии при смене ракурса естественнее Is that better?']],
    8:[['i possess an additional photograph','i have another photo','Possess an additional photograph звучит как запись в описи. В разговоре проще I have another photo.']],
    9:[['i will forward it to you','i will send it to you','Forward часто означает переслать уже полученный файл. Когда обещаешь отправить свой снимок, send it to you яснее.']],
    10:[['contact me by telephone tomorrow','call me tomorrow','Contact me by telephone звучит как контактное указание. Бабушке проще сказать Call me tomorrow.','contact me by telephone']]
  });

  expand('a1-parcel',[
    'I’m here to send this gift to my sister. | Could you help me mail this to my sister? | This is for my sister. I’d like to mail it to her. | I’ve brought something to send to my sister. | I’d like to get this package to my sister. | I want to mail this. It’s for my sister.',
    'It’s a sweater I made by hand. | I made a sweater for her. That’s what’s inside. | A sweater I knit myself. | I knitted her a sweater. | A sweater, one I made myself. | There’s a sweater in there that I made for my sister.',
    'No, I didn’t bring anything but this bag. | There’s nothing else. Just this bag. | I’ve just got the bag you see here. | No, this paper bag is it. | I didn’t bring any other packaging. | No, I only brought the bag it’s in.',
    'It doesn’t need a big box. A small one is enough. | I think one of the little boxes will work. | There’s enough room in the small box. | This will fit in your smallest box. | I can use one of the small boxes. | The small box should be plenty big.',
    'It can get there sooner, but it has to be there by Saturday. | It has to reach her on or before Saturday. | I need her to have it by Saturday. | This has to get to my sister by Saturday. | Can you make sure she gets it by Saturday? | Saturday is the latest it can get there.',
    'What would you charge for the faster option? | What does it cost to have it there Friday? | What would it cost to have it there this Friday? | What would I pay for the Friday service? | Can you tell me the price for the quicker delivery? | If I go with Friday, how much is it?',
    'That’s a little more than I wanted to pay, but let’s go with it. | It’s more than I expected, but I’ll pay it. | A little expensive, but I’m okay with that. | A bit steep, but I’ll take the Friday option. | A bit high, but let’s send it that way. | That’s a lot, but I’ll go ahead with the faster one.',
    'I have it saved on my phone. | The address? I can pull it up on my phone. | I’ve got it in my contacts. | Her address is here on my phone. | I have her address right here. It’s on my phone. | It’s in a message on my phone.',
    'How can I check where it is after I send it? | How do I look up where my package is? | Will I be able to track it? How do I do that? | What do I use to track my package? | Is there somewhere I can check on it? | How do I find out where it is while it’s on its way?',
    'Can I use my phone here instead of a card? | Is it all right if I tap my phone? | Do you accept contactless payment from a phone? | Will it work if I pay with my phone? | Can I tap my phone on the reader to pay? | Does paying with my phone work here?'
  ],{
    1:[['i wish to dispatch','i want to send','Dispatch звучит как описание отправки груза. У почтового окна естественнее send или mail.']],
    2:[['i fabricated it myself','i made it myself','Fabricated звучит как описание промышленного изготовления. Про связанный вручную свитер естественнее I made it myself.']],
    3:[['i have no other packaging materials','i only have this bag','Packaging materials звучит технически для простого вопроса о пакете. В этой ситуации достаточно сказать I only have this bag.']],
    4:[['will suffice','is enough','Will suffice звучит официально для выбора коробки. Обычно говорят is enough или will do.']],
    5:[['no later than the close of saturday','no later than saturday','The close of Saturday звучит как формулировка срока в документе. Для обычной просьбы проще by Saturday.']],
    6:[['what is the charge for expedited delivery','how much is the faster one','What is the charge понятно, но звучит официально для обычного вопроса о цене. How much…? проще.'],['tell me the price of the faster option','what is the price for the faster option','Прямое Tell me может прозвучать как распоряжение. Нейтральнее спросить What’s the price…?']],
    7:[['i consent to that option','i will go with it','Consent to звучит как официальное согласие. При выборе тарифа проще сказать I’ll go with it.'],['that is somewhat costly','that is a little expensive','Somewhat costly характерно для письменной оценки расходов. В разговоре обычнее a little expensive.']],
    8:[['is stored on my mobile device','is saved on my phone','Mobile device подходит для технического описания. У окошка обычно говорят my phone.','mobile device']],
    9:[['how can i determine the current whereabouts of my package','how can i see where my package is','Current whereabouts звучит официально в обычном вопросе об отслеживании. Естественнее How can I see where my package is?','determine the current whereabouts of']],
    10:[['remit payment with my phone','pay with my phone','Remit payment уместно в инструкции или счете. У терминала проще спросить May I pay…?','remit payment']]
  });

  expand('a1-class',[
    'I’m already signed up for your class on Mondays. | I’m one of the students in the Monday group. | My name’s on the list for the Monday class. | I’m taking the class that meets on Mondays. | I’ve got a spot in the Monday group. | I’m registered for your Monday drawing class.',
    'I don’t finish work until seven on Mondays. | I’m still on the clock until seven every Monday. | I have to stay at work until seven on Mondays. | I get off at seven every Monday. | Mondays are hard. I’m at work until seven. | I’m not done with work until seven on Mondays.',
    'Could I move my class to another day? | Do you offer the same class on a different day? | Is there any way to take it on another day? | What other days can I take the class? | Could you put me in a group that meets on a different day? | Can I take it some other day instead?',
    'Do you have any openings on Wednesday? | Is Wednesday an option? | Do any of the groups meet on Wednesdays? | Is there any room in a Wednesday class? | What have you got on Wednesdays? | Could I take it on Wednesday instead?',
    'When do you start on Wednesday? | Can you tell me the start time? | What time does that group meet? | What time do you get started? | Would you tell me when class starts? | And what time does that one start?',
    'That time is fine. It’s Anna Lee. | Seven’s good for me. The name’s Anna Lee. | I can do that time. I’m Anna Lee. | Perfect. My name’s Anna Lee. | Yeah, that’ll work. Anna Lee. | Seven works. The name on the list is Anna Lee.',
    'No, I’m new to your classes. | I haven’t had a class with you before. | No, I’ve never been to any of your classes. | This will be my first lesson with you. | No, this is my first time taking a class there. | No, I haven’t taken one of your classes before.',
    'What am I supposed to bring to the class? | Should I bring any drawing supplies? | What will I need to take with me? | Do you want me to bring anything for class? | Do I need my own supplies? | What do I need to come with?',
    'There’s only a pen at my place. | I don’t have either of those. I just have a pen. | All I’ve got is a pen, nothing else. | I’ve got a pen at home, but that’s it. | No paper or pencil at home. Just a pen. | I only have a pen, and nothing to write on.',
    'Which door do I go through for class? | Is there a particular door I should use? Where is it? | Can you tell me where the entrance is? | Which way do I go in? | Where do I enter the building for class? | How do I find the studio’s entrance?'
  ],{
    1:[['i am presently enrolled in','i am in','Presently enrolled звучит как запись в учебном реестре. В начале телефонного звонка естественнее I’m in the Monday class.']],
    2:[['my shift concludes','my shift ends','Concludes звучит официально для описания рабочего дня. Обычно говорят my shift ends или I finish work.','concludes']],
    3:[['request a transfer to another day','switch to another day','Request a transfer звучит как заявление. По телефону о времени занятия проще сказать switch to another day.']],
    4:[['do you have availability for wednesday','do you have any openings on wednesday','Availability понятно, но звучит как язык расписания или бронирования. В простом вопросе подойдет any openings.']],
    5:[['at what hour does','what time does','At what hour звучит формально для вопроса по телефону. Обычная форма — What time does…?']],
    6:[['that is acceptable to me','that works for me','Acceptable to me звучит как условие переговоров. Подтвердить удобное время проще словами That works for me.','acceptable to me'],['my name for registration is','my name is','My name for registration звучит как подпись поля в анкете. При обычном переносе достаточно My name is…','for registration']],
    7:[['i have not previously attended a class here','i have never taken a class here','Previously attended звучит официально. По телефону привычнее I’ve never taken a class here.']],
    8:[['what am i required to bring','what do i need to bring','Required звучит как ссылка на правила. В обычном звонке естественнее What do I need to bring?']],
    9:[['all i have at my residence','all i have at home','Residence звучит как формальное обозначение адреса. Здесь достаточно at home.','at my residence']],
    10:[['the point of entry','the entrance','Point of entry подходит для схемы здания или плана доступа. По телефону проще спросить Where’s the entrance?']]
  });

  // These constructions combine form and context without multiplying full sentences in the reference list.
  const {ask,request}=root.A1BatchForms;
  const patterns={
    'a1-laundry':{
      1:['i have never (?:done (?:my )?laundry|washed (?:my )?clothes) (?:here|at this laundromat) before',
        '(?:this|it) is my first time (?:using (?:this place|this laundromat)|washing (?:my )?clothes here)'],
      3:['(?:no )?(?:it|everything|the whole load) (?:will|should) fit in (?:a|the) (?:small|little) (?:one|washer|washing machine)'],
      4:[`(?:i did not bring any (?:coins|change)|i (?:do not have any|am out of) (?:coins|quarters|change))(?: so)? (?:${ask} (?:pay (?:by card|with (?:a|my) (?:credit |debit )?card)|put it on my card)|do you (?:take|accept) (?:credit |debit )?cards|is (?:a|my) (?:credit |debit )?card (?:okay|ok))(?: instead)?`],
      6:['(?:what|which) (?:slot|tray|compartment) (?:should|do) i (?:put|pour) (?:the (?:soap|detergent)|it) (?:in|into)'],
      7:['(?:cold(?: water)?(?: please)?|i (?:will|would like to) use cold water) i (?:have|have got) a (?:brand )?new red (?:t shirt|tee|shirt)(?: (?:in (?:here|there|the load)|with me))?',
        'i (?:have|have got) a (?:brand )?new red (?:t shirt|tee|shirt)(?: in (?:here|there|the load))? so i (?:will|would rather) (?:use cold water|wash (?:it|them|these) on cold)'],
      8:['how (?:much time|many minutes) (?:does|will) (?:the|this) (?:wash|cycle) (?:take|run)'],
      10:['i will (?:be back|come back|return) here in (?:about )?(?:20|twenty) minutes',
        'in (?:about )?(?:20|twenty) minutes i will (?:be back|come back|return)(?: here)?']
    },
    'a1-cinema':{
      1:['i (?:just )?(?:noticed|realized|found out)(?: that)? i (?:left|forgot) my scarf (?:in (?:there|the (?:movie theater|theater|screening room))|inside)'],
      3:['(?:i (?:sat|was) |my seat was )?(?:right )?(?:by|next to|near) the door (?:in the (?:last|back) row|(?:all the way )?at the back)'],
      4:['(?:(?:it is|mine is) )?(?:blue|a blue (?:scarf|one)) with white stripes(?: on it)?',
        '(?:it is|mine is) blue and has white stripes(?: on it)?|white stripes on (?:blue|a blue background)'],
      6:['(?:do|would) you mind if i (?:check(?:ed)?|look(?:ed)?|took a (?:quick )?look) (?:under|underneath|beneath) (?:my seat|the seat i was in)'],
      9:[`(?:${ask}|is it (?:all right|okay|ok) (?:to|if i)) (?:go|head|get) out (?:this way|(?:through|via) this door|through here)`,
        'would it be (?:all right|okay|ok) if i (?:left|went out|headed out) (?:this way|through this door|through here)'],
      10:['(?:thanks|thank you)(?: so much| very much)? for (?:taking the time to help me|helping me) (?:find (?:it|my scarf)|get (?:it|my scarf) back)']
    },
    'a1-bike':{
      2:['(?:it is|my bike is) (?:getting|becoming) (?:a (?:bit|lot) )?hard(?:er)? to (?:ride|pedal)|i am having (?:a hard time|trouble|difficulty) (?:pedaling|riding)(?: right now)?'],
      3:['(?:the|my) (?:back|rear) tire (?:(?:has )?lost all its air|has gone flat|went flat)|i (?:have|have got) a flat (?:back|rear) tire'],
      4:['(?:did you (?:happen to )?(?:bring|pack)|have you (?:brought|packed)) a (?:bike )?pump',
        '(?:do you have|have you got) a (?:bike )?pump (?:with you|on you|in your bag)'],
      6:['(?:do you (?:happen to )?know|any idea) if (?:they are|it is|the (?:bike )?shop is) (?:still )?open (?:today|now|right now)',
        '(?:is (?:it|the (?:bike )?shop)|are they) open for business (?:today|now|right now)'],
      8:['before we (?:leave|head over|go there|walk over) (?:let us|we should) (?:call (?:them|the shop)|give (?:them|the shop) a call)'],
      9:[`(?:${request}|will you) (?:call (?:them|the shop)|make the call) while i (?:hold|watch|look after|hang on to) (?:the bikes|both bikes|our bikes)`]
    },
    'a1-video':{
      1:['i (?:can )?hear (?:you|your voice)(?: (?:fine|okay|loud and clear))? (?:but |just )?(?:i (?:still )?cannot see you(?: yet)?|(?:your|the) video is not (?:coming through|showing up)|there is no (?:picture|video))'],
      4:['(?:my|the) bed is (?:right |over |right over )?(?:by|next to|beside) the window'],
      6:['(?:it|that(?: one)?) (?:is from when we were|was (?:taken|shot)) (?:at|on) the beach'],
      8:['(?:i have|i have got|i still have|i saved) (?:another|one more|one other|a second) (?:photo|picture|shot) from (?:that|our|the same) (?:trip|vacation)'],
      9:['i (?:will|can) (?:send|text|message) you (?:a copy|that one|the (?:photo|picture)) (?:later )?(?:tonight|this evening)']
    },
    'a1-parcel':{
      1:[`(?:${request} (?:help me )?|i am here to )(?:send|mail|ship) (?:this|this (?:gift|present|package|parcel)) to my sister`],
      2:['(?:it is |there is )?a sweater(?: in (?:here|there))? (?:that )?i (?:made|knit|knitted)(?: (?:by hand|myself))?(?: for (?:her|my sister))?'],
      5:['(?:she needs to (?:have|get) it|it (?:has|needs) to (?:get to my sister|reach her|get there)) (?:on or before|by|no later than) saturday'],
      6:['(?:what (?:would you charge|would i pay|would it cost)|how much (?:would you charge|would i pay|would it cost)) for (?:the (?:friday|faster|quicker) (?:one|option|service|delivery)|(?:this )?friday delivery)'],
      8:['(?:i have|i have got) (?:it|(?:the|her) address) (?:saved|written down) (?:on|in) my phone(?: contacts)?'],
      9:['how (?:do|can) i (?:look up|check|see) where (?:it|(?:my|the) (?:parcel|package)) is(?: (?:online|after i send it|while it is on its way))?']
    },
    'a1-class':{
      1:['i am (?:already )?(?:signed up|registered|enrolled) (?:for|in) (?:the|your) monday (?:(?:art|drawing) )?(?:class|group)'],
      2:['(?:on mondays |every monday )?i (?:have to stay at work|am still on the clock|am not done with work) (?:until|till) (?:seven|7)(?: (?:pm|p m))?(?: on mondays| every monday)?'],
      3:[`(?:${request} (?:move me to|put me in a group that meets on) |${ask} (?:take|have) (?:the class|it) (?:on )?)(?:another|a different|some other) day(?: instead)?`],
      4:['(?:do you have|are there) (?:any )?(?:openings|spots|places) (?:on wednesdays?|in (?:the|a) wednesday (?:class|group))'],
      5:[`(?:what (?:is|would be) |${request} tell me )?the start(?:ing)? time(?: (?:for (?:that|the wednesday) (?:class|group)|on wednesday))?`,
        `${request} tell me what the start(?:ing)? time is(?: on wednesday)?`],
      8:['(?:should i|do i need to|do you want me to) (?:bring|take) (?:any |some |my own )?(?:drawing |art )?(?:supplies|materials)(?: (?:with me|to class|for class))?']
    }
  };
  for(const dialogue of root.DIALOGUES){
    for(const [number,forms] of Object.entries(patterns[dialogue.id]||{})){
      dialogue.turns[number-1].assessment.patterns.push(...forms);
    }
  }
})(typeof window!=='undefined'?window:globalThis);
