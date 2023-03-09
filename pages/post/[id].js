import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { useCookies } from 'react-cookie';
import { EyeOutlined , FieldTimeOutlined, CommentOutlined, LikeOutlined , ShareAltOutlined } from "@ant-design/icons";
import { useRecoilValue, useResetRecoilState } from "recoil";
import axios from "axios";
import Image from "next/image";

import CreateTime from "../../component/utils/createTime";
import setToken from "../../component/utils/setToken";
import { userState } from "../../store/states";
import Rank from "./rank";
import Comments from "./comments";

export default function Details() {
    const router = useRouter();
    const user = useRecoilValue(userState);
    const reset = useResetRecoilState(userState);
    const [detailData, setDetailData] = useState([]);
    const [cookie, setCookie, removecookie] = useCookies(['refreshToken','accessToken']);

    
    useEffect(() => {
      async function getPostView() {
        const token = cookie.accessToken
        const res = await axios.get(`/post/read/${router.query.id}`, {
          headers : {
            'Authorization' : `Bearer ${token}`
          }
        });
        if(res.data.success) setDetailData(res.data.data)
        else alert('잠시 후 다시 접속해주세요')
      }
      try {
          if(user.loggin) {
            setToken({cookie:cookie, setCookie : setCookie, router : router, reset : reset}).then((res) =>{
              if(res === 'userLogin') getPostView();
              else return
            })
          } else {
            alert('로그인 후 이용 가능합니다.');
            router.push("/user/signin");
          }
       } catch(e) {
          console.log(e)
          alert('잠시 후 다시 접속해주세요')
       }
    },[]);
    
    const doCopy = url => {
      if (navigator.clipboard) {
        navigator.clipboard
          .writeText(url)
          .then(() => {
            alert("클립보드에 복사되었습니다.");
          })
          .catch(() => {
            alert("일시적인 오류가 발생했습니다. 다시 시도해주세요.");
          });
      }
    }
    
    const handleOnComments = (data) => {
      let CommentsLength = 0;
      CommentsLength = data?.map((i) => i.children)
      .map((v) => v.length).reduce((cum, n) => cum + n) + data?.length
      if (CommentsLength > 0) return CommentsLength
      else return 0
    }

    return (
        <div className="detailPost">
          <Rank/>
          <div className="detailPostBox">
            <div className="detailPostBox_header">
              <h2>{detailData.title}</h2>
              <div className="detailPostBox_header_info">
                <div style={{display:'flex', gap:'10px'}}>
                  <p><FieldTimeOutlined />{CreateTime(detailData.createTime)}</p>
                  <p><EyeOutlined /> {detailData.view}</p>
                </div>
                  <p>{detailData.writer}</p>
              </div>
            </div>
            <div className="detailPostBox_contents">
              <p >{detailData.content}</p>
                {detailData.images !== undefined  && detailData.images.every((i) => i !== null) ? detailData.images.map((i) => (
                  <Image src={`https://yeh-bucket.s3.ap-northeast-2.amazonaws.com/${i.imageName}`} key={i.id} fill alt='게시글사진'/>
                )) : null}
            </div>
            <div className="detailPostBox_footer">
              <div className="detailPostBox_footer_info">
                <p><LikeOutlined />{detailData.likes}</p>
                <p><CommentOutlined />{handleOnComments(detailData.comments)}</p>
              </div>
              <button onClick={() => doCopy(`https://www.devyeh.com${router.asPath}`)}className="detailPostBox_share"><p><ShareAltOutlined /></p></button>
            </div>
            <Comments comments={detailData.comments}/>
          </div>
        </div>
    )
}
