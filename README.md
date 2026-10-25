# GMI Frontend

[![Deploy to Firebase](https://github.com/gmitalia/gmi-frontend/actions/workflows/deploy-firebase.yml/badge.svg)](https://github.com/gmitalia/gmi-frontend/actions/workflows/deploy-firebase.yml)

Frontend del sito [GameMaker Italia](https://gamemakeritalia.it), gestito tramite Firebase Hosting.

## Struttura del progetto

Il progetto è organizzato in due pacchetti:

| Pacchetto | Tecnologia | Ruolo |
|---|---|---|
| [packages/portal](packages/portal) | React + Next.js + Tailwind + Redux | Portale: blog, showcase, risorse, tutorial e competizioni (`/competizioni`); consuma contenuti da Sanity CMS |
| [packages/sanity](packages/sanity) | Sanity Studio v3 | CMS per la gestione dei contenuti |

## Ambienti

- [Staging](https://gmi-frontend-staging.web.app/)
- [Produzione](https://gamemakeritalia.it)

## Prerequisiti

- Node.js 20+
- npm
- Firebase CLI (`npx firebase`)

## Sviluppo locale

Il portale si avvia con un'unica app Next:

```bash
# Portale (http://localhost:3000 e /competizioni)
cd packages/portal
npm run dev

# CMS (Sanity Studio)
cd packages/sanity
npm run dev
```

## Build

La build completa viene gestita da [build.sh](build.sh), che esporta l'app Next come file statici nella cartella `public/`, pronta per il deploy.

### Build totale (build.sh)

Esegue l'esportazione dell'app in un unico comando:

```bash
npm run build
```

Lo script:
1. Compila l'unica app Next in `packages/portal` (blog + competizioni) con `next build` in modalità export statico
2. Copia l'output (`packages/portal/out`) in `public/`, incluse le rotte `/competizioni`

Dopo aver lanciato `build.sh`, la cartella `public/` conterrà tutti i file pronti per il deploy su Firebase.

### Build del portale

```bash
cd packages/portal
npm install
npm run build
```

Maggiori dettagli: [packages/portal/README.md](packages/portal/README.md)

### Build del CMS Sanity

```bash
cd packages/sanity
npm install
npm run build
```

Maggiori dettagli: [packages/sanity/README.md](packages/sanity/README.md)

## Deploy

### Login

Al primo deploy, autenticati con Firebase:

```bash
npx firebase login
# oppure
npm exec -- firebase login
```

### Impostare l'ambiente

Sono disponibili due ambienti: `staging` e `default` (produzione).

```bash
npx firebase use <environment>
```

### Deploy in produzione

```bash
npx firebase deploy -P default
```

### Deploy in staging

```bash
npm run deploy-staging
# oppure
npx firebase deploy -P staging
```

### Troubleshooting

In caso di errore:

> Error: Failed to get Firebase project gmi-frontend. Please make sure the project exists and your account has permission to access it.

Riesegui il login:

```bash
npx firebase login --reauth
```

## Note

### Rewrite del path verso index

Tutte le richieste vengono reindirizzate a `index.html` per il routing lato client:

```json
{
  "rewrites": [
    {
      "source": "**",
      "destination": "/index.html"
    }
  ]
}
```
