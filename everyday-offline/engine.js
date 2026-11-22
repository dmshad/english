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
    if (rules.includes('get-have')) value = value.replace(/^can (i|we) get\b/, 'can $1 have');
    if (rules.includes('id-like')) value = value.replace(/^i'd like\b/, 'i would like');
    if (rules.includes('would-like')) value = value.replace(/\b(i|we)'d like\b/g, '$1 would like');
    return value;
  }
  function check(answer, turn) {
    const plain = normalize(answer);
    if (!plain) return {status: 'empty'};
    const rules = turn.rules || [];
    const key = canonical(answer, rules);
    const natural = turn.natural.find(value => canonical(value, rules) === key);
    if (natural) return {status: 'correct', matched: natural, method: normalize(natural) === plain ? 'variant' : 'grammar'};
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
  root.OfflineEngine = {normalize, canonical, check, eligible, pick};
  if (typeof module !== 'undefined') module.exports = root.OfflineEngine;
})(typeof window !== 'undefined' ? window : globalThis);
