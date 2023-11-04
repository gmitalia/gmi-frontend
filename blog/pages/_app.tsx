import "../styles/globals.css";
import "../styles/BlogPost.scss";
import "../styles/BlogCard.scss";
import "../styles/Footer.scss"
import type { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
