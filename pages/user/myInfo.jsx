import { useState } from "react";
import { nickNameEdit, passwordInit, userSecession } from "../api";
import { Modal } from "antd";

export default function MyInfoEdit() {
  const [isModal, setIsModal] = useState(false);
  const [openEdit, setOpenEdit] = useState(null);
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");

  // 회원 탈퇴
  const handleOnSecession = async () => {
    try {
      const res = await userSecession();
      if (res.data.success) {
      } else alert("잠시 후 다시 시도해주세요");
    } catch (e) {
      console.log(e);
      alert("잠시 후 다시 시도해주세요");
    }
  };

  const handleOnCancle = () => {
    setEmail("");
    setNickname("");
    setOpenEdit(null);
  };

  const handleOnSubmit = async (type) => {
    let res;
    try {
      if (type === "nickname") res = await nickNameEdit({ nickname: nickname, email: email });
      else res = await passwordInit(email);
      console.log(res);
      if (res.data.success) {
      } else alert("잠시 후 다시 시도해주세요");
    } catch (e) {
      console.log(e);
      alert("잠시 후 다시 시도해주세요");
    }
  };

  const beforeEdit = (
    <>
      <div className="myinfo_wrap">
        <p>닉네임</p>
        <button onClick={() => setOpenEdit("nickname")}>수정</button>
      </div>
      <div className="myinfo_wrap">
        <p>비밀번호</p>
        <button onClick={() => setOpenEdit("password")}>수정</button>
      </div>
      <span onClick={() => setIsModal(true)}>회원탈퇴</span>
    </>
  );

  const nicknameEdit = (
    <>
      <div className="myinfo_wrap">
        <p>이메일</p>
        <input
          placeholder="example@goldenplanet.co.kr"
          value={email}
          type="text"
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="myinfo_wrap">
        <p>새 닉네임</p>
        <input value={nickname} type="text" onChange={(e) => setNickname(e.target.value)} />
      </div>
      <div className="myinfo_btns">
        <button onClick={() => handleOnCancle()}>취소</button>
        <button onClick={() => handleOnSubmit("nickname")}>수정</button>
      </div>
    </>
  );

  const passwordEdit = (
    <>
      <div className="myinfo_wrap">
        <p>이메일</p>
        <input
          placeholder="example@goldenplanet.co.kr"
          value={email}
          type="text"
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="myinfo_btns">
        <button onClick={() => handleOnCancle()}>취소</button>
        <button onClick={() => handleOnSubmit("password")}>수정</button>
      </div>
    </>
  );
  return (
    <>
      <div className="myinfo">
        {openEdit !== null ? (openEdit === "nickname" ? nicknameEdit : passwordEdit) : beforeEdit}
      </div>
      <Modal
        title="회원 탈퇴"
        open={isModal}
        centered
        okText="확인"
        cancelText="취소"
        onOk={() => handleOnSecession()}
        onCancel={() => setIsModal(false)}
      >
        <p>계정은 복구되지 않습니다. 정말 탈퇴하시겠습니까?</p>
      </Modal>
    </>
  );
}
