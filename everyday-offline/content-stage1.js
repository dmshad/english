/* Этап 01: самостоятельные авторские ситуации. Никакой генерации сюжетов шаблонами. */
(function (root) {
  'use strict';
  const {turn} = root.OfflineContent;
  root.DIALOGUES.push(
    {
      id:'bread-sliced', level:'A1', topic:'bakery', topicLabel:'Пекарня', length:'short',
      title:'Хлеб к завтраку', speaker:'Продавец', tone:'Обычная вежливая покупка',
      context:'Ты берешь один белый хлеб домой. Хочешь, чтобы его нарезали, но пакет у тебя свой.',
      turns:[
        turn('Morning! What would you like?', 'Доброе утро! Что будете?', 'Один белый хлеб, пожалуйста.', 'One white loaf, please.', [
          'A loaf of white bread, please.', 'White bread, please. One loaf.', 'One loaf of white bread, please.',
          'Can I have a loaf of white bread, please?', 'I’d like one white loaf, please.',
          'I’ll have a loaf of white bread, please.', 'Just one white loaf, please.'
        ]),
        turn('Would you like it sliced?', 'Нарезать?', 'Да, пожалуйста.', 'Yes, please.', [
          'Yes, thanks.', 'Yes, thank you.', 'Yes, please. Thanks.', 'Yes, please. Thank you.',
          'Sliced, please.', 'Yes, sliced, please.', 'Can you slice it, please?',
          'That would be great, thanks.', 'That would be nice, thank you.',
          'Please, yes.', 'Sure, thanks.', 'Yes, that’s great, thank you.'
        ]),
        turn('Do you need a bag?', 'Вам нужен пакет?', 'Нет, спасибо. У меня свой.', 'No, thanks. I have my own bag.', [
          'No, thank you. I have a bag.', 'No, I have my own bag, thanks.', 'I have my own bag, thanks.',
          'No bag, thanks. I have one.', 'No, thanks. I’ve got a bag.', 'I’ve got my own bag, thanks.',
          'No, thank you. I brought a bag.'
        ]),
        turn('That’s four dollars.', 'Четыре доллара.', 'Вот, пожалуйста.', 'Here you go.', [
          'Here you are.', 'Here’s four dollars.', 'Four dollars. Here you go.',
          'Here you go. Thanks.', 'Here you are. Thank you.'
        ])
      ], ending:{en:'Thank you! Enjoy your bread.',ru:'Спасибо! Приятного аппетита.'}
    },
    {
      id:'school-snacks', level:'A1', topic:'bakery', topicLabel:'Пекарня', length:'short',
      title:'Два отдельных пакета', speaker:'Продавец', tone:'Короткая бытовая просьба',
      context:'Ты покупаешь четыре булочки: по две для двух детей. Нужно положить их в два отдельных пакета.',
      turns:[
        turn('How many rolls would you like?', 'Сколько булочек вы хотите?', 'Четыре, пожалуйста.', 'Four, please.', [
          'Four rolls, please.', 'I’d like four, please.', 'Can I have four, please?', 'Just four, please.',
          'I’ll take four.', 'Four, thanks.', 'I’ll have four rolls, please.'
        ]),
        turn('All in one bag?', 'Все в один пакет?', 'Нет, в два пакета, пожалуйста.', 'No, two bags, please.', [
          'Two bags, please.', 'In two bags, please.', 'No, in two bags, please.',
          'Can I have two bags, please?', 'Can you put them in two bags, please?',
          'No, I need two bags, please.', 'Two separate bags, please.'
        ]),
        turn('Two rolls in each bag?', 'По две булочки в каждый пакет?', 'Да, именно. Спасибо.', 'Yes, that’s right. Thanks.', [
          'Yes, that’s right. Thank you.', 'That’s right, thanks.', 'Yes, please.', 'Yes, thanks.',
          'Exactly, thanks.', 'Yes, two in each, please.', 'Two in each bag, please.',
          'Perfect, thank you.', 'Yes, thank you.', 'That’s it, thanks.', 'Yes, exactly.'
        ]),
        turn('Anything else for the kids?', 'Что-нибудь еще для детей?', 'Нет, этого достаточно, спасибо.', 'No, that’s enough, thanks.', [
          'No, thanks. That’s enough.', 'That’s enough, thank you.', 'No, that’s all, thanks.',
          'No, thanks.', 'No, thank you.', 'Nothing else, thanks.', 'That’s all, thank you.',
          'We’re all set, thanks.', 'No, we’re good, thanks.', 'Just the rolls, thanks.'
        ])
      ], ending:{en:'Here are your two bags.',ru:'Вот ваши два пакета.'}
    },
    {
      id:'birthday-cake', level:'A1', topic:'bakery', topicLabel:'Пекарня', length:'short',
      title:'Торт для Сэма', speaker:'Продавец', tone:'Дружелюбный разговор у витрины',
      context:'Ты выбираешь маленький торт на шестой день рождения ребенка по имени Сэм. Нужно имя на торте и шесть свечей.',
      turns:[
        turn('Hi! What are you looking for?', 'Здравствуйте! Что вы ищете?', 'Маленький торт на день рождения, пожалуйста.', 'A small birthday cake, please.', [
          'I’m looking for a small birthday cake.', 'Can I have a small birthday cake, please?',
          'I’d like a small birthday cake, please.', 'I need a small birthday cake.',
          'A small cake for a birthday, please.', 'I’d like a small cake for a birthday.'
        ]),
        turn('This one is chocolate. Is that OK?', 'Этот шоколадный. Подойдет?', 'Да, отлично.', 'Yes, that’s great.', [
          'Yes, perfect.', 'That’s perfect.', 'Chocolate is great.', 'Yes, that’s fine.',
          'That one is great.', 'Yes, please.', 'That’s good, thanks.', 'Perfect, thanks.',
          'Yes, chocolate is fine.', 'I’ll take it.', 'That one, please.'
        ]),
        turn('What name would you like on it?', 'Какое имя написать на нем?', 'Сэм, пожалуйста.', 'Sam, please.', [
          'The name is Sam.', 'Sam.', 'Can you write Sam, please?', 'Please write Sam.',
          'Sam on the cake, please.', 'The name is Sam, please.'
        ]),
        turn('And how many candles?', 'И сколько свечей?', 'Шесть, пожалуйста.', 'Six, please.', [
          'Six candles, please.', 'Can I have six candles, please?', 'We need six candles.',
          'Six, thanks.', 'Just six, please.'
        ])
      ], ending:{en:'Of course. Happy birthday to Sam!',ru:'Конечно. С днем рождения Сэма!'}
    },
    {
      id:'hold-last-loaf', level:'A1', topic:'bakery', topicLabel:'Пекарня', length:'short',
      title:'Последний хлеб', speaker:'Сотрудник пекарни по телефону', tone:'Короткий телефонный разговор',
      context:'Ты звонишь в пекарню по пути домой. До нее пять минут. Хочешь забрать последний хлеб; тебя зовут Алекс.',
      turns:[
        turn('Hello, Green Street Bakery.', 'Здравствуйте, пекарня на Грин-стрит.', 'Здравствуйте. У вас еще есть хлеб?', 'Hi. Do you have any bread left?', [
          'Hello. Do you have any bread?', 'Hi, is there any bread left?', 'Do you still have bread?',
          'Hi, do you still have any bread?', 'Do you have any bread?', 'Is there any bread left?',
          'Hello, is there any bread?'
        ]),
        turn('Just one loaf.', 'Только один хлеб.', 'Можно оставить его для меня?', 'Can you keep it for me?', [
          'Can you save it for me?', 'Can you hold it for me?', 'Can you keep that loaf for me, please?',
          'Can you save that loaf for me, please?', 'Can you hold the loaf for me, please?',
          'Can you put it aside for me, please?'
        ]),
        turn('Yes, for fifteen minutes. Are you nearby?', 'Да, на пятнадцать минут. Вы близко?', 'Да, я буду через пять минут.', 'Yes, I’ll be there in five minutes.', [
          'I’ll be there in five minutes.', 'Yes, five minutes away.', 'I’m five minutes away.',
          'Yes, I’m five minutes away.', 'I’ll be there in five minutes, thanks.',
          'Five minutes. I’m nearby.'
        ]),
        turn('What’s your name?', 'Как вас зовут?', 'Алекс.', 'Alex.', [
          'I’m Alex.', 'My name is Alex.', 'It’s Alex.', 'The name is Alex.', 'Alex, thanks.'
        ])
      ], ending:{en:'OK, Alex. See you soon.',ru:'Хорошо, Алекс. До скорой встречи.'}
    },
    {
      id:'bakery-morning-pickup', level:'A1', topic:'bakery', topicLabel:'Пекарня', length:'medium',
      title:'Заказ на утро', speaker:'Сотрудник пекарни', tone:'Простая договоренность заранее',
      context:'Сегодня ты заказываешь шесть булочек для завтрашнего завтрака. Заберешь их в восемь утра. Заказ на имя Анна.',
      turns:[
        turn('Hi! What can I do for you?', 'Здравствуйте! Чем помочь?', 'Можно заказать шесть булочек на завтра?', 'Can I order six rolls for tomorrow?', [
          'I’d like six rolls for tomorrow, please.', 'Can I have six rolls for tomorrow?',
          'I’d like to order six rolls for tomorrow.', 'Six rolls for tomorrow, please.',
          'Can I order six bread rolls for tomorrow, please?', 'I need six rolls for tomorrow, please.'
        ]),
        turn('Sure. White or brown?', 'Конечно. Белые или из темной муки?', 'Белые, пожалуйста.', 'White, please.', [
          'White rolls, please.', 'White, thanks.', 'The white ones, please.',
          'I’d like white rolls, please.', 'White bread rolls, please.', 'All white, please.'
        ]),
        turn('What time will you pick them up?', 'Во сколько вы их заберете?', 'В восемь утра.', 'At eight in the morning.', [
          'At eight a.m.', 'Eight in the morning.', 'At 8 a.m.', 'At eight tomorrow morning.',
          'Tomorrow at eight in the morning.', 'I’ll pick them up at eight in the morning.',
          'Eight a.m., please.'
        ]),
        turn('What name is the order for?', 'На какое имя заказ?', 'Анна. Через две «н».', 'Anna, with two Ns.', [
          'Anna. A-N-N-A.', 'Anna, A N N A.', 'The name is Anna. A-N-N-A.',
          'It’s Anna, with two Ns.', 'Anna, double N.', 'My name is Anna. A-N-N-A.'
        ]),
        turn('Would you like to pay now or tomorrow?', 'Хотите заплатить сейчас или завтра?', 'Завтра, пожалуйста.', 'Tomorrow, please.', [
          'I’ll pay tomorrow.', 'Tomorrow, thanks.', 'I’d like to pay tomorrow.',
          'Can I pay tomorrow?', 'I’ll pay when I pick them up.', 'Tomorrow is better, thanks.'
        ]),
        turn('No problem. Six white rolls for Anna, tomorrow at eight a.m.', 'Без проблем. Шесть белых булочек для Анны, завтра в восемь утра.', 'Да, всё верно. Спасибо.', 'Yes, that’s right. Thank you.', [
          'That’s right, thanks.', 'Yes, exactly. Thanks.', 'Yes, that’s correct. Thank you.',
          'Perfect, thanks.', 'Yes, thank you.', 'That’s all correct, thanks.',
          'Yes, great. Thanks.', 'That’s it, thank you.', 'Yes, see you tomorrow. Thanks.',
          'Yes, that’s right. See you tomorrow.'
        ])
      ], ending:{en:'See you tomorrow!',ru:'До завтра!'}
    },
    {
      id:'bakery-outside-table', level:'A1', topic:'bakery', topicLabel:'Пекарня', length:'medium',
      title:'Еще один стул на улице', speaker:'Сотрудник пекарни', tone:'Непринужденная просьба о помощи',
      context:'Вы втроем хотите перекусить у пекарни на улице. У нужного столика только два стула. Еду еще не заказывали.',
      turns:[
        turn('Hello! Can I help?', 'Здравствуйте! Помочь?', 'Можно сесть на улице?', 'Can we sit outside?', [
          'Is it OK to sit outside?', 'Can we have a table outside?', 'Can we sit out here?',
          'Can we use the tables outside?', 'We’d like to sit outside, please.',
          'Is it OK if we sit outside?'
        ]),
        turn('Yes, of course. How many of you are there?', 'Да, конечно. Сколько вас?', 'Нас трое.', 'There are three of us.', [
          'Three of us.', 'Three.', 'Just three.', 'There are three people.',
          'We’re a group of three.', 'Three people.'
        ]),
        turn('This table has two chairs.', 'У этого столика два стула.', 'Можно еще один стул, пожалуйста?', 'Can we have one more chair, please?', [
          'One more chair, please.', 'Can you bring one more chair, please?',
          'We need one more chair, please.', 'Can we get another chair, please?',
          'Can we have another chair, please?', 'Can you bring us another chair?',
          'Another chair, please.'
        ]),
        turn('Sure. Where would you like it?', 'Конечно. Куда его поставить?', 'Рядом с этим столиком, пожалуйста.', 'By this table, please.', [
          'Next to this table, please.', 'Here, by this table.', 'Beside this table, please.',
          'Just here, next to the table.', 'Here by the table, please.', 'Right here, please.'
        ]),
        turn('Here you go. The menus are on the table.', 'Вот, пожалуйста. Меню на столике.', 'Спасибо. Можно заказать здесь?', 'Thanks. Can we order here?', [
          'Thank you. Can we order here?', 'Can we order here?', 'Do we order here?',
          'Thanks. Do we order at the table?', 'Can we order at the table?',
          'Thank you. Do we order here?'
        ]),
        turn('Please order inside, at the counter.', 'Закажите внутри, у стойки, пожалуйста.', 'Хорошо, я зайду внутрь.', 'OK, I’ll go inside.', [
          'All right, I’ll go inside.', 'I’ll go inside, thanks.', 'OK, I’ll order inside.',
          'I’ll order inside, then.', 'OK, I’ll go in.', 'I’ll go in, thanks.',
          'Sure, I’ll go inside.'
        ])
      ], ending:{en:'Great. I’ll leave the chair here.',ru:'Хорошо. Стул оставлю здесь.'}
    }
  );
})(typeof window !== 'undefined' ? window : globalThis);

