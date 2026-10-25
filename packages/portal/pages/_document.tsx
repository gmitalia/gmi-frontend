import { Head, Html, Main, NextScript } from "next/document";

export default function MyDocument() {
  return (
    <Html lang="it">
      <Head>
        <meta name="theme-color" content="#E8EDF1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/competizioni/manifest.json" />
      </Head>
      <body className="bg-page min-h-screen">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
