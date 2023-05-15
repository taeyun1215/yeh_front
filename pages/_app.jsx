import "../asset/styles/main.scss";
import Head from "next/head";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { RecoilRoot } from "recoil";
import RecoilNexus from "recoil-nexus";
import { getRecoil, setRecoil } from "recoil-nexus";
import { BsFillSunFill, BsFillMoonFill } from "react-icons/bs";

import { ThemeProvider } from "styled-components";
import { useGrid } from "../component/utils/responsive";
import { lightTheme, darkTheme, GlobalStyles } from "../component/utils/themeConfig";
import { themeState } from "../store";
const AppLayout = dynamic(() => import("../component/layout/AppLayout"), { ssr: false });

function MyApp({ Component, pageProps }) {
  const [theme, setTheme] = useState(false);
  const { isDesktop } = useGrid();

  const handleThemeToggle = () => {
    setTheme((prev) => !prev);
    setRecoil(themeState, (prev) => !prev);
  };

  useEffect(() => {
    setTheme(getRecoil(themeState));
  }, []);

  function PageRouter() {
    const pages = pageProps.path;
    switch (pages) {
      case "signin":
      case "signup":
      case "postNew":
        return <Component {...pageProps} />;
      default:
        return (
          <AppLayout>
            <Component {...pageProps} />
          </AppLayout>
        );
    }
  }

  const ToggleBtn = (
    <button onClick={() => handleThemeToggle()} className="themeToggle">
      {!theme ? <BsFillMoonFill className="themeToggleIcon" /> : <BsFillSunFill className="themeToggleIcon" />}
    </button>
  );

  return (
    <>
      <Head>
        <title>YEH</title>
      </Head>
      <ThemeProvider theme={!theme ? lightTheme : darkTheme}>
        <RecoilRoot>
          <RecoilNexus />
          <GlobalStyles />
          <div className="body_wrap">{PageRouter()}</div>
          {isDesktop && ToggleBtn}
        </RecoilRoot>
      </ThemeProvider>
    </>
  );
}
export default MyApp;
