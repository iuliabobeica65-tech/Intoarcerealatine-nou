import {HttpError} from './security.mjs';
export const COLLECTION_CONSENT_VERSION='community-collection-only-v1';
export const COLLECTION_DOI_TEMPLATE_ID=15;
export const COLLECTION_FORM_PATH='/newsletter';
export const COLLECTION_CONSENT_TEXT='Sunt de acord să primesc pe viitor e-mailuri de la Iulia Bobeica – Echilibrarea rădăcinilor despre noutăți, evenimente și programe. În prezent, voi primi doar mesajul necesar confirmării abonării. Îmi pot retrage acordul oricând.';
export const collectionOnly=env=>env.NEWSLETTER_COLLECTION_ONLY==='true';
export function assertCollectionConfiguration(env){
 if(!collectionOnly(env))return;
 if(env.EMAIL_SEND_ENABLED!=='false'||env.REGISTRATIONS_ENABLED!=='false'||env.PAYMENTS_TEST_ENABLED!=='false'||env.LIVE_PAYMENTS_ENABLED!=='false'||env.INVOICING_ENABLED!=='false'||env.NEWSLETTER_AUTOMATIONS_REVIEWED!=='true'||env.NEWSLETTER_PRIVACY_APPROVED!=='true')throw new HttpError(503,'newsletter_review_required');
 if(env.TEST_MODE==='true'||env.TEST_DOI_REDIRECTION_URL!==undefined)throw new HttpError(503,'newsletter_public_profile_required');
 if(env.BREVO_DOI_TEMPLATE_ID!==String(COLLECTION_DOI_TEMPLATE_ID))throw new HttpError(503,'newsletter_doi_template_required');
}
export function collectionSourcePath(source){
 if(source==='home')return '/acasa#newsletter';
 if(source===undefined||source==='newsletter')return COLLECTION_FORM_PATH;
 throw new HttpError(400,'newsletter_source');
}
