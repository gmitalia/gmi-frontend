
function getQuery(router) {
    const idx = router.asPath.lastIndexOf('?');
    let paramsString = router.asPath.substring(idx + 1)
    return Object.fromEntries(new URLSearchParams(paramsString));
}


const months = ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"]
function getItalianDate(date){
    return date.getDate() + " " + months[date.getMonth()]
}

module.exports = {
    getQuery: getQuery,
    getItalianDate: getItalianDate,
};