export const sections=['events','participants','outbox','message-preview','payments'];
export const labels={draft:'Ciornă',open:'Înscrieri deschise',closed:'Înscrieri închise',reserved:'Rezervată',confirmed:'Confirmată',cancelled:'Anulată',completed:'Finalizată',pending:'În așteptare',sending:'În curs',sent:'Trimis',stopped:'Oprit',review:'Necesită verificare',paid:'Achitată',failed:'Eșuată',refunded:'Rambursată',created:'Creată'};
// Transport is injected. The shipped preview injects synthetic data only.
export function createReader(transport){return async(section,input={})=>{if(!sections.includes(section))throw Error('Operațiunea nu este de consultare.');return transport(section,input);};}
export function pageRows(rows,{limit=3,after=''}={}){
 if(!Number.isSafeInteger(limit)||limit<1||limit>100||typeof after!=='string')throw Error('Paginare invalidă.');
 const sorted=rows.filter(r=>r.id>after).sort((a,b)=>a.id<b.id?-1:a.id>b.id?1:0),items=sorted.slice(0,limit);
 return {items,next:sorted.length>limit?items.at(-1).id:null};
}
export function dateLabel(seconds,timezone='Europe/Bucharest'){return new Intl.DateTimeFormat('ro-RO',{dateStyle:'medium',timeStyle:'short',timeZone:timezone}).format(new Date(seconds*1000));}
export function moneyLabel(amount,currency){return Number.isSafeInteger(amount)&&typeof currency==='string'&&/^[a-z]{3}$/i.test(currency)?new Intl.NumberFormat('ro-RO',{style:'currency',currency}).format(amount/100):'—';}
export function reviewLabel(row){return row.accountantReviewRequired?'Revizuire contabilă':row.manualPaymentReviewRequired?'Verificare plată':'—';}
