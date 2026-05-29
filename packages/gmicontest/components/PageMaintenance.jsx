import Head from 'next/head'

export default function PageMaintenance()
{
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-primary">
      <Head>
        <title>GMI Competizioni — Sito in manutenzione</title>
      </Head>
      <style>{`
        @keyframes dot-bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-12px); }
        }
        .dot { animation: dot-bounce 1.4s ease-in-out infinite both; }
        .dot:nth-child(1) { animation-delay: 0s; }
        .dot:nth-child(2) { animation-delay: 0.2s; }
        .dot:nth-child(3) { animation-delay: 0.4s; }
      `}</style>
      <div className="text-center px-6">
        <div className="bg-surface border border-default rounded-2xl p-12 max-w-lg w-full shadow-lg">
          <h1 className="text-4xl font-bold text-content mb-4">
            In manutenzione
          </h1>
          <p className="text-lg text-content-muted">
            Stiamo lavorando per migliorare l'esperienza™
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <span className="inline-block w-2 h-2 bg-secondary rounded-full dot" />
            <span className="inline-block w-2 h-2 bg-secondary rounded-full dot" />
            <span className="inline-block w-2 h-2 bg-secondary rounded-full dot" />
          </div>
          <div className="mt-8">
            <a
              href="https://gamemakeritalia.it"
              className="inline-block px-6 py-2.5 bg-secondary text-on-secondary font-semibold rounded-lg hover:opacity-90 transition-opacity"
            >
              Torna su GameMaker Italia
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
