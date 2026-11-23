/* Google Calendar integration. No attendee details or private Jitsi URL are transmitted. */
(() => {
  const calendarUrl = (date) => {
    const ymd = date.replace(/-/g, "");
    const details = {
      action: "TEMPLATE",
      text: "LIVE gratuit · Echilibrarea rădăcinilor / Root Balancing",
      dates: ymd + "T190000/" + ymd + "T200000",
      ctz: "Europe/Bucharest",
      details: "Întâlnire online pe Jitsi. Solicită și confirmă detaliile participării direct cu Iulia Bobeica. / Online Jitsi meeting. Contact Iulia Bobeica to confirm participation and obtain joining details.",
      location: "Online · Jitsi (link oferit după confirmare)"
    };
    return "https://calendar.google.com/calendar/render?" + new URLSearchParams(details).toString();
  };
  const nextMondayRomania = () => {
    const parts = new Intl.DateTimeFormat("en-CA", {timeZone:"Europe/Bucharest",year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",hourCycle:"h23"}).formatToParts(new Date());
    const get = type => parts.find(part => part.type === type).value;
    const date = new Date(Date.UTC(Number(get("year")),Number(get("month"))-1,Number(get("day"))));
    const offset = (8-date.getUTCDay())%7;
    date.setUTCDate(date.getUTCDate() + (offset === 0 && Number(get("hour")) >= 19 ? 7 : offset));
    return date.toISOString().slice(0,10);
  };
  document.querySelectorAll("[data-google-calendar-live]").forEach(link => {
    link.href = calendarUrl(nextMondayRomania());
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  });
  /* Only expose direct booking when an actual public Google Appointment Schedule URL is supplied. */
  document.querySelectorAll("[data-google-booking-url]").forEach(link => {
    const url = link.getAttribute("data-google-booking-url") || "";
    if (/^https:\/\/calendar\.google\.com\/calendar\/appointments\/schedules\/[a-zA-Z0-9_-]+/.test(url)) {
      link.href = url;
      link.hidden = false;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    } else link.remove();
  });
})();