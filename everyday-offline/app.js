(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const app = $('app');
  const E = window.OfflineEngine;
  const dialogues = window.DIALOGUES;
  const KEY = 'everyday-offline-v1';
  const labels = {short: '4 реплики · прежняя версия', medium: '6 реплик · прежняя версия', long: '10 реплик'};
  const statuses = {correct: 'Верно', acceptable: 'Допустимо', unknown: 'Не распознано', revealed: 'Без ответа'};
  const escape = text => String(text ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  let persistent = true;
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; }
  catch (_) { persistent = false; }
  let settings = {level: 'A1', topic: 'random', ...saved.settings, length: 'long'};
  if (!['A1','A2','B1','B2','C1','C2'].includes(settings.level)) settings.level = 'A1';
  const topics = [...new Map(dialogues.map(d => [d.topic, d.topicLabel])).entries()];
  if (settings.topic !== 'random' && !topics.some(([id]) => id === settings.topic)) settings.topic = 'random';
  let journal = Array.isArray(saved.journal) ? saved.journal.filter(item => item && typeof item.answer === 'string' && typeof item.task === 'string') : [];
  const completedIds = new Set(Array.isArray(saved.completedIds) ? saved.completedIds.filter(id => typeof id === 'string') : []);
  if (saved.progressRevision !== window.CONTENT_REVISION) for (const id of window.REVISED_DIALOGUE_IDS) completedIds.delete(id);
  const validAnswer = a => a && Object.hasOwn(statuses, a.status) && typeof a.answer === 'string';
  function validArchive(entry) {
    const d = entry?.dialogue;
    return typeof entry?.runId === 'string' && typeof entry.updatedAt === 'string' &&
      Number.isInteger(entry.index) && Array.isArray(entry.answers) && entry.answers.length > 0 && entry.answers.every(validAnswer) &&
      typeof d?.id === 'string' && typeof d.title === 'string' && typeof d.speaker === 'string' && typeof d.ending?.en === 'string' &&
      Array.isArray(d.turns) && entry.index >= 0 && entry.index <= d.turns.length && entry.answers.length >= entry.index && entry.answers.length <= d.turns.length &&
      d.turns.every(t => t && typeof t.en === 'string' && typeof t.ru === 'string' && typeof t.task === 'string' && typeof t.best === 'string' &&
        Array.isArray(t.natural) && t.natural.every(v => typeof v === 'string') && Array.isArray(t.acceptable) && t.acceptable.every(v => v && typeof v.text === 'string'));
  }
  let history = Array.isArray(saved.history) ? saved.history.filter(validArchive).slice(-6) : [];
  let session = saved.session;
  let contentUpdated = Boolean(session && session.contentRevision !== window.CONTENT_REVISION);
  if (contentUpdated) session = null;
  const storedDialogue = dialogues.find(d => d.id === session?.id);
  if (!storedDialogue || !Number.isInteger(session?.index) || session.index < 0 || session.index > storedDialogue.turns.length ||
      !Array.isArray(session.answers) || session.answers.length < session.index ||
      session.answers.length > storedDialogue.turns.length || session.answers.some(a => !validAnswer(a))) session = null;
  if (session) session.draft = typeof session.draft === 'string' ? session.draft : '';
  let screen = 'home';
  let selectedId = '';
  let toastTimer;

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify({version: 3, progressRevision: window.CONTENT_REVISION, settings, journal, completedIds: [...completedIds], history, session})); }
    catch (_) { persistent = false; }
    $('journal-count').textContent = journal.length;
  }
  function storageNote() {
    return persistent ? '' : '<div class="notice" role="status">Хранилище браузера недоступно. Прогресс и журнал сохраняются только до закрытия страницы. Скачай журнал перед выходом.</div>';
  }
  function toast(message) {
    $('toast').textContent = message;
    $('toast').hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { $('toast').hidden = true; }, 3500);
  }
  function current() { return dialogues.find(d => d.id === session?.id); }
  function pool() { return dialogues.filter(d => d.level === settings.level && d.length === settings.length && (settings.topic === 'random' || d.topic === settings.topic)); }
  function availablePool() {
    const choices = pool();
    const ids = E.eligible(choices.map(d => d.id), [...completedIds]);
    return choices.filter(d => ids.includes(d.id));
  }
  function rememberSession() {
    const d = current();
    if (!d || !session.answers.length) return;
    if (!session.runId) session.runId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    if (session.index === d.turns.length) completedIds.add(d.id);
    const snapshot = JSON.parse(JSON.stringify({runId: session.runId, index: session.index, startedAt: session.startedAt,
      updatedAt: new Date().toISOString(), answers: session.answers, dialogue: d}));
    history = [...history.filter(entry => entry.runId !== session.runId), snapshot].slice(-6);
  }
  function renderHome() {
    screen = 'home';
    const choices = pool();
    const available = availablePool();
    const remaining = choices.filter(d => !completedIds.has(d.id)).length;
    const previous = current();
    app.innerHTML = `${storageNote()}${contentUpdated ? '<p class="notice">Теперь в каждом диалоге 10 твоих реплик. Текущий диалог старой версии нужно начать заново. История и журнал нераспознанных ответов сохранены.</p>' : ''}<div class="menu-tools"><button class="secondary" data-action="history">История · ${history.length}</button><button class="text-button" data-action="update">Загрузить свежую версию</button></div><section class="hero"><div class="hero-copy"><div class="eyebrow">Практика настоящих разговоров</div>
      <h1>Маленький диалог.<br>Больше уверенности.</h1><p>Переводи реплики на английский и пробуй, как это звучит в обычной жизни. Один разговор за раз.</p>
      <div class="features"><span class="pill">Живой английский</span><span class="pill">Без интернета</span><span class="pill">Без таймера</span></div>
      <div class="sample"><small>В кафе это может звучать просто</small><p>“Small, please.”</p><small>Короткий ответ тоже бывает лучшим ответом.</small></div></div>
      <div class="setup-card"><h2>Твой следующий разговор</h2>
      ${previous ? `<div class="resume"><p><strong>${escape(previous.title)}</strong><br><small>${session.index === previous.turns.length ? 'Диалог завершен — результаты сохранены' : `Сохранено: ${session.index} из ${previous.turns.length} реплик`}</small></p><div class="actions"><button class="quiet" data-action="resume">${session.index === previous.turns.length ? 'Посмотреть результат' : 'Продолжить'}</button><button class="text-button" data-action="discard">Убрать сохраненный диалог</button></div></div>` : ''}
      <fieldset class="field"><legend>Уровень английского</legend><div class="levels">${['A1','A2','B1','B2','C1','C2'].map(level => `<button class="choice" data-level="${level}" aria-pressed="${settings.level === level}">${level}</button>`).join('')}</div></fieldset>
      <div class="field"><label for="topic">Тема</label><select id="topic"><option value="random" ${settings.topic === 'random' ? 'selected' : ''}>Случайная тема</option>${topics.map(([id,label]) => `<option value="${escape(id)}" ${settings.topic === id ? 'selected' : ''}>${escape(label)}</option>`).join('')}</select></div>
      <p class="hint">В каждом диалоге — 10 твоих реплик.</p>
      ${choices.length ? `<div class="field"><label for="dialogue-choice">Ситуация</label><select id="dialogue-choice"><option value="">Случайная из ${available.length}${remaining ? ' непройденных' : ' — повторение'}</option>${choices.map(d => `<option value="${d.id}" ${selectedId === d.id ? 'selected' : ''} ${remaining && completedIds.has(d.id) ? 'disabled' : ''}>${escape(d.title)}${completedIds.has(d.id) ? ' · пройден' : ''}</option>`).join('')}</select><p class="hint">${remaining ? `Еще не пройдено: ${remaining} из ${choices.length}.` : 'Все диалоги этого выбора пройдены — можно повторять.'}</p></div>` : `<p class="notice">Для ${settings.level} в этом выборе диалогов пока нет. Выбери A1 или другую тему.</p>`}
      <button class="primary full" data-action="start" ${choices.length ? '' : 'disabled'}>Начать диалог</button>
      <p class="setup-note">В подборке ${dialogues.length} ситуаций, ${topics.length} темы. Каждый диалог — 10 твоих реплик. Сначала предлагаются непройденные диалоги.</p></div></section>`;
  }
  function begin(forceRandom = false) {
    const choices = availablePool();
    if (!choices.length) return;
    const pickPool = forceRandom && choices.length > 1 ? choices.filter(d => d.id !== session?.id) : choices;
    const id = !forceRandom && choices.some(d => d.id === selectedId) ? selectedId : E.pick(pickPool.map(d => d.id), []);
    session = {id, contentRevision: window.CONTENT_REVISION, index: 0, answers: [], draft: '', startedAt: new Date().toISOString()};
    contentUpdated = false;
    save(); screen = 'practice'; renderPractice(); window.scrollTo(0, 0);
  }
  function partner(en, ru, speaker, stage = '') {
    return `${stage ? `<p class="scene-note">${escape(stage)}</p>` : ''}<p class="speaker">${escape(speaker)}</p><div class="partner"><p class="english" lang="en">${escape(en)}</p><details><summary>Показать перевод</summary><p class="translation">${escape(ru)}</p></details></div>`;
  }
  function variants(turn) {
    const choices = E.preferred(turn);
    return `<details class="variants"><summary>Частые варианты ответа · ${choices.length}</summary><ul lang="en">${choices.map(item => `<li>${escape(item)}</li>`).join('')}</ul><p class="hint">Показано не больше 10 естественных вариантов для этой ситуации. Приложение распознает и другие формулировки.</p></details>`;
  }
  function feedback(result, turn) {
    const message = result.status === 'unknown' ? 'В базе пока нет такого ответа. Возможно, он правильный. Попытка добавлена в журнал для разбора.' :
      result.status === 'acceptable' ? result.note : result.status === 'revealed' ? 'Можно запомнить эту фразу и продолжить.' : 'Так естественно сказать в этой ситуации.';
    return `<div class="feedback ${result.status}" role="status"><span class="status ${result.status}">${statuses[result.status]}</span><p class="explanation">${escape(message)}</p><h3>Как можно сказать</h3><p class="best" lang="en">${escape(turn.best)}</p>${variants(turn)}</div>`;
  }
  function renderPractice() {
    const d = current();
    if (!d) { renderHome(); return; }
    screen = 'practice';
    const done = session.index >= d.turns.length;
    const record = session.answers[session.index];
    app.innerHTML = `<section class="practice">${storageNote()}<div class="practice-top"><button class="text-button" data-action="home">К выбору диалога</button><span class="progress-label">${done ? 'Завершено' : `Твоя реплика ${session.index + 1} из ${d.turns.length}`}</span></div>
      <div class="progress" role="progressbar" aria-label="Пройдено реплик" aria-valuemin="0" aria-valuemax="${d.turns.length}" aria-valuenow="${session.index}"><div class="progress-fill" style="width:${100 * session.index / d.turns.length}%"></div></div>
      <div class="meta"><span class="pill">${d.level}</span><span class="pill">${d.topicLabel}</span><span class="pill">${labels[d.length]}</span></div><h1>${escape(d.title)}</h1><p class="context">${escape(d.context)}</p><p class="hint">${escape(d.tone)}</p>
      <div class="conversation">${d.turns.slice(0, session.index).map((t, index) => {
        const a = session.answers[index];
        return `<div class="exchange">${partner(t.en,t.ru,d.speaker,t.stage)}<div class="answer-history"><p class="speaker">Ты · <span class="status ${a.status}">${statuses[a.status]}</span></p><p class="original">${escape(t.task)}</p>${a.answer ? `<p lang="en">${escape(a.answer)}</p>` : '<p class="muted">Ответ пропущен</p>'}<p class="reference">Эталон: <span lang="en">${escape(t.best)}</span></p>${variants(t)}<button class="text-button" data-copy-turn="${index}">Скопировать фрагмент</button></div></div>`;
      }).join('')}
      ${done ? partner(d.ending.en,d.ending.ru,d.speaker) : `<div id="active-turn">${partner(d.turns[session.index].en,d.turns[session.index].ru,d.speaker,d.turns[session.index].stage)}
        <section class="answer-card"><label for="answer">Твоя реплика — переведи на английский</label><p class="task">${escape(d.turns[session.index].task)}</p>
        <form id="answer-form"><textarea id="answer" lang="en" spellcheck="false" autocomplete="off" autocapitalize="sentences" placeholder="Напиши, как бы ты это сказал…" ${record ? 'readonly' : ''}>${escape(record ? record.answer : session.draft)}</textarea>
        ${record ? '' : '<div class="actions"><button class="primary" type="submit">Проверить</button><button class="secondary" type="button" data-action="reveal">Не знаю, показать ответ</button></div><p class="hint">Enter — проверить · Shift + Enter — новая строка</p>'}</form>
        ${record ? `${feedback(record,d.turns[session.index])}<div class="actions"><button class="primary" data-action="next">${session.index === d.turns.length - 1 ? 'Завершить диалог' : 'Следующая реплика'}</button><button class="secondary" data-action="retry">Изменить ответ</button><button class="text-button" data-copy-turn="${session.index}">Скопировать фрагмент</button></div>` : ''}</section></div>`}
      </div>${done ? completion(d) : ''}
      <div class="actions"><button class="text-button" data-action="copy-all">Скопировать ${done ? 'весь диалог' : 'диалог до этого места'}</button></div></section>`;
    if (!record && !done) $('answer').focus({preventScroll: true});
  }
  function completion(d) {
    const counts = key => session.answers.filter(a => a.status === key).length;
    return `<div class="completion" id="completion"><div class="eyebrow">Еще один разговор позади</div><h2>Диалог пройден</h2><p>Посмотри на удачные фразы. К ним можно вернуться в переписке выше.</p><div class="stats">${[['correct','Верно'],['acceptable','Допустимо'],['unknown','Не распознано'],['revealed','Без ответа']].map(([key,label]) => `<div class="stat"><strong>${counts(key)}</strong>${label}</div>`).join('')}</div><div class="actions"><button class="primary" data-action="another">Еще одна ситуация</button><button class="secondary" data-action="home">Изменить настройки</button></div></div>`;
  }
  function renderHistory() {
    screen = 'history';
    app.innerHTML = `<section class="practice">${storageNote()}<div class="practice-top"><button class="text-button" data-action="home">В главное меню</button><span class="progress-label">${history.length} из 6 записей</span></div><h1>История</h1><p class="context">Последние шесть разговоров с твоими ответами. Старые записи удаляются автоматически. Отметки о пройденных диалогах сохраняются отдельно.</p>${history.length ? [...history].reverse().map(entry => `<article class="card history-card"><div class="meta"><span class="pill">${escape(entry.dialogue.level)}</span><span class="pill">${escape(entry.dialogue.topicLabel)}</span><span class="pill">${labels[entry.dialogue.length] || ''}</span></div><h2>${escape(entry.dialogue.title)}</h2><p class="hint">${escape(new Date(entry.updatedAt).toLocaleString('ru-RU'))} · ${entry.index === entry.dialogue.turns.length ? 'Завершен' : `В процессе · ${entry.answers.length} из ${entry.dialogue.turns.length} реплик`}</p><div class="actions"><button class="secondary" data-history-view="${escape(entry.runId)}">Посмотреть ответы</button><button class="text-button" data-history-copy="${escape(entry.runId)}">Скопировать диалог</button></div></article>`).join('') : '<p class="empty-state">Пока здесь пусто. Разговор появится после первого проверенного ответа.</p>'}</section>`;
    window.scrollTo(0,0);
  }
  function renderHistoryEntry(entry) {
    const d = entry.dialogue;
    const done = entry.index === d.turns.length;
    screen = 'history-entry';
    app.innerHTML = `<section class="practice"><div class="practice-top"><button class="text-button" data-action="history">К истории</button><button class="text-button" data-history-copy="${escape(entry.runId)}">Скопировать диалог</button></div><div class="meta"><span class="pill">${escape(d.level)}</span><span class="pill">${escape(d.topicLabel)}</span></div><h1>${escape(d.title)}</h1><p class="context">${escape(d.context)}</p><p class="hint">${done ? 'Завершенный диалог' : 'Сохраненные ответы незавершенного диалога'} · ${escape(new Date(entry.updatedAt).toLocaleString('ru-RU'))}</p><div class="conversation">${entry.answers.map((a,index) => {
      const t = d.turns[index];
      return `<div class="exchange">${partner(t.en,t.ru,d.speaker,t.stage)}<div class="answer-history"><p class="speaker">Ты · <span class="status ${a.status}">${statuses[a.status]}</span></p><p class="original">${escape(t.task)}</p><p lang="en">${a.answer ? escape(a.answer) : 'Ответ пропущен'}</p><p class="reference">Эталон: <span lang="en">${escape(t.best)}</span></p>${a.note ? `<p class="hint">${escape(a.note)}</p>` : ''}${variants(t)}</div></div>`;
    }).join('')}${done ? partner(d.ending.en,d.ending.ru,d.speaker) : ''}</div></section>`;
    window.scrollTo(0,0);
  }
  function submit(reveal = false) {
    const d = current();
    if (!d || session.index >= d.turns.length || session.answers[session.index]) return;
    const answer = $('answer').value.trim();
    if (!reveal && !answer) { toast('Сначала напиши ответ или открой эталон.'); $('answer').focus(); return; }
    const t = d.turns[session.index];
    const result = reveal ? {status:'revealed'} : E.check(answer, t);
    const record = {...result, answer, at: new Date().toISOString()};
    session.answers[session.index] = record;
    session.draft = answer;
    if (result.status === 'unknown') journal.push({at: record.at, dialogueId: d.id, title: d.title, level: d.level, context: d.context, partner: t.en, task: t.task, answer, best: t.best, turn: session.index + 1});
    rememberSession(); save(); renderPractice();
    document.querySelector('.feedback')?.scrollIntoView({block:'nearest',behavior:'auto'});
    document.querySelector('[data-action="next"]')?.focus({preventScroll:true});
  }
  function fragment(index, d = current(), source = session) {
    const t = d.turns[index], a = source.answers[index];
    return `${t.stage ? t.stage + '\n' : ''}${d.speaker}: ${t.en}\nПеревод: ${t.ru}\nМоя заданная реплика: ${t.task}\nМой ответ: ${a?.answer || '(нет ответа)'}\nРезультат: ${a ? statuses[a.status] : 'Еще не проверен'}\nЭталон: ${t.best}\nЕстественные варианты: ${E.preferred(t).join(' / ')}`;
  }
  function dialogueText(index, d = current(), source = session) {
    const header = `Everyday · ${d.level} · ${d.topicLabel} · ${d.title}\nКонтекст: ${d.context}\nТон: ${d.tone}\n`;
    if (Number.isInteger(index)) return header + '\n' + fragment(index,d,source);
    const limit = source === session ? Math.min(source.index + 1, d.turns.length) : source.answers.length;
    return header + '\n' + d.turns.slice(0,limit).map((_,i) => fragment(i,d,source)).join('\n\n') + (source.index === d.turns.length ? `\n\n${d.speaker}: ${d.ending.en}\nПеревод: ${d.ending.ru}` : '');
  }
  async function copy(text) {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(text); toast('Скопировано. Можно вставить в чат.');
    } catch (_) {
      $('copy-text').value = text;
      $('copy-dialog').showModal();
      $('copy-text').focus(); $('copy-text').select();
    }
  }
  function renderJournal() {
    $('journal-content').innerHTML = journal.length ? [...journal].reverse().map(item => `<article class="journal-entry"><p class="muted">${escape(item.title)} · ${escape(item.level)} · ${escape(new Date(item.at).toLocaleString('ru-RU'))}</p><p lang="en">${escape(item.partner)}</p><p>${escape(item.task)}</p><blockquote lang="en">${escape(item.answer)}</blockquote><p>Эталон: <span lang="en">${escape(item.best)}</span></p></article>`).join('') : '<p class="empty-state">Пока здесь пусто. Нераспознанные ответы появятся после проверки.</p>';
    $('export-journal').disabled = !journal.length;
    $('clear-journal').disabled = !journal.length;
    $('clear-confirm').hidden = true;
  }
  function exportJournal() {
    const text = `Everyday — нераспознанные ответы\nЭто не список ошибок. Требуется разбор правильности и естественности.\n\n` + journal.map(item => `${item.level} · ${item.title}\nКонтекст: ${item.context}\nСобеседник: ${item.partner}\nЗадание: ${item.task}\nМой ответ: ${item.answer}\nЭталон: ${item.best}\nДата: ${item.at}`).join('\n\n---\n\n');
    const url = URL.createObjectURL(new Blob([text], {type:'text/plain;charset=utf-8'}));
    const link = document.createElement('a');
    link.href = url; link.download = `everyday-answers-${new Date().toISOString().slice(0,10)}.txt`;
    document.body.append(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  app.addEventListener('click', event => {
    const button = event.target.closest('button');
    if (!button) return;
    if (button.dataset.historyView) { const entry = history.find(item => item.runId === button.dataset.historyView); if (entry) renderHistoryEntry(entry); return; }
    if (button.dataset.historyCopy) { const entry = history.find(item => item.runId === button.dataset.historyCopy); if (entry) copy(dialogueText(undefined,entry.dialogue,entry)); return; }
    if (button.dataset.level) { settings.level = button.dataset.level; selectedId = ''; save(); renderHome(); document.querySelector(`[data-level="${settings.level}"]`).focus(); return; }
    if (button.hasAttribute('data-copy-turn')) { copy(dialogueText(Number(button.dataset.copyTurn))); return; }
    switch (button.dataset.action) {
      case 'start': begin(); break;
      case 'update': {
        if (!['http:','https:'].includes(window.location.protocol)) { toast('Для обновления оффлайн файла скачай новый index.html с сайта проекта.'); break; }
        if (navigator.onLine === false) { toast('Для загрузки новой версии нужен интернет.'); break; }
        save(); const url = new URL(window.location.href); url.searchParams.set('update',String(Date.now())); window.location.assign(url.href); break;
      }
      case 'resume': screen = 'practice'; renderPractice(); window.scrollTo(0,0); break;
      case 'discard': session = null; save(); renderHome(); break;
      case 'home': renderHome(); window.scrollTo(0,0); break;
      case 'history': renderHistory(); break;
      case 'reveal': submit(true); break;
      case 'retry': session.draft = session.answers[session.index].answer; session.answers.length = session.index; if (!session.answers.length) history = history.filter(entry => entry.runId !== session.runId); else rememberSession(); save(); renderPractice(); break;
      case 'next': if (!session.answers[session.index]) break; session.index++; session.draft = ''; rememberSession(); save(); renderPractice(); (document.getElementById('active-turn') || document.getElementById('completion'))?.scrollIntoView({block:'start'}); break;
      case 'copy-all': copy(dialogueText()); break;
      case 'another': { const d = current(); settings.level = d.level; if (settings.topic !== 'random') settings.topic = d.topic; settings.length = d.length; begin(true); break; }
    }
  });
  app.addEventListener('change', event => {
    if (event.target.id === 'topic') { settings.topic = event.target.value; selectedId = ''; save(); renderHome(); $('topic').focus(); }
    if (event.target.id === 'dialogue-choice') selectedId = event.target.value;
  });
  app.addEventListener('input', event => { if (event.target.id === 'answer' && session) { session.draft = event.target.value; save(); } });
  app.addEventListener('submit', event => { if (event.target.id === 'answer-form') { event.preventDefault(); submit(); } });
  app.addEventListener('keydown', event => { if (event.target.id === 'answer' && event.key === 'Enter' && !event.shiftKey && !event.isComposing && !event.target.readOnly) { event.preventDefault(); submit(); } });
  $('home-link').addEventListener('click', event => { event.preventDefault(); renderHome(); window.scrollTo(0,0); });
  $('journal-button').addEventListener('click', () => { renderJournal(); $('journal-dialog').showModal(); });
  document.querySelectorAll('[data-close]').forEach(button => button.addEventListener('click', () => $(button.dataset.close).close()));
  $('export-journal').addEventListener('click', exportJournal);
  $('clear-journal').addEventListener('click', () => { $('clear-confirm').hidden = false; });
  $('cancel-clear').addEventListener('click', () => { $('clear-confirm').hidden = true; });
  $('confirm-clear').addEventListener('click', () => { journal = []; save(); renderJournal(); toast('Журнал очищен.'); });
  if (session) rememberSession();
  save(); renderHome();
})();
