import "../styles/main.scss";
import Head from "next/head";
import axios from "axios";
import dynamic from 'next/dynamic'
import { useEffect, useState } from "react";
import { RecoilRoot } from 'recoil';
import { BsFillSunFill, BsFillMoonFill } from "react-icons/bs";

import { ThemeProvider } from "styled-components";
import { lightTheme, darkTheme, GlobalStyles } from "../component/utils/themeConfig" 
// import AppLayout from '../component/layout/AppLayout'
const AppLayout = dynamic(() => import('../component/layout/AppLayout'), { ssr: false })

function MyApp({ Component, pageProps}) {
  axios.defaults.baseURL = "http://43.201.144.113:8080";
  axios.defaults.withCredentials = true;

  const [theme, setTheme] = useState(null);
  const handleThemeToggle = () => {
    setTheme((prev) => !prev)
    if(theme) localStorage.setItem('theme', false)
    else localStorage.setItem('theme', true)
  }

  useEffect(() =>{
    setTheme(JSON.parse(localStorage.getItem('theme')))
  },[theme])

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
      <ThemeProvider theme={!theme ? lightTheme : darkTheme}>
        <RecoilRoot >
          <GlobalStyles />
          {PageRouter()}
          <button onClick={() => handleThemeToggle()} className='themeToggle'>
            {!theme ? <BsFillMoonFill className="themeToggleIcon"/> : <BsFillSunFill className="themeToggleIcon"/>}
          </button>
        </RecoilRoot>
      </ThemeProvider>
    </>
    
  );
}
export default MyApp;
