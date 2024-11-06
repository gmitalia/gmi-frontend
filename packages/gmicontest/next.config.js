//config
const basePathDev = "";
const basePathBuild = "/competizioni"

let basePath = basePathDev;
if(process.env.NODE_ENV == "production")
    basePath = basePathBuild;

console.log("Exporting with basePath = " + basePath);

module.exports = {
    trailingSlash: true,
    basePath: basePath,
    images: {
        domains: [
            'gmitalia.altervista.org',
            'cdn.discordapp.com'
        ],
    },
}