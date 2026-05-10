import '../styles/App.scss'
import Head from 'next/head'
import { Provider, useDispatch } from "react-redux";
import { store, wrapper } from "../src/store";
import Header from '../components/WebsiteLayout/Header';
import { Footer } from '../components/WebsiteLayout/Footer';
import { useSelector } from "react-redux";
import { mainActions } from "../src/slices/mainSlice";
import { useEffect } from "react";

function MyApp({ Component, pageProps })
{
  return (
    <Provider store={store}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <ThemeInitializer />
      <AppContainer Component={Component} pageProps={pageProps} />
    </Provider>
  )
}

// Reads persisted theme from localStorage on mount and applies it to <html>
function ThemeInitializer()
{
  const dispatch = useDispatch()

  useEffect(() => {
    try {
      const stored = localStorage.getItem('gmicontest-theme')
      if (stored === 'light' || stored === 'dark') {
        dispatch(mainActions.setTheme(stored))
        document.documentElement.className = `theme-${stored}`
      } else {
        // Default: light theme
        document.documentElement.className = 'theme-light'
        localStorage.setItem('gmicontest-theme', 'light')
      }
    } catch {
      document.documentElement.className = 'theme-light'
    }
  }, [dispatch])

  return null
}

function AppContainer({ Component, pageProps })
{
  const showMenu = useSelector(root=>root.main.showMenu)
  const theme = useSelector(root=>root.main.theme)
  const rootClass = `min-h-screen bg-primary flex flex-col ${showMenu ? "overflow-hidden" : ""}`

  // Sync Redux theme to <html> class (in case of toggle)
  useEffect(() => {
    document.documentElement.className = `theme-${theme}`
    try {
      localStorage.setItem('gmicontest-theme', theme)
    } catch {}
  }, [theme])

  return (
    <div className={rootClass}>
      <Header />
      <main className="w-full flex-1">
        <div className="mx-auto w-full max-w-screen-2xl px-4 py-6 sm:px-6 lg:px-8">
        <Component {...pageProps} />
        </div>
      </main>
      <Footer />
      </div>
  )
}

export default wrapper.withRedux(MyApp);
