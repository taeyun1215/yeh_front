import "../styles/main.scss";
import Head from "next/head";
import axios from "axios";
import { RecoilRoot } from 'recoil';
import dynamic from 'next/dynamic'
const AppLayout = dynamic(() => import('../component/layout/AppLayout'), { ssr: false })

function MyApp({ Component, pageProps}) {
  // axios.defaults.baseURL = "http://130.162.159.231:8080";
  axios.defaults.baseURL = "http://43.201.144.113:8080";

  axios.defaults.withCredentials = true;

  function PageRouter() {
    const pages = pageProps.name;
    switch(pages) {
      case 'signin' : return (
          <Component {...pageProps} />
      )
      case 'signup' : return (
          <Component {...pageProps} />
      )   
      default : return (
        <AppLayout>
        <Component {...pageProps} />
        </AppLayout> 
      )
    }
  }
  return (
    <>
        <Head>
          <title>YEH</title>
        </Head>
      <RecoilRoot>
          {PageRouter()}
      </RecoilRoot>
    </>
  );
}
export default MyApp;
