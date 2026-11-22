/* v0.4. Each continuation is written for its own story; no generated dialogue templates. */
(function(root){
  'use strict';
  const {turn:t}=root.OfflineContent;
  root.CONTENT_REVISION=3;
  root.APP_VERSION='0.4';
  root.REVISED_DIALOGUE_IDS=[];
  function extend(id,at,turns,context){
    const d=root.DIALOGUES.find(d=>d.id===id);
    if(!d)throw Error('Missing dialogue '+id);
    d.turns.splice(at,0,...turns); d.context=context||d.context;
    root.REVISED_DIALOGUE_IDS.push(id);
  }
  extend('coffee-to-go',3,[
    t('Your coffee will be ready in a minute. Do you need sugar?', 'Кофе будет готов через минуту. Сахар нужен?', 'Нет, спасибо. Без сахара.', 'No sugar, thanks.', ['No, thanks.','No, thank you.','Without sugar, please.','No sugar, please.','Just black, no sugar.','No, I don’t take sugar.','No, no sugar, thanks.']),
    t('OK. The lids are over there.', 'Хорошо. Крышки вон там.', 'Где именно? Я не вижу.', 'Where? I can’t see them.', ['Where are they? I can’t see them.','Sorry, where are they?','Where exactly?','Sorry, I don’t see them.','I can’t see them. Where are they?','Where are the lids?']),
    t('Next to the cups. The small ones are on the left.', 'Рядом со стаканами. Маленькие слева.', 'Эта подойдет?', 'Is this the right one?', ['Is this one OK?','Does this one fit?','Is this one right?','This one?','Will this one fit?','Is this the small one?']),
    t('Yes, that’s the one. Be careful, it’s hot.', 'Да, эта. Осторожно, горячо.', 'Можно еще один стакан?', 'Can I have another cup?', ['Another cup, please.','Can I have one more cup, please?','Could I have another cup, please?','One more cup, please.','Can you give me another cup?','Can I get a second cup, please?']),
    t('Of course. Here’s an extra cup.', 'Конечно. Вот еще один стакан.', 'Спасибо. И салфетку, пожалуйста.', 'Thanks. And a napkin, please.', ['A napkin too, please.','And a napkin, please.','Can I have a napkin too, please?','Thanks. Can I have a napkin?','A napkin as well, please.','And one napkin, thanks.']),
    t('Here you are. Would you like your receipt?', 'Вот, пожалуйста. Чек нужен?', 'Нет, спасибо.', 'No, thanks.', ['No, thank you.','I don’t need it, thanks.','No receipt, thanks.','You can keep it, thanks.','I’m good, thanks.','No, I’m all set.','No, that’s OK, thanks.'])
  ],'Ты берешь маленький черный кофе с собой и платишь картой. Пока его готовят, нужно найти крышку, взять дополнительный стакан и салфетку.');
  extend('window-table',3,[
    t('Still or sparkling water?', 'Вода без газа или с газом?', 'Без газа, пожалуйста.', 'Still water, please.', ['Still, please.','Plain water, please.','Just still water, thanks.','Not sparkling, please.','Just plain water.','Still water, thanks.']),
    t('Would you like ice in it?', 'Со льдом?', 'Без льда, пожалуйста.', 'No ice, please.', ['Without ice, please.','No, thanks.','No ice, thanks.','No, no ice, please.','No, thank you.','Just the water, no ice.']),
    t('Here’s your water.', 'Вот ваша вода.', 'Можно меню на английском?', 'Can we have menus in English?', ['Do you have menus in English?','Can I have an English menu, please?','An English menu, please.','Can we have English menus, please?','Do you have an English menu?','Can we see the menu in English?']),
    t('Yes, here you go.', 'Да, вот, пожалуйста.', 'Этот стул мокрый. Можно другой?', 'This chair is wet. Can I have another one?', ['This chair is wet. Can we have another chair?','Can I have another chair? This one is wet.','This one is wet. Can I use a different chair?','The chair is wet. Can I change it?','This chair is wet. Can you bring another one?']),
    t('Sorry about that. Here’s a dry chair.', 'Извините. Вот сухой стул.', 'Спасибо. Можно поставить сумку сюда?', 'Thanks. Can I put my bag here?', ['Can I put my bag here?','Is it OK to put my bag here?','Can I leave my bag here?','Thank you. Is my bag OK here?','Can my bag go here?','Thanks. Is it OK if I put my bag here?']),
    t('Of course. Are you ready to order?', 'Конечно. Готовы заказать?', 'Еще нет. Где туалет?', 'Not yet. Where’s the restroom?', ['Not yet. Where is the bathroom?','Not yet, thanks. Where’s the restroom?','Where’s the bathroom? We’re not ready yet.','We need a minute. Where’s the restroom?','Not yet. Where is the toilet?'])
  ],'Вы с другом садитесь у окна. Нужно попросить воду и английское меню, заменить мокрый стул и найти туалет, прежде чем выбирать еду.');
  // The restroom question gets its answer before the final offer of time with the menu.
  root.DIALOGUES.find(d=>d.id==='window-table').turns[9].en='The restroom is at the back. Would you like a minute with the menus?';
  root.DIALOGUES.find(d=>d.id==='window-table').turns[9].ru='Туалет в глубине зала. Дать вам минутку посмотреть меню?';
  extend('no-tea',5,[
    t('The spoon is here. Anything sweet with your coffee?', 'Вот ложка. Что-нибудь сладкое к кофе?', 'Маленький шоколадный торт, пожалуйста.', 'A small chocolate cake, please.', ['One small chocolate cake, please.','Can I have a small chocolate cake?','I’d like a small chocolate cake, please.','A small chocolate cake, thanks.','I’ll have a small chocolate cake.']),
    t('This one? It’s three dollars.', 'Этот? Он стоит три доллара.', 'Да, этот. Сколько за всё?', 'Yes, that one. How much is it all together?', ['Yes, that one. What’s the total?','That one, please. How much is everything?','Yes. How much is the coffee and cake?','Yes, this one. How much altogether?','That one. How much for both?']),
    t('Five dollars for the coffee and cake.', 'Пять долларов за кофе и торт.', 'Вот пять долларов.', 'Here’s five dollars.', ['Here you go. Five dollars.','Here you are.','Here you go.','Five dollars. Here you are.','Here’s the five.']),
    t('Thank you. Would you like a plate for the cake?', 'Спасибо. Нужна тарелка для торта?', 'Да, пожалуйста. И вилку.', 'Yes, please. And a fork.', ['A plate and a fork, please.','Yes, and a fork, please.','Yes, can I have a fork too?','Yes, please. A fork too, please.','Yes, thanks. And a fork, please.'])
  ],'Ты выбираешь кофе вместо отсутствующего чая, добавляешь маленький шоколадный торт, платишь и ищешь место в кафе.');
  extend('wrong-drink',4,[
    t('How’s the coffee?', 'Как кофе?', 'Он холодный.', 'It’s cold.', ['The coffee is cold.','It’s a bit cold.','It isn’t hot.','It’s not hot.','My coffee is cold.','Sorry, it’s cold.']),
    t('Sorry! Would you like a fresh cup?', 'Извините! Принести новую чашку?', 'Да, горячий, пожалуйста.', 'Yes, a hot one, please.', ['Yes, please. A hot one.','A hot coffee, please.','Yes, please.','Yes, thanks.','Yes, a fresh hot coffee, please.','Yes, hot coffee, please.']),
    t('Here you go. Nice and hot.', 'Вот, пожалуйста. Горячий.', 'Так лучше, спасибо.', 'That’s better, thanks.', ['Much better, thanks.','That’s much better, thank you.','It’s better now, thanks.','That’s good now, thanks.','Perfect, thank you.','Thanks, that’s better.']),
    t('Ready to pay?', 'Готовы заплатить?', 'Да, счет, пожалуйста.', 'Yes, the check, please.', ['The check, please.','Yes. Can I have the bill?','Yes, the bill, please.','Can I have the check, please?','The bill, please.','Yes, I’d like the check, please.'],[],[], 'После кофе ты собираешься уходить.')
  ],'Официант сначала приносит не тот напиток, а замененный кофе оказывается холодным. Нужно спокойно решить обе проблемы, а затем заплатить наличными.');
})(typeof window!=='undefined'?window:globalThis);
(function(root){
  'use strict';
  const {turn:t}=root.OfflineContent;
  function add(id,at,turns,context){const d=root.DIALOGUES.find(d=>d.id===id);d.turns.splice(at,0,...turns);d.context=context;root.REVISED_DIALOGUE_IDS.push(id);}
  add('bread-sliced',3,[
    t('Your bag is here. Shall I put the bread in it?', 'Ваш пакет здесь. Положить в него хлеб?', 'Да, пожалуйста. Осторожно, там яйца.', 'Yes, please. There are eggs in there.', ['Yes, but there are eggs in the bag.','Please be careful. There are eggs in there.','Yes, please. Be careful with the eggs.','There are eggs in the bag, so please be careful.','Yes, thanks. There are eggs in my bag.']),
    t('I see them. I’ll put the bread on top.', 'Вижу. Положу хлеб сверху.', 'Спасибо. У вас есть масло?', 'Thanks. Do you have butter?', ['Do you sell butter?','Do you have any butter?','Thank you. Do you sell butter?','Is there any butter?','Can I buy butter here?']),
    t('Yes, in the fridge. A small pack is two dollars.', 'Да, в холодильнике. Маленькая пачка стоит два доллара.', 'Возьму маленькую пачку.', 'I’ll take a small pack.', ['A small pack, please.','I’d like a small pack, please.','Can I have a small pack?','I’ll have a small one.','The small pack, please.']),
    t('Is this one OK?', 'Эта подойдет?', 'Да. Положите отдельно, пожалуйста.', 'Yes. Put it in separately, please.', ['Yes, in a separate bag, please.','Yes, please keep it separate.','That’s fine. A separate bag, please.','Yes, but not with the bread, please.','Yes, separately, please.']),
    t('Here you are. The bread is four and the butter is two.', 'Вот, пожалуйста. Хлеб — четыре, масло — два.', 'Значит, шесть долларов?', 'So, six dollars?', ['Is that six dollars?','Six dollars altogether?','Is the total six dollars?','Six in total?','Six dollars for everything?']),
    t('Yes, six. Cash or card?', 'Да, шесть. Наличными или картой?', 'Наличными.', 'Cash, please.', ['Cash.','I’ll pay cash.','I’ll pay in cash.','In cash, please.','Cash, thanks.'])
  ],'Ты покупаешь нарезанный белый хлеб и масло. В твоем пакете уже лежат яйца: хлеб нужно положить осторожно, а масло отдельно. За всё платишь шесть долларов наличными.');
  const bread=root.DIALOGUES.find(d=>d.id==='bread-sliced');
  bread.turns[9].en='Six dollars, please.';bread.turns[9].ru='Шесть долларов, пожалуйста.';
  bread.turns[9].natural=bread.turns[9].natural.filter(s=>!s.toLowerCase().includes('four')); // The total changed when butter was added.
  add('school-snacks',3,[
    t('Here are the bags. The rolls are still warm.', 'Вот пакеты. Булочки еще теплые.', 'Можно оставить пакеты открытыми?', 'Can you leave the bags open?', ['Please leave the bags open.','Can you keep the bags open, please?','Can the bags stay open?','Leave them open, please.','Please don’t close the bags.']),
    t('Sure. Are they both for you?', 'Конечно. Оба пакета для вас?', 'Нет, они для двух детей.', 'No, they’re for two children.', ['They’re for two children.','No, for two kids.','One for each of my two children.','They’re for my two kids.','No, one for each of two children.']),
    t('Would you like names on the bags?', 'Написать имена на пакетах?', 'Да. На этом — Эмма.', 'Yes. Emma on this one.', ['Yes, put Emma on this bag, please.','Emma on this bag, please.','Yes, please. This one is for Emma.','Yes, write Emma on this one.','Yes, Emma here, please.']),
    t('And on the other bag?', 'А на другом пакете?', 'Лиам, пожалуйста.', 'Liam, please.', ['Liam.','The other one is for Liam.','Liam on that one, please.','Please write Liam.','Put Liam on the other bag, please.']),
    t('Done. That’s six dollars.', 'Готово. Шесть долларов.', 'У вас есть сдача с десяти?', 'Do you have change for ten?', ['Can you change ten dollars?','Do you have change for a ten?','Can I pay with a ten?','Is a ten-dollar bill OK?','Is ten dollars OK?']),
    t('Yes. Here’s your four dollars change.', 'Да. Вот ваша сдача — четыре доллара.', 'Спасибо. Можно чек?', 'Thanks. Can I have the receipt?', ['Can I have a receipt, please?','A receipt, please.','Thank you. The receipt, please.','Can I get a receipt?','Thanks. Can I have a receipt, please?'])
  ],'Ты берешь четыре теплые булочки для двух детей: по две в открытые пакеты с именами Эмма и Лиам. Покупка стоит шесть долларов, у тебя десять.');
  add('birthday-cake',3,[
    t('Can you spell Sam for me?', 'Продиктуйте Сэм по буквам.', 'S-A-M.', 'S-A-M.', ['S A M.','Sam. S-A-M.','It’s S-A-M.','Sure, S-A-M.','S, A, M.']),
    t('What would you like us to write before the name?', 'Что написать перед именем?', 'С днем рождения.', 'Happy birthday.', ['Happy birthday, please.','Please write Happy birthday.','Just Happy birthday.','Can you write Happy birthday?','Happy birthday to Sam.']),
    t('Would you like a box?', 'Нужна коробка?', 'Да, пожалуйста.', 'Yes, please.', ['Yes, thanks.','Yes, thank you.','A box, please.','That would be great, thanks.','Yes, a box, please.','Please put it in a box.','Can I have a box, please?']),
    t('Are you taking it now?', 'Забираете сейчас?', 'Нет, зайду в четыре.', 'No, I’ll come back at four.', ['I’ll pick it up at four.','No, at four, please.','I’ll be back at four.','Can I pick it up at four?','No, I’ll get it at four.']),
    t('That’s fine. What’s your name?', 'Хорошо. Как вас зовут?', 'Меня зовут Алекс.', 'My name is Alex.', ['I’m Alex.','Alex.','It’s Alex.','The name is Alex.','Alex, thanks.']),
    t('OK, Alex. The cake is twelve dollars.', 'Хорошо, Алекс. Торт стоит двенадцать долларов.', 'Можно заплатить сейчас картой?', 'Can I pay by card now?', ['Can I pay now with a card?','Can I pay now by card?','I’d like to pay by card now.','Can I use my card now?','Can I pay with my card now, please?'])
  ],'Ты заказываешь маленький шоколадный торт на шестой день рождения Сэма. На торте нужны имя и поздравление, торт в коробке заберешь в четыре. Заказ на имя Алекс.');
  const cake=root.DIALOGUES.find(d=>d.id==='birthday-cake');cake.turns[9].en='Yes, you can. And how many candles would you like?';cake.turns[9].ru='Да, можно. И сколько свечей вы хотите?';
  add('hold-last-loaf',3,[
    t('It’s a white loaf. Is that what you want?', 'Это белый хлеб. Вам такой нужен?', 'Да, белый подойдет.', 'Yes, white is fine.', ['White is fine, thanks.','Yes, that’s fine.','Yes, white bread is fine.','That’s great, thanks.','Yes, please.','Yes, white is good.']),
    t('Would you like it sliced?', 'Нарезать?', 'Да, пожалуйста.', 'Yes, please.', ['Sliced, please.','Yes, thanks.','Yes, please slice it.','That would be great.','Yes, thank you.','Please cut it for me.','Yes, sliced, thanks.']),
    t('OK. Anything else?', 'Хорошо. Что-нибудь еще?', 'А молоко у вас есть?', 'Do you have milk?', ['Do you sell milk?','Do you have any milk?','Can I buy milk there?','Is there any milk?','And do you have milk?']),
    t('Sorry, no milk today.', 'Извините, молока сегодня нет.', 'Хорошо, тогда только хлеб.', 'OK, just the bread, then.', ['Just the bread, thanks.','OK, only the bread.','That’s OK. Just the bread.','Only the bread, then.','Just the loaf, please.']),
    t('The loaf is four dollars.', 'Хлеб стоит четыре доллара.', 'Картой можно заплатить?', 'Can I pay by card?', ['Do you take cards?','Can I use my card?','Is card OK?','Can I pay with a card?','Do you accept cards?']),
    t('Yes, we take cards. You know where we are?', 'Да, карты принимаем. Вы знаете, где мы?', 'Да, рядом с автобусной остановкой.', 'Yes, next to the bus stop.', ['Yes, by the bus stop.','You’re next to the bus stop.','Yes, near the bus stop.','Yes, beside the bus stop.','Next to the bus stop, right?'])
  ],'По телефону просишь оставить последний белый хлеб, нарезать его и уточняешь оплату и место. До пекарни у автобусной остановки пять минут. Тебя зовут Алекс.');
  add('bakery-morning-pickup',5,[
    t('Can I have a phone number for the order?', 'Можно номер телефона для заказа?', '555-0130.', '555-0130.', ['555 0130.','It’s 555-0130.','My number is 555-0130.','Five five five zero one three zero.','Five five five oh one three oh.']),
    t('Thanks. One box for all six rolls?', 'Спасибо. Все шесть булочек в одну коробку?', 'Да, в одну коробку.', 'Yes, one box, please.', ['All in one box, please.','Yes, all together.','One box is fine.','Yes, all six in one box.','Yes, please.','One box, thanks.']),
    t('We open at seven, but your order will be ready at eight.', 'Открываемся в семь, но ваш заказ будет готов в восемь.', 'Хорошо. Где забирать заказ?', 'OK. Where do I pick it up?', ['Where do I pick up my order?','Where can I get my order?','OK. Do I pick it up here?','Where is the pickup counter?','Where do I collect it?']),
    t('Right here, at this counter.', 'Прямо здесь, у этой стойки.', 'Отлично, увидимся завтра.', 'Great, see you tomorrow.', ['OK, see you tomorrow.','See you tomorrow, thanks.','Perfect. See you tomorrow.','Thank you, see you tomorrow.','Great, I’ll see you tomorrow.'])
  ],'Ты заказываешь шесть белых булочек на завтра, к восьми утра. Заказ на имя Анна, в одной коробке, оплата при получении. Телефон: 555-0130.');
  add('bakery-outside-table',4,[
    t('The chair is here. Do you need anything else?', 'Стул здесь. Еще что-нибудь нужно?', 'Можно немного воды?', 'Can we have some water?', ['Some water, please.','Can I have some water, please?','Water, please.','Can you bring some water?','Can we get some water, please?']),
    t('Yes. I’ll bring a jug. Are you staying for lunch?', 'Да, принесу кувшин. Вы останетесь на обед?', 'Нет, только перекусим.', 'No, just a snack.', ['Just a snack, thanks.','No, only a snack.','We’re just having a snack.','No lunch, just a snack.','No, we just want a snack.']),
    t('That’s fine. We close at three today.', 'Хорошо. Сегодня закрываемся в три.', 'А сейчас сколько времени?', 'What time is it now?', ['What’s the time now?','What time is it?','Do you have the time?','What’s the time?','And what time is it now?']),
    t('It’s two o’clock.', 'Два часа.', 'У нас есть час. Отлично.', 'We have an hour. Great.', ['Great, we have an hour.','An hour is fine, thanks.','That’s fine. We have an hour.','Great, that gives us an hour.','We have one hour. That’s good.'])
  ],'Вы втроем перекусите у пекарни на улице. Нужны дополнительный стул и вода. Пекарня сегодня закрывается в три, а сейчас два. Потом нужно узнать, где заказать еду.');
})(typeof window!=='undefined'?window:globalThis);
(function(root){
  'use strict';
  const {turn:t}=root.OfflineContent;
  function add(id,at,turns,context){const d=root.DIALOGUES.find(d=>d.id===id);d.turns.splice(at,0,...turns);d.context=context;root.REVISED_DIALOGUE_IDS.push(id);}
  add('takeout-pickup-name',3,[
    t('I have two orders for Alex. What food did you order?', 'У меня два заказа на имя Алекс. Что вы заказали?', 'Курицу с рисом.', 'Chicken and rice.', ['Chicken with rice.','I ordered chicken and rice.','It’s chicken and rice.','The chicken and rice.','Chicken and rice, please.']),
    t('One meal or two?', 'Одна порция или две?', 'Две, для меня и коллеги.', 'Two, for me and my colleague.', ['Two meals, for me and a colleague.','Two. One for me and one for my colleague.','Two meals, for me and my coworker.','Two, for me and a coworker.','One for me and one for my coworker.']),
    t('Yes, here it is. Do you need forks?', 'Да, вот он. Нужны вилки?', 'Да, две, пожалуйста.', 'Yes, two forks, please.', ['Two forks, please.','Yes, two, please.','Can I have two forks?','Two, thanks.','Yes, two forks, thanks.']),
    t('Anything else before I close the bag?', 'Что-нибудь еще, прежде чем я закрою пакет?', 'Можно добавить бутылку воды?', 'Can I add a bottle of water?', ['A bottle of water too, please.','Can I have a bottle of water as well?','And a bottle of water, please.','I’d like to add a bottle of water.','Can I get a bottle of water too?']),
    t('Of course. That’s one dollar extra.', 'Конечно. Это еще один доллар.', 'Вот доллар.', 'Here’s a dollar.', ['Here you go. One dollar.','A dollar. Here you go.','Here you are.','Here you go.','Here’s one dollar.']),
    t('Thanks. The water and forks are in the bag.', 'Спасибо. Вода и вилки в пакете.', 'Отлично. Это оба обеда?', 'Great. Are both meals in there?', ['Are both meals in the bag?','Great. Are the two meals in there?','Is that both meals?','Are both lunches in the bag?','Are both lunches in there?'])
  ],'Ты забираешь оплаченный онлайн заказ №17 на имя Алекс: два обеда с курицей и рисом, для тебя и коллеги. У стойки добавляешь бутылку воды за доллар и просишь две вилки.');
  const pickup=root.DIALOGUES.find(d=>d.id==='takeout-pickup-name');pickup.turns[9].en='Yes, both meals. Can I see the order on your phone?';pickup.turns[9].ru='Да, оба обеда. Можно посмотреть заказ на вашем телефоне?';
  add('takeout-napkins',3,[
    t('Here are two packets. Do you have forks?', 'Вот два пакетика. Вилки у вас есть?', 'Нет. Можно две вилки?', 'No. Can I have two forks?', ['Two forks, please.','No, two forks, please.','I need two forks, please.','Can you give me two forks?','No, can I have two forks, please?']),
    t('They’re in this drawer.', 'Они в этом ящике.', 'Я не могу его открыть. Поможете?', 'I can’t open it. Can you help?', ['Can you help me open it?','I can’t open the drawer. Can you help?','It won’t open. Can you help me?','Can you open it for me, please?','I can’t open it. Can you open it, please?']),
    t('Sure. Here are your forks.', 'Конечно. Вот ваши вилки.', 'За них нужно платить?', 'Do I need to pay for them?', ['Are they free?','Do I pay for these?','Do the forks cost anything?','Do I have to pay for them?','Is there a charge for the forks?']),
    t('No, they’re free.', 'Нет, они бесплатные.', 'Спасибо. Положите всё в этот пакет.', 'Thanks. Put everything in this bag, please.', ['Can you put it all in this bag, please?','Everything in this bag, please.','Thanks. Can you put these in this bag?','Please put them all in here.','Thank you. All in this bag, please.']),
    t('This bag is a bit small.', 'Этот пакет маловат.', 'Тогда можно пакет побольше?', 'Can I have a bigger bag, then?', ['A bigger bag, please.','Can you give me a bigger bag?','Then a bigger bag, please.','Can I have a larger bag?','Could I have a bigger bag, please?']),
    t('Here’s a bigger one. It’s two dollars.', 'Вот побольше. Он стоит два доллара.', 'Нет, спасибо. Я понесу так.', 'No, thanks. I’ll carry them like this.', ['No, I’ll just carry them, thanks.','No, thanks. I can carry them.','I’ll carry them in my hands, thanks.','No bag, thanks. I’ll carry them.','No, thank you. I’ll carry everything.'])
  ],'После покупки возвращаешься за салфетками, двумя пакетиками соуса и двумя вилками. Ящик с вилками не открывается. Большой пакет платный, поэтому решаешь понести вещи в руках.');
  add('takeout-sandwich',5,[
    t('I’ve cut it in half. One bag for both halves?', 'Я разрезал пополам. Обе половинки в один пакет?', 'В два пакета, пожалуйста.', 'Two bags, please.', ['In two bags, please.','Separate bags, please.','One bag for each half, please.','Can I have two bags, please?','Can you put them in two bags?']),
    t('Sure. Would you like any ketchup?', 'Конечно. Томатный соус нужен?', 'Да, один пакетик.', 'Yes, one packet, please.', ['One packet, please.','Just one, thanks.','Yes, just one, please.','One packet of ketchup, please.','Yes, one, thanks.']),
    t('Anything to drink?', 'Что-нибудь попить?', 'Бутылку воды, пожалуйста.', 'A bottle of water, please.', ['One bottle of water, please.','Can I have a bottle of water?','I’d like a bottle of water.','Water, please. A bottle.','I’ll have a bottle of water.']),
    t('Cold or room temperature?', 'Холодную или комнатной температуры?', 'Холодную, пожалуйста.', 'Cold, please.', ['A cold one, please.','Cold water, please.','Cold, thanks.','I’d like it cold, please.','A cold bottle, please.'])
  ],'Ты берешь сэндвич с курицей на белом хлебе, без сыра, с томатом и салатом. Половинки нужны в разных пакетах. Еще берешь пакетик соуса и холодную воду. Всё с собой.');
  add('takeout-wrong-counter',2,[
    t('Over there. Do you have your receipt?', 'Вон там. У вас есть чек?', 'Нет, у меня заказ на телефоне.', 'No, I have the order on my phone.', ['My order is on my phone.','No, it’s on my phone.','I have it on my phone.','No receipt, but I have the order on my phone.','No, the order is here on my phone.']),
    t('Can you show me the order?', 'Можете показать заказ?', 'Конечно, вот он.', 'Sure, here it is.', ['Here you go.','Yes, here you are.','Of course. Here it is.','Here it is.','Sure, here you go.','Yes, it’s right here.']),
    t('Chicken and rice, number twenty-one?', 'Курица с рисом, номер двадцать один?', 'Да, всё верно.', 'Yes, that’s right.', ['That’s right.','Yes, exactly.','Yes, that’s my order.','Correct.','Yes, correct.','That’s it.','Yes, chicken and rice.']),
    t('And the name is Alex?', 'И имя Алекс?', 'Да, Алекс.', 'Yes, Alex.', ['Yes, that’s me.','Yes, I’m Alex.','That’s right, Alex.','My name is Alex.','Alex, yes.','Yes, that’s right.'])
  ],'Ты ждешь оплаченный заказ №21 с курицей и рисом на имя Алекс. Чека нет, но заказ есть на телефоне. Нужно найти стойку выдачи, показать подтверждение и узнать, где ждать.');
  add('takeout-second-bag',5,[
    t('Would you like a receipt?', 'Чек нужен?', 'Да, пожалуйста.', 'Yes, please.', ['Yes, thanks.','A receipt, please.','Yes, thank you.','That would be great, thanks.','Can I have one, please?','Yes, I’d like a receipt.']),
    t('A paper receipt, or shall I email it?', 'Бумажный или отправить по электронной почте?', 'Бумажный, пожалуйста.', 'A paper receipt, please.', ['Paper, please.','On paper, please.','I’d like a paper receipt.','Paper is fine, thanks.','Just paper, thanks.']),
    t('Here it is. Your food is still hot.', 'Вот он. Еда еще горячая.', 'Можно закрыть пакет?', 'Can you close the bag?', ['Please close the bag.','Can you close it, please?','Could you close the bag?','Can you shut the bag, please?','Close it, please.']),
    t('Of course. Are you walking far?', 'Конечно. Вам далеко идти?', 'Нет, я живу рядом.', 'No, I live nearby.', ['No, I live near here.','I live close by.','No, my home is near here.','Not far. I live nearby.','No, I live just around the corner.'])
  ],'В заказе два бургера и картошка. Картошка осталась во втором пакете на стойке. Нужно объединить еду в один пакет, получить бумажный чек и закрыть пакет перед короткой дорогой домой.');
  add('takeout-lunch-friend',4,[
    t('Do you want to eat outside?', 'Хочешь поесть на улице?', 'Нет, сегодня холодно.', 'No, it’s cold today.', ['It’s too cold today.','No, it’s too cold.','No, it’s cold out.','Not today. It’s cold.','No, it’s cold outside.']),
    t('We can eat at my place, then.', 'Тогда можем поесть у меня.', 'Отлично. Ты дома?', 'Great. Are you at home?', ['Are you home?','Great, are you home?','Are you at your place?','Sounds good. Are you at home?','OK. Are you home now?']),
    t('Yes. Is Sam coming too?', 'Да. Сэм тоже придет?', 'Нет, только мы вдвоем.', 'No, just the two of us.', ['Just us two.','No, just us.','No, only the two of us.','It’s just you and me.','No, just you and me.']),
    t('OK. The pizza is sixteen dollars.', 'Хорошо. Пицца стоит шестнадцать долларов.', 'Я заплачу половину — восемь долларов.', 'I’ll pay half. Eight dollars.', ['Eight dollars for me, then.','I’ll pay eight dollars. Half.','Half is eight dollars. I’ll pay that.','I can pay half, eight dollars.','I’ll give you eight dollars for my half.'])
  ],'Вы с другом делите большую пиццу с курицей на обед. На улице холодно, поэтому едите у друга. Больше никто не придет. Пицца стоит шестнадцать долларов, твоя половина — восемь.');
  for(const d of root.DIALOGUES){if(d.turns.length!==10)throw Error(d.id+' needs 10 turns');d.length='long';}
})(typeof window!=='undefined'?window:globalThis);
