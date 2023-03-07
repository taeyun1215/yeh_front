import axios from "axios";
import { useState } from "react";

export default function IdFind() {
  const [id, setId] = useState(null);
  const handleOnChange = (event) => {
    setId(event.target.value);
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
      const res = await axios.get("/api/username", { params: data });
      if (res.data.success)
        alert("가입한 이메일 주소로 아이디가 전송되었습니다.");
      else alert(res.data.error.message);
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <div
      className="sign"
      style={{
        width: "25%",
        padding: "50px",
        border: "1px solid lightgray",
        borderRadius: "10px",
      }}
    >
      <div className="idFind">
        <span>가입한 이메일 주소를 입력주세요.</span>
        <input
          placeholder="example@goldenplanet.co.kr"
          onChange={handleOnChange}
          onKeyUp={handleonKeyUp}
        />
        <button onClick={handleOnSubmit}>아이디 찾기</button>
      </div>
    </div>
  );
}
