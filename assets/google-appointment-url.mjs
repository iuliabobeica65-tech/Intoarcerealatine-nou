// Shared by the API and the optional browser link; no requests to Google.
export function validateGoogleAppointmentUrl(value) {
 try{
  const u=new URL(value);
  if(u.protocol!=='https:'||u.username||u.password||u.port||u.search||u.hash)return null;
  const schedule=u.hostname==='calendar.google.com'&&/^\/calendar\/appointments\/schedules\/[A-Za-z0-9_-]+\/?$/.test(u.pathname);
  const shared=u.hostname==='calendar.app.google'&&/^\/[A-Za-z0-9_-]+\/?$/.test(u.pathname);
  return schedule||shared?u.href:null;
 }catch{return null;}
}
