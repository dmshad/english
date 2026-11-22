/* Авторские диалоги. Варианты оцениваются по смыслу в ситуации, а не дословности. */
(function (root) {
  'use strict';
  root.CONTENT_REVISION = 2;
  const turn = (en, ru, task, best, natural = [], acceptable = [], rules = [], stage = '') => {
    const variants = [best, ...natural];
    const scopedRules = new Set(rules);
    // Enable these constructions only when an authored natural answer uses them.
    if (variants.some(text => /\b(?:i|we)(?:['’]d| would) like\b/i.test(text))) scopedRules.add('would-like');
    if (variants.some(text => /^can (?:i|we) have\b/i.test(text))) scopedRules.add('get-have');
    return {en, ru, task, best, natural: variants, acceptable, rules: [...scopedRules], stage};
  };
  root.OfflineContent = {turn};
  root.DIALOGUES = [
    {
      id: 'coffee-to-go', level: 'A1', topic: 'cafe', topicLabel: 'Кафе', length: 'short',
      title: 'Кофе по пути', tone: 'Неформально, вежливо', speaker: 'Бариста',
      context: 'Ты заходишь в небольшую кофейню по дороге на работу. Берешь маленький черный кофе с собой и платишь картой.',
      turns: [
        turn('Hi! What can I get you?', 'Привет! Что тебе приготовить?', 'Маленький кофе с собой, пожалуйста.',
          'A small coffee to go, please.', [
            'Can I have a small coffee to go, please?', 'A small coffee to go.',
            'I’d like a small coffee to go, please.', 'I’d like a small coffee to go.',
            'Can I have a small coffee to go?', 'I’ll have a small coffee to go, please.',
            'I’ll have a small coffee to go.', 'Just a small coffee to go, please.',
            'One small coffee to go, please.'
          ], [{text: 'I want a small coffee to go, please.', note: 'Смысл понятен, но I want звучит прямолинейно при заказе. Обычно называют заказ или говорят Can I have…?'}], ['get-have', 'id-like']),
        turn('Any milk?', 'Молоко добавить?', 'Без молока, спасибо.', 'No milk, thanks.', [
          'No milk, thank you.', 'No, thanks.', 'No, thank you.', 'Black, please.',
          'Just black, thanks.', 'Just black, please.', 'Black, thanks.', 'Black, thank you.',
          'No, black, please.', 'No, just black, thanks.', 'Without milk, please.',
          'No milk, please.', 'Just coffee, thanks.', 'No, no milk, thanks.'
        ]),
        turn('That’s three dollars. Cash or card?', 'Три доллара. Наличными или картой?', 'Картой, пожалуйста.', 'Card, please.', [
          'By card, please.', 'Card, thanks.', 'By card, thanks.', 'I’ll pay by card.',
          'I’ll pay by card, please.', 'I’m paying by card.', 'With a card, please.',
          'With my card, please.', 'I’ll use my card.'
        ]),
        turn('Here’s your coffee. Have a good day!', 'Вот твой кофе. Хорошего дня!', 'Спасибо, и вам!', 'Thanks, you too!', [
          'Thank you, you too!', 'You too, thanks!', 'You too, thank you!',
          'Thanks! Have a good day too!', 'Thank you! Have a good day too!',
          'Thanks! Have a good one!', 'You too! Have a good day!', 'You too!',
          'Thanks. You have a good day too.'
        ])
      ], ending: {en: 'Bye!', ru: 'Пока!'}
    },
    {
      id: 'window-table', level: 'A1', topic: 'cafe', topicLabel: 'Кафе', length: 'short',
      title: 'Место у окна', tone: 'Спокойно, вежливо', speaker: 'Сотрудник кафе',
      context: 'Вы с другом пришли в кафе. Сотрудник помогает выбрать столик. Вы хотите спокойно посмотреть меню.',
      turns: [
        turn('Hi! Can I help you?', 'Здравствуйте! Чем помочь?', 'Столик на двоих, пожалуйста.', 'A table for two, please.', [
          'A table for two.', 'Can we have a table for two, please?', 'Can we have a table for two?',
          'We’d like a table for two, please.', 'We’d like a table for two.',
          'Table for two, please.', 'Two, please.', 'For two, please.',
          'Hi, a table for two, please.', 'Hi! There are two of us.'
        ]),
        turn('Is this table by the window OK?', 'Этот столик у окна подойдет?', 'Да, отлично. Спасибо.', 'Yes, that’s great. Thanks.', [
          'Yes, that’s great. Thank you.', 'That’s great, thanks.', 'Yes, perfect. Thank you.',
          'Perfect, thanks.', 'Yes, it’s perfect. Thanks.', 'Yes, great. Thanks.',
          'That’s perfect, thank you.', 'That’s fine, thanks.', 'Yes, that’s fine.',
          'Yes, thanks.', 'Yes, thank you.', 'Looks good, thanks.', 'Great, thank you.',
          'This is great, thanks.', 'This is perfect.', 'Yes, please.', 'Sure, thanks.',
          'Yes, this table is fine.', 'We’d like this table, thanks.'
        ]),
        turn('Here are your menus. Anything to drink?', 'Вот ваши меню. Что-нибудь попить?', 'Воду, пожалуйста.', 'Water, please.', [
          'Some water, please.', 'Can we have some water, please?', 'Can I have some water, please?',
          'Just water, please.', 'Water for us, please.', 'We’d like some water, please.',
          'Water would be great, thanks.', 'Water, thanks.', 'Can we have water, please?'
        ]),
        turn('Sure. Would you like a minute with the menus?', 'Конечно. Дать вам минутку посмотреть меню?', 'Да, спасибо.', 'Yes, please.', [
          'Yes, thanks.', 'Yes, thank you.', 'Yes, please. Thank you.', 'Yes, please. Thanks.',
          'A minute, please.', 'Just a minute, please.', 'A minute would be great, thanks.',
          'That would be great, thanks.', 'That would be great, thank you.',
          'That’s great, thanks.', 'Thanks, we need a minute.', 'We need a minute, please.',
          'Yes, we need a minute.', 'Sure, thanks.',
          'Yes, a minute, please.', 'Just a minute, thanks.', 'Thank you, yes.'
        ])
      ], ending: {en: 'Of course. I’ll be back in a minute.', ru: 'Конечно. Вернусь через минутку.'}
    },
    {
      id: 'no-tea', level: 'A1', topic: 'cafe', topicLabel: 'Кафе', length: 'medium',
      title: 'Чая сегодня нет', tone: 'Обычный разговор у стойки', speaker: 'Бариста',
      context: 'Ты уже попросил чай, но его нет. Выбираешь другой напиток и остаешься в кафе. Нужно еще взять ложку и найти место.',
      turns: [
        turn('Sorry, we don’t have any tea today.', 'Извините, сегодня у нас нет чая.', 'Тогда кофе, пожалуйста.', 'A coffee, then, please.', [
          'Coffee, then, please.', 'Then a coffee, please.', 'A coffee, please.', 'Coffee, please.',
          'Can I have a coffee, then?', 'I’ll have a coffee, then.', 'I’ll have coffee, then.',
          'OK, a coffee, please.', 'Coffee is fine, thanks.', 'A coffee is fine.',
          'Then I’ll have a coffee, please.', 'I’d like a coffee, then, please.'
        ], [], ['get-have', 'id-like']),
        turn('Small or large?', 'Маленький или большой?', 'Маленький, пожалуйста.', 'Small, please.', [
          'A small one, please.', 'A small coffee, please.', 'Small.', 'A small one.',
          'Small, thanks.', 'A small one, thanks.', 'Just a small one, please.',
          'I’ll have a small one.', 'The small one, please.', 'A small coffee, thanks.'
        ]),
        turn('With milk?', 'С молоком?', 'Да, немного молока, пожалуйста.', 'Yes, a little milk, please.', [
          'A little milk, please.', 'Yes, just a little, please.', 'Just a little, please.',
          'Yes, a little, please.', 'Just a little milk, please.', 'A little, thanks.',
          'Yes, just a little milk.', 'A little milk, thanks.', 'Just a little, thanks.',
          'Yes, a little milk, thanks.', 'With a little milk, please.'
        ]),
        turn('To go?', 'С собой?', 'Нет, я буду пить здесь.', 'No, for here, please.', [
          'No, for here.', 'For here, please.', 'I’m staying here.', 'No, I’m staying here.',
          'For here, thanks.', 'No, I’ll have it here.', 'I’ll have it here, please.',
          'Here, please.', 'No, here, please.', 'I’m having it here.', 'No, I’m having it here.'
        ]),
        turn('Do you need a spoon?', 'Нужна ложка?', 'Да, пожалуйста.', 'Yes, please.', [
          'Yes, thanks.', 'Yes, thank you.', 'Yes, please. Thanks.', 'Yes, please. Thank you.',
          'A spoon, please.', 'Can I have a spoon, please?', 'I’d like a spoon, please.',
          'That would be great, thanks.', 'That would be nice, thank you.',
          'Sure, thank you.', 'Yes, I need a spoon, please.',
          'Yes, a spoon, please.', 'A spoon would be great, thanks.'
        ], [], ['get-have', 'id-like']),
        turn('Here you go. Your coffee is ready.', 'Вот, держи. Кофе готов.', 'Спасибо. Где можно сесть?', 'Thanks. Where can I sit?', [
          'Thank you. Where can I sit?', 'Thanks. Where can I have a seat?',
          'Where can I sit, please?', 'Where can I sit?', 'Thanks. Where can I sit down?',
          'Thank you. Where can I sit down?', 'Where can I have a seat?'
        ])
      ], ending: {en: 'Any free table is fine.', ru: 'Можно за любой свободный столик.'}
    },
    {
      id: 'wrong-drink', level: 'A1', topic: 'cafe', topicLabel: 'Кафе', length: 'medium',
      title: 'Это не мой напиток', tone: 'Вежливо исправить ошибку', speaker: 'Официант',
      context: 'Ты заказал кофе без молока. Официант приносит чай. Нужно спокойно объяснить ошибку, а после кофе заплатить наличными.',
      turns: [
        turn('Here’s your tea.', 'Вот ваш чай.', 'Извините, я заказывал кофе.', 'Sorry, I ordered coffee.', [
          'Sorry, I ordered a coffee.', 'Excuse me, I ordered coffee.', 'Excuse me, I ordered a coffee.',
          'A coffee for me, please.', 'Coffee for me, please.', 'Sorry, coffee for me.',
          'Sorry, a coffee for me.', 'Sorry, coffee, not tea.', 'Sorry, a coffee, not tea.',
          'I ordered coffee, not tea.', 'Sorry, I’d like coffee, not tea.'
        ], [], ['id-like']),
        turn('Oh, sorry! Coffee with milk?', 'Ой, извините! Кофе с молоком?', 'Нет, без молока, пожалуйста.', 'No, without milk, please.', [
          'No, no milk, please.', 'No milk, please.', 'Without milk, please.', 'No, black, please.',
          'Black, please.', 'Just black, please.', 'No, just black.', 'No milk, thanks.',
          'No, thanks. Just black.', 'No, thank you. Black, please.', 'Black coffee, please.',
          'No, I’d like it black, please.', 'No, just coffee, please.'
        ], [], ['id-like']),
        turn('Here’s your coffee. Sorry about that.', 'Вот ваш кофе. Извините за ошибку.', 'Ничего страшного. Спасибо.', 'That’s OK. Thanks.', [
          'That’s OK. Thank you.', 'It’s OK. Thanks.', 'It’s OK. Thank you.',
          'No problem. Thanks.', 'No problem. Thank you.', 'No worries. Thanks.',
          'No worries. Thank you.', 'That’s all right. Thanks.', 'That’s alright, thanks.',
          'It’s all right, thanks.', 'It’s fine, thanks.', 'That’s fine, thank you.',
          'All good, thanks.', 'You’re fine, thanks.', 'Don’t worry. Thank you.',
          'No problem at all. Thanks.', 'That’s not a problem, thanks.', 'Thanks, it’s OK.'
        ]),
        turn('Anything else?', 'Что-нибудь еще?', 'Нет, это всё, спасибо.', 'No, that’s all, thanks.', [
          'No, that’s all, thank you.', 'That’s all, thanks.', 'That’s all, thank you.',
          'No, thanks. That’s all.', 'No, thank you. That’s all.', 'No, thanks.', 'No, thank you.',
          'Nothing else, thanks.', 'Nothing else, thank you.', 'I’m good, thanks.',
          'I’m all set, thanks.', 'That’s everything, thanks.', 'No, I’m good, thank you.',
          'No, I’m all set, thanks.', 'Just the coffee, thanks.', 'Just this, thanks.'
        ]),
        turn('Here’s your bill.', 'Вот ваш счет.', 'Можно заплатить здесь?', 'Can I pay here?', [
          'Do I pay here?', 'Can I pay you?', 'Can I pay here, please?',
          'Do I pay you?', 'Can I pay at the table?', 'Can I pay right here?'
        ], [], [], 'Ты допиваешь кофе. Официант подходит со счетом.'),
        turn('Yes. Cash or card?', 'Да. Наличными или картой?', 'Наличными, пожалуйста.', 'Cash, please.', [
          'Cash, thanks.', 'In cash, please.', 'I’ll pay cash.', 'I’ll pay in cash.',
          'I’m paying cash.', 'I’m paying in cash.', 'In cash, thanks.', 'Cash.',
          'I’ll pay with cash.'
        ])
      ], ending: {en: 'Here’s your change. Thank you!', ru: 'Вот ваша сдача. Спасибо!'}
    },
    {
      id: 'breakfast', level: 'A1', topic: 'cafe', topicLabel: 'Кафе', length: 'long',
      title: 'Завтрак без спешки', tone: 'Дружелюбно, без церемоний', speaker: 'Сотрудник кафе',
      context: 'Утро, ты один в небольшом кафе. Садишься за столик, заказываешь завтрак, потом сок. В конце уточняешь сумму и платишь картой.',
      turns: [
        turn('Morning! Can I help you?', 'Доброе утро! Чем помочь?', 'Этот столик свободен?', 'Is this table free?', [
          'Can I sit here?', 'Is it OK to sit here?', 'Is this table taken?',
          'Is anyone sitting here?', 'Can I have this table?', 'Is this table free, please?'
        ]),
        turn('Yes, it is. Have a seat.', 'Да, свободен. Присаживайся.', 'Можно меню, пожалуйста?', 'Can I have a menu, please?', [
          'A menu, please.', 'Can I see the menu, please?', 'Can I have the menu, please?',
          'Can I see a menu, please?', 'Can I have a menu?', 'Can I see the menu?',
          'The menu, please.', 'I’d like a menu, please.', 'Can you bring me a menu, please?',
          'Do you have a menu?'
        ], [], ['get-have', 'id-like']),
        turn('Here you go. What would you like?', 'Вот, держи. Что будешь?', 'Яйца и тост, пожалуйста.', 'Eggs and toast, please.', [
          'Can I have eggs and toast, please?', 'I’d like eggs and toast, please.', 'Eggs and toast.',
          'I’ll have eggs and toast, please.', 'I’ll have eggs and toast.',
          'Can I have eggs and toast?', 'I’d like eggs and toast.', 'Just eggs and toast, please.'
        ], [], ['get-have', 'id-like']),
        turn('And something to drink?', 'А попить что-нибудь?', 'Только воду, спасибо.', 'Just water, thanks.', [
          'Just water, thank you.', 'Water, please.', 'Just water, please.', 'Some water, please.',
          'Just some water, thanks.', 'Only water, please.', 'Water is fine, thanks.',
          'Just a glass of water, please.', 'A glass of water, thanks.',
          'I’ll just have water, thanks.', 'Can I have some water, please?'
        ], [], ['get-have']),
        turn('Here’s your breakfast. Anything else?', 'Вот твой завтрак. Что-нибудь еще?', 'Можно немного соли, пожалуйста?', 'Can I have some salt, please?', [
          'Some salt, please.', 'Can I have the salt, please?', 'Can you pass the salt, please?',
          'Can I have some salt?', 'Can you bring me some salt, please?', 'The salt, please.',
          'Do you have any salt?', 'A little salt, please.', 'Can you pass me the salt, please?'
        ], [], ['get-have']),
        turn('Sure. Is everything OK?', 'Конечно. Всё хорошо?', 'Да, очень вкусно. Спасибо.', 'Yes, it’s very good. Thanks.', [
          'Yes, it’s very good. Thank you.', 'It’s very good, thanks.', 'It’s great, thanks.',
          'Yes, it’s great, thank you.', 'It’s really good, thanks.', 'Very good, thank you.',
          'Really good, thanks.', 'Yes, very good, thanks.', 'The food is great, thanks.',
          'Everything is great, thank you.', 'It’s delicious, thanks.', 'Yes, delicious. Thank you.',
          'It’s lovely, thank you.'
        ]),
        turn('Would you like anything else?', 'Что-нибудь еще?', 'Да, яблочный сок, пожалуйста.', 'Yes, an apple juice, please.', [
          'Apple juice, please.', 'Yes, apple juice, please.', 'An apple juice, please.',
          'Can I have an apple juice, please?', 'Can I have some apple juice, please?',
          'A glass of apple juice, please.', 'I’d like an apple juice, please.',
          'I’ll have an apple juice, please.', 'Yes, a glass of apple juice, thanks.'
        ], [], ['get-have', 'id-like']),
        turn('All done?', 'Уже закончил?', 'Да. Можно счет, пожалуйста?', 'Yes. Can I have the check, please?', [
          'Yes, the check, please.', 'Can I have the check, please?', 'The check, please.',
          'Can I have the bill, please?', 'Yes, can I have the bill, please?', 'The bill, please.',
          'Can you bring me the check, please?', 'Can you bring me the bill, please?',
          'I’m done, thanks. Can I have the check?', 'Yes, I’d like the check, please.'
        ], [], ['get-have', 'id-like'], 'После завтрака и сока сотрудник подходит убрать посуду.'),
        turn('Here’s your check.', 'Вот твой счет.', 'Это десять долларов?', 'Is that ten dollars?', [
          'Is it ten dollars?', 'Ten dollars?', 'Is the total ten dollars?',
          'Is that ten?', 'Ten?', 'So, ten dollars?', 'Is it ten dollars in total?'
        ]),
        turn('Yes, ten dollars. You can pay here.', 'Да, десять долларов. Можно заплатить здесь.', 'Можно заплатить картой?', 'Can I pay by card?', [
          'Can I pay with a card?', 'Can I pay with my card?', 'Do you take cards?',
          'Do you accept cards?', 'Can I use my card?', 'Is card OK?', 'Is a card OK?',
          'Can I pay by card, please?', 'Can I use a card?', 'Is it OK to pay by card?',
          'Do you take credit cards?'
        ])
      ], ending: {en: 'Yes, of course. Thank you!', ru: 'Да, конечно. Спасибо!'}
    },
    {
      id: 'waiting-friend', level: 'A1', topic: 'cafe', topicLabel: 'Кафе', length: 'long',
      title: 'В ожидании друга', tone: 'Неформальная беседа в кафе', speaker: 'Официант',
      context: 'Ты пришел раньше друга. Сначала ждешь, затем заказываете два кофе и один кусочек торта на двоих. В кафе шумно. Позже просите воду и узнаете, где заплатить.',
      turns: [
        turn('Hi! Ready to order?', 'Привет! Готов сделать заказ?', 'Пока нет. Я жду друга.', 'Not yet. I’m waiting for a friend.', [
          'Not yet, I’m waiting for my friend.', 'I’m waiting for a friend.', 'I’m waiting for my friend.',
          'Not yet. Waiting for a friend.', 'Waiting for a friend.', 'Waiting for my friend.',
          'No, I’m waiting for a friend.', 'Not yet, thanks. I’m waiting for a friend.',
          'I’m still waiting for my friend.', 'Not yet, my friend isn’t here.',
          'My friend isn’t here yet.', 'Not yet, I’m waiting for someone.'
        ]),
        turn('No problem. Is your friend here now?', 'Без проблем. Твой друг уже здесь?', 'Да. Два кофе, пожалуйста.', 'Yes. Two coffees, please.', [
          'Yes, two coffees.', 'Yes. Can we have two coffees, please?', 'Yes. We’d like two coffees, please.',
          'Yes, we’ll have two coffees, please.', 'Two coffees, please.', 'Can we have two coffees, please?',
          'We’d like two coffees, please.', 'Yes, two coffees, thanks.', 'Two coffees for us, please.'
        ], [], [], 'Через несколько минут друг приходит и садится за стол.'),
        turn('Anything to eat?', 'Что-нибудь поесть?', 'Сколько стоит шоколадный торт?', 'How much is the chocolate cake?', [
          'How much is a slice of chocolate cake?', 'How much is the chocolate cake, please?',
          'How much does the chocolate cake cost?', 'How much for the chocolate cake?',
          'What’s the price of the chocolate cake?', 'How much is a piece of chocolate cake?',
          'How much for a slice of chocolate cake?', 'How much for a piece of chocolate cake?'
        ]),
        turn('It’s five dollars.', 'Пять долларов.', 'Извините, сколько?', 'Sorry, how much?', [
          'How much, sorry?', 'Sorry, how much is it?', 'How much?', 'Sorry?',
          'Sorry, can you say that again?', 'Can you say that again, please?',
          'Sorry, what was that?', 'Sorry, I didn’t hear you.', 'How much is it, sorry?',
          'Can you repeat that, please?', 'Sorry, can you repeat that?', 'What was that, sorry?',
          'Sorry, how much was that?', 'Sorry, say that again, please.'
        ]),
        turn('Five dollars.', 'Пять долларов.', 'Один кусочек, пожалуйста.', 'One slice, please.', [
          'A slice, please.', 'One piece, please.', 'A piece, please.', 'Can we have one slice, please?',
          'Just one slice, please.', 'Just one piece, please.', 'We’ll have one slice, please.',
          'One slice of chocolate cake, please.', 'Can we have a piece, please?',
          'We’d like one piece, please.', 'One, please.'
        ]),
        turn('Sure. Two coffees and one slice of cake.', 'Конечно. Два кофе и один кусочек торта.', 'И две вилки, пожалуйста.', 'And two forks, please.', [
          'Two forks, please.', 'And can we have two forks, please?', 'Can we have two forks, please?',
          'Can we get two forks, please?', 'We need two forks, please.', 'Two forks, thanks.',
          'And two forks, thanks.', 'Can you bring us two forks, please?',
          'We’d like two forks, please.', 'Two forks for the cake, please.'
        ]),
        turn('Here you go. Is the cake OK?', 'Вот ваш заказ. Как торт?', 'Да, очень вкусно.', 'Yes, it’s really good.', [
          'It’s really good.', 'Yes, very good.', 'Very good.', 'It’s great.', 'Yes, it’s great.',
          'Really good, thanks.', 'It’s very good, thanks.', 'Yes, it’s delicious.',
          'Delicious, thank you.', 'We love it.', 'It’s lovely.', 'It’s very nice.'
        ], [], [], 'Официант приносит заказ. Вы с другом пробуете торт.'),
        turn('Anything else for you two?', 'Вам двоим еще что-нибудь?', 'Можно немного воды, пожалуйста?', 'Can we have some water, please?', [
          'Some water, please.', 'Can I have some water, please?', 'Can we have water, please?',
          'Water, please.', 'Just some water, please.', 'We’d like some water, please.',
          'Can you bring us some water, please?', 'A little water, please.',
          'Some water would be great, thanks.'
        ]),
        turn('One glass or two?', 'Один стакан или два?', 'Два, пожалуйста.', 'Two, please.', [
          'Two glasses, please.', 'Two, thanks.', 'Two glasses, thanks.',
          'One for each of us, please.', 'Two would be great, thanks.',
          'We’d like two, please.', 'One each, please.', 'Two, thank you.'
        ]),
        turn('You can pay at the counter.', 'Можно заплатить у стойки.', 'Хорошо, спасибо.', 'OK, thanks.', [
          'OK, thank you.', 'Okay, thanks.', 'Okay, thank you.', 'All right, thanks.',
          'All right, thank you.', 'Alright, thanks.', 'Great, thanks.', 'Great, thank you.',
          'Perfect, thanks.', 'Sure, thanks.', 'Thanks!', 'Thank you!', 'OK, great. Thanks.',
          'Sounds good, thanks.', 'Thanks, OK.'
        ], [], [], 'Вы закончили и собираетесь уходить. Официант подсказывает, где оплатить заказ.')
      ], ending: {en: 'Thank you. See you!', ru: 'Спасибо. До встречи!'}
    }
  ];
})(typeof window !== 'undefined' ? window : globalThis);
