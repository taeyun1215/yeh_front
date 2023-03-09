import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useRecoilValue, useResetRecoilState } from "recoil";
import { Upload, Modal} from 'antd';
import { InboxOutlined } from "@ant-design/icons";
import { useCookies } from 'react-cookie';
import axios from "axios";

import { userState } from "../../store/states";
import setToken from "../../component/utils/setToken";


export default function New(props) {
  const user = useRecoilValue(userState);
  const reset = useResetRecoilState(userState);
  const router = useRouter();
  const { Dragger } = Upload;
  
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
      
      const token = cookie.load("accessToken");
      const imageFiles = images.map((image) => image.originFileObj);
      imageFiles.forEach(file => formData.append('imageFiles', file));

      try {
          // 이미지 전송을 위해 헤더를 multipart/form-data 로 한다.
          await axios.post('/post/new', formData, {
              headers: {
              'Authorization' : `Bearer ${token}`,
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

  const uploads = {
    name: 'file',
    multiple: true,
    maxCount : isModal ? 5 : null,
    accept:'image/jpg,impge/png,image/jpeg,image/gif',
    onChange : (info) => {
      setImages(info.fileList)
      if(info.fileList.length > 5) {
        setIsModal(true);
      }
    },
  }
  
  const handleOnCancle = () => {
    setTitle('');
    setContent('')
    setImages(null);
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
        />
      <textarea placeholder="내용을 입력해 주세요" 
        value={content}
        onChange={(e) => setContent(e.target.value)}
        ref={inputRefContent}
       />
      <Dragger {...uploads} showUploadList={images.length > 0 ? true : false}>
        <div style={{display:'flex', justifyContent:'center', gap:'5px'}}>
          <p className="ant-upload-drag-icon"><InboxOutlined /></p>
          <p className="ant-upload-text">파일 업로드</p>
        </div>
        <p className="ant-upload-hint">첨부할 파일을 선택하거나 마우스로 드래그 해주세요.</p>
      </Dragger>
      <div className="postBtn">
        <button className="cancle" onClick={handleOnCancle}>취소</button>
        <button onClick={handleOnSubmit}>등록</button>
      </div>
      {isModal ? <Modal open={isModal} onOk={() => setIsModal(false)} onCancel={() => setIsModal(false)} cancelButtonProps={{ style: { display: 'none' } }} width='420px'>
        <p>첨부 이미지는 최대 5장까지 가능합니다.</p>
      </Modal> : null}
    </div>
  );
}
