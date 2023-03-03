import logo from "../../asset/images/logo.png";
import Image from "next/image";
import { useRouter } from "next/router";
import { Dropdown, Button } from 'antd';
import { SearchOutlined } from "@ant-design/icons";
import { useRecoilState } from "recoil";
import { userState } from "../../store/states";
import cookie from "react-cookies";

const AppLayout = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useRecoilState(userState);

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
  return (
    <>
      <div className="header">
        <div className="header_wrap">
          <Image src={logo} alt="yehLogo" className="heaeder_logo" onClick={() => router.push('/')}/>
          <div className="header_search">
            <button>
              <SearchOutlined style={{fontSize:'22px', color:"#2b3089", fontWeight:'bold'}}/>
            </button>
            <input
              placeholder="관심있는 내용을 검색해보세요"
              className="header_input"
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
