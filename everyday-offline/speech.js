/* Device speech. Automatic mode delegates to the system when all English voices are local. */
(function(root){
  let current=null;
  function voices(){try{return root.speechSynthesis?.getVoices()||[];}catch(_){return [];}}
  const english=v=>/^en(?:[-_]|$)/i.test(v.lang),key=v=>v.voiceURI||`${v.name}::${v.lang}`;
  function localVoices(){return voices().filter(v=>english(v)&&v.localService===true);}
  function voice(preferred=''){const local=localVoices();if(preferred==='@ava-premium')return local.find(v=>/\bava\b/i.test(v.name+' '+v.voiceURI)&&/premium/i.test(v.name+' '+v.voiceURI));return preferred?local.find(v=>key(v)===preferred):local.find(v=>v.default)||local.find(v=>/^en[-_]US$/i.test(v.lang))||local[0];}
  function stop(){root.speechSynthesis?.cancel();current=null;}
  function play(text,speed,onError,preferred=''){
    stop();const selected=voice(preferred);
    if(!root.speechSynthesis||!root.SpeechSynthesisUtterance||!selected){onError?.(preferred==='@ava-premium'?'Ava (Premium) недоступен':preferred?'Выбранный голос недоступен':'Английский голос недоступен');return false;}
    const utterance=new root.SpeechSynthesisUtterance(text);
    // Safari can mark every voice default; do not infer an iOS accessibility preference from that flag.
    const systemDefault=!preferred&&voices().filter(english).every(v=>v.localService===true);
    if(!systemDefault)utterance.voice=selected;
    utterance.lang=systemDefault?'en':selected.lang;utterance.rate=1;
    utterance.onerror=e=>{if(current===utterance){current=null;if(!['canceled','interrupted'].includes(e.error))onError?.('Не удалось воспроизвести');}};
    utterance.onend=()=>{if(current===utterance)current=null;};current=utterance;root.speechSynthesis.speak(utterance);return true;
  }
  voices();root.speechSynthesis?.addEventListener?.('voiceschanged',voices);
  root.OfflineSpeech={play,stop,voice,localVoices,key};
})(typeof window!=='undefined'?window:globalThis);
