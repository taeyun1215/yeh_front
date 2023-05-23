import { useState } from "react";
import { Modal } from "antd";
import { useRouter } from "next/router";
import { useRecoilState, useSetRecoilState } from "recoil";
import { useCookies } from "react-cookie";

import { userState } from "../../store/index";
import { nickNameEdit, userSecession, passWordEdit } from "../api";
import { useRef } from "react";

export default function MyInfoEdit() {
  const router = useRouter();
  const formData = new FormData();

  const [user, setUser] = useRecoilState(userState);
  const UserHandler = useSetRecoilState(userState);

  const [isModal, setIsModal] = useState(false);
  const [openEdit, setOpenEdit] = useState(null);
  const [nickname, setNickname] = useState("");
  const [pw, setPw] = useState({ password: "", confirmPassword: "" });
  const [cookie, setCookie, removecookie] = useCookies(["refresh_token"]);

  const inputRefNickname = useRef(null);
  const inputRefPw = useRef(null);
  const inputRefConfirmPw = useRef(null);

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
    setNickname("");
    setPw({ password: "", confirmPassword: "" });
    setOpenEdit(null);
  };

  const handleOnSubmit = async (type) => {
    let res;
    try {
      if (type === "nickname" && nickname === "") return inputRefNickname.current.focus();
      else if (type === "nickname" && nickname !== "") {
        formData.append("nickname", nickname);
        res = await nickNameEdit(formData);
        if (res.data.success) {
          setUser({ ...user, name: res.data.data.nickname });
          alert("닉네임이 수정되었습니다.");
          router.push("/main");
        }
      } else if (type === "password") {
        if (pw.password === "") return inputRefPw.current.focus();
        else if (pw.confirmPassword === "") return inputRefConfirmPw.current.focus();
        else if (pw.password !== pw.confirmPassword) alert("비밀번호와 비밀번호 확인이 다릅니다.");
        else {
          res = await passWordEdit(pw);
          alert("비밀번호가 수정되었습니다. 다시 로그인해 주세요.");
          UserHandler();
          removecookie("refresh_token");
          router.push("/user/signin");
        }
      }
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
        <p>새 닉네임</p>
        <input value={nickname} type="text" onChange={(e) => setNickname(e.target.value)} ref={inputRefNickname} />
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
        <button onClick={() => handleOnCancle()}>취소</button>
        <button onClick={() => handleOnSubmit("password")}>수정</button>
      </div>
    </>
  );
  return (
    <div className="myinfo">
      <div className="myinfo_container">
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
        <p className="modal_content">
          게시글은 모두 삭제되며, 계정은 다시 복구되지 않습니다.
          <br /> 정말 탈퇴하시겠습니까?
        </p>
      </Modal>
    </div>
  );
}
