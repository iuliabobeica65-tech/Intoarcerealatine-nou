// Link-only integration with the existing Google Appointment Schedules decision.
// No calendar API calls, bookings, notifications, payments or marketing consent.
import {validateGoogleAppointmentUrl} from '../assets/google-appointment-url.mjs';
export function googleAppointmentUrl(env) {
 return env.GOOGLE_APPOINTMENTS_ENABLED==='true'?validateGoogleAppointmentUrl(env.GOOGLE_APPOINTMENT_URL):null;
}
