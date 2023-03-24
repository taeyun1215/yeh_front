import { useRouter } from "next/router";
import { useEffect } from "react";
import { useCookies } from "react-cookie";
import { useRecoilValue, useResetRecoilState } from "recoil";
import { userState } from "../../store/states";

import setToken from "../../component/utils/setToken";
import axios, { Axios } from "axios";

export default function MyPage() {
  const router = useRouter();
  const user = useRecoilValue(userState);
  const reset = useResetRecoilState(userState);
  const [cookie, setCookie, removecookie] = useCookies(["refreshToken"]);

  const getMyInfo = async () => {
    const response = await axios.get("/user/profile");
  };
  // 리프레시 토큰 발급
  useEffect(() => {
    if (user?.loggin) {
      setToken({ cookie: cookie, router: router, reset: reset }).then((res) => {
        // if (res === "userLogin") getMyInfo();
        // else return;
      });
    }
  }, []);

  return (
    <div className="myPage">
      <p>버드실버</p>
      <button>미인증</button>
      <div className="myPage_wrap"></div>
    </div>
  );
}
