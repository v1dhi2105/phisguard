
importScripts('heuristics.js');

chrome.webNavigation.onBeforeNavigate.addListener(async (details) => {
  if(details.frameId!== 0) return;
  const {score, reasons} = scoreUrl(details.url);

  // Optional: Google Safe Browsing API check (add your API key)
  // let sbThreat = await checkSafeBrowsing(details.url);
  // if(sbThreat) { score=100; reasons.push("Listed in Google Safe Browsing"); }
    let level = score < 30? 'safe' : score < 70? 'warning' : 'danger';
    chrome.storage.local.set({[details.tabId]: {url: details.url, score, reasons, level}});
});

async function checkSafeBrowsing(url) {
  // You need to enable Safe Browsing API v4 and get key
    const API_KEY = "YOUR_API_KEY";
    const res = await fetch(`https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${API_KEY}`, {
    method: 'POST',
    body: JSON.stringify({
    client: {clientId: "phishguard", clientVersion: "1.0"},
    threatInfo: {
        threatTypes: ["MALWARE","SOCIAL_ENGINEERING"],
        platformTypes: ["ANY_PLATFORM"],
        threatEntryTypes: ["URL"],
        threatEntries: [{url}]
    }
    })
});
const data = await res.json();
return data.matches && data.matches.length > 0;
}