import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useRecoilValue, useResetRecoilState } from "recoil";
import { Modal} from 'antd';
import { InboxOutlined , DeleteFilled } from "@ant-design/icons";
import { useCookies } from 'react-cookie';
import axios from "axios";

import { userState } from "../../store/states";
import setToken from "../../component/utils/setToken";


export default function New(props) {
  const user = useRecoilValue(userState);
  const reset = useResetRecoilState(userState);
  const router = useRouter();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);
  const [isModal, setIsModal] = useState(false);
	const [cookie, setCookie, removecookie] = useCookies(['refreshToken','accessToken']);
  const formData = new FormData()
  const inputRefTitle = useRef(null)
  const inputRefContent = useRef(null)

  useEffect(() => {   
    if(!user.loggin) {
        alert('로그인 후 이용 가능합니다. 로그인 페이지로 이동합니다.');
        router.push("/user/signin");
    } else if(user.loggin && !user.emailAuth) {
          alert('YEH의 모든 기능 사용을 위해 이메일 인증을 완료해 주세요.');
            router.push("/user/signupComplete");
    } else setToken({cookie:cookie, setCookie : setCookie, router : router, reset : reset})  
  }, [])
  
  const handleOnSubmit = async () => {
    if(title === '') {
      return inputRefTitle.current.focus();
    } else if(content === '') {
      return inputRefContent.current.focus();
    } else {
      formData.append("title", title);
      formData.append("content", content);
      
      images.forEach(file => formData.append('imageFiles', file));

      try {
          // 이미지 전송을 위해 헤더를 multipart/form-data 로 한다.
          await axios.post('/post/new', formData, {
              headers: {
              'Authorization' : `Bearer ${cookie.accessToken}`,
              'Content-Type': 'multipart/form-data',
            },
          }).then((res) => {
            if(res.data.success) {
              alert(res.data.data)
              router.push("/")
            } else {
              alert('게시글 등록에 실패했습니다. 다시 시도해 주세요')
            }

          });
      } catch (err) {
          console.log(err)
          alert(err.data.data);
      }
    }
  }

  // 이미지 추가
  const handleOnChange = (e) =>{
    const tmpFiles = Array.from(e.target.files)
    setImages([...images, ...tmpFiles])
  }

  const handleOnCancle = () => {
    setTitle('');
    setContent('')
    setImages(null);
  }
  
  const deleteOnFile = (key) => {
    setImages(images.filter((i) => i.lastModified !== key))
  }

  return (  
    <div className="post" >
      <input
        type="text"
        placeholder="제목을 입력해 주세요"
        name="title"
        autoComplete="off"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        ref={inputRefTitle}
        className='postTitle'
        />
      <textarea placeholder="내용을 입력해 주세요" 
        value={content}
        onChange={(e) => setContent(e.target.value)}
        ref={inputRefContent}
        className='postContents'
       />
    
      <form className="postFile">
        <label>
          <InboxOutlined className="postFile_Icon"/><p>이미지 첨부</p>
          <input type="file" accept='image/jpg,impge/png,image/jpeg,image/gif' onChange={handleOnChange} multiple/>
        </label>
      </form>
      <div className="postFileList">
        {images?.map((i) => (
          <div className="postFileList_wrap" key={i.lastModified}>
            <p>{i.name}</p>
            <DeleteFilled onClick={() => deleteOnFile(i.lastModified)}/>
          </div>
        ))}
      </div>
      <div className="postBtn">
        <button className="cancle" onClick={() => handleOnCancle()}>취소</button>
        <button onClick={() => handleOnSubmit()}>등록</button>
      </div>
      {isModal ? <Modal open={isModal} onOk={() => setIsModal(false)} onCancel={() => setIsModal(false)} cancelButtonProps={{ style: { display: 'none' } }} width='420px'>
        <p>첨부 이미지는 최대 5장까지 가능합니다.</p>
      </Modal> : null}
    </div>
  );
}
