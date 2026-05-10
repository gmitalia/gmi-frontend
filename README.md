# GMI Frontend

[![Deploy to Firebase](https://github.com/gmitalia/gmi-frontend/actions/workflows/deploy-firebase.yml/badge.svg)](https://github.com/gmitalia/gmi-frontend/actions/workflows/deploy-firebase.yml)

Frontend del sito [GameMaker Italia](https://gamemakeritalia.it), gestito tramite Firebase Hosting.

## Struttura del progetto

Il progetto è organizzato in tre pacchetti:

| Pacchetto | Tecnologia | Ruolo |
|---|---|---|
| [packages/blog](packages/blog) | React + Next.js + Tailwind | Blog frontend, consuma contenuti da Sanity CMS |
| [packages/gmicontest](packages/gmicontest) | React + Next.js + Redux | Gestione competizioni e contest |
| [packages/sanity](packages/sanity) | Sanity Studio v3 | CMS per la gestione dei contenuti |

## Ambienti

- [Staging](https://gmi-frontend-staging.web.app/)
- [Produzione](https://gamemakeritalia.it)

## Prerequisiti

- Node.js (per gmicontest è raccomandata la v16.13.2)
- npm
- Firebase CLI (`npx firebase`)

## Sviluppo locale

Ogni pacchetto può essere avviato in modalità sviluppo in modo indipendente:

```bash
# Blog
cd packages/blog
npm run dev

# Contest
cd packages/gmicontest
npm run dev

# CMS (Sanity Studio)
cd packages/sanity
npm run dev
```

## Build

La build completa dei pacchetti viene gestita da [build.sh](build.sh), che esporta i progetti Next.js come file statici nella cartella `public/` pronti per il deploy.

### Build totale (build.sh)

Esegue l'esportazione di tutti i pacchetti in un unico comando:

```bash
npm run build
```

Lo script:
1. Compila il **blog** con `next export` e copia i file statici in `public/`
2. Compila **gmicontest** con `next build && next export` e sposta l'output in `public/competizioni/`

Dopo aver lanciato `build.sh`, la cartella `public/` conterrà tutti i file pronti per il deploy su Firebase.

### Build del blog

```bash
cd packages/blog
npm install
npm run export
```

Maggiori dettagli: [packages/blog/README.md](packages/blog/README.md)

### Build del CMS Sanity

```bash
cd packages/sanity
npm install
npm run build
```

Maggiori dettagli: [packages/sanity/README.md](packages/sanity/README.md)

### Build di gmicontest

```bash
cd packages/gmicontest
npm install
npm run build && npm run export
```

Maggiori dettagli: [packages/gmicontest/README.md](packages/gmicontest/README.md)

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
