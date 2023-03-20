import logo from "../../asset/images/logo.png";
import Image from "next/image";
import { useRouter } from "next/router";
import { Dropdown, Button } from 'antd';
import { SearchOutlined } from "@ant-design/icons";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { keywordState, pageState, userState } from "../../store/states";
import { useCookies } from 'react-cookie';
import { useState } from "react";
import axios from "axios";
import qs from 'qs'

const AppLayout = ({ children }) => {
  const router = useRouter();
  const user = useRecoilValue(userState);
  const keywordHandler = useSetRecoilState(keywordState);
  const UserHandler = useSetRecoilState(userState);
  const PageHandler = useSetRecoilState(pageState);

  const [searchVal, setSearchVal] = useState('');
  const [cookie, setCookie, removecookie] = useCookies(['refreshToken','accessToken']);

  const logout = () => {
    UserHandler()
    removecookie('refreshToken')
    removecookie('accessToken')
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
    if(e.keyCode === 13 && searchVal.trim() !== '') {
      try {
        const res = await axios({
          method : 'post',
          url : '/post/search/',
          data: qs.stringify({
            keyword: searchVal,
          }),
          headers: {
            'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
          }
        })
        if(res.data.success && res.data.data.postCount > 0) keywordHandler({posts : res.data.data.posts, postCount : res.data.data.postCount})
        else if(res.data.success && res.data.data.postCount === 0) alert('검색 결과가 없습니다.')
        else alert('잠시 후 다시 시도해주세요.')
      } 
      catch(e) {
        console.log(e)
        alert('잠시 후 다시 시도해주세요.')
      }
    } else if(e.keyCode === 13 && searchVal.trim() === '') alert('검색어를 입력해 주세요.')
      else return
  }

  const handleOnInit = () =>{
    router.push('/main' , undefined, { shallow: true });
    PageHandler(1);
    keywordHandler();
    setSearchVal('');
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
              value={searchVal}
            />
          </div>
        </div>
        <div className="header_signBtn">
          {user?.loggin ? (
            <Dropdown menu={{ items }} placement="bottom" className="header_more">
              <Button className="header_user">{user.name}</Button>
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
