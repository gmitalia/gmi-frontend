import PageEditVotes from '../components/PageEditVotes';
import Head from 'next/head'
import { useRouter } from 'next/router'

export default function EditVotes()
{
  const router = useRouter()
  // Key forza remount quando cambia il contesto, evita stati inconsistenti
  const pageKey = router.query?.contest || 'default'
  
  return (
    <>
      <Head>
        <title>GMI Competizioni</title>
      </Head>
      <PageEditVotes key={pageKey} />
    </>
  )
}