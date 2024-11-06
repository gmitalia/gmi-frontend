import { Head, Html, Main, NextScript } from 'next/document';
import { basePath } from '../next.config';

export default function MyDocument() {

  const domain = "gmitalia.altervista.org";
  const url = "https://gmitalia.altervista.org";
  const thumbnail = "https://gmitalia.altervista.org/img/thumbnail.png";
  const title = "GMIContest";
  const description = "GMI Contest è il portale della competizione annuale di GameMaker Italia.";

  return (
    <Html lang="it">
      <Head>
        <meta charSet="utf-8" />
        <meta property="og:title" content={title} />

        {/*  HTML Meta Tags  */}
        <meta name="theme-color" content="#161616" />


        <meta name="description" content={description} />

        {/*  Facebook Meta Tags  */}
        <meta property="og:url" content="https://gmitalia.altervista.org/" />
        <meta property="og:type" content="website" />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={thumbnail} />

        {/*  Twitter Meta Tags  */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content={domain} />
        <meta property="twitter:url" content={url} />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={thumbnail} />

        {/*  Favicon  */}
        {/* <link rel="icon" type="image/png" sizes="96x96" href="img/favicon-96x96.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="img/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="img/favicon-16x16.png" /> */}
        <link rel="icon" href={`${basePath}/img/favicon.ico`} />

        {/*  Font awesome  */}
        <link href={`${basePath}/fontawesome/css/all.min.css`} rel="stylesheet" />


        {/*
        <link rel="apple-touch-icon" href="./MISSING.png" /> 
        manifest.json provides metadata used when your web app is installed on a
        user's mobile device or desktop. See https://developers.google.com/web/fundamentals/web-app-manifest/
         */}
        <link rel="manifest" href={`${basePath}/manifest.json`} />

      </Head>

      <body className='container bg-gray-100 shadow-xl'>
        <Main />
        <NextScript />
      </body>
      <div id="modal-root"></div>

    </Html>
  )
}