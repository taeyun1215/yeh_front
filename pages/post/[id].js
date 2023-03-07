import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { useRecoilValue , useResetRecoilState } from "recoil";
import { EyeOutlined , FieldTimeOutlined, CommentOutlined, LikeOutlined , ShareAltOutlined } from "@ant-design/icons";
import {CopyToClipboard} from 'react-copy-to-clipboard';
import axios from "axios";
import cookies from "next-cookies";
import cookie from "react-cookies";
import Image from "next/image";

import { userState } from "../../store/states";
import getToken from "../../component/utils/getToken";
import setToken from "../../component/utils/setToken";
import CreateTime from "../../component/utils/createTime";
import { Rank } from "./rank";

export default function Details(props) {
    const router = useRouter();
    
    const user = useRecoilValue(userState);
    const reset = useResetRecoilState(userState);
    // const [datailData, setDetailData] = useState([]);

    // useEffect(() => {
    //     setToken({user, props}).then((res) => {
    //         if(res === 'logout') {
    //           reset();
    //           router.push("/user/signin");
    //         }
    //     })
    //     async function getPostView() {
    //     const token = cookie.load("accessToken");
    //     const res = await axios.get(`/post/read/${router.query.id}`, {
    //         headers : {
    //             'Authorization' : `Bearer ${token}`
    //         }
    //     });
    //     if(res.data.success) setDetailData(res.data.data)
    //     else if(!res.data.success && res.data.error[0].code === 'invalid_token') {
    //       alert('로그인이 필요한 페이지입니다. 로그인 후 이용 가능합니다.');
    //       router.push("/user/signin");
    //     }
    //     else alert('잠시 후 다시 접속해주세요')
    //    }
    //    try {
    //       getPostView();
    //    } catch(e) {
    //       console.log(e)
    //       alert('잠시 후 다시 접속해주세요')
    //    }
    // },[]);
    const test = [
      {
        "data": {
            "id": 38,
            "title": "테스트 금요일",
            "content": "오늘은 금요일이다 우하하하",
            "writer": "버드실버",
            "view": 2,
            "writeStatus": false,
            "images": [
                {
                    "id": 35,
                    "originalImageName": "KakaoTalk_20220908_105334397.jpg",
                    "imageName": "d4af4939-9b45-4cdd-a2e2-d499c3fb7ca4.jpg",
                    "imageUrl": "https://yeh-bucket.s3.ap-northeast-2.amazonaws.com/d4af4939-9b45-4cdd-a2e2-d499c3fb7ca4.jpg"
                }
            ],
            "comments": [
                {
                    "id": 5,
                    "content": "이건 되려나???????",
                    "writer": "dasddasd",
                    "createTime": "2023-02-24T15:40:58.600687",
                    "children": [
                        {
                            "id": 6,
                            "content": "12312312",
                            "writer": "dasddasd",
                            "createTime": "2023-02-25T14:12:17.299279"
                        },
                        {
                            "id": 7,
                            "content": "ㅇoh...nice..............",
                            "writer": "dasddasd",
                            "createTime": "2023-02-25T14:12:48.259042"
                        }
                    ]
                },
                {
                    "id": 8,
                    "content": "ㅅㅣㅣㅁ시ㅁ해ㅐㅐㅐ",
                    "writer": "dasddasd",
                    "createTime": "2023-02-25T14:13:27.43793",
                    "children": [
                        {
                            "id": 11,
                            "content": "나도 심심혀",
                            "writer": "dasddasd",
                            "createTime": "2023-02-25T14:14:21.966565"
                        },
                        {
                            "id": 12,
                            "content": "앗 너도?",
                            "writer": "dasddasd",
                            "createTime": "2023-02-25T14:14:27.564202"
                        }
                    ]
                },
                {
                    "id": 9,
                    "content": "저녁엔 뭐하지?",
                    "writer": "dasddasd",
                    "createTime": "2023-02-25T14:13:37.048054",
                    "children": [
                        {
                            "id": 10,
                            "content": "저녁엔 치킨이지",
                            "writer": "dasddasd",
                            "createTime": "2023-02-25T14:14:04.087577"
                        }
                    ]
                }
            ],
            "likes": 0,
            "createTime": null
        }
    }
    ]
    const datailData = test[0].data
    console.log(router)
    const handleOnShare = (e) => {
      console.log(e.target.id)
    }

    return (
        <div className="detailPost">
          {/* <Rank/> */}
          <div></div>
          <div className="detailPostBox">
          <div className="detailPostBox_header">
            <h2>{datailData.title}</h2>
            <div className="detailPostBox_header_info">
              <div style={{display:'flex', gap:'10px'}}>
                <p><FieldTimeOutlined />{CreateTime(datailData.createTime)}</p>
                <p><EyeOutlined /> {datailData.view}</p>
              </div>
                <p>{datailData.writer}</p>
            </div>
          </div>
          <div className="detailPostBox_contents">
            <p >{datailData.content}</p>
              {datailData.images !== undefined  && datailData.images.every((i) => i !== null) ? datailData.images.map((i) => (
                <Image src={i.imageUrl} key={i.id} fill alt='게시글사진'/>
              )) : null}
          </div>
          <div className="detailPostBox_footer">
            <div className="detailPostBox_footer_info">
              <p><LikeOutlined /> {datailData.comments !== undefined? datailData.comments.length : null}</p>
              <p><CommentOutlined /> {datailData.likes}</p>
            </div>
            <button onClick={(id) => handleOnShare(id)} id={`https://www.devyeh.com${router.asPath}`} className="detailPostBox_share"><p><ShareAltOutlined /></p></button>
          </div>
          </div>
        </div>
    )
}

// export async function getServerSideProps(ctx) {
//     const allCookies = cookies(ctx);
//     if(allCookies.refreshToken) {
//       const res = await getToken(allCookies.accessToken, allCookies.refreshToken)
//       const data = res.data
//       return {
//         props: {
//           name : "detail",
//           data : data  
//         },
//       };
//     } else return {
//       props: {
//         name : "detail",
//         data : null  
//       },
//     } 
//   }