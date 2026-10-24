import PageMaintenance from '../../components/PageMaintenance';
import PageCompetitions from '../../components/PageCompetitions';
import Head from 'next/head'

export default function Home()
{
  const isMaintenance = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "true"

  if (isMaintenance)
    return <PageMaintenance />

  return (
    <>
      <Head>
        <title>GMI Competizioni</title>
      </Head>
      <PageCompetitions />
    </>
  )
}
