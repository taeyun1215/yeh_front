import { useRouter } from "next/router";
import { useState } from "react";
import { userFind } from "../api";

export default function IdFind() {
  const router = useRouter();
  const [id, setId] = useState(null);

  const handleOnDivision = () => {
    if (router.query.type === "id") return "아이디";
    else return "비밀번호";
  };

  const handleonKeyUp = (event) => {
    if (event.keyCode === 13) {
      handleOnSubmit();
    }
  };

  const handleOnSubmit = async () => {
    const data = {
      email: id,
    };
    try {
      const res = await userFind(router.query.type, data);
      if (res.data.success) {
        alert(`가입한 이메일 주소로 ${handleOnDivision()}가 전송되었습니다.`);
        router.push("/main");
      } else alert(res.data.error.message);
    } catch (e) {
      console.log(e);
      alert("잠시 후 다시 시도해 주세요.");
    }
  };

  return (
    <div
      className="sign"
      style={{
        padding: "50px",
        border: "1px solid lightgray",
        borderRadius: "10px",
      }}
    >
      <div className="idFind">
        <span>가입한 이메일 주소를 입력주세요.</span>
        <input
          type="text"
          name="email"
          placeholder="example@goldenplanet.co.kr"
          onChange={(e) => setId(e.target.value)}
          onKeyUp={handleonKeyUp}
        />
        <button onClick={handleOnSubmit}>{handleOnDivision()} 찾기</button>
      </div>
    </div>
  );
}
