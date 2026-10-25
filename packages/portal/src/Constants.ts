import { basePath } from "./paths";

export const Config = {
  maxThumbnailSize: 2 * 1024 * 1024, // 2MB
  descriptionMaxLength: 1024,

  getServerUrl: () => {
    if (typeof window === "undefined") return "";

    // Keep the real origin (scheme, host and port) so the OAuth
    // redirect_uri matches the URL the user is actually browsing.
    return window.location.origin + basePath;
  },
};

export const ParticipantType = {
  competitor: 0,
  judge: 1,
};

export const prosList = [
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
];

export const consList = [
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
  "Poco User Friendly",
];
