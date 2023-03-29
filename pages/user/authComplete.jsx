import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSetRecoilState } from "recoil";
import { BsCheck2Circle } from "react-icons/bs";

import { userState } from "../../store/states";
import { joinCheck } from "../api";

export default function SignupComplete() {
  const router = useRouter();
  const setUser = useSetRecoilState(userState);
  const [confirm, setConfirm] = useState(false);

  useEffect(() => {
    const params = router.query;
    joinCheck(params).then((res) => {
      if (res.data.success) {
        setConfirm(true);
        setUser({
          emailAuth: true,
        });
      } else null;
    });
  }, [router.query]);

  return (
    <>
      {confirm ? (
        <div className="sign" style={{ width: "auto" }}>
          <div className="signupComplete">
            <BsCheck2Circle fontSize="72px" color="#2b3089" />
            <h1>이메일인증이 완료 되었습니다.</h1>
            <button onClick={() => router.push("/")}>홈으로 돌아가기</button>
          </div>
        </div>
      ) : null}
    </>
  );
}
