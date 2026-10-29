// popup.js
chrome.tabs.query({active:true, currentWindow:true}, ([tab])=>{
    chrome.storage.local.get([tab.id.toString()], (data)=>{
    const info = data[tab.id];
    if(!info) return;
    document.getElementById('url').innerText = info.url;
    document.getElementById('score').innerText = `Risk:${info.score}/100 - ${info.level.toUpperCase()}`;
    document.getElementById('reasons').innerHTML = info.reasons.map(r=><li>${r}</li>).join('');});
});