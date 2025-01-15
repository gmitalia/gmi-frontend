

/**
 * @typedef {Object} Game
 * @property {string} id L'ID del gioco
 * @property {string} name Il nome del gioco
 * @property {string} contest_id L'ID della competizione
 * @property {string} image_url L'URL dell'immagine del gioco
 * @property {string} short_description La descrizione breve del gioco
 * @property {string} description La descrizione dettagliata del gioco
 * @property {string} authors Gli autori del gioco
 * @property {string} download_url L'URL per il download del gioco
 * @property {string} placement La posizione del gioco nella competizione
 */

/**
 * @typedef {Object} Contest
 * @property {number} id L'ID della competizione
 * @property {string} name Il nome della competizione
 * @property {string} end_at La data di fine della competizione
 * @property {boolean} can_submit Se è possibile sottomettere giochi
 * @property {string} completed_at La data di completamento della competizione
 * @property {string} public Se la competizione è pubblica
 * @property {boolean} is_ended Se la competizione è terminata
 * @property {boolean} is_completed Se la competizione è completata
 */

/**
 * @typedef {Object} Participant
 * @property {string} id L'ID del partecipante
 * @property {string} user_name Il nome utente del partecipante
 * @property {string} user_discord_id L'ID Discord del partecipante
 * @property {string} contest_id L'ID della competizione
 * @property {string} kind Tipo di partecipante
 */

/**
 * @typedef {Object} Vote
 * @property {string} user_id L'ID dell'utente che ha votato
 * @property {string} game_id L'ID del gioco votato
 * @property {string} created_at La data in cui il voto è stato creato
 * @property {string} updated_at La data dell'aggiornamento del voto
 * @property {string} score Il punteggio assegnato al gioco
 * @property {string} comment Il commento lasciato dall'utente
 * @property {string} pros I punti positivi menzionati nel voto
 * @property {string} cons I punti negativi menzionati nel voto
 * @property {string} judge_name Il nome del giudice
 */

/**
 * @typedef {function} CallbackWithGames
 * @param {Object} data
 * @param {boolean} data.success Stato dell'operazione
 * @param {Game[]} data.games Lista dei giochi
 */

/**
 * @typedef {function} CallbackWithContests
 * @param {Object} data
 * @param {boolean} data.success Stato dell'operazione
 * @param {Contest[]} data.contests Lista delle competizioni
 */

/**
 * @typedef {function} CallbackWithParticipants
 * @param {Object} data
 * @param {boolean} data.success Stato dell'operazione
 * @param {Participant[]} data.participants Lista dei partecipanti
 */

/**
 * @typedef {function} CallbackWithVotes
 * @param {Object} data
 * @param {boolean} data.success Stato dell'operazione
 * @param {Vote[]} data.votes Lista dei voti
 */

/**
 * @typedef {function} CallbackSuccess
 * @param {Object} data
 * @param {boolean} data.success Stato dell'operazione
 */
