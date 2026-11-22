(function (root) {
  'use strict';
  const contractions = {
    "i'm": 'i am', "you're": 'you are', "we're": 'we are', "they're": 'they are',
    "isn't": 'is not', "aren't": 'are not', "don't": 'do not', "doesn't": 'does not',
    "didn't": 'did not', "can't": 'cannot', "won't": 'will not', "i'll": 'i will',
    "we'll": 'we will', "that's": 'that is', "what's": 'what is', "here's": 'here is'
  };
  function normalize(text) {
    let value = String(text).normalize('NFKC').toLowerCase().replace(/[’‘`]/g, "'");
    value = value.replace(/\b[a-z]+(?:'[a-z]+)\b/g, word => contractions[word] || word);
    return value.replace(/\bcan not\b/g, 'cannot').replace(/[.,!?;:“”"…()]/g, ' ').replace(/\s+/g, ' ').trim();
  }
  function canonical(text, rules) {
    let value = normalize(text);
    if (rules.includes('get-have')) value = value.replace(/^(can|could) (i|we)( please)? get\b/, '$1 $2$3 have');
    if (rules.includes('id-like')) value = value.replace(/^i'd like\b/, 'i would like');
    if (rules.includes('would-like')) value = value.replace(/\b(i|we)'d like\b/g, '$1 would like');
    return value;
  }
  const formCache = new WeakMap();
  function naturalForms(turn) {
    if (formCache.has(turn)) return formCache.get(turn);
    const forms = new Map();
    const add = text => forms.set(canonical(text, turn.rules || []), text);
    turn.natural.forEach(add);
    for (const text of turn.natural) {
      // Only transform an explicitly authored request. The object, number and negation stay intact.
      const value = text.replace(/[’‘]/g, "'").trim();
      const request = value.match(/^can (i|we) (have|get) (.+?)[?.!]*$/i);
      if (request) {
        const who = request[1].toLowerCase(), verb = request[2].toLowerCase();
        const object = request[3].replace(/[, ]*please$/i,'').replace(/[?.!]+$/,'').trim();
        for (const start of [`Can ${who} ${verb}`, `Could ${who} ${verb}`, `Can ${who} please ${verb}`, `Could ${who} please ${verb}`]) {
          add(`${start} ${object}?`);
          if (!start.includes('please')) { add(`${start} ${object}, please?`); add(`${start} ${object}, thanks?`); add(`${start} ${object}, thank you?`); }
        }
      }
      if (/\bthanks[.!]?$/i.test(value)) add(value.replace(/\bthanks([.!]?)$/i,'thank you$1'));
      if (/\bthank you[.!]?$/i.test(value)) add(value.replace(/\bthank you([.!]?)$/i,'thanks$1'));
    }
    const result = [...forms.values()]; formCache.set(turn,result); return result;
  }
  function preferred(turn, limit = 10) {
    const seen = new Set();
    return [turn.best,...turn.natural].filter(text => {const key=normalize(text);if(seen.has(key))return false;seen.add(key);return true;}).slice(0,limit);
  }
  function check(answer, turn) {
    const plain = normalize(answer);
    if (!plain) return {status: 'empty'};
    const rules = turn.rules || [];
    const key = canonical(answer, rules);
    const natural = naturalForms(turn).find(value => canonical(value, rules) === key);
    if (natural) return {status: 'correct', matched: natural, method: turn.natural.some(value => normalize(value) === plain) ? 'variant' : 'grammar'};
    const acceptable = turn.acceptable.find(value => canonical(value.text, rules) === key);
    if (acceptable) return {status: 'acceptable', matched: acceptable.text, note: acceptable.note};
    return {status: 'unknown'};
  }
  function eligible(ids, completed) {
    const unseen = ids.filter(id => !completed.includes(id));
    return unseen.length ? unseen : ids;
  }
  // Completion flags are global: changing topic/random filters cannot reset them.
  function pick(ids, seen, random = Math.random) {
    const available = eligible(ids, seen);
    if (!available.length) return null;
    return available[Math.floor(random() * available.length)];
  }
  root.OfflineEngine = {normalize, canonical, check, eligible, pick, naturalForms, preferred};
  if (typeof module !== 'undefined') module.exports = root.OfflineEngine;
})(typeof window !== 'undefined' ? window : globalThis);
