import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { Modal, Spin } from 'antd';
import { BsCheck2Circle } from "react-icons/bs";
import { LoadingOutlined } from '@ant-design/icons';
import { useCookies } from 'react-cookie';
import { useSetRecoilState } from "recoil";

import { pageState } from "../../store/states";

export default function SignupComplete() {
  const [isModal, setIsModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cookie,, removecookie] = useCookies(['refreshToken','accessToken']);
  const router = useRouter();
  const PageHandler = useSetRecoilState(pageState);
  
  const handleOnAuth = () => {
    setIsModal(true);
    setLoading(true);
    const token = cookie.accessToken;
    try{
      axios.post("/email/certify-regis", {
        body : null
      }, {
      headers: {
            "Authorization" : `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        }).then((res) => {
          if(res.data.success) {
              setLoading(false);
          } else {
              setLoading(false);
              alert('잠시 후 다시 시도해 주세요.');
          }
        })
    } catch(e) {
        console.log(e)
        setLoading(false);
        alert('잠시 후 다시 시도해 주세요.');
    }
  }
  const antIcon = <LoadingOutlined style={{ fontSize: 24, color:'#2b3089' }} spin />;

  const handleOnOk = () => {
    if(loading) alert('인증 메일이 전송될 때까지 잠시 기다려주십시오.');
    else {
      setIsModal(false);
      PageHandler(1);
      router.push('/main' , undefined, { shallow: true });
    }
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
      <Modal title="이메일 인증" centered okText='확인' open={isModal} onOk={handleOnOk} onCancel={() => setIsModal(false)} cancelButtonProps={{ style: { display: 'none' } }} width='420px'>
        {loading ? <Spin indicator={antIcon} /> : <p>인증 메일이 전송되었습니다.<br/>전송된 메일을 통해 인증해주시기 바랍니다.</p>}
      </Modal> 
      : null} 
    </>
  );
}
