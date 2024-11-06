# Configuration (Using node 16.13.2)

# 1) Installation

`npm ci`

## 2) Development

`npm run dev`

## 3) Build

`npm run build`

## 4) Export/Render

`npm run export`

## 4) Build + Export

`npm run build && npm run export`


## Per mockare i dati

il progetto supporta uno strato di mock dei dati configurabile tramite chiave in src/api/GMIApi.js

la chiave da modificare è DIkey, che può assumere i seguenti valori:

- mock
- prod

prima di rilasciare impostare la chiave a prod
