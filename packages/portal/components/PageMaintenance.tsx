import Head from 'next/head'

export default function PageMaintenance()
{
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-page">
      <Head>
        <title>GMI Competizioni — Sito in manutenzione</title>
      </Head>
      <div className="text-center px-6">
        <div className="bg-surface border border-default rounded p-12 max-w-lg w-full">
          <h1 className="text-4xl font-bold text-content mb-4">
            In manutenzione
          </h1>
          <p className="text-lg text-content-muted">
            Stiamo lavorando per migliorare l'esperienza™
          </p>
          <div className="mt-8">
            <a
              href="https://gamemakeritalia.it"
              className="inline-block px-6 py-2.5 bg-secondary text-on-secondary font-semibold rounded-sm hover:opacity-90 transition-opacity"
            >
              Torna su GameMaker Italia
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
