
// heuristics.js
const SUSPICIOUS_TLDS = ['.tk', '.ml', '.ga', '.cf', '.gq', '.xyz'];
const BRANDS = ['google','facebook','amazon','hdfc','sbi','paypal','apple'];
const SUSPICIOUS_KEYWORDS = ['secure','verify','login','account','update'];

function levenshtein(a, b) {
    const m = Array(b.length+1).fill(null).map(()=>Array(a.length+1).fill(null));
    for(let i=0;i<=a.length;i++) m[0][i]=i;
    for(let j=0;j<=b.length;j++) m[j][0]=j;
    for(let j=1;j<=b.length;j++){
    for(let i=1;i<=a.length;i++){
        m[j][i]= a[i-1]==b[j-1]? m[j-1][i-1] : Math.min(m[j-1][i]+1, m[j][i-1]+1, m[j-1][i-1]+1);
    }
}
return m[b.length][a.length];
}

function scoreUrl(urlStr) {
    let score = 0; let reasons = [];
    try {
    const url = new URL(urlStr);
    // 1. IP address
    if (/^\d+\.\d+\.\d+\.\d+$/.test(url.hostname)) { score+=30; reasons.push("Uses IP address instead of domain"); }
    // 2. No HTTPS
    if (url.protocol!== 'https:') { score+=20; reasons.push("No HTTPS - not encrypted"); }
    // 3. @ symbol
    if (urlStr.includes('@')) { score+=20; reasons.push("Contains '@' to hide real destination"); }
    // 4. Too many subdomains
    if (url.hostname.split('.').length > 3) { score+=15; reasons.push("Abnormal number of subdomains"); }
    // 5. Suspicious TLD
    if (SUSPICIOUS_TLDS.some(tld => url.hostname.endsWith(tld))) { score+=15; reasons.push("High-risk TLD"); }
    // 6. Long URL
    if (urlStr.length > 75) { score+=10; reasons.push("Excessively long URL"); }
    // 7. Typosquat
    for (let brand of BRANDS) {
        if (levenshtein(url.hostname, brand+'.com') <=2 &&!url.hostname.includes(brand)) {
        score+=25; reasons.push(`Possible typosquat of ${brand}`); break;
    }
    }
    // 8. Keyword stuffed
    if (SUSPICIOUS_KEYWORDS.filter(k=>url.hostname.includes(k)).length>=2) { score+=15; reasons.push("Keyword-stuffed domain (secure/verify/login)"); }
} catch(e){}
return {score: Math.min(score,100), reasons};
}