(function (root) {
  'use strict';
  const {turn} = root.OfflineContent;
  root.DIALOGUES.push(
    {
      id:'takeout-pickup-name', level:'A1', topic:'takeout', topicLabel:'Еда навынос', length:'short',
      title:'Заказ на имя Алекс', speaker:'Сотрудник у стойки', tone:'Быстро и вежливо',
      context:'Ты уже заказал и оплатил еду онлайн. Пришел забрать ее. Заказ на имя Алекс, номер семнадцать.',
      turns:[
        turn('Hi! Are you here to order?', 'Здравствуйте! Хотите сделать заказ?', 'Нет, я за своим заказом.', 'No, I’m here to pick up an order.', [
          'I’m here to pick up my order.', 'No, I’m picking up an order.', 'No, I’m picking up my order.',
          'I’m picking up an order.', 'I’m here for my order.', 'No, I’m here for my order.',
          'I have an order to pick up.'
        ]),
        turn('What name is it under?', 'На какое имя?', 'На имя Алекс.', 'It’s under Alex.', [
          'Alex.', 'The name is Alex.', 'It’s for Alex.', 'Under Alex.', 'My name is Alex.',
          'It’s Alex.', 'The order is for Alex.'
        ]),
        turn('Do you have your order number?', 'У вас есть номер заказа?', 'Да, семнадцать.', 'Yes, seventeen.', [
          'Seventeen.', 'Number seventeen.', 'Yes, number seventeen.', 'It’s seventeen.',
          'The order number is seventeen.', 'Yes, it’s 17.', '17.', 'Yes, 17.'
        ]),
        turn('Can I see the order on your phone?', 'Можно посмотреть заказ на вашем телефоне?', 'Да, вот пожалуйста.', 'Sure, here you go.', [
          'Yes, here you go.', 'Here you go.', 'Here you are.', 'Sure, here you are.',
          'Yes, here it is.', 'Here it is.', 'Of course. Here you go.', 'Yes, of course.',
          'Sure, it’s right here.', 'Yes, it’s here on my phone.', 'Yes, here you are.'
        ])
      ], ending:{en:'Great. Here’s your food!',ru:'Отлично. Вот ваша еда!'}
    },
    {
      id:'takeout-napkins', level:'A1', topic:'takeout', topicLabel:'Еда навынос', length:'short',
      title:'Салфетки и соус', speaker:'Сотрудник у стойки', tone:'Небольшая просьба после покупки',
      context:'Еда у тебя уже есть. Ты возвращаешься к стойке за салфетками и двумя пакетиками томатного соуса.',
      turns:[
        turn('Hi again! Everything OK?', 'Еще раз здравствуйте! Всё хорошо?', 'Да. Можно салфетки, пожалуйста?', 'Yes. Can I have some napkins, please?', [
          'Can I have some napkins, please?', 'Some napkins, please.', 'Yes, just some napkins, please.',
          'I need some napkins, please.',
          'Yes, can you give me some napkins, please?', 'Napkins, please.'
        ]),
        turn('Of course. Any sauce?', 'Конечно. Соус нужен?', 'Да, томатный, пожалуйста.', 'Yes, ketchup, please.', [
          'Ketchup, please.', 'Some ketchup, please.', 'Yes, some ketchup, please.',
          'Can I have some ketchup, please?', 'I’d like some ketchup, please.',
          'Ketchup would be great, thanks.', 'Yes, ketchup, thanks.'
        ]),
        turn('How many packets?', 'Сколько пакетиков?', 'Два, пожалуйста.', 'Two, please.', [
          'Two packets, please.', 'Just two, please.', 'Two, thanks.', 'Can I have two, please?',
          'Two packets, thanks.', 'I’ll take two, please.', 'Two is enough, thanks.'
        ]),
        turn('Here you go. Anything else?', 'Вот, держите. Что-нибудь еще?', 'Нет, теперь всё. Спасибо.', 'No, that’s all now. Thanks.', [
          'No, that’s all, thanks.', 'That’s all, thank you.', 'No, thanks.', 'No, thank you.',
          'I’m all set now, thanks.', 'I’m good now, thanks.', 'Nothing else, thanks.',
          'That’s everything, thank you.', 'No, I’m good, thanks.', 'All set, thanks.',
          'No, that’s it. Thank you.'
        ])
      ], ending:{en:'You’re welcome!',ru:'Пожалуйста!'}
    },
    {
      id:'takeout-sandwich', level:'A1', topic:'takeout', topicLabel:'Еда навынос', length:'medium',
      title:'Сэндвич, который собирают при тебе', speaker:'Сотрудник кафе', tone:'Простой заказ с выбором начинки',
      context:'Ты заказываешь сэндвич с курицей на белом хлебе, без сыра. Томат и салат подходят. Сэндвич нужно разрезать пополам.',
      turns:[
        turn('What kind of sandwich would you like?', 'Какой сэндвич вы хотите?', 'С курицей, пожалуйста.', 'A chicken sandwich, please.', [
          'Chicken, please.', 'I’d like a chicken sandwich.', 'Can I have a chicken sandwich, please?',
          'I’ll have chicken, please.', 'The chicken sandwich, please.', 'A chicken one, please.'
        ]),
        turn('White or brown bread?', 'Белый или темный хлеб?', 'Белый, пожалуйста.', 'White, please.', [
          'White bread, please.', 'White, thanks.', 'On white bread, please.', 'The white bread, please.',
          'I’d like white bread, please.', 'White bread is fine, thanks.'
        ]),
        turn('Would you like cheese?', 'Добавить сыр?', 'Нет, без сыра, пожалуйста.', 'No cheese, please.', [
          'No, thanks.', 'No, thank you.', 'Without cheese, please.', 'No, no cheese, please.',
          'No cheese, thanks.', 'No, without cheese, please.'
        ]),
        turn('Tomato and lettuce?', 'Томат и салат?', 'Да, и то и другое, пожалуйста.', 'Yes, both, please.', [
          'Both, please.', 'Yes, please.', 'Yes, thanks.', 'Tomato and lettuce, please.',
          'Yes, tomato and lettuce.', 'Both, thanks.', 'Yes to both, please.',
          'That’s great, thanks.', 'Yes, I’d like both, please.'
        ]),
        turn('Would you like it cut in half?', 'Разрезать пополам?', 'Да, пожалуйста.', 'Yes, please.', [
          'Yes, thanks.', 'Yes, thank you.', 'In half, please.', 'Yes, in half, please.',
          'That would be great, thanks.', 'Please cut it in half.', 'Can you cut it in half, please?',
          'Sure, thanks.', 'Yes, that’s great.', 'Yes, please. Thank you.'
        ]),
        turn('Here you go. Eating here or taking it to go?', 'Вот, пожалуйста. Здесь будете есть или с собой?', 'С собой, пожалуйста.', 'To go, please.', [
          'To go, thanks.', 'I’ll take it to go.', 'I’m taking it to go.', 'It’s to go.',
          'Takeout, please.', 'I’d like it to go, please.', 'To take away, please.'
        ])
      ], ending:{en:'OK. I’ll put it in a bag.',ru:'Хорошо. Положу в пакет.'}
    },
    {
      id:'takeout-wrong-counter', level:'A1', topic:'takeout', topicLabel:'Еда навынос', length:'medium',
      title:'Где ждать заказ', speaker:'Сотрудник у стойки', tone:'Спокойно уточнить порядок получения',
      context:'Ты оплатил заказ номер двадцать один и ждешь у кассы. Получать еду нужно у другой стойки. Хочешь узнать, сколько ждать и можно ли пока сесть.',
      turns:[
        turn('Are you waiting to order?', 'Вы ждете, чтобы заказать?', 'Нет, я жду заказ номер двадцать один.', 'No, I’m waiting for order twenty-one.', [
          'I’m waiting for order twenty-one.', 'No, I’m waiting for order number twenty-one.',
          'I’m waiting for order 21.', 'No, I’m waiting for order 21.',
          'I’m waiting for number twenty-one.', 'No, my order is number twenty-one.'
        ]),
        turn('Please wait at the pickup counter.', 'Пожалуйста, подождите у стойки выдачи.', 'Где она?', 'Where is it?', [
          'Where’s that?', 'Where is that?', 'Where’s the pickup counter?', 'Where is the pickup counter?',
          'Sorry, where is it?', 'Where do I go?', 'Where should I wait?'
        ]),
        turn('Over there, by the window.', 'Вон там, у окна.', 'Спасибо. Сколько еще ждать?', 'Thanks. How much longer?', [
          'Thank you. How long will it be?', 'How much longer?', 'How long is the wait?',
          'Thanks. How long do I need to wait?', 'How long will it be?',
          'Thank you. How much longer?', 'How long do I have to wait?'
        ]),
        turn('About five minutes.', 'Около пяти минут.', 'Можно пока сесть?', 'Can I sit down while I wait?', [
          'Can I sit down?', 'Can I have a seat?', 'Is it OK to sit down?', 'Can I sit here?',
          'Can I sit down and wait?', 'Can I wait at a table?', 'Can I sit while I wait?'
        ]),
        turn('Yes. We’ll call your number.', 'Да. Мы назовем ваш номер.', 'Здесь шумно. Можно ждать у стойки?', 'It’s noisy here. Can I wait by the counter?', [
          'It’s loud here. Can I wait by the counter?', 'Can I wait by the counter? It’s noisy here.',
          'It’s noisy here. Can I wait near the counter?', 'Can I stay by the counter? It’s noisy here.',
          'It’s loud here. Can I stay near the counter?'
        ]),
        turn('Sure. You can sit on this chair by the counter.', 'Конечно. Можно сесть на этот стул у стойки.', 'Отлично, спасибо.', 'Great, thanks.', [
          'Great, thank you.', 'Perfect, thanks.', 'That’s great, thank you.', 'That’s perfect, thanks.',
          'Thanks, that’s great.', 'OK, thanks.', 'Thank you.', 'That works, thanks.',
          'Yes, that’s fine, thank you.', 'Perfect, thank you.'
        ])
      ], ending:{en:'Order twenty-one! Your food is ready.',ru:'Заказ двадцать один! Ваша еда готова.'}
    },
    {
      id:'takeout-second-bag', level:'A1', topic:'takeout', topicLabel:'Еда навынос', length:'medium',
      title:'Второй пакет', speaker:'Сотрудник кафе', tone:'Вежливо проверить комплектность',
      context:'В заказе два бургера и картошка. Ты получил пакет, но видишь в нем только бургеры. Второй пакет остался на стойке.',
      turns:[
        turn('Here’s your order. Have a good day!', 'Вот ваш заказ. Хорошего дня!', 'Извините, здесь нет картошки.', 'Sorry, the fries are missing.', [
          'Sorry, there are no fries in here.', 'Excuse me, there are no fries.',
          'There are no fries in the bag.', 'Sorry, I don’t have my fries.',
          'Excuse me, where are the fries?', 'Sorry, the fries aren’t here.'
        ]),
        turn('You have two burgers and fries, right?', 'У вас два бургера и картошка, верно?', 'Да, всё верно.', 'Yes, that’s right.', [
          'That’s right.', 'Yes, exactly.', 'Yes, two burgers and fries.', 'Correct.',
          'Yes, correct.', 'That’s my order.', 'Yes, that’s my order.', 'Exactly.'
        ]),
        turn('There’s a second bag on the counter.', 'На стойке есть второй пакет.', 'Этот коричневый пакет мой?', 'Is this brown bag mine?', [
          'Is the brown bag mine?', 'Is that brown bag mine?', 'Is this my brown bag?',
          'Is this brown bag for me?', 'Is the brown bag for me?', 'Is that my bag, the brown one?'
        ]),
        turn('Yes, that’s yours. The fries are in there.', 'Да, ваш. Картошка там.', 'Понятно. Можно один большой пакет?', 'OK. Can I have one big bag?', [
          'Can I have one big bag, please?', 'Can you put everything in one big bag?',
          'One big bag, please.', 'Can I get a big bag for everything, please?',
          'Can you put it all in one big bag, please?', 'I see. Can I have one big bag, please?'
        ]),
        turn('Of course. Any drinks?', 'Конечно. Напитки у вас есть?', 'Нет, только еда.', 'No, just the food.', [
          'No drinks, just food.', 'No, only food.', 'Just food.', 'No, just food, thanks.',
          'No drinks.', 'Just the food, thanks.', 'No, I only have food.'
        ]),
        turn('OK, it’s all in one bag now.', 'Хорошо, теперь всё в одном пакете.', 'Спасибо за помощь.', 'Thanks for your help.', [
          'Thank you for your help.', 'Thanks for helping.', 'Thank you for helping me.',
          'Thanks, that’s great.', 'Great, thank you.', 'Thank you!', 'Thanks a lot.',
          'Thanks so much.', 'Perfect, thanks.'
        ])
      ], ending:{en:'You’re welcome. Have a good day!',ru:'Пожалуйста. Хорошего дня!'}
    },
    {
      id:'takeout-lunch-friend', level:'A1', topic:'takeout', topicLabel:'Еда навынос', length:'medium',
      title:'Что взять на обед', speaker:'Друг', tone:'Неформальная беседа двух друзей',
      context:'Вы с другом выбираете еду навынос на обед. Ты хочешь пиццу, друг предлагает разделить одну большую. Потом договоритесь, кто заберет заказ.',
      turns:[
        turn('What do you want for lunch?', 'Что хочешь на обед?', 'Давай пиццу.', 'Let’s get pizza.', [
          'How about pizza?', 'Pizza sounds good.', 'I’d like pizza.', 'Let’s have pizza.',
          'Pizza?', 'What about pizza?', 'I want pizza.', 'We can get pizza.', 'Pizza would be good.'
        ]),
        turn('Do you want one each, or a large one to share?', 'По одной каждому или одну большую на двоих?', 'Одну большую на двоих.', 'One large one to share.', [
          'Let’s share a large one.', 'One large pizza to share.', 'A large one for both of us.',
          'Let’s get one large pizza.', 'One big pizza for us both.', 'We can share a large pizza.',
          'A large one to share.'
        ]),
        turn('OK. Cheese or chicken?', 'Хорошо. С сыром или курицей?', 'Я хочу с курицей. А ты?', 'I’d like chicken. How about you?', [
          'Chicken for me. What about you?', 'I want chicken. What about you?',
          'Chicken. How about you?', 'I’d like chicken. What about you?',
          'Chicken sounds good. What about you?', 'I want chicken. How about you?',
          'Chicken for me. How about you?'
        ]),
        turn('Chicken is good. Anything to drink?', 'С курицей хорошо. Попить что-нибудь?', 'У меня есть вода.', 'I have water.', [
          'I’ve got water.', 'I have some water.', 'I’ve got some water.', 'I already have water.',
          'No, thanks. I have water.', 'I have a bottle of water.', 'I’ve got a bottle of water.'
        ]),
        turn('Great. I’ll order it. Can you pick it up?', 'Отлично. Я закажу. Можешь забрать?', 'Да. Во сколько?', 'Sure. What time?', [
          'Yes, what time?', 'OK, what time?', 'Sure, when?', 'Yes. When?',
          'I can. What time?', 'Yes, I can. What time?', 'No problem. What time?',
          'Sure, what time do I pick it up?'
        ]),
        turn('At twelve thirty. We can eat at my place.', 'В половине первого. Можем поесть у меня.', 'Хорошо, увидимся у тебя.', 'OK, see you at your place.', [
          'Sure, see you at your place.', 'Great, see you at your place.', 'See you at your place.',
          'OK, I’ll see you at your place.', 'I’ll see you at your place, then.',
          'Sounds good. See you at your place.'
        ])
      ], ending:{en:'See you! Thanks for picking it up.',ru:'До встречи! Спасибо, что заберешь.'}
    }
  );
})(typeof window !== 'undefined' ? window : globalThis);

