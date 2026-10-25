import type { AppProps } from "next/app";
import Head from "next/head";
import { Provider } from "react-redux";
import { store } from "../src/store";
import Header from "../components/WebsiteLayout/Header";
import { Footer } from "../components/WebsiteLayout/Footer";
import {
  BreadcrumbsProvider,
  SiteBreadcrumbs,
} from "../components/WebsiteLayout/SiteBreadcrumbs";

import "../styles/globals.css";
import "../styles/app.scss";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <BreadcrumbsProvider>
        <div className="min-h-screen bg-page flex flex-col">
          <Header />
          <main className="w-full flex-1">
            <SiteBreadcrumbs
              pageTitle={pageProps?.post?.title}
              pageCategories={pageProps?.post?.categories}
            />
            <Component {...pageProps} />
          </main>
          <Footer />
        </div>
      </BreadcrumbsProvider>
    </Provider>
  );
}

export default MyApp;
