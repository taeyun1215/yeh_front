import { useRouter } from "next/router";
import { useEffect } from "react";
import { useRecoilValue, useResetRecoilState } from "recoil";
import { userState } from "../../store/states";

import setToken from "../../component/utils/setToken";
import axios from "axios";

export default function MyPage() {
  const router = useRouter();
  const user = useRecoilValue(userState);
  const reset = useResetRecoilState(userState);

  const getMyInfo = async () => {
    const response = await axios.get("/user/profile");
    console.log(response);
  };
  // 리프레시 토큰 발급
  useEffect(() => {
    try {
      if (user?.loggin) {
        setToken({ router: router, reset: reset }).then((res) => {
          if (res === "userLogin") getMyInfo();
          else return;
        });
      } else return;
    } catch (e) {
      console.log(e);
      alert("잠시 후 다시 시도해주세요");
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
