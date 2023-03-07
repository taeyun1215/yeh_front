import logo from "../../asset/images/logo.png";
import Image from "next/image";
import { useRouter } from "next/router";
import { Dropdown, Button } from 'antd';
import { SearchOutlined } from "@ant-design/icons";
import { useRecoilState, useResetRecoilState, useSetRecoilState } from "recoil";
import { keywordState, pageState, userState } from "../../store/states";
import cookie from "react-cookies";
import { useState } from "react";
import axios from "axios";

const AppLayout = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useRecoilState(userState);
  const [searchVal, setSearchVal] = useState(null);
  const keywordHandler = useSetRecoilState(keywordState);
  const initHandler = useSetRecoilState(pageState)

  const logout = () => {
    setUser((prev) => ({ ...prev, name: null , loggin: false}))
    cookie.remove('accessToken');
    cookie.remove('refreshToken');
  }

 const items = [
   {
     key: '1',
     label: (
      <a>
        마이페이지
      </a>
    )
   },
   {
     key: '2',
     label: (
       <a onClick={() => logout()}>로그아웃</a>
     ),
   },
  
 ];
  const handleOnSubmit = async (e) =>{
  if(e.keyCode === 13) {
    try {
      const res = await axios.get(`/post/search/${searchVal}`)
      if(res.data.success) keywordHandler({posts : res.data.data.posts, postCount : res.data.data.postCount})
      else alert('잠시 후 다시 시도해주세요.')
    } 
    catch(e) {
      console.log(e)
      alert('잠시 후 다시 시도해주세요.')
    }
  } else null
  }

  const handleOnInit = () =>{
    router.push('/');
    initHandler(1);
  }
  return (
    <>
      <div className="header">
        <div className="header_wrap">
          <Image src={logo} alt="yehLogo" className="heaeder_logo" onClick={() => handleOnInit()}/>
          <div className="header_search">
            <button>
              <SearchOutlined style={{fontSize:'22px', color:"#2b3089", fontWeight:'bold'}}/>
            </button>
            <input
              placeholder="관심있는 내용을 검색해보세요"
              className="header_input"
              onChange={(e) => setSearchVal(e.target.value)}
              onKeyUp={(e) => handleOnSubmit(e)}
            />
          </div>
        </div>
        <div className="header_signBtn">
          {user.loggin ? (
           <Dropdown menu={{ items }} placement="bottom">
           <Button>{user.name}</Button>
         </Dropdown>
          ) : (
          <div>
            <button
              onClick={() => router.push("/user/signin")}
              className="header_signin"
            >
              로그인
            </button>
            <span style={{color:"#2b3089"}}> | </span>
            <button
              onClick={() => router.push("/user/signup")}
              className="header_signin"
            >
              회원가입
            </button>
            </div>
            )} 
           <button
            onClick={() => router.push("/post/new")}
            className="header_write"
          >
            글쓰기
          </button>
        </div>
      </div>
      {children}
    </>
  );
};
export default AppLayout;
