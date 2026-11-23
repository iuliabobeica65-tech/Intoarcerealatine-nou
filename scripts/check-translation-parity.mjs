import {readFileSync,existsSync} from "node:fs";
import {join} from "node:path";
const pairs=[
 ["metoda-clar.html","en/root-balancing.html"],
 ["legi-universale.html","en/universal-laws.html"],
 ["acasa.html","en/index.html"],
 ["constelatii.html","en/systemic-constellations.html"],
 ["lucram-impreuna.html","en/work-with-me.html"],
 ["sedinte-individuale.html","en/individual-sessions.html"],
 ["despre-mine.html","en/about.html"],
 ["live.html","en/weekly-live.html"],
 ["program-nivelul-de-merit.html","en/self-worth-programme.html"]
];
const root="dist";
const count=(s)=>[...s.matchAll(/<h[1-3]\b[^>]*>/gi)].length;
const findings=[];
for(const [ro,en] of pairs){
 const a=join(root,ro),b=join(root,en);
 if(!existsSync(a)||!existsSync(b)){findings.push({ro,en,error:"missing output"});continue}
 const roText=readFileSync(a,"utf8"),enText=readFileSync(b,"utf8");
 const roHeadings=count(roText),enHeadings=count(enText);
 const ratio=Number((enHeadings/roHeadings).toFixed(2));
 if(ratio<0.9)findings.push({ro,en,roHeadings,enHeadings,ratio,reason:"Major structural difference: requires human review against original"});
}
console.log(JSON.stringify({reviewRequired:findings},null,2));
if(findings.length)process.exitCode=1;
