import '../styles/App.scss'
import Head from 'next/head'
import { Provider } from "react-redux";
import { store, wrapper } from "./../src/store";
import Header from "../components/commons/Header.jsx"
import { useDispatch, useSelector } from "react-redux";


function MyApp({ Component, pageProps })
{
  return (
    <Provider store={store}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <AppContainer Component={Component} pageProps={pageProps} />
    </Provider>
  )
}

function AppContainer({ Component, pageProps })
{
  const showMenu = useSelector(root=>root.main.showMenu)
  const rootClass = showMenu ? "bg-white flex flex-col h-full overflow-y-hidden" : "bg-white flex flex-col  h-full overflow-y-hidden"

  return <>
    <Header />
    <div className={rootClass}>
	 <meta name="viewport"  content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"/>
      <div className="p-5 h-full">
        <Component {...pageProps} />
      </div>
      {/* <Footer /> */}
    </div>
    </>
}

export default wrapper.withRedux(MyApp);