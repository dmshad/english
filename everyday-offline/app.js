(function(){
  'use strict';
  window.APP_VERSION='0.13.1';
  const $=id=>document.getElementById(id),app=$('app'),E=window.OfflineEngine,P=window.OfflineProgress,S=window.OfflineSpeech;
  const dialogues=window.DIALOGUES.filter(d=>d.checking==='construction'),KEY='everyday-offline-v1';
  const statusNames={correct:'Верно',acceptable:'Понятно, но обычно так не говорят или неуместно в этой ситуации',error:'Ошибка',unknown:'Не распознано',revealed:'Не определено'};
  const esc=t=>String(t??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  let saved={},persistent=true;try{saved=JSON.parse(localStorage.getItem(KEY)||'{}')||{};}catch(_){persistent=false;}
  const availableLevels=['A1','A2','B1','B2','C1','C2'].filter(l=>dialogues.some(d=>d.level===l));
  const settings={level:availableLevels.includes(saved.settings?.level)?saved.settings.level:availableLevels[0],theme:saved.settings?.theme==='dark'?'dark':'light',voiceURI:typeof saved.settings?.voiceURI==='string'?saved.settings.voiceURI:'@ava-premium'};
  function resolveVoice(){if(settings.voiceURI==='@ava-premium'&&S.voice(settings.voiceURI))settings.voiceURI=S.key(S.voice(settings.voiceURI));}
  resolveVoice();
  const completionCounts=P.migrate(saved,window.CONTENT_REVISION,window.PROGRESS_MIGRATIONS);
  const topicOrder={};
  for(const level of availableLevels)topicOrder[level]=[...new Set((Array.isArray(saved.topicOrder?.[level])?saved.topicOrder[level]:[]).filter(t=>dialogues.some(d=>d.level===level&&d.topic===t)))];
  const latestResults=Object.create(null);
  for(const [id,result] of Object.entries(saved.latestResults||{}))if(dialogues.some(d=>d.id===id)&&result&&typeof result.updatedAt==='string'&&['correct','acceptable','error','unknown'].every(k=>Number.isSafeInteger(result.counts?.[k])&&result.counts[k]>=0))latestResults[id]=result;
  const validAnswer=a=>a&&Object.hasOwn(statusNames,a.status)&&typeof a.answer==='string';
  const validArchive=h=>h&&typeof h.runId==='string'&&typeof h.dialogue?.id==='string'&&typeof h.dialogue.title==='string'&&typeof h.dialogue.context==='string'&&typeof h.dialogue.speaker==='string'&&typeof h.dialogue.ending?.en==='string'&&Array.isArray(h.dialogue.turns)&&h.dialogue.turns.every(t=>typeof t?.en==='string'&&typeof t.ru==='string'&&typeof t.task==='string'&&typeof t.best==='string'&&Array.isArray(t.natural)&&Array.isArray(t.acceptable))&&Array.isArray(h.answers)&&h.answers.length>0&&h.answers.length<=h.dialogue.turns.length&&h.answers.every(validAnswer)&&Number.isInteger(h.index)&&h.index>=0&&h.index<=h.dialogue.turns.length&&h.answers.length>=h.index;
  let history=(Array.isArray(saved.history)?saved.history:[]).filter(validArchive).slice(-6).map(h=>({...h,mode:h.mode==='speech'?'speech':'text'}));
  for(const h of history)recordResult(h);
  let journal=(Array.isArray(saved.journal)?saved.journal:[]).filter(j=>j&&typeof j.answer==='string'&&typeof j.task==='string');
  let session=saved.session,contentUpdated=Boolean(session&&session.contentRevision!==window.CONTENT_REVISION);
  const stored=dialogues.find(d=>d.id===session?.id);
  if(contentUpdated||!stored||!Number.isInteger(session?.index)||session.index<0||session.index>stored.turns.length||!Array.isArray(session.answers)||session.answers.length<session.index||session.answers.length>stored.turns.length||!session.answers.every(validAnswer))session=null;
  if(session){if(!Number.isInteger(session.viewIndex)||session.viewIndex<0||session.viewIndex>session.index)session.viewIndex=session.index;session.mode=session.mode==='speech'?'speech':'text';session.draft=typeof session.draft==='string'?session.draft:'';session.views=session.views&&typeof session.views==='object'?session.views:{};session.runId=typeof session.runId==='string'?session.runId:runId();session.completedRecorded=typeof session.completedRecorded==='boolean'?session.completedRecorded:session.index===stored.turns.length;session.phase=['intro','stage','work','review','ending','done'].includes(session.phase)?session.phase:session.index===stored.turns.length?'done':session.answers[session.index]?'review':'work';}
  let screen='home',viewIndex=session?.index||0,variantsOpen=false,toastTimer,selectedId=null,pendingMark=null,copyingJournal=false,pendingCopyBatch=null;
  function runId(){return Date.now()+'-'+Math.random().toString(36).slice(2);}
  function current(){return dialogues.find(d=>d.id===session?.id);}
  function save(){try{localStorage.setItem(KEY,JSON.stringify({version:5,progressFormat:2,progressRevision:window.CONTENT_REVISION,settings,completionCounts,topicOrder,latestResults,history,journal,session}));}catch(_){persistent=false;}}
  function applyTheme(){document.documentElement.dataset.theme=settings.theme;document.querySelector('meta[name="theme-color"]')?.setAttribute('content',settings.theme==='dark'?'#111014':'#f5f7fb');}
  function toast(t){$('toast').textContent=t;$('toast').hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').hidden=true,2600);}
  function stop(){S.stop();}
  function page(name,html){screen=name;app.innerHTML=html;window.scrollTo(0,0);}
  function nav(back,next,action='next',disabled=false){return `<div class="nav"><button type="button" data-action="${back}">Назад</button><button type="button" class="primary" data-action="${action}" ${disabled?'disabled':''}>${next}</button></div>`;}
  function top(title,counter=''){return `<div class="topline"><div class="screen-title">${esc(title)}</div><span class="counter">${esc(counter)}</span><button class="exit" type="button" data-action="home" aria-label="На главный экран">×</button></div>`;}
  function setPhase(phase){session.phase=phase;session.viewIndex=viewIndex;save();}
  function choices(){return dialogues.filter(d=>d.level===settings.level);}
  function levels(){return `<fieldset class="field"><legend>Уровень</legend><div class="levels">${['A1','A2','B1','B2','C1','C2'].map(l=>`<button type="button" data-level="${l}" aria-pressed="${l===settings.level}" ${availableLevels.includes(l)?'':'disabled'}>${l}</button>`).join('')}</div></fieldset>`;}
  function practiceTop(counter=''){return `<div class="topline"><button type="button" class="text-switch" data-action="toggle-text" aria-pressed="${session.mode==='speech'}">${session.mode==='speech'?'Показать текст':'Скрыть текст'}</button><span class="counter">${esc(counter)}</span><button class="exit" type="button" data-action="home" aria-label="На главный экран">×</button></div>`;}
  function renderHome(){
    page('home',`<section class="screen home">
      <div class="theme-row"><span>Оформление</span><div class="segments theme-control"><button type="button" data-theme="light" aria-pressed="${settings.theme==='light'}">Светлое</button><button type="button" data-theme="dark" aria-pressed="${settings.theme==='dark'}">Темное</button></div></div>
      ${levels()}
      ${`<div class="field"><label for="voice-choice" class="field-label">Голос</label><select id="voice-choice"><option value="">Автоматически</option>${S.localVoices().map(v=>`<option value="${esc(S.key(v))}" ${S.key(v)===settings.voiceURI?'selected':''}>${esc(v.name)} · ${esc(v.lang)}</option>`).join('')}${settings.voiceURI&&!S.voice(settings.voiceURI)?`<option value="${esc(settings.voiceURI)}" selected disabled>${settings.voiceURI==='@ava-premium'?'Ava (Premium) недоступен':'Выбранный голос недоступен'}</option>`:''}</select></div>`}
      <div class="home-actions">${session&&session.phase!=='done'?'<button type="button" data-action="resume">Продолжить</button>':''}<button type="button" data-action="catalog">Выбрать диалог</button><button type="button" class="primary" data-action="start" ${choices().length?'':'disabled'}>Начать следующий диалог</button></div>
      <button type="button" class="home-history" data-action="history">История</button>${!persistent?'<p class="storage-error" role="status">Сохранение недоступно</p>':''}${contentUpdated?'<p class="storage-error" role="status">Сюжет обновлен. Начни диалог заново.</p>':''}</section>`);
  }
  function home(){stop();save();renderHome();}
  function begin(id,practiceReplay=false){
    stop();const pool=id?[]:P.balanced(choices(),completionCounts,topicOrder[settings.level]);const d=id?dialogues.find(d=>d.id===id):pool[Math.floor(Math.random()*pool.length)];if(!d)return;
    topicOrder[d.level]=[...(topicOrder[d.level]||[]).filter(t=>t!==d.topic),d.topic];
    session={id:d.id,mode:'text',unified:true,contentRevision:window.CONTENT_REVISION,index:0,answers:[],draft:'',views:{},runId:runId(),startedAt:new Date().toISOString(),completedRecorded:false,practiceReplay,phase:'intro'};viewIndex=0;contentUpdated=false;save();renderIntro();
  }
  function resultCounts(answers){return Object.fromEntries(['correct','acceptable','error','unknown'].map(k=>[k,answers.filter(a=>a.status===k||(k==='unknown'&&a.status==='revealed')).length]));}
  function recordResult(h){const old=latestResults[h.dialogue.id],updatedAt=typeof h.updatedAt==='string'?h.updatedAt:typeof h.startedAt==='string'?h.startedAt:'';if(!old||updatedAt>=old.updatedAt)latestResults[h.dialogue.id]={runId:h.runId,updatedAt,counts:resultCounts(h.answers)};}
  function renderCatalog(){
    stop();const topics=[...new Map(choices().map(d=>[d.topic,d.topicLabel.replace(/ · пилот$/,'')])).entries()];
    page('catalog',`<section class="screen">${top('Выбрать диалог')}${levels()}<div class="list-scroll catalog-list">${topics.map(([topic,label])=>`<section class="catalog-topic"><h2>${esc(label)}</h2>${choices().filter(d=>d.topic===topic).map(d=>`<div class="catalog-row"><button type="button" class="completion-dot ${P.count(completionCounts[d.id])?'completed':''}" data-mark="${esc(d.id)}" aria-label="${esc(d.title)}: ${P.count(completionCounts[d.id])?'пройден':'не пройден'}. Изменить отметку" aria-pressed="${Boolean(P.count(completionCounts[d.id]))}"></button><button type="button" class="dialogue-choice" data-dialogue="${esc(d.id)}">${esc(d.title)}</button></div>`).join('')}</section>`).join('')}</div><button type="button" data-action="home">Назад</button></section>`);
  }
  function renderDialogue(id){
    stop();const d=dialogues.find(d=>d.id===id);if(!d)return renderCatalog();selectedId=id;const result=latestResults[id];
    page('dialogue',`<section class="screen dialogue-detail">${top(d.title)}<div class="dialogue-summary">${result?`<div class="last-stats" aria-label="Последняя попытка">${['correct','acceptable','error','unknown'].map(k=>`<span class="${k}" aria-label="${statusNames[k]}: ${result.counts[k]}">${result.counts[k]}</span>`).join('')}</div>`:''}</div>${nav('catalog','Начать диалог','start-selected')}</section>`);
  }
  function askMark(id){const d=dialogues.find(d=>d.id===id);if(!d)return;pendingMark={id,completed:!P.count(completionCounts[id])};$('mark-title').textContent=pendingMark.completed?'Отметить диалог пройденным?':'Отметить диалог непройденным?';$('mark-name').textContent=d.title;$('mark-dialog').showModal();}
  $('cancel-mark').addEventListener('click',()=>{pendingMark=null;$('mark-dialog').close();});
  $('mark-dialog').addEventListener('close',()=>{if(!$('mark-dialog').open)pendingMark=null;});
  $('mark-dialog').addEventListener('cancel',()=>{pendingMark=null;});
  $('confirm-mark').addEventListener('click',()=>{if(!pendingMark)return;const {id,completed}=pendingMark;completionCounts[id]=completed?Math.max(1,P.count(completionCounts[id])):0;pendingMark=null;save();$('mark-dialog').close();renderCatalog();});
  async function exportJournal(){
    if(copyingJournal||!journal.length)return;copyingJournal=true;const batch=journal.slice();
    try{if(await copy(journalText(),batch))removeCopied(batch);}finally{copyingJournal=false;}
  }
  function removeCopied(batch){journal=journal.filter(j=>!batch.includes(j));save();if(screen==='journal')renderHistory('journal');}
  $('copy-text').addEventListener('copy',event=>{
    if(!pendingCopyBatch||!event.clipboardData)return;
    const field=$('copy-text');if(field.selectionStart!==0||field.selectionEnd!==field.value.length)return;
    event.clipboardData.setData('text/plain',field.value);event.preventDefault();const batch=pendingCopyBatch;pendingCopyBatch=null;removeCopied(batch);$('copy-dialog').close();toast('Скопировано');
  });
  $('copy-dialog').addEventListener('close',()=>{if(!$('copy-dialog').open)pendingCopyBatch=null;});
  function renderIntro(){stop();setPhase('intro');const d=current();page('intro',`<section class="screen intro"><div class="intro-body"><h1>${esc(d.title)}</h1><p class="context">${esc(d.context)}</p></div>${nav('home','Дальше','intro-next')}</section>`);}
  function openTurn(){if(viewIndex>=current().turns.length)return renderEnding();current().turns[viewIndex].stage?renderStage():renderWork();}
  function renderStage(){stop();const d=current(),stage=d.turns[viewIndex]?.stage;if(!stage)return renderWork();setPhase('stage');page('stage',`<section class="screen intro stage-screen"><div class="intro-body"><p class="context">${esc(stage)}</p></div>${nav('stage-back','Дальше','stage-next')}</section>`);}
  const listenIcon='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M16 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14"/></svg>';
  function listen(ending=false){return `<button type="button" class="listen" data-action="${ending?'listen-ending':'listen'}" aria-label="Прослушать">${listenIcon}</button>`;}
  function view(){return session.views[viewIndex]||(session.views[viewIndex]={text:false,translation:false,task:false});}
  function renderWork(){
    stop();const d=current();if(!d)return home();if(viewIndex>=d.turns.length)return renderEnding();setPhase('work');const t=d.turns[viewIndex],a=session.answers[viewIndex],v=view(),audio=session.mode==='speech',taskShown=!audio||v.task||Boolean(a)||Boolean(session.draft);
    const english=!audio;
    page('work',`<section class="screen work">${practiceTop(`${viewIndex+1}/${d.turns.length}`)}<div class="work-grid">
      <section class="panel partner-panel" aria-label="Реплика собеседника"><div class="partner-scroll">${english?`<p class="english" lang="en">${esc(t.en)}</p>${v.translation?`<p class="translation">${esc(t.ru)}</p>`:''}`:`<div class="audio-main">${listen()}</div>`}</div>
      <div class="partner-controls">${english?listen():''}${english?`<button type="button" class="toggle" data-action="translation">${v.translation?'Скрыть перевод':'Перевод'}</button>`:''}</div></section>
      <section class="panel task-panel" aria-label="Твоя реплика">${taskShown?`<p class="task">${esc(t.task)}</p>`:'<button type="button" data-action="show-task">Показать</button>'}</section>
      <form id="answer-form" class="panel input-panel"><textarea id="answer" aria-label="Твой ответ" lang="en" spellcheck="false" autocomplete="off" autocapitalize="sentences" ${a?'readonly class="read-only"':''} ${taskShown?'':'disabled'}>${esc(a?a.answer:session.draft)}</textarea></form>
      </div><div class="nav"><button type="button" data-action="back">Назад</button>${a?'<button type="button" class="primary" data-action="show-review">Дальше</button>':`<button type="submit" form="answer-form" class="primary" id="check-answer" ${taskShown&&session.draft.trim()?'':'disabled'}>Проверить</button>`}</div></section>`);
  }
  function annotated(answer,a){
    if(!Array.isArray(a.annotations))return `<div class="annotated-answer" lang="en">${esc(answer)}</div>`;
    let out='',cursor=0;for(const t of a.annotations){if(!Number.isInteger(t.start)||!Number.isInteger(t.end)||t.start<cursor||t.end>answer.length)continue;out+=esc(answer.slice(cursor,t.start));for(const gap of a.insertions||[])if(gap.at===t.start)out+=`<span class="word-error" title="${esc(gap.note)}">[${esc(gap.label)}]</span> `;out+=`<span class="word-${['correct','acceptable','error'].includes(t.color)?t.color:'neutral'}" title="${esc(t.note||'')}">${esc(answer.slice(t.start,t.end))}</span>`;cursor=t.end;}out+=esc(answer.slice(cursor));return `<div class="annotated-answer" lang="en">${out}</div>`;
  }
  function detail(a){const notes=[];if(['error','acceptable'].includes(a.status)&&a.note)notes.push(a.note);if(a.orthographyNote)notes.push(a.orthographyNote);for(const d of a.diagnostics||[])if(d.note&&!notes.includes(d.note))notes.push(d.note);for(const n of a.grammarNotes||[])if(!notes.includes(n))notes.push(n);return notes.map(n=>`<p class="explanation">${esc(n)}</p>`).join('');}
  function renderReview(){stop();const d=current(),t=d.turns[viewIndex],a=session.answers[viewIndex];if(!a)return renderWork();setPhase('review');page('review',`<section class="screen">${practiceTop(`${viewIndex+1}/${d.turns.length}`)}<div class="review-scroll"><section class="panel review-card ${a.status}"><h1 class="status ${a.status}">${statusNames[a.status]}</h1>${annotated(a.answer,a)}${detail(a)}<div><p class="reference-label">Эталон</p><p class="best" lang="en">${esc(t.best)}</p></div><button type="button" class="variants-button" data-action="variants" aria-expanded="${variantsOpen}">${variantsOpen?'Скрыть варианты':'Другие варианты'}</button>${variantsOpen?`<ul class="variants" lang="en">${E.preferred(t).map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:''}</section></div>${nav('review-back','Дальше')}</section>`);}
  function remember(){const d=current();if(!d||!session.answers.length)return;const h=JSON.parse(JSON.stringify({runId:session.runId,mode:session.mode,practiceReplay:Boolean(session.practiceReplay),index:session.index,startedAt:session.startedAt,updatedAt:new Date().toISOString(),answers:session.answers,dialogue:d}));history=[...history.filter(x=>x.runId!==h.runId),h].slice(-6);recordResult(h);}
  function submit(){const d=current();if(screen!=='work'||viewIndex!==session.index||session.answers[viewIndex]||session.mode==='speech'&&!view().task)return;const answer=$('answer').value;if(!answer.trim())return;const result=E.check(answer,d.turns[viewIndex]);if(result.status==='empty')return;const a={...result,answer,at:new Date().toISOString()};session.answers[viewIndex]=a;session.draft=answer;if(a.status==='unknown')journal.push({at:a.at,dialogueId:d.id,title:d.title,level:d.level,topic:d.topicLabel,mode:session.mode,context:d.context,partner:d.turns[viewIndex].en,partnerTranslation:d.turns[viewIndex].ru,stage:d.turns[viewIndex].stage||'',task:d.turns[viewIndex].task,answer,best:d.turns[viewIndex].best,turn:viewIndex+1});$('answer').blur();remember();save();variantsOpen=false;renderReview();}
  function next(){stop();if(screen!=='review')return;const d=current();if(viewIndex<session.index){viewIndex++;return openTurn();}if(!session.answers[session.index])return;session.index++;session.draft='';viewIndex=session.index;remember();save();variantsOpen=false;openTurn();}
  function renderEnding(){stop();setPhase('ending');const d=current(),audio=session.mode==='speech',v=session.endingView||(session.endingView={text:false,translation:false}),shown=!audio;page('ending',`<section class="screen ending-screen">${practiceTop()}<div class="ending-body panel">${shown?`<p class="english" lang="en">${esc(d.ending.en)}</p>${v.translation?`<p class="translation">${esc(d.ending.ru)}</p>`:''}`:`<div class="audio-main">${listen(true)}</div>`}<div class="partner-controls">${shown?listen(true):''}${shown?`<button type="button" class="toggle" data-action="ending-translation">${v.translation?'Скрыть перевод':'Перевод'}</button>`:''}</div></div>${nav('ending-back','Дальше','ending-next')}</section>`);}
  function finish(){if(screen!=='ending')return;const d=current();if(!session.completedRecorded){if(!session.practiceReplay)completionCounts[d.id]=Math.min(Number.MAX_SAFE_INTEGER,P.count(completionCounts[d.id])+1);session.completedRecorded=true;}remember();save();renderDone();}
  function renderDone(){stop();setPhase('done');const d=current(),count=k=>session.answers.filter(a=>a.status===k||(k==='unknown'&&a.status==='revealed')).length;page('done',`<section class="screen done"><h1>Итог</h1><div class="done-content"><div class="stats">${[['correct','Верно'],['acceptable','Понятно'],['error','Ошибка'],['unknown',statusNames.unknown]].map(([k,label])=>`<div class="stat ${k}"><strong>${count(k)}</strong>${label}</div>`).join('')}</div></div><div class="done-actions"><button type="button" data-action="copy-all">Скопировать диалог</button><button type="button" data-action="replay">Пройти заново</button><button type="button" class="primary" data-action="home">Выход</button></div></section>`);}
  function renderHistory(tab='dialogues'){stop();const journalTab=tab==='journal';page(journalTab?'journal':'history',`<section class="screen">${top('История')}<div class="segments"><button type="button" data-action="history" aria-pressed="${!journalTab}">Диалоги · ${history.length}</button><button type="button" data-action="journal" aria-pressed="${journalTab}">Не распознано · ${journal.length}</button></div><div class="list-scroll">${journalTab?journalHTML():history.length?[...history].reverse().map(h=>`<article class="panel history-card"><div class="meta"><span>${h.index}/${h.dialogue.turns.length}</span></div><h2>${esc(h.dialogue.title)}</h2><div class="actions"><button type="button" data-history-view="${esc(h.runId)}">Открыть</button><button type="button" data-history-copy="${esc(h.runId)}">Скопировать</button></div></article>`).join(''):'<p class="empty">Пусто</p>'}</div>${journalTab?`<button type="button" class="primary" data-action="copy-journal" ${journal.length?'':'disabled'}>Скопировать все</button>`:'<button type="button" data-action="home">Назад</button>'}</section>`);}
  function journalHTML(){return journal.length?[...journal].reverse().map(j=>`<article class="panel journal-entry"><p class="meta">${esc(j.title)} · ${esc(j.level)}</p><p lang="en">${esc(j.partner)}</p><p>${esc(j.task)}</p><blockquote lang="en">${esc(j.answer)}</blockquote><p class="best" lang="en">${esc(j.best)}</p></article>`).join(''):'<p class="empty">Пусто</p>';}
  function renderHistoryEntry(h){const d=h.dialogue;page('history-entry',`<section class="screen">${top(d.title)}<div class="list-scroll"><p class="context">${esc(d.context)}</p>${h.answers.map((a,i)=>{const t=d.turns[i];return `<article class="panel history-exchange">${t.stage?`<p class="scene-note">${esc(t.stage)}</p>`:''}<p class="english" lang="en">${esc(t.en)}</p><p class="translation">${esc(t.ru)}</p><p>${esc(t.task)}</p><span class="status ${a.status}">${statusNames[a.status]}</span>${annotated(a.answer,a)}${detail(a)}<div><p class="reference-label">Эталон</p><p class="best" lang="en">${esc(t.best)}</p></div></article>`;}).join('')}${h.index===d.turns.length?`<p class="english" lang="en">${esc(d.ending.en)}</p>`:''}</div>${nav('history','Скопировать','copy-entry')}</section>`);app.dataset.historyId=h.runId;}
  function dialogueText(d,source){return `Everyday · ${d.level} · ${d.topicLabel}\n${d.title}\nПредыстория: ${d.context}\n\n`+source.answers.map((a,i)=>{const t=d.turns[i];return `${t.stage?t.stage+'\n':''}${d.speaker}: ${t.en}\nПеревод: ${t.ru}\nЗадание: ${t.task}\nМой ответ: ${a.answer}\nОценка: ${statusNames[a.status]}${['error','acceptable'].includes(a.status)&&a.note?'\nПояснение: '+a.note:''}${a.correction?'\nИсправление: '+a.correction:''}\nЭталон: ${t.best}\nВарианты: ${E.preferred(t).join(' / ')}`;}).join('\n\n')+(source.index===d.turns.length?`\n\n${d.speaker}: ${d.ending.en}\nПеревод: ${d.ending.ru}`:'');}
  function journalText(){return 'Нераспознанные ответы из приложения Everyday\n\n'+journal.map(j=>`${j.level} · ${j.title}\n${j.context||''}\n${j.stage||''}\nСобеседник: ${j.partner}\nПеревод: ${j.partnerTranslation||''}\nЗадание: ${j.task}\nМой ответ: ${j.answer}\nЭталон: ${j.best}\nДата: ${j.at||''}`).join('\n\n---\n\n');}
  async function copy(text,batch=null){pendingCopyBatch=null;try{if(!navigator.clipboard?.writeText)throw Error();await navigator.clipboard.writeText(text);toast('Скопировано');return true;}catch(_){pendingCopyBatch=batch;$('copy-text').value=text;$('copy-dialog').showModal();$('copy-text').focus();$('copy-text').select();return false;}}
  app.addEventListener('click',event=>{
    const b=event.target.closest('button');if(!b||b.disabled)return;
    if(b.dataset.theme){settings.theme=b.dataset.theme;applyTheme();save();renderHome();return;}
    if(b.dataset.level&&availableLevels.includes(b.dataset.level)){settings.level=b.dataset.level;save();screen==='catalog'?renderCatalog():renderHome();return;}
    if(b.dataset.dialogue){renderDialogue(b.dataset.dialogue);return;}
    if(b.dataset.mark){askMark(b.dataset.mark);return;}
    if(b.dataset.historyView){const h=history.find(x=>x.runId===b.dataset.historyView);if(h)renderHistoryEntry(h);return;}
    if(b.dataset.historyCopy){const h=history.find(x=>x.runId===b.dataset.historyCopy);if(h)copy(dialogueText(h.dialogue,h));return;}
    switch(b.dataset.action){
      case 'home':home();break;
      case 'start':begin();break;
      case 'catalog':renderCatalog();break;
      case 'start-selected':begin(selectedId);break;
      case 'resume':viewIndex=Math.min(session.viewIndex??session.index,session.index);variantsOpen=false;if(session.phase==='intro')renderIntro();else if(session.phase==='stage')renderStage();else if(session.phase==='ending')renderEnding();else if(session.phase==='review')renderReview();else if(session.phase==='done')renderDone();else renderWork();break;
      case 'intro-next':viewIndex=0;openTurn();break;
      case 'stage-next':renderWork();break;
      case 'stage-back':if(viewIndex===0)renderIntro();else{viewIndex--;variantsOpen=false;renderReview();}break;
      case 'back':if(current().turns[viewIndex].stage)renderStage();else if(viewIndex===0)renderIntro();else{viewIndex--;variantsOpen=false;renderReview();}break;
      case 'review-back':renderWork();break;
      case 'show-review':variantsOpen=false;renderReview();break;
      case 'next':next();break;
      case 'show-task':view().task=true;save();renderWork();break;
      case 'toggle-text':{session.mode=session.mode==='speech'?'text':'speech';if(session.mode==='speech'){if(session.draft)view().task=true;view().translation=false;if(session.endingView)session.endingView.translation=false;}save();if(screen==='review')renderReview();else if(screen==='ending')renderEnding();else renderWork();break;}
      case 'translation':view().translation=!view().translation;save();renderWork();break;
      case 'variants':variantsOpen=!variantsOpen;renderReview();break;
      case 'listen':S.play(current().turns[viewIndex].en,3,toast,settings.voiceURI);break;
      case 'listen-ending':S.play(current().ending.en,3,toast,settings.voiceURI);break;
      case 'ending-translation':session.endingView.translation=!session.endingView.translation;save();renderEnding();break;
      case 'ending-back':viewIndex=current().turns.length-1;variantsOpen=false;renderReview();break;
      case 'ending-next':finish();break;
      case 'replay':{const d=current();settings.level=d.level;begin(d.id,true);break;}
      case 'copy-all':copy(dialogueText(current(),session));break;
      case 'history':renderHistory();break;
      case 'journal':renderHistory('journal');break;
      case 'copy-journal':exportJournal();break;
      case 'copy-entry':{const h=history.find(x=>x.runId===app.dataset.historyId);if(h)copy(dialogueText(h.dialogue,h));break;}
    }
  });
  app.addEventListener('change',event=>{if(event.target.id==='voice-choice'){settings.voiceURI=event.target.value;save();}});
  app.addEventListener('input',event=>{if(event.target.id==='answer'&&session&&screen==='work'&&!session.answers[viewIndex]){session.draft=event.target.value;save();const b=$('check-answer');if(b)b.disabled=!session.draft.trim();}});
  app.addEventListener('submit',event=>{if(event.target.id==='answer-form'){event.preventDefault();submit();}});
  app.addEventListener('keydown',event=>{if(event.target.id==='answer'&&event.key==='Enter'&&!event.shiftKey&&!event.isComposing&&!event.target.readOnly){event.preventDefault();submit();}});
  $('update-version').addEventListener('click',async()=>{
    const button=$('update-version');if(button.disabled)return;
    button.disabled=true;button.setAttribute('aria-busy','true');save();
    try{
      const result=await window.OfflineUpdate.check(window.location.href,window.APP_VERSION,navigator.onLine!==false);
      if(result.status==='available'){
        save();if(!persistent){toast('Не удалось сохранить прогресс');return;}
        stop();window.location.assign(result.url);return;
      }
      toast({current:'Обновлений нет',file:'Для обновления скачай новый index.html',offline:'Нет подключения к интернету',error:'Не удалось проверить обновление'}[result.status]);
    }finally{button.disabled=false;button.removeAttribute('aria-busy');}
  });
  $('home-link').addEventListener('click',event=>{event.preventDefault();home();});$('close-copy').addEventListener('click',()=>$('copy-dialog').close());
  let baseHeight=window.innerHeight||844;
  function viewport(){const vv=window.visualViewport,focused=document.activeElement?.id==='answer',height=vv?.height||window.innerHeight||baseHeight;const keyboard=focused&&baseHeight-height>120;if(!keyboard)baseHeight=window.innerHeight||height;document.documentElement.style.setProperty('--app-height',baseHeight+'px');document.documentElement.style.setProperty('--keyboard-gap',keyboard?Math.max(0,baseHeight-height)+'px':'0px');document.body.classList.toggle('keyboard-open',keyboard);}
  window.addEventListener?.('resize',viewport);window.visualViewport?.addEventListener('resize',viewport);app.addEventListener('focusin',viewport);app.addEventListener('focusout',()=>setTimeout(viewport,100));window.addEventListener?.('pagehide',stop);window.addEventListener?.('beforeunload',stop);
  window.speechSynthesis?.addEventListener?.('voiceschanged',()=>{resolveVoice();save();if(screen==='home')renderHome();});
  applyTheme();viewport();save();renderHome();
})();
