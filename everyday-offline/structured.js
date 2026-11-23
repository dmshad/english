/* Bounded, fully consuming construction parser for the two reviewed pilot dialogues.
 * No word-bag scoring. Unknown syntax never becomes a red verdict by default. */
(function(root){
  'use strict';
  const contractions={"i'm":'i am',"we're":'we are',"you're":'you are',"it's":'it is',"that's":'that is',"there's":'there is',"where's":'where is',"what's":'what is',"i'd":'i would',"we'd":'we would',"i'll":'i will',"we'll":'we will',"i've":'i have',"we've":'we have',"don't":'do not',"doesn't":'does not',"can't":'cannot',"isn't":'is not',"aren't":'are not',"won't":'will not',"wouldn't":'would not',"couldn't":'could not',"let's":'let us'};
  function normalize(text){return String(text).normalize('NFKC').toLowerCase().replace(/[’‘]/g,"'").replace(/\b[a-z]+'[a-z]+\b/g,w=>contractions[w]||w).replace(/[^a-z0-9'\s]/g,' ').replace(/\s+/g,' ').trim();}
  function edges(text){
    let core=text;const blocks=[];
    const take=(re,role,last=false)=>{const m=core.match(re);if(!m)return false;blocks.push({role,text:m[0].trim()});core=last?core.slice(0,m.index).trim():core.slice(m[0].length).trim();return true;};
    for(let i=0;i<3;i++){if(!take(/^(?:yes|yeah|yep|yup|sure|okay|ok|of course|certainly|absolutely|all right)\b\s*/,'Подтверждение'))break;}
    for(let i=0;i<3;i++){if(!take(/\s*\b(?:please|thank you(?: very much| so much)?|thanks(?: a lot| so much)?)$/,'Вежливость',true))break;}
    take(/^(?:thanks(?: a lot| so much)?|thank you(?: very much| so much)?)\s+/,'Вежливость');
    take(/^please\s+/,'Вежливость');
    return {core,blocks,affirmed:blocks.some(b=>b.role==='Подтверждение'),polite:blocks.some(b=>b.role==='Вежливость')};
  }
  const good=(blocks=[],note='Смысл, конструкция и грамматика распознаны.')=>({status:'correct',note,blocks});
  const bad=(code,fragment,note,correction,blocks=[])=>({status:'error',code,fragment,note,correction,blocks});
  const unusual=(note,blocks=[])=>({status:'acceptable',note,blocks});
  const unknown=(fragment='',blocks=[])=>({status:'unknown',fragment,blocks,note:fragment?'Распознана часть конструкции, но выражение «'+fragment+'» не удалось уверенно разобрать. Это не означает, что оно ошибочно.':'У этой формулировки пока нет надежного разбора. Это не ошибка: ее нужно разобрать и при необходимости расширить правила.'});
  const numbers={a:1,an:1,one:1,two:2,three:3,four:4,five:5,six:6,seven:7,eight:8,nine:9,ten:10};
  const lexemes=[
    ['english language textbook','textbook',1,true],['english textbook','textbook',1,true],['english coursebook','textbook',1,true],['textbook for learning english','textbook',1,false],['book for learning english','textbook',1,false],['book to learn english','textbook',1,false],['english book','textbook',1,true],['english textbooks','textbook',2,true],['textbooks','textbook',2,false],['textbook','textbook',1,false],['book','textbook',1,false],['books','textbook',2,false],
    ['glasses','glass',2,false],['glass','glass',1,false],['bottles','bottle',2,false],['bottle','bottle',1,false],['cups','cup',2,false],['cup','cup',1,false],['mug','mug',1,false],['sip','sip',1,false],['drink','drink',1,false],['plates','plate',2,false],['plate','plate',1,false],['knives','knife',2,false],['knife','knife',1,false],['bags','bag',2,false],['bag','bag',1,false],['waters','water',2,false],['water','water',0,false],['ice','ice',0,true],['milk','milk',0,false],['juice','juice',0,false],['tea','tea',0,false],['coffee','coffee',0,false]
  ];
  function nounPhrase(text,full=false){
    let s=text.trim(),amount=null,det=null,count=null;const notes=[];
    s=s.replace(/^just /,'');
    const quantifier=s.match(/^(a few|few|many|much) /);if(quantifier)s=s.slice(quantifier[0].length);
    const small=s.match(/^(a little bit of|a little|a bit of|a small amount of) /);
    if(small){amount='small';s=s.slice(small[0].length);}
    const pair=s.match(/^(a couple of|a pair of) /);if(pair){count=2;s=s.slice(pair[0].length);}
    const determiner=s.match(/^(a|an|the|some|any|my|our|your|this|that|these|those|one|two|three|four|five|six|seven|eight|nine|ten|[0-9]+) /);
    if(determiner){det=determiner[1];s=s.slice(determiner[0].length);if(numbers[det]!=null)count=numbers[det];else if(/^\d+$/.test(det))count=Number(det);}
    const second=s.match(/^(a|an|the|some|my|our|your|this|that|these|those) /);
    if(second){notes.push({code:'double-determiner',fragment:(det||'')+' '+second[1],note:'Здесь два несовместимых определителя перед одним существительным. Например, my glass, а не a my glass.',correction:second[1]});s=s.slice(second[0].length);}
    const modifier=s.match(/^((?:(?:cold|warm|hot|clean|small|big|large|plain|still|sparkling|empty|white|blue|red|plastic|paper|metal) ){1,3})/);
    if(modifier)s=s.slice(modifier[0].length);
    let content=null;
    const of=s.match(/^(glass(?:es)?|bottles?|cups?|mug|sip|drink) of (.+)$/);
    if(of){content=nounPhrase(of[2],false);if(!content||content.kind!=='water')return null;s=of[1];}
    else {
      const missing=s.match(/^(glass(?:es)?|bottles?) (water)$/);
      if(missing){s=missing[1];content={kind:'water',count:null};notes.push({code:'missing-of',fragment:missing[0],note:'Между емкостью и содержимым здесь нужен of: a glass of water, a bottle of water.',correction:missing[1]+' of water'});}
    }
    const lex=lexemes.find(row=>row[0]===s);if(!lex)return null;
    const [word,kind,plural,vowel]=lex;
    if(quantifier&&['a few','few','many'].includes(quantifier[1])&&plural!==2)notes.push({code:'count-quantifier',fragment:text,note:'Few/many требуют исчисляемого существительного во множественном числе. Для небольшого количества воды можно a little water.',correction:'a little water'});
    if(quantifier&&quantifier[1]==='much'&&plural!==0)notes.push({code:'mass-quantifier',fragment:text,note:'Much используется с неисчисляемым существительным. Для plates здесь нужно many или конкретное количество.',correction:'two plates'});
    if(amount==='small'&&plural===2)notes.push({code:'little-plural',fragment:text,note:'A little относится к неисчисляемому количеству. Здесь нужно a little water; для отдельных порций нужна другая конструкция.',correction:'a little water'});
    if(kind==='water'&&plural===0&&count>1)notes.push({code:'serving-plural',fragment:text,note:'Если считаются порции, после этого числа нужна форма waters или емкость: two glasses of water.',correction:count+' glasses of water'});
    if(content?.errors?.length)notes.push(...content.errors);
    if(content?.kind==='water'&&content.plural===2)notes.push({code:'mass-in-container',fragment:text,note:'В выражении емкости с обычной водой используется of water, не of waters.',correction:text.replace(/\bwaters\b/,'water')});
    if(det==='a'||det==='an'){
      const initial=modifier?modifier[1]:word;
      const startsVowel=modifier?/^[aeiou]/.test(initial):vowel;
      if((det==='an')!==startsVowel)notes.push({code:'a-an',fragment:det+' '+initial,note:'Выбор a/an зависит от следующего звука. Здесь нужно '+(startsVowel?'an':'a')+'.',correction:(startsVowel?'an':'a')+' '+initial});
    }
    if(plural===2 && count===1)notes.push({code:'singular-determiner-plural',fragment:text,note:'После a/an/one здесь нужна форма единственного числа, а не множественного.',correction:kind==='knife'?'a knife':'a '+kind});
    if(plural===1 && count>1)notes.push({code:'missing-plural',fragment:text,note:'После '+count+' здесь нужна форма множественного числа: '+(kind==='knife'?'knives':kind==='glass'?'glasses':kind+'s')+'.',correction:count+' '+(kind==='knife'?'knives':kind==='glass'?'glasses':kind+'s')});
    if(plural===1 && (det==='these'||det==='those'))notes.push({code:'demonstrative-number',fragment:text,note:'These/those требуют множественного числа; перед одним предметом нужны this/that.',correction:(det==='these'?'this':'that')+' '+word});
    if(plural===2 && (det==='this'||det==='that'))notes.push({code:'demonstrative-number',fragment:text,note:'This/that обозначают один предмет; здесь нужно these/those или единственное число.',correction:(det==='this'?'these':'those')+' '+word});
    if(full && plural===1 && det===null && count===null)notes.push({code:'missing-determiner',fragment:text,note:'В этой полной просьбе перед единственным исчисляемым существительным нужен определитель: a/an, the, my и т. п.',correction:(vowel?'an ':'a ')+text});
    if((kind==='milk'||kind==='ice')&&(count!=null||plural===2))return null; // Not enough context to diagnose a serving/type use.
    return {kind,count:count??(plural===1?1:null),plural,content,amount,det,modifier:modifier?.[1]?.trim(),errors:notes,text};
  }
  function request(text){
    let s=text,style='neutral';
    s=s.replace(/^(can|could|may|might) (i|we) please /,'$1 $2 ')
      .replace(/^(can|could|would|will) you please /,'$1 you ');
    const patterns=[
      /^(?:can|could|may|might) (?:i|we) (?:have|get|borrow) (.+)$/,
      /^(?:can|could|would|will) you (?:bring|give|pass|get|lend|fetch) (?:(?:me|us) )?(.+)$/,
      /^(?:i|we) (?:would (?:like|love|prefer)|will (?:have|take)|want|need|would appreciate) (?!to\b|it if\b)(.+)$/,
      /^i am looking for (.+)$/,
      /^(?:can|could|would) you help me (?:find|get) (.+)$/,
      /^(?:i|we) would (?:like|love) to (?:have|get|borrow) (.+)$/,
      /^i could use (.+)$/,
      /^i was wondering if (?:i could (?:have|get|borrow)|you could (?:bring|give|pass|get|lend) me) (.+)$/,
      /^would it be possible (?:for me )?to (?:have|get|borrow) (.+)$/,
      /^would you mind (?:bringing|giving|passing|getting|lending) (?:me|us) (.+)$/,
      /^is there any chance (?:i could (?:have|get)|you could (?:bring|give|get) me) (.+)$/,
      /^i would be grateful if you could (?:bring|give|pass|get|lend) me (.+)$/,
      /^i would appreciate it if you could (?:bring|give|pass|get|lend) me (.+)$/,
      /^i was hoping (?:i could (?:have|get|borrow)|you could (?:bring|give|pass|get|lend) me) (.+)$/,
      /^(?:can|could|would|will) you (?:please )?pour (?:me )?(.+)$/,
      /^would you mind pouring me (.+)$/,
      /^do you mind if i (?:have|get|borrow|take) (.+)$/,
      /^would you mind if i (?:had|borrowed|took) (.+)$/
    ];
    for(const p of patterns){const m=s.match(p);if(m)return {object:m[1],full:true,style,prefix:s.slice(0,s.length-m[1].length).trim()};}
    const wish=s.match(/^(.+?) would be (?:great|nice|good|lovely|perfect)(?: for me)?$/);if(wish)return {object:wish[1],full:true,style:'neutral',prefix:'would be nice — пожелание'};
    const direct=s.match(/^(?:give|bring|pass|get|lend|fetch) (?:me|us) (.+)$/);
    if(direct)return {object:direct[1],full:true,style:'direct',prefix:s.slice(0,s.length-direct[1].length).trim()};
    const slang=s.match(/^gimme (.+)$/);if(slang)return {object:slang[1],full:true,style:'slang',prefix:'gimme'};
    const formal=s.match(/^i request that you (?:give|bring) me (.+)$/);
    if(formal)return {object:formal[1],full:true,style:'formal',prefix:s.slice(0,s.length-formal[1].length).trim()};
    return {object:s,full:false,style:'fragment',prefix:''};
  }
  function objectAnswer(s,frame,blocks,polite){
    const req=request(s),np=nounPhrase(req.object,req.full);
    if(!np)return req.full?unknown(req.object,[...blocks,{role:'Просьба',text:req.prefix}]):null;
    const parts=[...blocks,...(req.prefix?[{role:'Просьба',text:req.prefix}]:[]),{role:'Предмет и определители',text:req.object}];
    if(/\b(?:borrow|lend|lending)\b/.test(req.prefix)&&frame.noun!=='textbook')return unknown(req.object,parts);
    if(/\b(?:pour|pouring)\b/.test(req.prefix)&&frame.noun!=='water'&&frame.noun!=='glass')return unknown(req.object,parts);
    if(np.errors.length){const first=np.errors[0];return {...bad(first.code,first.fragment,first.note,first.correction,parts),diagnostics:np.errors};}
    let match=frame.noun===np.kind;
    if(frame.noun==='water' && np.content?.kind==='water')match=true;
    if(frame.noun==='glass' && np.kind==='glass' && (!np.content||np.content.kind==='water'))match=true;
    if(!match)return bad('wrong-object',req.object,'Грамматика этой группы понятна, но по заданию нужен другой предмет: '+frame.objectLabel+'.',frame.example,parts);
    if(frame.quantity!=null && np.count!==frame.quantity){
      if(np.count==null)return unknown(req.object,parts);
      return bad('wrong-quantity',req.object,'По заданию нужно '+frame.quantity+', а в ответе указано '+np.count+'.',frame.example,parts);
    }
    if(frame.amount==='small' && np.amount!=='small')return unknown(req.object,parts);
    if(frame.noun==='glass' && np.modifier?.split(' ').includes('empty'))return bad('wrong-property',req.object,'Здесь выбирается стакан воды, а не пустой стакан.',frame.example,parts);
    if(np.modifier?.split(' ').includes('empty')&&np.content?.kind==='water')return bad('conflicting-properties',req.object,'Empty означает пустой, а of water здесь означает с водой. Эти условия противоречат друг другу.',frame.example,parts);
    if(np.det==='some'&&np.plural===1)return unusual('Some перед единственным предметом может означать «какой-то». Здесь это звучит необычно; обычнее a/an или конкретный определитель.',parts);
    if(req.style==='formal'||req.style==='slang'&&frame.register==='service'||req.style==='direct'&&frame.register==='service')return unusual('Грамматика и смысл верные. В этой спокойной ситуации формулировка '+(req.style==='formal'?'слишком официальная.':'слишком прямая или фамильярная.')+' Более нейтральный вариант показан ниже.',parts);
    const result=good(parts);
    result.grammarNotes=np.kind==='water'&&!np.content
      ?[np.count!==null||np.plural===2?'Water разобрано как порция напитка; исчисляемое употребление здесь возможно.':'Water разобрано как вещество: water и some water допустимы, some не обязательно.']
      :[np.content?'Артикль и число проверены у главного слова емкости; of связывает его с water.':req.full?'Проверены число и определитель существительного в полной конструкции.':'Распознана краткая разговорная реплика; правила полного предложения не применяются механически.'];
    if(frame.register==='service'&&!req.full&&np.plural===1&&np.det===null)return unusual('Это краткое название предмета. Здесь нейтральнее просьба с a/an или другим определителем; в полной фразе отсутствие определителя уже было бы ошибкой.',parts);
    return result;
  }
  const yes=/^(?:(?:yes|yeah|yep|yup|sure|okay|ok|of course|certainly|absolutely) ?)?(?:that is (?:great|fine|perfect|good|right)|it is (?:great|fine|perfect|good)|(?:great|fine|perfect|good|lovely)|that works(?: for me)?|that sounds (?:good|great|fine)|sounds (?:good|great|fine)|it works for me|that would be (?:great|nice)|i would like that|that is (?:quite|absolutely) fine)$/;
  function parseCore(s,frame,blocks=[],polite=false,affirmed=false){
    if(frame.kind==='object'){
      if(!s && affirmed && frame.allowYes)return good([...blocks,{role:'Смысл',text:'принято предложение: '+frame.objectLabel}]);
      if(s==='no'&&frame.allowYes)return bad('opposite-intent',s,'Это отказ от предложения, а по заданию вы его принимаете.',frame.example,blocks);
      if(frame.noun==='glass'){
        const vessel=s.match(/^(?:(?:can|could|may) i have it )?in (.+)$/);
        if(vessel)return objectAnswer(vessel[1],frame,[...blocks,{role:'Емкость',text:'in'}],polite);
      }
      const denial=s.match(/^(?:no(?: thank you| thanks)?|i do not want|i would not like) (?:any )?(water|a glass|two plates|a knife|an english textbook)$/);
      if(denial)return bad('opposite-intent',s,'В ответе отказ, а в задании нужно попросить или принять предложенное.',frame.example,blocks);
      return objectAnswer(s,frame,blocks,polite);
    }
    if(frame.kind==='small'){
      if(/^(?:just )?(?:a little(?: bit)?|a bit|not much|a small amount)(?: of water| water)?$/.test(s))return good([...blocks,{role:'Количество',text:s}]);
      if(/^(?:a lot of|lots of|plenty of) water$/.test(request(s).object))return bad('wrong-amount',request(s).object,'В ответе много воды, а по заданию нужно небольшое количество.',frame.example,blocks);
      return objectAnswer(s,{...frame,noun:'water',amount:'small'},blocks,polite);
    }
    if(frame.kind==='no-ice'){
      if(/^(?:no(?: ice(?: for me)?)?|without (?:any )?ice|(?:i )?(?:do not want|do not need|would prefer no|would rather have no) ice|(?:i would like|can i have) (?:it|the water) without ice)$/.test(s))return good([...blocks,{role:'Отказ от льда',text:s}]);
      if(/^(?:no(?: thanks| thank you)? )?(?:i (?:do not want|do not need|would not like)(?: any)? ice|i would (?:prefer|like) (?:it|the water) (?:without|with no) ice|(?:please )?do not (?:add|put)(?: any)? ice(?: in (?:it|my water))?|leave (?:the )?ice out)$/.test(s))return good([...blocks,{role:'Отказ от льда',text:s}]);
      const positive=objectAnswer(s,{noun:'ice',objectLabel:'лед',example:frame.example},blocks,polite);
      if(positive?.status==='correct')return bad('opposite-intent',s,'Здесь вы просите лед, а по заданию нужно отказаться от него.',frame.example,positive.blocks);
      return positive?.status==='error'?positive:null;
    }
    if(frame.kind==='location'){
      if(/^(?:put (?:it|my plate) |(?:you can|please) put (?:it|my plate) |i would like it )?(?:on|onto) the table(?: please)?$/.test(s))return good([...blocks,{role:'Место',text:s}]);
      if(/^(?:on|onto) (?:a|this|that) table$/.test(s))return good([...blocks,{role:'Место',text:s}]);
      if(/^(?:under|behind|in|at) the table$/.test(s))return bad('wrong-place',s,'По заданию тарелку нужно поставить на поверхность стола: on the table.',frame.example,blocks);
      if(/^(?:on|onto) table$/.test(s))return bad('missing-determiner',s,'Здесь речь об определенном столе: on the table, а не on table.',frame.example,blocks);
    }
    if(frame.kind==='tv'){
      if(/^(?:(?:i|we) (?:want|would like|would love) to |let us |(?:can|could) we |i (?:feel like|fancy) |how about |what about |i am in the mood for |i would enjoy )?(?:watch(?:ing)?)(?: some)? (?:tv|television|the tv|the television)(?: for a (?:bit|while))?$/.test(s)){
        // The verb form is constrained by its construction, not merely the word watch.
        if(/^(?:i feel like|i fancy|how about|what about|i am in the mood for|i would enjoy) watch\b/.test(s))return bad('gerund-required','watch','После этой конструкции нужна форма watching.',s.replace(/\bwatch\b/,'watching'),blocks);
        if(/^(?:i want to|i would like to|i would love to|we want to|let us|can we|could we) watching\b/.test(s))return bad('infinitive-required','watching','После to или модального глагола здесь нужна начальная форма watch.',s.replace('watching','watch'),blocks);
        return good([...blocks,{role:'Занятие',text:s}]);
      }
      if(/^(?:i|we) (?:want|would like) to (?:see|look) (?:tv|television|the tv|the television)$/.test(s))return bad('watch-tv',s,'В этой сцене речь о просмотре передачи: watch TV. See the TV означает видеть сам телевизор; look требует другой конструкции.',frame.example,blocks);
    }
    if(frame.kind==='yes'){
      if(!s&&affirmed||yes.test(s)||/^(?:eight|8)(?: (?:is|would be))? (?:fine|good|great|perfect|ok|okay)(?: for me)?$/.test(s))return good([...blocks,{role:'Согласие',text:s||'да'}]);
      if(/^(?:no|no that is not (?:fine|good)|(?:eight|8) is not (?:fine|good))$/.test(s))return bad('opposite-intent',s,'По заданию нужно согласиться.',frame.example,blocks);
    }
    if(frame.kind==='ready'){
      if(/^(?:(?:i am|we are) )?(?:already |all )?(?:ready|set)(?: (?:now|to start))?$/.test(s)||/^(?:let us (?:start|begin)|we can (?:start|begin)|i am ready to (?:go|watch|begin))$/.test(s)||!s&&affirmed)return good([...blocks,{role:'Готовность',text:s||'да'}]);
      if(/^(?:i am not ready|not ready|not yet|no)$/.test(s))return bad('opposite-intent',s,'Ответ означает «пока не готов», а по заданию вы готовы.',frame.example,blocks);
    }
    if(frame.kind==='beneficiary'){
      if(/^(?:(?:it|the book) is )?for (?:me|myself)$/.test(s)||/^(?:it is mine|it is for my own use|i need it for myself)$/.test(s))return good([...blocks,{role:'Для кого',text:s}]);
      if(/^(?:for i|for my|to me)$/.test(s))return bad('for-me',s,'Здесь нужно for me («для меня»). После for используется me, не I/my.',frame.example,blocks);
      if(/^(?:for my child|for (?:him|her|them|you))$/.test(s))return bad('wrong-beneficiary',s,'По заданию книга нужна вам, а не другому человеку.',frame.example,blocks);
    }
    if(frame.kind==='one'){
      if(/^(?:just )?(?:one|1)(?: (?:book|textbook))?(?: for me)?$/.test(s))return good([...blocks,{role:'Количество',text:s}]);
      const np=nounPhrase(s,false);if(np?.kind==='textbook'){if(np.errors.length){const d=np.errors[0];return bad(d.code,d.fragment,d.note,d.correction,blocks);}if(np.count===1)return good([...blocks,{role:'Количество',text:s}]);if(np.count>1)return bad('wrong-quantity',s,'По заданию нужна одна книга.',frame.example,blocks);}
      if(/^(?:two|three|2|3)(?: books)?$/.test(s))return bad('wrong-quantity',s,'По заданию нужна одна книга.',frame.example,blocks);
      if(request(s).full)return objectAnswer(s,{...frame,noun:'textbook',quantity:1,objectLabel:'одна книга',register:'service'},blocks,polite);
    }
    if(frame.kind==='name'){
      if(/^(?:(?:my name is|i am|it is|the name is|i am called|people call me|you can call me) )?anna$/.test(s)||s==='anna is my name')return good([...blocks,{role:'Имя',text:s}]);
      if(/^(?:my name is|i am) (?:ana|anne|ann|alex)$/.test(s))return bad('wrong-name',s,'В этой ситуации нужно назвать имя Anna, а не другое имя.',frame.example,blocks);
    }
    if(frame.kind==='spelling'){
      if(/^(?:(?:it is|anna|sure|yes) )?(?:a n n a|a double n a|anna)$/.test(s))return good([...blocks,{role:'По буквам',text:s}]);
      if(/^(?:(?:it is|anna|sure|yes) )?(?:a n a|a n n e|a n|ana|anne)$/.test(s))return bad('spelling',s,'В имени Anna две n и конечная a: A-N-N-A.',frame.example,blocks);
    }
    if(frame.kind==='duration'){
      if(/^(?:for )?(?:two weeks|2 weeks|a fortnight|one fortnight|fourteen days|14 days)$/.test(s)||/^(?:i (?:need|would like) it|(?:can|could|may) i (?:keep|borrow) it|i would like to (?:keep|borrow) it) for (?:two weeks|2 weeks|a fortnight)$/.test(s))return good([...blocks,{role:'Срок',text:s}]);
      if(/^(?:for )?(?:two|2) week$/.test(s))return bad('plural-weeks',s,'После two нужна форма weeks во множественном числе.',frame.example,blocks);
      if(/^(?:in|on|during|at) (?:two|2) weeks$/.test(s))return bad('duration-for',s,'Здесь вопрос «на какой срок»: for two weeks. In two weeks означает «через две недели».',frame.example,blocks);
      if(/^(?:for )?(?:one week|three weeks|a week|seven days)$/.test(s))return bad('wrong-duration',s,'По заданию срок — две недели.',frame.example,blocks);
    }
    if(frame.kind==='day'){
      if(/^(?:on )?tuesday(?: (?:is|would be) (?:fine|good|great))?$/.test(s)||/^(?:i (?:will|can) (?:come|bring it) back|i will return it|i can return it) (?:on )?tuesday$/.test(s))return good([...blocks,{role:'День',text:s}]);
      if(/^(?:in|at|for) tuesday$/.test(s))return bad('weekday-on',s,'Для дня недели здесь используется on: on Tuesday. В коротком ответе можно просто Tuesday.',frame.example,blocks);
      if(/^(?:on )?(?:monday|wednesday|thursday|friday|saturday|sunday)$/.test(s))return bad('wrong-day',s,'По заданию вы выбираете вторник — Tuesday.',frame.example,blocks);
    }
    if(frame.kind==='bag'){
      const own=/^(?:(?:no|no thanks|no thank you) )?(?:(?:i (?:already )?have|i have (?:already )?got|i brought|i have brought) (?:my own bag|a bag|my bag|one|my own)(?: (?:already|with me))?|(?:my bag|my own bag) is here)$/;
      if(own.test(s)||/^(?:no|no bag|i do not need (?:one|a bag)|i am (?:good|all set))$/.test(s))return good([...blocks,{role:'Отказ от пакета',text:s}]);
      if(/^(?:no(?: thanks| thank you)? )?(?:i have|i have got) (?:own bag|bag)$/.test(s))return bad('bag-determiner',s,'В этой полной фразе нужен определитель: my own bag или a bag.',frame.example,blocks);
      if(/^(?:no(?: thanks| thank you)? )?(?:i have|i have got) (?:a|an|the|some) my (?:own )?bag$/.test(s))return bad('double-determiner',s,'Перед bag нельзя одновременно a/the/some и my. Нужно my own bag.',frame.example,blocks);
      if(/^(?:a bag|i need a bag|i would like a bag)$/.test(s))return bad('opposite-intent',s,'По заданию вы отказываетесь от пакета: свой уже есть.',frame.example,blocks);
    }
    if(frame.kind==='seat-question'){
      if(/^(?:where (?:can|could|may|should) (?:i|we) (?:sit|sit down|have a seat)|where (?:is|are) (?:the seating area|the seats)|is there (?:a place|somewhere) (?:where )?i can sit|(?:can|could|may) i (?:have a seat|sit down|sit somewhere)|where would you like me to sit)$/.test(s))return good([...blocks,{role:'Вопрос о месте',text:s}]);
      if(/^(?:where i can sit|where i can sit down|where can i to sit)$/.test(s))return bad('question-order',s,'В прямом вопросе нужно Where can I sit? После can не ставится to.',frame.example,blocks);
    }
    return null;
  }
  function parse(s,frame,blocks=[],polite=false,affirmed=false){
    const result=parseCore(s,frame,blocks,polite,affirmed);
    if(result&&result.status!=='unknown')return result;
    if((frame.aliases||[]).some(a=>normalize(a)===s))return good([...blocks,{role:frame.label||'Смысл ответа',text:s||'подтверждение'}]);
    return result;
  }
  // Each repair is considered only if the entire repaired utterance has a valid analysis.
  const repairs=[
    [/\bi are\b/,'i am','subject-agreement','С I употребляется am, не are.'],
    [/\bi is\b/,'i am','subject-agreement','С I употребляется am, не is.'],
    [/\bmy name are\b/,'my name is','subject-agreement','Name в единственном числе: my name is.'],
    [/\bi has\b/,'i have','subject-agreement','С I используется have, не has.'],
    [/^(can|could|may|might) (i|we)( please)? (?:has|having)\b/,'$1 $2$3 have','modal-form','После модального глагола нужна начальная форма have.'],
    [/^would you mind to (bring|give|pass|get|lend)\b/,(_,v)=>'would you mind '+({bring:'bringing',give:'giving',pass:'passing',get:'getting',lend:'lending'}[v]),'mind-ing','После would you mind нужна форма с -ing, не to + глагол.'],
    [/\bi want watch\b/,'i want to watch','missing-to','После want перед глаголом здесь нужен to: want to watch.'],
    [/^i am want\b/,'i want','extra-am','Перед want здесь не нужен am: I want.'],
    [/^my name anna$/,'my name is anna','missing-is','В полной фразе нужно my name is Anna.']
  ];
  function check(answer,turn){
    const text=normalize(answer),frame=turn.assessment;
    if(!String(answer).trim())return {status:'empty'};
    if(!text||/\p{L}/u.test(String(answer).replace(/[a-z]/gi,'')))return {...unknown('неподдерживаемые буквы или фрагмент ответа'),method:'construction',assessmentVersion:'pilot-1'};
    const e=edges(text);
    let result=parse(e.core,frame,e.blocks,e.polite,e.affirmed);
    if(!result||result.status==='unknown'){
      // Whole-answer examples are a safe fallback, never a bag-of-words match.
      if(turn.natural.some(a=>normalize(a)===text))result=good([...e.blocks,{role:'Формулировка',text:e.core||text}]);
      else for(const [pattern,replacement,code,note] of repairs){
        if(!pattern.test(e.core))continue;
        const fixed=e.core.replace(pattern,replacement),parsed=parse(fixed,frame,e.blocks,e.polite,e.affirmed);
        if(parsed&&['correct','acceptable','error'].includes(parsed.status)){result=bad(code,e.core.match(pattern)[0],note,fixed,parsed.blocks);break;}
      }
    }
    return {...(result||unknown('',e.blocks)),method:'construction',assessmentVersion:'pilot-1'};
  }
  root.StructuredAssessment={check,normalize,nounPhrase,request};
  if(typeof module!=='undefined')module.exports=root.StructuredAssessment;
})(typeof window!=='undefined'?window:globalThis);
