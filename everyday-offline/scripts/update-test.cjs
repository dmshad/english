const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),assert=require('node:assert/strict');
const c={globalThis:{},URL,AbortController,setTimeout,clearTimeout};vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../update.js'),'utf8'),c);const U=c.globalThis.OfflineUpdate;
(async()=>{
  assert.equal(U.newer('0.12.2','0.12.1'),true);assert.equal(U.newer('0.13','0.12.9'),true);assert.equal(U.newer('0.12.1','0.12.1'),false);assert.equal(U.newer('0.12','0.12.1'),false);assert.equal(U.newer('bad','0.12.1'),false);
  let requests=0;const get=version=>async(url,opts)=>{requests++;assert.equal(opts.cache,'no-store');assert.equal(opts.credentials,'same-origin');assert.ok(new URL(url).searchParams.has('update'));return {ok:true,text:async()=>`<meta name="application-version" content="${version}">`};};
  assert.equal((await U.check('file:///tmp/index.html','0.12.1',true,get('0.12.2'))).status,'file');assert.equal((await U.check('https://example.test/english/','0.12.1',false,get('0.12.2'))).status,'offline');assert.equal(requests,0);
  assert.equal((await U.check('https://example.test/english/','0.12.1',true,get('0.12.2'))).status,'available');assert.equal((await U.check('https://example.test/english/','0.12.1',true,get('0.12.1'))).status,'current');
  assert.equal((await U.check('https://example.test/english/','0.12.1',true,async()=>{throw Error();})).status,'error');assert.equal((await U.check('https://example.test/english/','0.12.1',true,async()=>({ok:false}))).status,'error');assert.equal((await U.check('https://example.test/english/','0.12.1',true,async()=>({ok:true,text:async()=>'<html>Not the app</html>'}))).status,'error');
  console.log('Update checks passed: version comparison, cache bypass, newer/current/offline/file/error branches.');
})().catch(e=>{console.error(e);process.exitCode=1;});
