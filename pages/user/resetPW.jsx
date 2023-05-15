import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";
import { passwordInit } from "../api";

export default function RestPW() {
  const router = useRouter();
  const params = router.query;

  const [pw, setPw] = useState({ password: "", confirmPassword: "" });
  const inputRefPw = useRef(null);
  const inputRefConfirmPw = useRef(null);

  const handleOnSubmit = async () => {
    if (pw.password === "") return inputRefPw.current.focus();
    else if (pw.confirmPassword === "") return inputRefConfirmPw.current.focus();
    else if (pw.password !== pw.confirmPassword) alert("새 비밀번호와 새 비밀번호 확인이 다릅니다.");
    else {
      const data = {
        code: params.checkCode,
        email: params.email,
        password: pw.password,
        confirmPassword: pw.confirmPassword,
      };
      try {
        const res = await passwordInit(data);
        if (res.data.success) {
          alert("비밀번호가 재설정되었습니다. 로그인 페이지로 이동합니다.");
          router.push("/user/signin");
        } else alert("잠시 후 다시 시도해주세요");
      } catch (e) {
        console.log(e);
        alert("잠시 후 다시 시도해주세요");
      }
    }
  };

  return (
    <div className="myinfo" style={{ width: "35%" }}>
      <div className="myinfo_wrap">
        <p>이메일</p>
        <input value={params.email} type="text" disabled />
      </div>
      <div className="myinfo_wrap">
        <p>새 비밀번호</p>
        <input
          value={pw.password}
          type="password"
          onChange={(e) => setPw({ ...pw, password: e.target.value })}
          ref={inputRefPw}
        />
      </div>
      <div className="myinfo_wrap">
        <p>새 비밀번호 확인</p>
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
