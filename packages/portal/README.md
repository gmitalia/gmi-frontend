# GameMaker Italia - portale

Questa app Next.js contiene il portale del sito: blog, showcase, risorse, tutorial e competizioni.

- Blog: `/`, `/blog`, `/showcase`, `/resources`, `/tutorial`, `/posts/[slug]`
- Competizioni: `/competizioni`, `/competizioni/contest`, `/competizioni/results`, ecc.
- Asset delle competizioni: `public/competizioni`

## Sviluppo locale

```bash
npm install
npm run dev
```

Blog su `http://localhost:3000`, competizioni su `http://localhost:3000/competizioni`.

## Build statica

```bash
npm run build
```

L'output viene generato in `out/`. Per la build completa del sito (output in `public/`),
usa `npm run build` dalla root del repository.

## Deploy di un nuovo articolo

- Modifica i contenuti su https://gmitalia.sanity.studio/desk
- Dalla root del repository esegui `npm run build`
- Pubblica su Firebase con `npx firebase deploy`
