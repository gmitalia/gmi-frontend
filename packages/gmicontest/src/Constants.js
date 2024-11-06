const { basePath } = require("../next.config")

const Config = {
    
    maxThumbnailSize: 2 * 1024 * 1024, //2MB
    descriptionMaxLength: 1024,
    
    getServerUrl: () => {

        if(typeof window === 'undefined')
            return "";
        let protocol = (window.location.hostname == "localhost") ? "http:" : "https:"
        let hostname = protocol + "//" + window.location.host
        console.debug(basePath)
        return hostname + basePath
    },
}

const ParticipantType = {
    competitor: 0,
    judge: 1
}

const prosList = [
    "Carismatico",
    "Divertente",
    "Godibile",
    "Grafica",
    "Longevità",
    "Originale",
    "Presentazione",
    "Rigiocabile",
    "Sonoro",
    "Tecnica Ottima",
    "Trama Efficace",
    "User Friendly",
]
  
const consList = [
    "Bugs",
    "Frustrante",
    "Grafica",
    "Poco Divertente",
    "Longevità",
    "Poco Originale",
    "Poco Rigiocabile",
    "Presentazione",
    "Sonoro",
    "Giocabilità",
    "Trama Inefficace",
]

module.exports = {
    Config,
    ParticipantType,
    prosList,
    consList
}