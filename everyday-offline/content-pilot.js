/* Two distinct, fully authored pilot stories. Examples are a display shortlist,
 * not the grammar's exhaustive list of accepted whole sentences. */
(function(root){
  'use strict';
  root.APP_VERSION='0.5';
  const make=(en,ru,task,best,natural,assessment,stage='')=>({en,ru,task,best,natural:[best,...natural],acceptable:[],rules:[],stage,assessment:{...assessment,example:best}});
  root.DIALOGUES.push({
    id:'pilot-friend-evening',level:'A1',topic:'visiting',topicLabel:'В гостях · пилот',length:'long',checking:'construction',
    title:'Вечер у друга',speaker:'Друг',tone:'Неформально, спокойно: вы знакомы и вместе готовите стол',
    context:'Ты пришел к другу на ужин. Сначала выбираешь воду и помогаешь накрыть стол на двоих. После ужина вы решаете посмотреть телевизор. Отвечай естественно; сложные правильные формулировки тоже принимаются.',
    turns:[
      make('Would you like some water?','Хочешь воды?','Да, дайте мне воду, пожалуйста.','Yes, some water, please.',[
        'Yes, please.','Yeah, water would be great, thanks.','Can I have some water, please?',
        'Could you bring me some water, please?','Water, please.','I’d like some water, please.',
        'Could I get a glass of water?','Yes, water, thanks.','Sure, thank you.',
        'I would love some water.','Could you get me a water, please?','I was wondering if I could have some water.',
        'Would you mind bringing me some water?','Would it be possible to have some water?'
      ],{kind:'object',noun:'water',objectLabel:'вода',register:'close',allowYes:true}),
      make('In a glass or a bottle?','В стакане или в бутылке?','В стакане, пожалуйста.','In a glass, please.',[
        'A glass, please.','A glass would be great.','In a glass, thanks.','I’d like a glass, please.',
        'Can I have it in a glass?','A glass of water, please.','I’ll have a glass.','Glass, please.',
        'A glass is fine, thanks.','In a glass would be nice.','Could I have it in a glass, please?'
      ],{kind:'object',noun:'glass',objectLabel:'стакан, не бутылка',register:'close',aliases:['in a glass','a glass would be great','a glass is fine','in a glass would be nice','can i have it in a glass','could i have it in a glass']}),
      make('How much water?','Сколько воды?','Немного, пожалуйста.','Just a little, please.',[
        'A little, please.','Not much, thanks.','Just a bit, please.','A little water, please.',
        'Just a little bit.','A bit of water, thanks.','Only a little, please.',
        'I’d like a little water.','Could I have a little water, please?','A small amount, please.'
      ],{kind:'small',objectLabel:'небольшое количество воды',register:'close',aliases:['only a little','just a little bit','a small amount']}),
      make('Do you want ice in it?','Добавить лед?','Нет, без льда, пожалуйста.','No ice, please.',[
        'No, thanks.','Without ice, please.','No ice for me, thanks.','No, thank you.',
        'I don’t want any ice, thanks.','I’d prefer it without ice.','Could I have it without ice?',
        'I’d rather have no ice.','Just the water, no ice.','No, leave out the ice, please.'
      ],{kind:'no-ice',aliases:['i would prefer it without ice','just the water no ice','no leave out the ice','i do not want any ice','could i have it without ice']}),
      make('We can eat here. What do you need for the table?','Можем поесть здесь. Что тебе нужно для стола?','Две тарелки, пожалуйста.','Two plates, please.',[
        'Can I have two plates?','Could you bring me two plates?','A couple of plates, please.',
        'We need two plates.','Two plates would be great.','Could I get a pair of plates?',
        'I’d like two plates, please.','Can you pass me two plates?','Two, please.',
        'Would you mind getting me two plates?','I was wondering if you could give me two plates.'
      ],{kind:'object',noun:'plate',quantity:2,objectLabel:'две тарелки',register:'close',aliases:['two','2','two plates would be great']}),
      make('Here are the plates. Anything else?','Вот тарелки. Что-нибудь еще?','Можно нож, пожалуйста?','Can I have a knife, please?',[
        'A knife, please.','Could you pass me a knife?','I need a knife, please.','A knife would be great.',
        'Could I get a knife?','Would you mind passing me a knife?','Can you give me a knife?',
        'Knife, please.','Please pass me a knife.','I was wondering if I could have a knife.'
      ],{kind:'object',noun:'knife',quantity:1,objectLabel:'один нож',register:'close',aliases:['a knife would be great']}),
      make('Where shall I put your plate?','Куда поставить твою тарелку?','На стол, пожалуйста.','On the table, please.',[
        'On the table.','Put it on the table, please.','You can put it on the table.',
        'On this table, please.','Please put my plate on the table.','Onto the table, please.',
        'I’d like it on the table.','Right on the table, please.','On that table, thanks.'
      ],{kind:'location',aliases:['right on the table']}),
      make('What do you want to do after dinner?','Чем хочешь заняться после ужина?','Я хочу посмотреть телевизор.','I want to watch TV.',[
        'I’d like to watch TV.','Let’s watch TV.','How about watching some TV?',
        'I feel like watching TV.','I’d love to watch television.','Can we watch TV?',
        'I’m in the mood for watching TV.','I would enjoy watching television.',
        'What about watching TV for a while?','I’d like to watch a bit of TV.'
      ],{kind:'tv',aliases:['i would like to watch a bit of tv']},'После ужина вы убрали посуду и выбираете занятие на вечер.'),
      make('There’s a film at eight. Is eight OK?','В восемь фильм. Восемь подойдет?','Да, отлично.','Yes, that’s great.',[
        'Eight is fine.','That works for me.','Sounds good.','Perfect.','Yeah, that’s fine.',
        'Eight would be great.','Sure, that sounds good.','That’s absolutely fine.',
        'Eight o’clock is fine with me.','Yes, eight is good.','Great, eight works for me.'
      ],{kind:'yes',aliases:['eight o clock is fine with me','eight works for me','great eight works for me','eight is good']}),
      make('Ready to start the film?','Готов включать фильм?','Да, я готов.','Yes, I’m ready.',[
        'I’m ready.','Ready.','All set.','Yes, ready to start.','I’m all set.',
        'Let’s start.','We can start.','Yeah, I’m ready now.','Yes, I’m ready to go.',
        'Let’s begin.','I’m ready when you are.'
      ],{kind:'ready',aliases:['i am ready when you are']})
    ],ending:{en:'Great. I’ll turn it on.',ru:'Отлично. Сейчас включу.'}
  },{
    id:'pilot-library',level:'A1',topic:'library',topicLabel:'Библиотека · пилот',length:'long',checking:'construction',
    title:'Книга и место у окна',speaker:'Библиотекарь',tone:'Нейтрально и вежливо, обращение к незнакомому сотруднику',
    context:'Тебя зовут Анна (Anna). Ты хочешь взять одну книгу для изучения английского на две недели, вернуть во вторник, а сегодня немного почитать в библиотеке. Пакет у тебя свой.',
    turns:[
      make('Hello! How can I help you?','Здравствуйте! Чем помочь?','Мне нужна книга для изучения английского.','I need an English textbook.',[
        'Can I have an English textbook, please?','I’d like a book for learning English.',
        'An English textbook, please.','Could I borrow an English textbook?',
        'I’m looking for an English textbook.','Do you have a book for learning English?',
        'Would you mind getting me an English textbook?','I was wondering if I could borrow an English textbook.',
        'Could you help me find an English textbook?','I’d like to borrow an English textbook.'
      ],{kind:'object',noun:'textbook',quantity:1,objectLabel:'одна книга для изучения английского',register:'service',aliases:['i am looking for an english textbook','do you have a book for learning english','could you help me find an english textbook','i would like to borrow an english textbook']}),
      make('Is it for you or for your child?','Для вас или для вашего ребенка?','Для меня.','For me.',[
        'It’s for me.','For myself.','The book is for me.','I need it for myself.',
        'For my own use.','It’s for my own use.','For me, thanks.','For myself, please.',
        'It’s for me, thank you.'
      ],{kind:'beneficiary',aliases:['for my own use']}),
      make('How many books would you like?','Сколько книг вы хотите?', 'Одну, пожалуйста.','One, please.',[
        'Just one.','One book, please.','Only one, thanks.','A book, please.','I’d like one book.',
        'One textbook, please.','Just one book.','One for me, thanks.','I only need one.'
      ],{kind:'one',aliases:['only one','i would like one book','i only need one']}),
      make('What’s your name?','Как вас зовут?','Меня зовут Анна.','My name is Anna.',[
        'I’m Anna.','Anna.','It’s Anna.','The name is Anna.','You can call me Anna.',
        'I’m called Anna.','Anna is my name.','People call me Anna.'
      ],{kind:'name'}),
      make('Can you spell that, please?','Продиктуйте по буквам, пожалуйста.','A-N-N-A.','A-N-N-A.',[
        'A double N A.','It’s A-N-N-A.','Anna. A-N-N-A.','Sure, A-N-N-A.',
        'A, N, N, A.','Yes, A-N-N-A.'
      ],{kind:'spelling'}),
      make('How long would you like to keep it?','На какой срок хотите взять книгу?','На две недели.','For two weeks.',[
        'Two weeks, please.','For a fortnight.','Fourteen days.','I need it for two weeks.',
        'Could I keep it for two weeks?','Can I borrow it for two weeks?',
        'I’d like it for two weeks.','A fortnight, please.','For fourteen days.'
      ],{kind:'duration',aliases:['could i keep it for two weeks']}),
      make('You can return it on Monday or Tuesday. Which day works for you?','Можно вернуть в понедельник или вторник. Какой день вам подходит?','Во вторник.','On Tuesday.',[
        'Tuesday, please.','I’ll bring it back on Tuesday.','I can return it on Tuesday.',
        'Tuesday is fine.','I’ll come back Tuesday.','I’ll return it Tuesday.',
        'I can bring it back on Tuesday.','Tuesday would be good.'
      ],{kind:'day'}),
      make('Would you like a bag for the book?','Нужен пакет для книги?','Нет, спасибо. У меня свой.','No, thanks. I have my own bag.',[
        'No, I’ve got my own bag.','No, thank you.','I have my own bag, thanks.',
        'No bag, thanks.','No, I brought my own.','I’ve got a bag with me, thanks.',
        'I don’t need one, thanks.','No, I have one.','No thanks, I’m all set.'
      ],{kind:'bag',aliases:['no i brought my own','i have got a bag with me','no i am all set']}),
      make('Anything else I can help with?','Еще чем-нибудь помочь?','Где можно сесть?','Where can I sit?',[
        'Where could I sit?','Is there somewhere I can sit?','Where can I have a seat?',
        'Can I sit down somewhere?','Where are the seats?','Where is the seating area?',
        'Where would you like me to sit?','Is there a place where I can sit?',
        'Where can I sit down?','Could you tell me where I can sit?'
      ],{kind:'seat-question',aliases:['where can i have a seat','can i sit down somewhere','could you tell me where i can sit']}),
      make('There’s a free seat by the window. Is that OK?','У окна свободное место. Подойдет?','Да, отлично, спасибо.','Yes, that’s great. Thank you.',[
        'That’s perfect, thanks.','Perfect, thank you.','Yes, that’s fine.',
        'That works for me, thanks.','Sure, thank you.','Great, thanks.',
        'Lovely, thank you.','That sounds good, thanks.','Yes, absolutely. Thanks.',
        'That would be great, thank you.'
      ],{kind:'yes'})
    ],ending:{en:'Enjoy your book!',ru:'Приятного чтения!'}
  });
  for(const d of root.DIALOGUES.filter(d=>d.checking==='construction'))for(const turn of d.turns){
    const seen=new Set();turn.natural=turn.natural.filter(s=>{const k=root.StructuredAssessment.normalize(s);if(seen.has(k))return false;seen.add(k);return true;});
  }
})(typeof window!=='undefined'?window:globalThis);

