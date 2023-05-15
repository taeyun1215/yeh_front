import Image from "next/image";
import { HomeOutlined, PlusCircleOutlined, UserOutlined } from "@ant-design/icons";
import { FaGithub } from "react-icons/fa";
import { useRouter } from "next/router";
import { useRecoilValue, useSetRecoilState } from "recoil";

import logo from "../../asset/images/logo.png";
import { useGrid } from "../utils/responsive";
import { keywordState, pageState, userState } from "../../store/index";

export default function AppFooter({ setSearchVal, setActiveSearch }) {
  const router = useRouter();
  const { isMobile } = useGrid();
  const user = useRecoilValue(userState);
  const PageHandler = useSetRecoilState(pageState);
  const keywordHandler = useSetRecoilState(keywordState);

  const handleOnInit = () => {
    router.push("/main", undefined, { shallow: true });
    PageHandler(1);
    keywordHandler();
    setSearchVal("");
    setActiveSearch(false);
  };

  return (
    <>
      <div className="footer">
        <div className="footer_image">
          <Image src={logo} alt="yehLogo" className="heaeder_logo" width={100} />
          <FaGithub onClick={() => window.open("https://github.com/taeyun1215/MKC")} className="footer_icon" />
        </div>
        <div className="footer_text">
          <p>
            서울특별시 강남구 언주로 535 (주)골든플래닛 DXED x SF | 권구현 • 오세은 • 이태윤 | YEH ⓒ 2023 All rights
            reserved.
          </p>
          <p>버그 문의 : ghkwon@goldenplanet.co.kr | seo@goldenplanet.co.kr | tylee@goldenplanet.co.kr</p>
        </div>
      </div>
      {isMobile && (
        <div className="footer_mobile">
          <HomeOutlined className="footer_mobile_icon" onClick={() => handleOnInit()} />
          <PlusCircleOutlined className="footer_mobile_icon" onClick={() => router.push("/post/new")} />
          <UserOutlined
            className="footer_mobile_icon"
            onClick={() => (user?.loggin ? router.push("/user/myPost") : router.push("/user/signin"))}
          />
        </div>
      )}
    </>
  );
}