(function (root) {
  'use strict';
  const {turn} = root.OfflineContent;
  root.DIALOGUES.push(
    {
      id:'takeout-phone-pizza', level:'A1', topic:'takeout', topicLabel:'Еда навынос', length:'long',
      title:'Заказ пиццы по телефону', speaker:'Сотрудник пиццерии', tone:'Вежливый телефонный заказ',
      context:'Ты, Алекс Грин, заказываешь две средние пиццы: одну с сыром, другую с курицей, и две бутылки воды. Заберешь в шесть вечера и заплатишь картой на месте. Телефон для заказа: 555-0124.',
      turns:[
        turn('Hello, City Pizza. What would you like?', 'Здравствуйте, «Сити Пицца». Что вы хотите?', 'Две пиццы, пожалуйста.', 'Two pizzas, please.', [
          'I’d like two pizzas, please.', 'Can I order two pizzas, please?', 'Can I have two pizzas, please?',
          'I’d like to order two pizzas.', 'I’ll have two pizzas, please.', 'I’d like two pizzas.'
        ]),
        turn('What size?', 'Какого размера?', 'Обе средние, пожалуйста.', 'Both medium, please.', [
          'Two medium pizzas, please.', 'Medium for both, please.', 'Both medium.',
          'Two medium ones, please.', 'Medium, both of them.', 'I’d like both medium, please.'
        ]),
        turn('And what kind?', 'И с чем?', 'Одну с сыром, другую с курицей.', 'One cheese and one chicken.', [
          'One cheese pizza and one chicken pizza.', 'One with cheese and one with chicken.',
          'A cheese pizza and a chicken pizza.', 'One cheese, one chicken, please.',
          'One chicken and one cheese, please.'
        ]),
        turn('Anything to drink?', 'Что-нибудь попить?', 'Две бутылки воды, пожалуйста.', 'Two bottles of water, please.', [
          'Can I have two bottles of water, please?', 'I’d like two bottles of water.',
          'Two waters, please.', 'Two bottled waters, please.', 'And two bottles of water, please.',
          'I’ll have two bottles of water, please.'
        ]),
        turn('Delivery or pickup?', 'Доставка или самовывоз?', 'Я сам заберу.', 'I’ll pick it up.', [
          'Pickup, please.', 'I’ll come and get it.', 'I’m picking it up.',
          'I’ll come to pick it up.', 'I’ll pick up the order.', 'Pickup, thanks.'
        ]),
        turn('What time would you like it?', 'На какое время приготовить?', 'На шесть вечера, пожалуйста.', 'Six p.m., please.', [
          'At six p.m., please.', 'At six in the evening, please.', 'Six this evening, please.',
          'For six p.m., please.', 'At 6 p.m., please.', 'I’ll pick it up at six p.m.',
          'Six in the evening, please.'
        ]),
        turn('What’s your name?', 'Как вас зовут?', 'Алекс Грин.', 'Alex Green.', [
          'My name is Alex Green.', 'I’m Alex Green.', 'It’s Alex Green.',
          'The name is Alex Green.', 'The order is for Alex Green.'
        ]),
        turn('Can you spell your last name?', 'Можете произнести фамилию по буквам?', 'G-R-E-E-N.', 'G-R-E-E-N.', [
          'G R E E N.', 'Green. G-R-E-E-N.', 'It’s G-R-E-E-N.', 'Yes. G-R-E-E-N.',
          'Sure. G-R-E-E-N.'
        ]),
        turn('And your phone number?', 'И ваш номер телефона?', '555-0124.', '555-0124.', [
          '555 0124.', 'My number is 555-0124.', 'It’s 555-0124.',
          'Five five five zero one two four.', 'Five five five oh one two four.',
          'My number is five five five zero one two four.'
        ]),
        turn('Thanks. Cash or card when you pick it up?', 'Спасибо. При получении заплатите наличными или картой?', 'Картой, пожалуйста.', 'Card, please.', [
          'By card, please.', 'Card, thanks.', 'I’ll pay by card.', 'I’ll pay with a card.',
          'With my card, please.', 'I’ll use my card.', 'I’m paying by card.',
          'Card, thank you.', 'By card, thanks.'
        ])
      ], ending:{en:'Great. See you at six!',ru:'Отлично. До встречи в шесть!'}
    },
    {
      id:'takeout-delivery-door', level:'A1', topic:'takeout', topicLabel:'Еда навынос', length:'long',
      title:'Курьер у другого входа', speaker:'Курьер по телефону', tone:'Дружелюбно помочь найти вход',
      context:'Тебя зовут Алекс. Курьер привез еду и напиток, но стоит у заднего входа. Твой дом — номер 12 с зеленой входной дверью, квартира 3 на втором этаже. Входная дверь заперта.',
      turns:[
        turn('Hi, I’m outside with your food.', 'Здравствуйте, я с вашей едой, на улице.', 'Я вас не вижу. Вы где?', 'I can’t see you. Where are you?', [
          'Where are you? I can’t see you.', 'Sorry, I can’t see you. Where are you?',
          'I don’t see you. Where are you?', 'Where are you? I don’t see you.',
          'I can’t see you outside. Where are you?'
        ]),
        turn('I’m by the back door.', 'Я у задней двери.', 'Подойдите к главному входу, пожалуйста.', 'Please come to the front door.', [
          'Can you come to the front door, please?', 'Come to the front door, please.',
          'Please come to the main entrance.', 'Can you come to the main entrance?',
          'Please go to the front door.', 'The front door, please.'
        ]),
        turn('What’s the building number?', 'Какой номер дома?', 'Двенадцать.', 'Twelve.', [
          'Number twelve.', 'It’s twelve.', 'The number is twelve.', 'It’s number twelve.',
          '12.', 'Number 12.', 'It’s 12.'
        ]),
        turn('Is the front door green?', 'Входная дверь зеленая?', 'Да, зеленая.', 'Yes, it’s green.', [
          'Yes, green.', 'That’s right, the green door.', 'Yes, that’s right.', 'Yes, it is.',
          'The green door, yes.', 'Yes, that’s the one.', 'That’s the one.', 'Yes.'
        ]),
        turn('Which apartment?', 'Какая квартира?', 'Квартира три.', 'Apartment three.', [
          'It’s apartment three.', 'Apartment number three.', 'Number three.',
          'Apartment 3.', 'Three.', 'It’s number three.', '3.'
        ]),
        turn('And what floor?', 'И какой этаж?', 'Второй.', 'The second floor.', [
          'Second floor.', 'On the second floor.', 'It’s on the second floor.',
          'The second.', 'Second.', 'Floor two.', 'On floor two.'
        ]),
        turn('The front door is locked. Can you come down?', 'Входная дверь заперта. Можете спуститься?', 'Да, одну минутку, пожалуйста.', 'Yes, one minute, please.', [
          'Sure, just a minute.', 'Yes, just a minute.', 'One minute, please.',
          'I’ll be right down.', 'Yes, I’m coming down.', 'I’m coming. One minute.',
          'Sure, I’ll be down in a minute.', 'Yes, give me a minute, please.',
          'I’ll come down. One minute, please.', 'Just a minute, please.'
        ]),
        turn('Are you Alex?', 'Вы Алекс?', 'Да, это я.', 'Yes, that’s me.', [
          'That’s me.', 'Yes, I’m Alex.', 'Yes, I am.', 'I’m Alex.',
          'Yes, it’s me.', 'Yes, Alex.', 'That’s right, I’m Alex.'
        ], [], [], 'Ты спускаешься и встречаешь курьера у двери.'),
        turn('Here are your two bags.', 'Вот ваши два пакета.', 'Напиток в пакете?', 'Is the drink in the bag?', [
          'Is my drink in the bag?', 'Is the drink in one of the bags?',
          'Is my drink in one of these bags?', 'Is the drink in here?', 'Is my drink in here?',
          'Is the drink in this bag?', 'Is my drink in there?'
        ]),
        turn('Yes, it’s in the small bag.', 'Да, в маленьком пакете.', 'Спасибо. Хорошего дня!', 'Thanks. Have a good day!', [
          'Thank you. Have a good day!', 'Thanks, have a nice day!', 'Thank you, have a nice day!',
          'Have a good day, thanks!', 'Thanks! Have a good one!',
          'Thank you. Have a good one!', 'Thanks a lot. Have a good day.'
        ])
      ], ending:{en:'You too! Enjoy your food.',ru:'И вам! Приятного аппетита.'}
    }
  );
})(typeof window !== 'undefined' ? window : globalThis);
