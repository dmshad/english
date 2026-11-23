/* Introductions contain the starting circumstances only. Events unfold in the dialogue. */
(function(root){
  const intros={
    'coffee-to-go':'Ты зашел в кофейню по дороге на работу.',
    'window-table':'Вы с другом пришли в кафе и стоите у входа.',
    'no-tea':'Ты у стойки кафе. Только что попросил чай.',
    'wrong-drink':'Ты сидишь в кафе. Твой заказ — кофе без молока.',
    'breakfast':'Утро. Ты зашел один в небольшое кафе позавтракать.',
    'waiting-friend':'Ты пришел в кафе раньше друга. В зале довольно шумно.',
    'bread-sliced':'Ты зашел в пекарню за хлебом. В своей сумке несешь яйца.',
    'school-snacks':'Ты покупаешь перекус для двух детей — Эммы и Лиама.',
    'birthday-cake':'У Сэма шестой день рождения. Ты пришел в пекарню за тортом.',
    'hold-last-loaf':'Ты звонишь в пекарню по пути домой. До нее пять минут. Тебя зовут Алекс.',
    'bakery-morning-pickup':'Ты зашел в пекарню накануне завтрака с гостями. Тебя зовут Анна.',
    'bakery-outside-table':'Вы втроем подошли к пекарне. На улице стоят столики.',
    'takeout-pickup-name':'Ты пришел за оплаченным онлайн заказом №17 на имя Алекс.',
    'takeout-napkins':'Ты только что купил еду навынос и еще не ушел далеко от стойки.',
    'takeout-sandwich':'Ты у стойки, где сэндвичи собирают при покупателе.',
    'takeout-wrong-counter':'Ты оплатил заказ №21 на имя Алекс и стоишь у кассы.',
    'takeout-second-bag':'Ты получил еду навынос: в заказе два бургера и картошка.',
    'takeout-lunch-friend':'Вы с другом обсуждаете обед по телефону.',
    'takeout-phone-pizza':'Ты звонишь в пиццерию. Тебя зовут Алекс Грин.',
    'takeout-delivery-door':'Ты ждешь доставку дома. Адрес: дом 12, квартира 3, второй этаж. Входная дверь зеленая.',
    'pilot-friend-evening':'Ты приехал к другу на ужин. Он открывает тебе дверь.',
    'pilot-library':'Тебя зовут Анна (Anna). Ты впервые пришел в эту библиотеку за книгой для изучения английского.'
  };
  for(const d of root.DIALOGUES){if(!intros[d.id])throw Error('Missing introduction '+d.id);d.authorSynopsis=d.context;d.context=intros[d.id];}
})(typeof window!=='undefined'?window:globalThis);
