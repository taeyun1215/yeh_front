import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";
import { passwordInit } from "../api";

export default function RestPW() {
  const formData = new FormData();
  const router = useRouter();
  const params = router.query;

  const [email, setEmail] = useState("");
  const [pw, setPw] = useState({ password: "", confirmPassword: "" });

  const inputRefEmail = useRef(null);
  const inputRefPw = useRef(null);
  const inputRefConfirmPw = useRef(null);

  useEffect(() => {
    console.log(params);
  }, [params]);

  const handleOnSubmit = async () => {
    if (email === "") return inputRefEmail.current.focus();
    else if (pw.password === "") return inputRefPw.current.focus();
    else if (pw.confirmPassword === "") return inputRefConfirmPw.current.focus();
    else {
      formData.append("code", params.checkCode);
      formData.append("email", email);
      formData.append("password", pw.password);
      formData.append("confirmPassword", pw.confirmPassword);
      try {
        const res = passwordInit(formData);
        console.log(res);
      } catch (e) {
        console.log(e);
        alert("잠시 후 다시 시도해주세요");
      }
    }
  };

  return (
    <div className="myinfo">
      <div className="myinfo_wrap">
        <p>이메일</p>
        <input
          value={email}
          type="password"
          onChange={(e) => setEmail(e.target.value)}
          placeholder="example@goldenplant.co.kr"
          ref={inputRefEmail}
        />
      </div>
      <div className="myinfo_wrap">
        <p>비밀번호</p>
        <input
          value={pw.password}
          type="password"
          onChange={(e) => setPw({ ...pw, password: e.target.value })}
          ref={inputRefPw}
        />
      </div>
      <div className="myinfo_wrap">
        <p>비밀번호 확인</p>
        <input
          value={pw.confirmPassword}
          type="password"
          onChange={(e) => setPw({ ...pw, confirmPassword: e.target.value })}
          ref={inputRefConfirmPw}
        />
      </div>
      <div className="myinfo_btns">
        <button onClick={() => handleOnSubmit()}>수정</button>
      </div>
    </div>
  );
}
