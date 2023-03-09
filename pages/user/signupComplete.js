import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { Modal } from 'antd';
import { BsCheck2Circle } from "react-icons/bs";
import { useCookies } from 'react-cookie';

export default function SignupComplete() {
  const [isModal, setIsModal] = useState(false);
  const [cookie, setCookie, removecookie] = useCookies(['refreshToken','accessToken']);
  const router = useRouter();
  
  const handleOnAuth = () => {
    const token = cookie.accessToken
    try{
      axios.post("/email/certify-regis", {
        body : null
      }, {
      headers: {
            "Authorization" : `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        }).then((res) => {
          console.log(res)
          if(res.data.success) {
             setIsModal(true);
          } else {
            alert('잠시 후 다시 시도해 주세요.');
          }
        })
    } catch(e) {
      console.log(e)
      alert('잠시 후 다시 시도해 주세요.');
    }
  };
  const handleOnOk = () => {
    setIsModal(false);
    router.push("/");
  }
  return (
    <>
    <div className="sign" style={{ width: "auto" }}>
      <div className="signupComplete">
      <BsCheck2Circle fontSize="72px" color="#2b3089" />
        <h1>회원가입이 완료 되었습니다.</h1>
        <span>YEH의 모든 기능 사용을 위해 이메일 인증을 완료해 주세요.</span>
        <button onClick={handleOnAuth}>이메일 인증</button>
      </div>
    </div>
          
     {isModal ?
      <Modal title="이메일 인증" open={isModal} onOk={handleOnOk} onCancel={() => setIsModal(false)} cancelButtonProps={{ style: { display: 'none' } }} width='420px'>
        <p>인증 메일이 전송되었습니다.<br/>전송된 메일을 통해 인증해주시기 바랍니다.</p>
      </Modal> 
      : null} 
    </>
  );
}
