function getQuery(router) {
    const path = router.asPath.split('#')[0];
    const idx = path.lastIndexOf('?');
    let paramsString = path.substring(idx + 1)
    return Object.fromEntries(new URLSearchParams(paramsString));
}

const months = ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"]
function getItalianDate(date){
    return date.getDate() + " " + months[date.getMonth()]
}

/**
 * Autori possono essere JSON array nativi (dopo refactor) o base64-encoded JSON (legacy).
 * Gestisce entrambi i formati per backward compat.
 */
function parseAuthors(authors) {
    if (!authors) return [];
    if (Array.isArray(authors)) return authors;
    // Tentativo diretto JSON (nuovo formato, niente base64)
    try {
        const parsed = JSON.parse(authors);
        if (Array.isArray(parsed)) return parsed;
    } catch {}
    // Fallback legacy: base64-decoded JSON
    try {
        const decoded = typeof Buffer !== 'undefined'
            ? Buffer.from(authors, 'base64').toString('ascii')
            : atob(authors);
        const parsed = JSON.parse(decoded);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

module.exports = {
    getQuery: getQuery,
    getItalianDate: getItalianDate,
    parseAuthors: parseAuthors,
};
