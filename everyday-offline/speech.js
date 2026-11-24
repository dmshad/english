/* Browser/device speech only. Never select a voice advertised as a remote service. */
(function(root){
  const rates=[0.6,0.7,0.8,0.9,1];let current=null;
  function voices(){try{return root.speechSynthesis?.getVoices()||[];}catch(_){return [];}}
  function voice(){return voices().filter(v=>/^en(?:[-_]|$)/i.test(v.lang)&&v.localService===true).sort((a,b)=>Number(/^en[-_]US$/i.test(b.lang))-Number(/^en[-_]US$/i.test(a.lang))||Number(b.default)-Number(a.default))[0];}
  function stop(){if(root.speechSynthesis)root.speechSynthesis.cancel();current=null;}
  function play(text,speed,onError){
    stop();const selected=voice();
    if(!root.speechSynthesis||!root.SpeechSynthesisUtterance||!selected){onError?.('Английский голос недоступен');return false;}
    const utterance=new root.SpeechSynthesisUtterance(text);utterance.voice=selected;utterance.lang=selected.lang;utterance.rate=rates[speed-1]||1;
    utterance.onerror=e=>{if(current===utterance){current=null;if(!['canceled','interrupted'].includes(e.error))onError?.('Не удалось воспроизвести');}};
    utterance.onend=()=>{if(current===utterance)current=null;};current=utterance;root.speechSynthesis.speak(utterance);return true;
  }
  // Prime asynchronously loaded voice inventories without auto-playing audio.
  voices();root.speechSynthesis?.addEventListener?.('voiceschanged',voices);
  root.OfflineSpeech={rates,play,stop,voice};
})(typeof window!=='undefined'?window:globalThis);
