(function(){
    const reasons = [];
    let scoreAdd = 0;
  // Password field on HTTP page
    if(document.querySelector('input[type="password"]') && location.protocol!== 'https:'){
    reasons.push("Password field on non-HTTPS page"); scoreAdd+=30;
}
  // Form submits to different domain
    document.querySelectorAll('form').forEach(form=>{
    try{
    if(form.action && new URL(form.action).hostname!== location.hostname){
        reasons.push("Form submits to different domain"); scoreAdd+=20;
    }
    }catch(e){}
});

if(reasons.length>0){
    const banner = document.createElement('div');
    banner.innerHTML = `<b>PhishGuard Warning:</b> ${reasons.join(', ')}`;
    banner.style.cssText = "position:fixed;top:0;left:0;width:100%;background:#ff4444;color:white;padding:10px;z-index:999999;text-align:center;font-family:sans-serif;";
    document.body.prepend(banner);
}
chrome.runtime.sendMessage({type:"CONTENT_RISK", reasons, scoreAdd});
})();