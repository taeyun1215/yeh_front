import "../asset/styles/main.scss";
import Head from "next/head";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { RecoilRoot } from "recoil";
import RecoilNexus from "recoil-nexus";
import { getRecoil, setRecoil } from "recoil-nexus";
import { BsFillSunFill, BsFillMoonFill, BsArrowBarUp } from "react-icons/bs";
import { QueryClient, QueryClientProvider } from "react-query";

import { ThemeProvider } from "styled-components";
import { useGrid } from "../component/utils/responsive";
import { lightTheme, darkTheme, GlobalStyles } from "../component/utils/themeConfig";
import { themeState } from "../store";

const AppLayout = dynamic(() => import("../component/layout/AppLayout"), { ssr: false });

function MyApp({ Component, pageProps }) {
  const [queryClient] = useState(() => new QueryClient());
  const [theme, setTheme] = useState(false);
  const { isDesktop } = useGrid();

  useEffect(() => {
    setTheme(getRecoil(themeState));
  }, []);

  const handleThemeToggle = () => {
    setTheme((prev) => !prev);
    setRecoil(themeState, (prev) => !prev);
  };

  const handleOnTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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

  const SideBtn = (
    <div className="side_btns_container">
      <button onClick={() => handleOnTop()} className="side_btns">
        <BsArrowBarUp className="side_btns_icons" />
      </button>
      <button onClick={() => handleThemeToggle()} className="side_btns">
        {!theme ? <BsFillMoonFill className="side_btns_icons" /> : <BsFillSunFill className="side_btns_icons" />}
      </button>
    </div>
  );

  return (
    <QueryClientProvider client={queryClient}>
      <Head>
        <title>YEH</title>
      </Head>
      <ThemeProvider theme={!theme ? lightTheme : darkTheme}>
        <RecoilRoot>
          <RecoilNexus />
          <GlobalStyles />
          {PageRouter()}
          {isDesktop && SideBtn}
        </RecoilRoot>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
export default MyApp;