// A1 display examples are deliberately separate from higher-level input recognition.
(function(root){
  const lists={
    'pilot-friend-evening':[
      ['Yes, please.','Water, please.','Some water, please.','Can I have some water, please?','I’d like some water.','Yes, water, thanks.','A glass of water, please.','Please give me some water.'],
      ['A glass, please.','In a glass, thanks.','Can I have it in a glass?','A glass of water, please.','Glass, please.','The glass, please.'],
      ['A little, please.','Not much, thanks.','A little water, please.','Just a bit, please.','A bit of water, thanks.'],
      ['No, thanks.','No, thank you.','Without ice, please.','No ice for me, thanks.','I don’t want any ice.','Please do not add ice.'],
      ['Can I have two plates?','Two, please.','We need two plates.','Please pass me two plates.','Can you give me two plates?'],
      ['A knife, please.','Can you pass me a knife?','I need a knife, please.','Please give me a knife.','The knife, please.'],
      ['On the table.','Put it on the table, please.','You can put it on the table.','On this table, please.'],
      ['I’d like to watch TV.','Let’s watch TV.','Can we watch TV?','I want to watch television.','Let’s watch some TV.'],
      ['Eight is fine.','Perfect.','Yes, that’s fine.','Great.','That’s good.','Yes, please.','That works for me.'],
      ['I’m ready.','Ready.','Yes, ready to start.','Let’s start.','We can start.','I’m ready now.']
    ],
    'pilot-library':[
      ['An English textbook, please.','I’d like an English textbook.','Can I have an English textbook?','Can I borrow an English textbook?','I’m looking for an English textbook.'],
      ['It’s for me.','The book is for me.','For myself.','For me, thanks.'],
      ['Just one.','One book, please.','A book, please.','One textbook, please.','I only need one.'],
      ['I’m Anna.','Anna.','It’s Anna.','The name is Anna.'],
      ['A double N A.','It’s A-N-N-A.','Anna. A-N-N-A.','A N N A.'],
      ['Two weeks, please.','Fourteen days.','I need it for two weeks.','Can I keep it for two weeks?','For fourteen days.'],
      ['Tuesday, please.','I’ll bring it back on Tuesday.','I’ll return it Tuesday.','Tuesday is fine.','I can return it on Tuesday.'],
      ['No, thank you.','I have my own bag, thanks.','No bag, thanks.','No, I have one.','I don’t need a bag.'],
      ['Where can I sit down?','Can I sit down somewhere?','Where are the seats?','Where can I have a seat?'],
      ['That’s perfect, thanks.','Perfect, thank you.','Yes, that’s fine.','Great, thanks.','Sure, thank you.']
    ]
  };
  for(const [id,examples] of Object.entries(lists)){const d=root.DIALOGUES.find(d=>d.id===id);d.turns.forEach((t,i)=>{t.displayExamples=examples[i];});}
})(typeof window!=='undefined'?window:globalThis);
