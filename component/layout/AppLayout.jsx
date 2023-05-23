import Image from "next/image";
import { useRouter } from "next/router";
import { Dropdown, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { useCookies } from "react-cookie";
import { useState } from "react";

import logo from "../../asset/images/logo.png";
import logoSmall from "../../asset/images/header_logo.png";
import AppFooter from "./appFooter";
import { keywordState, pageState, userState } from "../../store/index";
import { useGrid } from "../utils/responsive";
import { postSearch } from "../../pages/api";
import Rank from "../../pages/post/rank";

const AppLayout = ({ children }) => {
  const router = useRouter();
  // const user = useRecoilValue(userState);
  const [user, setUser] = useRecoilState(userState);
  const setKeywordState = useSetRecoilState(keywordState);
  const setPageState = useSetRecoilState(pageState);

  const [searchVal, setSearchVal] = useState(null);
  // const [activeSearch, setActiveSearch] = useState(false);
  const [cookie, setCookie, removecookie] = useCookies(["refresh_token"]);
  const { isMobile, isDesktop } = useGrid();

  const logout = () => {
    setUser();
    removecookie("refresh_token");
  };

  const items = [
    {
      key: "1",
      label: <a onClick={() => router.push("/user/myPost")}>마이페이지</a>,
    },
    {
      key: "2",
      label: <a onClick={() => logout()}>로그아웃</a>,
    },
  ];

  // const handleOnKeyup = async (e) => {
  //   if (e.keyCode === 13 && searchVal.trim() !== "") {
  //     setActiveSearch(false);
  //     try {
  //       const res = await postSearch(searchVal);
  //       if (res.data.success && res.data.data.postCount > 0) {
  //         keywordHandler({
  //           posts: res.data.data.posts,
  //           postCount: res.data.data.postCount,
  //         });
  //         router.push("/main");
  //       } else if (res.data.success && res.data.data.postCount === 0) alert("검색 결과가 없습니다.");
  //       else alert("잠시 후 다시 시도해주세요.");
  //     } catch (e) {
  //       console.log(e);
  //       alert("잠시 후 다시 시도해주세요.");
  //     }
  //   } else if (e.keyCode === 13 && searchVal.trim() === "") alert("검색어를 입력해 주세요.");
  //   else return;
  // };

  const handleOnKeyup = async (e) => {
    if (e.keyCode === 13 && searchVal.trim() !== "") setKeywordState(searchVal);
    else if (e.keyCode === 13 && searchVal.trim() === "") alert("검색어를 입력해 주세요.");
    else return;
  };

  // 로고 버튼 클릭 핸들러
  const handleOnInit = () => {
    router.push("/main", undefined, { shallow: true });
    setKeywordState(null);
    setSearchVal("");
  };

  const DesktopUser = (
    <div className="header_signBtn">
      {user?.loggin ? (
        <Dropdown menu={{ items }} placement="bottom" className="header_more">
          <Button className="header_user">{user.name}</Button>
        </Dropdown>
      ) : (
        <div>
          <button onClick={() => router.push("/user/signin")} className="header_signin">
            로그인
          </button>
          <span style={{ color: "#2b3089" }}> | </span>
          <button onClick={() => router.push("/user/signup")} className="header_signin">
            회원가입 g{" "}
          </button>
        </div>
      )}
      <button onClick={() => router.push("/post/new")} className="header_write">
        글쓰기
      </button>
    </div>
  );

  return (
    <>
      <div className="header">
        <div className="header_wrap">
          <Image
            src={isMobile ? logoSmall : logo}
            alt="yehLogo"
            className={isMobile ? "heaeder_logo_small" : "heaeder_logo"}
            onClick={() => handleOnInit()}
          />
          <div className="header_search">
            <button onClick={() => handleOnClick()}>
              <SearchOutlined
                style={{
                  fontSize: "22px",
                  fontWeight: "bold",
                }}
              />
            </button>
            <input
              placeholder="관심있는 내용을 검색해보세요"
              className="header_input"
              onChange={(e) => setSearchVal(e.target.value)}
              onKeyUp={(e) => handleOnKeyup(e)}
              value={searchVal || ""}
            />
          </div>
        </div>
        {isDesktop && DesktopUser}
      </div>
      {children}
      {/* <AppFooter /> */}
    </>
  );
};
export default AppLayout;
