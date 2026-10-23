import React, { useEffect, useState } from "react"
import Head from "next/head"
import GMIApi from "../../../src/api/GMIApi"
import { TokenService } from "../../../src/services/TokenService"
import { store } from "../../../src/store"
import { authActions } from "../../../src/slices/authSlice"

/**
 * AuthCallback — gestisce il redirect da OAuth Discord.
 * Legge ?code=xxx dall'URL, lo scambia per JWT pair via auth.php?action=exchange,
 * salva i token, carica userinfo, e reindirizza alla home.
 */
export default function AuthCallback() {
  const [error, setError] = useState(null)
  const [status, setStatus] = useState("Completamento accesso in corso...")

  useEffect(() => {
    let cancelled = false

    async function handleCallback() {
      try {
        const params = new URLSearchParams(window.location.search)
        const code = params.get("code")
        const errorParam = params.get("error")

        if (errorParam) {
          setError(errorParam)
          return
        }

        if (!code) {
          setError("Nessun codice di autorizzazione ricevuto.")
          return
        }

        // 1. Scambia il codice breve per JWT pair
        const exchangeData = await GMIApi.getInstance().exchangeCode(code)
        if (!exchangeData.success) {
          setError(exchangeData.error || "Scambio codice fallito.")
          return
        }

        // 2. Salva i token
        TokenService.setTokens(
          exchangeData.access_token,
          exchangeData.refresh_token,
          true // remember
        )

        // 3. Carica le info utente
        const userData = await GMIApi.getInstance().getMe()
        if (!cancelled && userData.success) {
          store.dispatch(authActions.setUser(userData.user))
        }

        // 4. Redirect alla home delle competizioni
        if (!cancelled) {
          window.location.href = "/competizioni/"
        }
      } catch (err) {
        if (!cancelled) {
          console.error("[AuthCallback] error:", err)
          setError(err.message || "Errore durante l'autenticazione.")
        }
      }
    }

    handleCallback()
    return () => { cancelled = true }
  }, [])

  if (error) {
    return (
      <>
        <Head><title>Errore di accesso</title></Head>
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="bg-error/10 border border-error/20 rounded p-8 max-w-md text-center">
            <h1 className="text-2xl font-bold text-error mb-4">Accesso non riuscito</h1>
            <p className="text-content-muted">{error}</p>
            <a
              href="/competizioni/"
              className="mt-6 inline-block px-6 py-2 bg-secondary text-on-secondary rounded-sm font-bold hover:opacity-90 transition-opacity"
            >
              Torna alla home
            </a>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Head><title>Accesso in corso...</title></Head>
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-4">
        <div className="w-12 h-12 border-thick border-secondary/30 border-t-secondary rounded-full animate-spin" />
        <p className="text-content-muted text-sm">{status}</p>
      </div>
    </>
  )
}
