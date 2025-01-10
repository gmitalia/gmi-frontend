/**
 * @typedef {Object} Contest
 * @property {number} id - ID univoco della competizione.
 * @property {string} name - Nome della competizione.
 * @property {string} end_at - Data e ora di fine della competizione (formato ISO 8601).
 * @property {boolean} can_submit - Indica se è possibile inviare partecipazioni.
 * @property {string} completed_at - Data e ora in cui la competizione è stata completata (formato ISO 8601).
 * @property {boolean} public - Indica se la competizione è pubblica.
 * @property {boolean} is_ended - Indica se la competizione è terminata.
 * @property {boolean} is_completed - Indica se la competizione è stata completata.
 */

/**
 * @typedef {Object} ContestsResponse
 * @property {boolean} success - Stato della richiesta.
 * @property {Contest[]} contests - Elenco delle competizioni.
 */