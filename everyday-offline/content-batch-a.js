/* Three individually authored A1 stories; editorial functions are kept out of the UI. */
(function(root){
  const error=(pattern,fragment,note,correction,code='conversation-grammar')=>({pattern,fragment,note,correction,code});
  const turn=(en,ru,task,best,examples,patterns,cases,errors=[],stage='')=>({en,ru,task,best,natural:[best,...examples],displayExamples:[best,...examples].slice(0,10),acceptable:[],rules:[],stage,assessment:{kind:'conversation',example:best,patterns,errors,cases}});
  const d=(id,topic,topicLabel,title,speaker,context,tone,turns,ending,reviewFunctions)=>({id,topic,topicLabel,title,speaker,context,tone,level:'A1',length:'long',checking:'construction',turns,ending,reviewFunctions});
  root.DIALOGUES.push(d('batch-shoes','shoes','Обувь','Удобная пара','Продавец','Ты зашел в обувной магазин. Нужна обувь для долгих прогулок. Обычно ты носишь американский размер 8.','Нейтральный разговор с продавцом, без избыточной официальности.',[
    turn('Hi! Can I help you find something?','Здравствуйте! Вам что-нибудь помочь найти?','Мне нужна удобная обувь для прогулок.','I need comfortable shoes for walking.',
      ['I’m looking for comfortable walking shoes.','Do you have any comfortable walking shoes?','I’d like some comfortable shoes for walking.','Something comfortable for walking.','I need a comfortable pair of walking shoes.','I’m after some comfortable shoes for walking.'],
      ['i (?:need|want|would like|am looking for|am after) (?:some |a pair of )?comfortable (?:walking shoes|shoes for walking)','i (?:need|want|would like|am looking for) a comfortable pair of (?:walking shoes|shoes for walking)','do you have (?:any |some )?comfortable (?:walking shoes|shoes for walking)','(?:something|a comfortable pair) (?:comfortable )?for walking'],
      {correct:['I want some comfortable walking shoes','I’m looking for a comfortable pair of shoes for walking','Do you have comfortable shoes for walking?'],error:['I need a comfortable shoes','I need comfortable shoes for walk'],unknown:['I don’t need comfortable shoes','I need running shoes']},
      [error('i need a comfortable shoes','a','Shoes во множественном числе: shoes, some shoes или a pair of shoes.','I need comfortable shoes.'),error('i need comfortable shoes for walk','walk','После for для занятия здесь нужна форма walking.','I need comfortable shoes for walking.')]),
    turn('These are good for walking. What size do you wear?','Эти хорошо подходят для прогулок. Какой у вас размер?','Обычно восьмой.','Usually an eight.',
      ['I usually wear an eight.','Usually size eight.','I’m usually a size eight.','An eight, usually.','My usual size is eight.','I normally wear a size eight.'],
      ['usually (?:(?:a )?size (?:eight|8)|an (?:eight|8)|(?:eight|8))','(?:an )?(?:eight|8) usually','i (?:usually|normally) (?:wear|take) (?:(?:a )?size (?:eight|8)|an (?:eight|8)|(?:eight|8))','i am (?:usually|normally) (?:a )?size (?:eight|8)','my (?:usual|normal) size is (?:eight|8)','(?:usually|normally) i (?:wear|take) (?:(?:a )?size (?:eight|8)|an (?:eight|8)|(?:eight|8))'],
      {correct:['I normally take an eight','I usually wear size 8','Normally I wear a size eight'],error:['I usually wears size eight'],unknown:['Usually nine','I never wear size eight']},
      [error('i usually wears (?:a |an )?(?:size )?(?:eight|8)','wears','С I нужно wear, не wears.','I usually wear size eight.')]),
    turn('Try this pair. They’re very light.','Попробуйте эту пару. Они очень легкие.','Здесь можно где-нибудь присесть?','Is there somewhere I can sit?',
      ['Can I sit down somewhere?','Is there a seat I can use?','Can I sit down here?','Is there somewhere to sit?','Could I have a seat?','Is there a chair I can sit on?'],
      ['is there (?:somewhere|anywhere)(?: here)? (?:i can sit|to sit)(?: down)?','(?:can|could|may) i (?:sit(?: down)?|have a seat)(?: here| somewhere| somewhere here)?','is there a (?:seat|chair)(?: here)?(?: i can (?:use|sit on))?','where can i sit(?: down)?'],
      {correct:['Is there anywhere to sit down','May I sit here','Where can I sit down'],error:['Is there chair','Where I can sit'],unknown:['I cannot sit down','Is there somewhere to sleep']},
      [error('is there (?:chair|seat)','chair','Chair/seat — исчисляемые существительные: a chair, a seat.','Is there a chair?','missing-determiner'),error('where i can sit(?: down)?','i can','В прямом вопросе can перед I: Where can I sit?','Where can I sit?')]),
    turn('How do they feel?','Ну как?','Они слишком тесные.','They’re too tight.',
      ['They feel too tight.','A bit too tight.','These are too tight.','They’re too small.','They feel a little too small.','Too tight for me.'],
      ['(?:(?:they|these|the shoes) (?:are|feel) )?(?:a (?:bit|little) )?too (?:tight|small)(?: for me)?','they (?:do not fit|are not big enough)'],
      {correct:['The shoes are too small for me','They feel a bit too tight','They don’t fit'],error:['They is too tight'],unknown:['They’re too big','They aren’t too tight']},
      [error('(?:they|these|the shoes) is too (?:tight|small)','is','Shoes/they — множественное число: are.','They’re too tight.')], 'Продавец показал на стул за тобой. Ты сел и примерил туфли.'),
    turn('The leather will get softer.','Кожа станет мягче.','У вас есть размер побольше?','Do you have a bigger size?',
      ['Do you have these in a larger size?','Could I try a size up?','Can I try the next size up?','Have you got a bigger size?','Could I have a larger size?','I’d like to try a bigger size.'],
      ['(?:do you have|have you got) (?:these in )?a (?:bigger|larger) size','(?:can|could|may) i (?:try|have) (?:a (?:bigger|larger) size|(?:the next |a )size up)','i would like to try a (?:bigger|larger) size','(?:do you have|have you got) (?:these|them) in (?:a )?(?:bigger|larger) size'],
      {correct:['May I try a larger size','Do you have them in a bigger size','Could I have a size up'],error:['Do you have bigger size','Do you have a more bigger size'],unknown:['Do you have a smaller size','Can I try a blue pair']},
      [error('do you have bigger size','bigger','Size — исчисляемое существительное: a bigger size.','Do you have a bigger size?','missing-determiner'),error('do you have a more bigger size','more bigger','Bigger уже сравнительная форма; more не нужен.','Do you have a bigger size?')]),
    turn('Here’s a nine. Try walking a little.','Вот девятый. Попробуйте немного пройтись.','Эти намного удобнее.','These are much more comfortable.',
      ['These feel much better.','They’re a lot more comfortable.','This pair feels much better.','Much more comfortable.','These are far more comfortable.','They feel a lot better.'],
      ['(?:(?:they|these) (?:are|feel) )?(?:much|a lot|far) more comfortable','(?:they|these) (?:feel|are) (?:much|a lot|far) better','this pair feels (?:much|a lot|far) better','this pair is (?:much|a lot) more comfortable'],
      {correct:['They feel far better','This pair is a lot more comfortable','These feel a lot more comfortable'],error:['These are more comfortabler'],unknown:['They are less comfortable','The color is much better']},
      [error('(?:they|these) are more comfortabler','comfortabler','У comfortable сравнительная форма more comfortable.','These are more comfortable.')]),
    turn('We have this size in brown and black. Which do you prefer?','Этот размер есть в коричневом и черном. Какой вам больше нравится?','Черные подойдут к моей куртке.','The black ones will go with my jacket.',
      ['Black will match my jacket.','The black pair will match my jacket.','Black goes with my jacket.','The black ones would go with my jacket.','My jacket will look good with the black ones.'],
      ['(?:the black ones|the black pair|black) (?:will|would) (?:go with|match) my jacket','the black ones (?:go with|match) my jacket','(?:the black pair|black) (?:goes with|matches) my jacket','my jacket (?:will|would) look good with (?:the )?black (?:ones|pair)','(?:the )?black (?:ones|pair) (?:will |would )?look good with my jacket'],
      {correct:['The black pair would match my jacket','The black ones look good with my jacket','Black would go with my jacket'],error:['The black ones will match with my jacket'],unknown:['Brown will match my jacket','I don’t have a jacket']},
      [error('(?:the black ones|the black pair|black) will match with my jacket','with','Match принимает дополнение без with: match my jacket. Go сочетается с with.','The black ones will match my jacket.')]),
    turn('Good choice. They’re ninety dollars.','Хороший выбор. Они стоят девяносто долларов.','Это слишком дорого. Есть что-нибудь дешевле?','That’s too expensive. Do you have anything cheaper?',
      ['That’s a bit too much. Have you got anything cheaper?','Too expensive for me. Is there a cheaper pair?','That’s more than I can spend. Do you have something cheaper?','Do you have a cheaper pair? That’s too expensive.','I can’t spend that much. Is there anything cheaper?'],
      ['(?:that is |it is )?(?:a (?:bit|little) )?too (?:expensive|much)(?: for me)? (?:do you have|have you got|is there) (?:anything|something|a pair that is) cheaper','(?:that is |it is )?(?:a bit )?too expensive(?: for me)? is there a cheaper pair','that is more than i can spend (?:do you have|is there) (?:something|anything) cheaper','do you have a cheaper pair (?:that|it) is too expensive','i cannot spend that much is there anything cheaper'],
      {correct:['It’s too expensive. Have you got something cheaper','Too expensive. Is there anything cheaper','That’s too much for me. Do you have something cheaper'],error:['That’s too expensive. Do you have anything more cheaper'],unknown:['That’s cheap. Do you have something more expensive','That’s too expensive']},
      [error('(?:that is )?too expensive do you have anything more cheaper','more cheaper','Cheaper уже означает «дешевле», more не нужен.','That’s too expensive. Do you have anything cheaper?')]),
    turn('This black pair is sixty dollars. Same size, softer sole.','Эта черная пара стоит шестьдесят долларов. Тот же размер, подошва мягче.','Эти тоже удобные. Я их возьму.','These are comfortable too. I’ll take them.',
      ['They feel good too. I’ll take this pair.','These feel comfortable as well. I’d like these.','This pair is comfortable too. I’ll buy it.','They’re comfortable too. I’ll have these.','These feel good too. I’ll get them.'],
      ['(?:they|these) (?:are|feel) (?:comfortable|good)(?: too| as well) i (?:will|would like to) (?:take|buy|get|have) (?:them|these|this pair)','(?:they|these) (?:are|feel) comfortable (?:too|as well) i would like these','this pair (?:is|feels) comfortable too i will (?:buy|take|get) it'],
      {correct:['These are comfortable as well. I will buy them','They feel comfortable too. I’ll take these','This pair feels comfortable too. I’ll take it'],error:['These is comfortable too. I will take them'],unknown:['They are uncomfortable. I’ll take them','I will take the brown ones']},
      [error('these is comfortable too i will take them','is','These — множественное число: these are.','These are comfortable too. I’ll take them.')]),
    turn('Would you like the box?','Вам нужна коробка?','Нет, у меня с собой сумка.','No, I have a bag with me.',
      ['No, I’ve got my own bag.','No box, thanks. I have a bag.','I brought my own bag.','No, I have my own bag.','I don’t need the box. I have a bag.','No, I’ve brought a bag.'],
      ['(?:no )?i (?:have|have got) (?:a bag(?: with me)?|my own bag)','no box i (?:have|have got) a bag','i (?:brought|have brought) (?:a|my own) bag','i do not need the box i have a bag'],
      {correct:['No I have got a bag with me','I have brought my own bag','No I have my own bag'],error:['No I have bag'],unknown:['Yes I need the box','I don’t have a bag']},
      [error('(?:no )?i have bag','bag','Bag — исчисляемое существительное: a bag или my bag.','No, I have a bag.','missing-determiner')])
  ],{en:'Perfect. You can pay at the counter over there.',ru:'Отлично. Оплатить можно у той стойки.'},['Объяснить цель покупки','Сообщить обычный размер','Найти место, где можно сесть для примерки','Сообщить о проблеме посадки','Запросить больший размер вместо ожидания растяжки','Оценить новую посадку','Выбрать цвет с причиной','Обозначить бюджет и запросить замену','Принять более дешевую подходящую пару','Отказаться от упаковки с объяснением']));

  root.DIALOGUES.push(d('batch-cat','neighbors','Соседи','Куда делась кошка','Соседка','Ты возвращаешься домой. У подъезда соседка оглядывается по сторонам.','Неформальное общение соседей: вы знаете друг друга, но не близкие друзья.',[
    turn('Hi! Have you seen my cat? She got out through the window.','Привет! Ты не видел мою кошку? Она вылезла через окно.','А какого она цвета?','What color is she?',
      ['What color is your cat?','What does she look like?','What color is it?','What does your cat look like?','Is she a particular color?'],
      ['what colou?r is (?:she|it|your cat|the cat)','what does (?:she|your cat|the cat) look like','what is (?:her|its) colou?r','is she a particular colou?r'],
      {correct:['What colour is the cat','What is her color','What does the cat look like'],error:['What color she is'],unknown:['What is her name','What color is your dog']},
      [error('what colou?r (?:she|it|your cat) is','she is','В прямом вопросе is стоит перед подлежащим: What color is she?','What color is she?')]),
    turn('Black and white. She has a red collar.','Черно-белая. На ней красный ошейник.','Я видел ее на парковке.','I saw her in the parking lot.',
      ['I saw a cat like that in the parking lot.','She was in the parking lot when I saw her.','I’ve seen her in the parking lot.','I spotted her in the parking lot.','I saw it in the parking lot.'],
      ['i (?:saw|spotted|have seen) (?:her|it|your cat|a cat like that) in the parking lot','(?:she|it|your cat) was in the parking lot when i saw (?:her|it)'],
      {correct:['I spotted your cat in the parking lot','I have seen your cat in the parking lot','I saw her in the parking lot'],error:['I saw her in parking lot','I seen her in the parking lot'],unknown:['I didn’t see her in the parking lot','I saw her at the station']},
      [error('i (?:saw|spotted) her in parking lot','parking','Речь об определенной парковке: in the parking lot.','I saw her in the parking lot.','missing-determiner'),error('i seen her in the parking lot','seen','Для прошедшего времени без have нужна форма saw.','I saw her in the parking lot.')]),
    turn('Really? When was that?','Правда? Когда это было?','Минут десять назад.','About ten minutes ago.',
      ['Around ten minutes ago.','Ten minutes ago, I think.','Maybe ten minutes ago.','I saw her about ten minutes ago.','About 10 minutes ago.'],
      ['(?:(?:about|around|maybe) )?(?:ten|10) minutes ago(?: i think)?','i saw (?:her|it) (?:about |around )?(?:ten|10) minutes ago'],
      {correct:['I saw it around 10 minutes ago','Around ten minutes ago I think','Maybe 10 minutes ago'],error:['Ten minute ago'],unknown:['Ten hours ago','Not ten minutes ago']},
      [error('(?:about )?(?:ten|10) minute ago','minute','После ten нужна множественная форма minutes.','About ten minutes ago.','missing-plural')]),
    turn('She gets scared of cars. Can you show me where?','Она боится машин. Можешь показать, где?','Вон там, под синей машиной.','Over there, under the blue car.',
      ['Under that blue car over there.','She’s under the blue car.','There, beneath the blue car.','Look under the blue car over there.','Under the blue car, over there.'],
      ['(?:over there |there )?(?:under|beneath|underneath) (?:the|that) blue car(?: over there)?','(?:she|it) is (?:under|beneath|underneath) (?:the|that) blue car(?: over there)?','look under (?:the|that) blue car(?: over there)?'],
      {correct:['Underneath that blue car','She is beneath that blue car','There underneath the blue car'],error:['Under blue car'],unknown:['Behind the red car','Not under the blue car']},
      [error('(?:over there )?under blue car','blue','Нужен определитель конкретной машины: the blue car.','Under the blue car.','missing-determiner')]),
    turn('I can see her! She won’t come out.','Вижу ее! Она не выходит.','Я принесу немного еды.','I’ll bring some food.',
      ['I’ll get some food.','I can bring her some food.','Let me get some food.','I’m going to get some food.','I’ll fetch something for her to eat.','I can get her something to eat.'],
      ['i (?:will|can|am going to) (?:bring|get|fetch) (?:her )?(?:some food|something to eat)','let me (?:bring|get|fetch) (?:her )?some food','i will (?:bring|get|fetch) something for her to eat'],
      {correct:['I can fetch some food','Let me bring her some food','I am going to bring some food'],error:['I’ll bring a food','I will bringing some food'],unknown:['I won’t bring any food','I’ll bring a toy']},
      [error('i will bring a food','a','Food обычно неисчисляемое: some food или food, без a.','I’ll bring some food.'),error('i will bringing some food','bringing','После will нужна начальная форма bring.','I’ll bring some food.')]),
    turn('Good idea. She loves fish. Do you have any?','Хорошая мысль. Она любит рыбу. У тебя есть?','Да, дома есть немного рыбы.','Yes, I have some fish at home.',
      ['I’ve got some fish at home.','There’s some fish at my place.','I have a little fish at home.','I do. There’s some at home.','I’ve got a bit of fish at home.'],
      ['i (?:have|have got) (?:some|a little|a bit of) fish (?:at home|at my place)','there is (?:some|a little|a bit of) fish (?:at home|at my place)','i do there is some at home'],
      {correct:['I have got a little fish at my place','There is a bit of fish at home','I have some fish at my place'],error:['I have some fish in home'],unknown:['I have no fish at home','I have some chicken at home']},
      [error('i have some fish in home','in home','В этом значении говорят at home, не in home.','I have some fish at home.')]),
    turn('Here she comes. I’ll try to grab her.','Она выходит. Попробую ее схватить.','Не беги за ней. Она боится.','Don’t run after her. She’s scared.',
      ['Don’t chase her. She’s scared.','She’s scared. Don’t chase her.','Don’t run after the cat. She’s frightened.','She’s afraid. Don’t run after her.','Don’t chase her, she’s frightened.'],
      ['do not (?:run after|chase) (?:her|the cat) (?:she|the cat) is (?:scared|afraid|frightened)','(?:she|the cat) is (?:scared|afraid|frightened) do not (?:run after|chase) (?:her|the cat)'],
      {correct:['Don’t chase the cat. She is afraid','The cat is frightened. Do not run after her','Do not chase her. The cat is scared'],error:['Don’t run after her. She afraid'],unknown:['Run after her she is scared','Don’t chase her she is hungry']},
      [error('do not run after her she afraid','she afraid','В полной фразе нужна связка is: she is afraid.','Don’t run after her. She’s afraid.')],
      'Ты принес из дома рыбу. Соседка положила немного в миску у машины.'),
    turn('You’re right. Can she get out through the gate?','Ты прав. Она может выбежать через калитку?','Нет, я закрыл калитку.','No, I closed the gate.',
      ['No, the gate is closed.','I’ve closed the gate.','No, I shut the gate.','I made sure the gate was closed.','No, I’ve shut the gate.'],
      ['(?:no )?i (?:closed|shut|have closed|have shut) the gate','(?:no )?the gate is (?:closed|shut)','i made sure the gate was closed'],
      {correct:['No I have closed the gate','No the gate is shut','I have shut the gate'],error:['I closed gate'],unknown:['I opened the gate','The gate is not closed']},
      [error('(?:no )?i closed gate','gate','Речь о конкретной калитке: the gate.','I closed the gate.','missing-determiner')]),
    turn('She’s coming closer to the bowl.','Она подходит к миске.','Давай я подержу миску.','Let me hold the bowl.',
      ['I can hold the bowl.','I’ll hold the bowl.','Can I hold the bowl?','I could hold it.','Let me hold it.','I’ll hold it for you.'],
      ['(?:let me|i can|i could|i will) hold (?:the bowl|it)(?: for you)?','(?:can|could|may) i hold (?:the bowl|it)'],
      {correct:['Could I hold the bowl','I can hold it for you','Let me hold the bowl for you'],error:['Let me to hold the bowl','I’ll hold bowl'],unknown:['I’ll drop the bowl','Let her hold the bowl']},
      [error('let me to hold (?:the bowl|it)','to','После let me здесь глагол без to: let me hold.','Let me hold the bowl.'),error('i will hold bowl','bowl','Нужен определитель конкретной миски: the bowl.','I’ll hold the bowl.','missing-determiner')]),
    turn('Got her! Thank you. I’ll take her upstairs.','Поймала! Спасибо. Отнесу ее наверх.','Не забудь закрыть окно.','Don’t forget to close the window.',
      ['Remember to close the window.','Make sure you close the window.','Don’t leave the window open.','Keep the window closed.','Remember to shut the window.','Don’t forget to shut the window.'],
      ['do not forget to (?:close|shut) the window','remember to (?:close|shut) the window','make sure you (?:close|shut) the window','make sure the window is (?:closed|shut)','do not leave the window open','keep the window (?:closed|shut)'],
      {correct:['Make sure the window is closed','Remember to shut the window','Don’t forget to close the window'],error:['Don’t forget close the window'],unknown:['Don’t close the window','Remember to open the window']},
      [error('do not forget (?:close|shut) the window','forget','После forget перед действием нужен to: forget to close.','Don’t forget to close the window.')])
  ],{en:'I will. No more trips outside for her today!',ru:'Закрою. На сегодня с прогулками хватит!'},['Уточнить признаки кошки','Сообщить место наблюдения','Уточнить давность наблюдения','Указать точное укрытие','Предложить действие для помощи','Подтвердить наличие нужной еды','Предупредить о поведении испуганного животного','Сообщить об устраненном пути побега','Помочь удержать миску рядом с кошкой','Предотвратить повторный побег после возвращения домой']));

  root.DIALOGUES.push(d('batch-park','meeting','Встреча с другом','У какого входа?','Друг','Ты договорился встретиться с другом у входа в парк. Ты уже пришел, но друга не видно.','Неформальный телефонный разговор друзей.',[
    turn('Hey, I’m here. Where are you?','Привет, я уже здесь. Ты где?','Я у красных ворот.','I’m at the red gate.',
      ['By the red gate.','I’m standing by the red gate.','At the red entrance.','I’m next to the red gate.','I’m outside the red gate.'],
      ['(?:i am )?(?:standing )?(?:at|by|next to|outside|beside) the red (?:gate|entrance)'],
      {correct:['Beside the red gate','I am by the red entrance','Standing at the red gate'],error:['I’m at red gate'],unknown:['I’m at the blue gate','I’m not at the red gate']},
      [error('(?:i am )?at red gate','red','Нужен определитель конкретного входа: the red gate.','I’m at the red gate.','missing-determiner')]),
    turn('Red? I’m at the green gate, by the lake.','Красных? Я у зеленых, рядом с озером.','Мы у разных входов.','We’re at different entrances.',
      ['We’re at two different gates.','We’re at different gates.','Looks like we’re at different entrances.','We must be at different entrances.','We’ve come to different gates.'],
      ['we are at (?:two )?different (?:entrances|gates)','(?:looks like |it looks like )?we are at different (?:entrances|gates)','we must be at different (?:entrances|gates)','we have come to different (?:entrances|gates)'],
      {correct:['It looks like we are at different gates','We are at two different entrances','We have come to different entrances'],error:['We is at different entrances'],unknown:['We are at the same entrance','The entrances are closed']},
      [error('we is at different (?:entrances|gates)','is','С we нужна форма are, не is.','We’re at different entrances.')]),
    turn('Stay there. I can come to you.','Оставайся там. Я могу к тебе подойти.','Я лучше подойду к озеру.','I’ll come to the lake instead.',
      ['I’d rather come to the lake.','Let me come to the lake.','I can come over to the lake.','I’ll walk over to the lake.','I’ll come to you by the lake.'],
      ['i will (?:come|walk|head)(?: over)? to the lake(?: instead)?','i would rather (?:come|walk|go) to the lake','let me (?:come|walk) to the lake','i can come(?: over)? to the lake','i will come to you by the lake'],
      {correct:['I would rather walk to the lake','I’ll head over to the lake','Let me walk to the lake'],error:['I’ll come to lake'],unknown:['I’ll stay at the red gate','I won’t come to the lake']},
      [error('i will come to lake','lake','Речь об определенном озере в парке: the lake.','I’ll come to the lake.','missing-determiner')]),
    turn('OK. Take the path on your right.','Хорошо. Иди по дорожке справа.','Эта дорожка закрыта.','That path is closed.',
      ['The path is closed.','This path is closed.','It’s closed.','They’ve closed that path.','That path isn’t open.'],
      ['(?:that|this|the) path is (?:closed|shut)','it is (?:closed|shut)','they have closed (?:that|this|the) path','(?:that|this|the) path is not open'],
      {correct:['This path is shut','The path is not open','They have closed the path'],error:['That path are closed'],unknown:['That path is open','The gate is closed']},
      [error('(?:that|this|the) path are closed','are','Path — единственное число: is closed.','That path is closed.')]),
    turn('Oh. Then go past the playground and turn left.','Тогда пройди мимо детской площадки и поверни налево.','Это далеко отсюда?','Is it far from here?',
      ['Is that far from here?','Is it a long way from here?','How far is it from here?','Is it far?','Do I have far to walk?','How far away is it?'],
      ['is (?:it|that|the lake) (?:far|a long way)(?: from here)?','how far (?:away )?is (?:it|the lake)(?: from here)?','do i have far to walk'],
      {correct:['Is the lake a long way from here','How far away is the lake','Is the lake far'],error:['How far it is from here'],unknown:['Is it near your house','Is it closed today']},
      [error('how far it is(?: from here)?','it is','В прямом вопросе is перед it: How far is it?','How far is it from here?')]),
    turn('Only five minutes. I’ll wait on a bench.','Всего пять минут. Подожду на скамейке.','Хорошо, у меня тяжелая сумка.','Good, my bag is heavy.',
      ['That’s good. I have a heavy bag.','Good. This bag is heavy.','Good, I’m carrying a heavy bag.','Good, my bag weighs a lot.','Glad to hear it. My bag is heavy.'],
      ['(?:good |that is good |glad to hear it )?(?:my|this|the) bag is (?:heavy|quite heavy|really heavy)','(?:good |that is good )?i (?:have|am carrying) a heavy bag','(?:good )?my bag weighs a lot'],
      {correct:['That is good my bag is quite heavy','I’m carrying a heavy bag','This bag is really heavy'],error:['My bag are heavy','I have heavy bag'],unknown:['My bag is light','I have no bag']},
      [error('my bag are heavy','are','Bag — единственное число: is heavy.','My bag is heavy.'),error('i have heavy bag','heavy','Нужен артикль: a heavy bag.','I have a heavy bag.','missing-determiner')]),
    turn('What’s in it?','А что в ней?','Еда для нашего пикника.','Food for our picnic.',
      ['I’ve brought food for our picnic.','It’s food for our picnic.','Our picnic food.','I have our picnic food in here.','There’s food for our picnic in it.'],
      ['(?:it is )?(?:the )?food for (?:our|the) picnic','our picnic food','i (?:brought|have brought) (?:the )?food for our picnic','i have our picnic food in here','there is (?:some )?food for our picnic in it'],
      {correct:['I brought the food for our picnic','There is some food for our picnic in it','The food for the picnic'],error:['A food for our picnic'],unknown:['Food for my dog','There’s no food in it']},
      [error('a food for our picnic','a','В этом значении food неисчисляемое, без a.','Food for our picnic.')]),
    turn('Nice! Can you see the lake now?','Здорово! Теперь видишь озеро?','Да, но я тебя не вижу.','Yes, but I can’t see you.',
      ['I can see the lake, but not you.','Yes, I can’t see you, though.','I see the lake, but I don’t see you.','The lake, yes. You, no.','Yes, but where are you? I can’t see you.'],
      ['(?:but )?i cannot see you(?: though)?','i (?:can see|see) the lake but (?:not you|i (?:cannot|do not) see you)','the lake yes you no','but where are you i cannot see you'],
      {correct:['But I cannot see you','I can see the lake but I cannot see you','I see the lake but not you'],error:['But I don’t can see you'],unknown:['Yes I can see you','I cannot see the lake']},
      [error('(?:but )?i do not can see you','do not can','С can отрицание образуется cannot/can’t, без don’t.','But I can’t see you.')]),
    turn('I’m wearing a yellow jacket. By the big tree.','На мне желтая куртка. У большого дерева.','Вижу тебя! Сейчас подойду.','I can see you! I’m coming.',
      ['There you are! I’m coming over.','I see you now. I’ll be right there.','Found you! I’m on my way over.','I can see you now. Coming!','I see you. I’ll come over now.'],
      ['i (?:can see|see) you(?: now)? (?:i am coming(?: over)?|coming|i will be right there|i will come over now)','there you are i am coming(?: over)?','found you i am on my way over'],
      {correct:['I can see you now. I’m coming over','I see you. Coming','There you are I am coming'],error:['I see you I coming'],unknown:['I can’t see you I’m coming','I see you but I’m leaving']},
      [error('i see you i coming','i coming','В полной фразе нужен am: I’m coming.','I see you. I’m coming.')]),
    turn('Here, let me take the bag. Where shall we sit?','Давай сумку. Где сядем?','Давай под тем деревом. Там тень.','Let’s sit under that tree. There’s shade.',
      ['How about under that tree? It’s shady there.','Under that tree. There’s some shade.','Let’s sit in the shade under that tree.','We can sit under that tree, in the shade.','That tree has some shade. Let’s sit there.'],
      ['(?:let us sit |how about )?under (?:that|the) tree (?:there is (?:some )?shade|it is shady there)','let us sit in the shade under (?:that|the) tree','we (?:can|could) sit under (?:that|the) tree in the shade','that tree has some shade let us sit there','let us sit under (?:that|the) tree it is shady there'],
      {correct:['We could sit under that tree in the shade','Let us sit under the tree there is some shade','Under that tree it is shady there'],error:['Let’s sit under that tree in shade'],unknown:['Let’s sit in the sun','Let’s sit under that tree there is no shade']},
      [error('let us sit under that tree in shade','shade','В выражении «в тени» здесь нужен the: in the shade.','Let’s sit under that tree in the shade.','missing-determiner')])
  ],{en:'Good idea. I’m hungry!',ru:'Хорошая мысль. Я голоден!'},['Назвать точку встречи','Выявить разные входы','Предложить идти к другу','Сообщить о перекрытой дорожке','Оценить расстояние обхода','Объяснить, почему расстояние важно','Раскрыть содержимое сумки и цель встречи','Отделить видимое озеро от пока не найденного друга','Сообщить, что друг найден, и подойти','Выбрать место для пикника с причиной']));
  // Additional independently phrased construction families, not dialogue templates.
  const extra=(id,i,patterns)=>root.DIALOGUES.find(d=>d.id===id).turns[i].assessment.patterns.push(...patterns);
  extra('batch-shoes',0,["i (?:need|want|would like|am looking for|am after) (?:some |a pair of )?(?:comfortable|comfy) shoes (?:to walk in|for walking)","i (?:need|want|would like|am looking for) (?:a )?(?:comfortable|comfy) pair (?:of shoes )?for walking","do you have (?:any |some )?(?:comfortable|comfy) shoes to walk in"]);
  extra('batch-shoes',1,["i am (?:usually |normally )?(?:(?:a )?size (?:eight|8)|an (?:eight|8)|(?:eight|8))","(?:my )?size is (?:usually |normally )?(?:eight|8)"]);
  extra('batch-shoes',2,["(?:do you mind|mind) if i try (?:them|these|this pair) on here","would it be (?:ok|okay|all right) (?:for me )?to try (?:them|these) on here"]);
  extra('batch-shoes',3,["(?:(?:they|these) (?:are|feel) )?a (?:bit|little) (?:tight|small)(?: for me)?","(?:they|these) do not fit (?:they|these) are too (?:tight|small)"]);
  extra('batch-shoes',4,["do (?:these|they) come in a (?:bigger|larger) size","(?:can|could|would) you (?:get|bring) me (?:a (?:bigger|larger) size|the next size up)"]);
  extra('batch-shoes',5,["(?:they|these) (?:fit|feel) (?:much|a lot|far) better","(?:they|these) are (?:much|a lot|far) comfier","this pair (?:fits|feels) (?:much|a lot|far) better"]);
  extra('batch-shoes',6,["(?:the black ones|the black pair|black) (?:will |would )?(?:go(?:es)? with|match(?:es)?) my coat"]);
  extra('batch-shoes',7,["(?:that is|it is|they are|these are) (?:a bit )?too expensive (?:do you have|is there) (?:a cheaper pair|a less expensive pair|anything less expensive|something less expensive)","(?:do you have|is there) (?:a cheaper pair|anything cheaper|something cheaper) (?:that is|it is|these are|they are) too expensive"]);
  extra('batch-shoes',8,["(?:they|these) (?:are|feel) (?:comfortable|comfy|good) (?:too|as well) i will (?:take|buy|get|have) (?:them|these|this pair)"]);
  extra('batch-shoes',9,["(?:no )?i (?:have|have got) my own bag(?: with me)?","no (?:i )?(?:brought|have brought) (?:a|my own) bag"]);
  extra('batch-cat',1,["i (?:saw|spotted|have seen) (?:her|it|your cat|a cat like that) out in the parking lot"]);
  extra('batch-cat',2,["(?:(?:about|around|maybe) )?(?:ten|10) mins ago(?: i think)?","(?:ten|10) or so minutes ago"]);
  extra('batch-cat',3,["right over there (?:under|beneath|underneath) (?:the|that) blue car","(?:she|it) is right (?:under|beneath|underneath) (?:the|that) blue car"]);
  extra('batch-cat',4,["i (?:will|can|am going to) go and (?:bring|get|fetch) (?:her )?some food","let me go and (?:get|fetch) some food"]);
  extra('batch-cat',6,["do not (?:run after|chase|go after) (?:her|the cat) (?:you will scare her|she is scared|she is afraid|she is frightened)"]);
  extra('batch-cat',7,["(?:no )?i (?:have already closed|have already shut|already closed|already shut) the gate"]);
  extra('batch-cat',8,["(?:do you )?want me to hold (?:the bowl|it)","i (?:will|can) keep hold of (?:the bowl|it)"]);
  extra('batch-park',0,["i am waiting (?:at|by|next to|outside) the red (?:gate|entrance)"]);
  extra('batch-park',2,["i would prefer to (?:come|go|walk) to the lake","(?:i will|let me) come to (?:you|your entrance)(?: instead)?"]);
  extra('batch-park',3,["the path on (?:the|my) right is closed","that path has been closed"]);
  extra('batch-park',4,["how far (?:do i have|is there) to (?:walk|go)"]);
  extra('batch-park',5,["(?:good )?this bag weighs a lot","(?:good )?my bag is (?:pretty|rather|very) heavy"]);
  extra('batch-park',6,["i have got (?:some |the )?food for our picnic","it is (?:the )?food for our picnic in here"]);
  extra('batch-park',7,["but i (?:do not see|cannot find) you","i can see the lake but i cannot find you"]);
  extra('batch-park',8,["(?:now )?i (?:can see|see) you i am on my way(?: over)?","there you are i will be right there"]);
  extra('batch-park',9,["how about sitting under (?:that|the) tree (?:there is (?:some )?shade|it is shady there)","(?:can|could) we sit under (?:that|the) tree in the shade"]);
  extra('batch-shoes',1,["i (?:wear|take) an (?:eight|8) (?:usually|normally)"]);
  extra('batch-shoes',3,["(?:they|these|the shoes) (?:are|feel) (?:really|very) tight"]);
  extra('batch-shoes',4,["(?:have you got|do you have) (?:a|one) size (?:bigger|larger)"]);
  extra('batch-shoes',7,["(?:that is|it is|they are|these are) (?:a bit )?too pricey (?:do you have|is there) (?:a cheaper pair|anything cheaper|something cheaper)"]);
  extra('batch-shoes',8,["this pair (?:is|feels) (?:comfortable|comfy|good) (?:too|as well) i will (?:take|buy|get|have) (?:it|them|these|this pair)"]);
  extra('batch-shoes',9,["(?:no )?i (?:have|have got) my bag(?: with me)?"]);
  extra('batch-cat',0,["what does it look like"]);
  extra('batch-cat',2,["(?:(?:about|around) )?(?:ten|10) minutes back"]);
  extra('batch-cat',5,["i (?:have|have got) fish (?:at home|at my place)"]);
  extra('batch-cat',6,["(?:she|the cat) is (?:scared|afraid|frightened) do not (?:run after|chase|go after) (?:her|the cat)"]);
  extra('batch-cat',8,["(?:let me|i will|i can) hold that bowl"]);
  extra('batch-cat',9,["do not forget to (?:close|shut) your window","remember to (?:close|shut) your window"]);
  extra('batch-park',0,["(?:i am )?(?:at|by|next to|outside) (?:the|those) red gates"]);
  extra('batch-park',1,["we are at (?:two )?different (?:entrances|gates) then"]);
  extra('batch-park',2,["i would rather (?:walk|come|go) over to the lake"]);
  extra('batch-park',3,["it is not open"]);
  extra('batch-park',4,["is (?:it|that) a long walk"]);
  extra('batch-park',5,["great (?:my|this|the) bag is heavy"]);
  extra('batch-park',6,["(?:some|the) food for (?:our|the) picnic"]);
  extra('batch-park',7,["but i do not see you"]);
  extra('batch-park',9,["let us sit in the shade of (?:that|the) tree"]);
  const shoes=root.DIALOGUES.find(d=>d.id==='batch-shoes');
  shoes.turns[1].assessment.errors.push(error('usually a (?:eight|8)','a','Перед eight нужен an; перед size — a: an eight / a size eight.','Usually an eight.','a-an'));
  shoes.turns[6].assessment.errors.push(error('(?:the black ones|the black pair|black) (?:will|would) (?:matches|goes with) my (?:jacket|coat)','matches','После will/would нужна начальная форма: match / go with.','The black ones will match my jacket.'));
  shoes.turns[6].assessment.errors.push(error('the black ones (?:goes with|matches) my (?:jacket|coat)','goes','The black ones — множественное число: go with / match.','The black ones go with my jacket.'));
  shoes.turns[1].assessment.cases.error.push('Usually a eight.');
  shoes.turns[6].assessment.cases.error.push('The black ones will matches my jacket.','The black ones goes with my jacket.');
  shoes.turns[6].assessment.errors.at(-2).fragmentPattern='matches|goes';
  shoes.turns[6].assessment.errors.at(-1).fragmentPattern='matches|goes';
  root.DIALOGUES.find(d=>d.id==='batch-park').turns[9].assessment.allowLets=true;
  // Final independent-review follow-up: intent guards and additional bounded paraphrases.
  for(const id of ['batch-shoes','batch-cat','batch-park'])for(const t of root.DIALOGUES.find(d=>d.id===id).turns)t.assessment.beContractions=['she','he','cat','bag','phone','light'];
  shoes.turns[9].assessment.rejectAffirmed=true;
  root.DIALOGUES.find(d=>d.id==='batch-cat').turns[7].assessment.rejectAffirmed=true;
  extra('batch-shoes',2,['is there (?:a place|somewhere) (?:where i can sit|to sit)']);
  extra('batch-shoes',0,['i am looking for a (?:comfortable|comfy) pair to walk in']);
  extra('batch-cat',4,['i will (?:bring|get|fetch) food(?: for (?:her|the cat))?']);
  extra('batch-park',9,['let us sit under (?:that|the) tree in the shade']);
  shoes.turns[5].assessment.errors.push(error('(?:they|these) feels (?:much |a lot )?(?:better|more comfortable)','feels','С they/these нужно feel без -s.','They feel much better.'));
  shoes.turns[5].assessment.errors.push(error('this pair are (?:much |a lot )?(?:better|more comfortable)','are','Pair — единственное число: this pair is.','This pair is much better.'));

  // Simpler required A1 wording; richer accepted formulations remain available.
  const park=root.DIALOGUES.find(d=>d.id==='batch-park'),cat=root.DIALOGUES.find(d=>d.id==='batch-cat');
  const primary=(dialogue,i,task,best)=>{const t=dialogue.turns[i];t.task=task;t.best=best;t.assessment.example=best;t.natural=[best,...t.natural.filter(a=>a!==best)];t.displayExamples=t.natural.slice(0,10);};
  primary(shoes,0,'Мне нужна обувь для долгих прогулок.','I need shoes for long walks.');
  extra('batch-shoes',0,['i (?:need|want|would like|am looking for) (?:some |a pair of )?shoes for long walks','do you have (?:any |some )?shoes for long walks']);
  primary(shoes,3,'Они слишком маленькие.','They’re too small.');
  primary(shoes,5,'В этих намного лучше.','These feel much better.');
  primary(shoes,6,'Черные будут хорошо смотреться с моей курткой.','Black will look good with my jacket.');
  extra('batch-shoes',6,['black (?:will|would) look good with my (?:jacket|coat)']);
  primary(shoes,8,'В этих тоже хорошо. Я их возьму.','These feel good too. I’ll take them.');
  primary(park,1,'Мы в разных местах.','We’re in different places.');
  extra('batch-park',1,['we are (?:in|at) different places','we are not at the same (?:gate|entrance|place)']);
  primary(park,3,'Я не могу там пройти.','I can’t go that way.');
  extra('batch-park',3,['i cannot (?:go|walk|get through) that way','that way is closed']);
  park.turns[3].en='OK. Go right.';park.turns[3].ru='Хорошо. Иди направо.';
  park.turns[4].en='Oh. Then go past the cafe and turn left.';park.turns[4].ru='Тогда пройди мимо кафе и поверни налево.';
  primary(park,9,'Давай под тем деревом. Там не так жарко.','Let’s sit under that tree. It’s not so hot there.');
  extra('batch-park',9,['(?:let us sit )?under (?:that|the) tree it is not (?:so|as) hot(?: there)?','let us sit under (?:that|the) tree out of the sun','(?:how about )?under (?:that|the) tree it is shady(?: there)?']);
  extra('batch-shoes',3,['(?:they|these) are (?:a little |a bit )?too snug']);
  extra('batch-shoes',4,['(?:have you got|do you have) the next size up','(?:can|could|may) i try (?:a|one) size (?:larger|bigger)','is there a (?:larger|bigger) size']);
  extra('batch-shoes',5,['(?:they|these) are (?:much|a lot) nicer to walk in']);
  extra('batch-shoes',7,['(?:that is |it is )?too much(?: for me)? (?:have you got|do you have|is there) a cheaper pair','(?:that is |it is )?too expensive(?: for me)? (?:can|could) you show me (?:something|anything) cheaper']);
  extra('batch-shoes',9,['no need i (?:have|have got) (?:a|my own) bag']);
  extra('batch-cat',1,['i (?:saw|spotted|have seen) (?:her|it|your cat|a cat like that) in the car park']);
  extra('batch-cat',2,['(?:it was )?(?:(?:about|around|roughly) )?(?:ten|10) minutes ago']);
  extra('batch-cat',6,['do not (?:chase|run after) (?:her|the cat) (?:she|it|the cat) is (?:scared|afraid|frightened)']);
  extra('batch-cat',7,['(?:no )?(?:it|the gate) is (?:closed|shut) now']);
  extra('batch-cat',8,['shall i hold (?:the bowl|it)']);
  extra('batch-park',4,['is (?:it|that|the lake) far away(?: from here)?']);
  extra('batch-park',5,['(?:good )?i (?:have|have got) a heavy bag']);
  extra('batch-park',7,['(?:but )?i cannot see you yet','i can see (?:it|the lake) but i cannot see you']);
  extra('batch-park',8,['found you i will be right there','i (?:can see|see) you(?: now)? i am on my way(?: over)?']);
  shoes.turns[2].assessment.errors[0].fragmentPattern='chair|seat';
  extra('batch-shoes',0,['i am after a (?:comfortable|comfy) pair of (?:walking shoes|shoes for walking|shoes to walk in)']);
  extra('batch-shoes',9,['no (?:thanks|thank you) i (?:brought|have brought) (?:a|my own) bag','no (?:thanks|thank you) i (?:have|have got) (?:a|my own|my) bag(?: with me)?']);
  const crossReviewCases={"shoes":[["I'm looking for comfortable walking shoes","I need some comfy shoes to walk in","I’m after a comfortable pair of walking shoes"],["I normally take size eight","I usually wear an 8","Usually size 8"],["Can I sit down somewhere","Is there a seat I can use","Could I sit somewhere"],["These feel too tight","They're too small for me","They’re a little too snug"],["Have you got the next size up","Could I try a size larger","Is there a larger size"],["These feel a lot better","These are much nicer to walk in","This pair is a lot more comfortable"],["Black would match my jacket","The black pair goes with my jacket","The black ones match my coat"],["That's too much. Have you got a cheaper pair","That is too expensive for me. Is there anything cheaper","Too expensive. Can you show me something cheaper"],["They feel good too. I’ll buy these","These are comfortable as well. I’ll get them","This pair feels good too. I’ll take it"],["No thanks I brought my own bag","No I’ve got my bag with me","No need I have a bag"]],"cat":[["What colour is your cat","What does she look like","What color is it"],["I saw it in the parking lot","She was in the parking lot when I saw her","I spotted her in the car park"],["Ten minutes back","It was about ten minutes ago","Roughly ten minutes ago"],["There under that blue car","Under the blue car over there","Over there beneath the blue car"],["I’ll get some food","Let me get some food","I’m going to bring some food"],["I’ve got a little fish at home","There’s some fish at my place","Yes I have a bit of fish at home"],["Don’t chase her. She’s frightened","Don’t run after the cat. It’s scared","She’s scared. Don’t chase her"],["No I’ve shut the gate","No the gate is closed now","I already closed the gate"],["I can hold the bowl","Shall I hold the bowl","I’ll hold the bowl for you"],["Remember to shut the window","Make sure you close the window","Do not forget to shut the window"]],"park":[["At the red gate","I’m next to the red gate","By the red gate"],["We’re not at the same gate","We’re at different gates","We’re at two different entrances"],["I’d rather walk to the lake","I’ll walk over to the lake instead","I’ll come to you by the lake"],["The path is closed","This path is shut","That way is closed"],["How far away is it","Is it a long way from here","Is it far away"],["Good I’ve got a heavy bag","That’s good my bag is heavy","Good my bag’s quite heavy"],["Our picnic food","Some food for the picnic","I’ve got food for our picnic"],["Yes but I cannot see you yet","I see the lake but not you","Yeah I can see it but I can’t see you"],["Found you I’ll be right there","I see you now I’m on my way","There you are I’m coming over"],["How about under that tree it’s shady","Let’s sit under that tree out of the sun","We can sit under that tree in the shade"]]};
  for(const [topic,turns] of Object.entries(crossReviewCases))for(const [i,values]of turns.entries())root.DIALOGUES.find(d=>d.id==='batch-'+topic).turns[i].assessment.cases.correct.push(...values);
})(typeof window!=='undefined'?window:globalThis);
