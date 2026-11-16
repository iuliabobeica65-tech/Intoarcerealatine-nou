import {validateGoogleAppointmentUrl} from './google-appointment-url.mjs';
export async function prepareGoogleAppointmentLinks(document,fetcher) {
 'use strict';
 const containers=document.querySelectorAll('[data-google-appointment-container]');if(!containers.length)return;
 // Default markup stays hidden. Merely viewing the page never contacts Google.
 return fetcher('/api/config').then(r=>{if(!r.ok)throw Error();return r.json();}).then(config=>{
  const url=validateGoogleAppointmentUrl(config.googleAppointmentUrl);if(!url)return;
  for(const container of containers){const link=container.querySelector('[data-google-appointment]');if(!link)continue;link.href=url;container.hidden=false;}
 }).catch(()=>{});
}
if(typeof document!=='undefined')prepareGoogleAppointmentLinks(document,fetch.bind(globalThis));
