import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useRecoilValue , useResetRecoilState } from "recoil";
import { Pagination } from 'antd';
import { EyeOutlined , CommentOutlined, LikeOutlined, FieldTimeOutlined} from "@ant-design/icons";
import cookies from "next-cookies";
import Image from "next/image";
import axios from "axios";

import getToken from "../component/utils/getToken";
import setToken from "../component/utils/setToken";
import CreateTime from "../component/utils/createTime";
import { userState } from "../store/states";

export default function main(props) {
  const reset = useResetRecoilState(userState)
  const user = useRecoilValue(userState)
  const router = useRouter();

  const [postsData, setPostsData] = useState([])
  const [rankigData, setRankingData] = useState([])
  const [current, setCurrent] = useState(1);
  const [postsCount, setPostsCount] = useState(0);
  const [test, setTest] = useState(false)

  // 실시간 인기글 데이터 통신, 전체 글 개수 통신
  useEffect(() => {
      setToken({user, props}).then((res) => {
        if(res === 'logout') {
          reset();
          router.push("/user/signin");
        }
      })
      async function getRankings() {
      const res = await axios.get('/post/popular');
      if(res.data.success) setRankingData(res.data.data)
      else alert('잠시 후 다시 접속해주세요')
      }
      async function getPostsCount() {
        const res = await axios.get('/post/allCount');
        if(res.data.success) setPostsCount(res.data.data)
        else alert('잠시 후 다시 접속해주세요')
      }
    try {
      getRankings();
      getPostsCount();
    } catch(e) {
      console.log(e)
      alert('잠시 후 다시 접속해주세요')
    }
  },[])

  // 전체 글 데이터 통신
  useEffect(() => {
    router.push(`/main?page=${current}`)
    async function getPosts() {
      const res = await axios.get('/post/all', {params : {page : current}});
      if(res.data.success) setPostsData(res.data.data.posts)
      else alert('잠시 후 다시 접속해주세요')
    }  
    try {
      getPosts();
    } catch(e) {
      console.log(e)
      alert('잠시 후 다시 접속해주세요')
    }
  },[current])

  const DetailPosts = (id) => {
    router.push(`/post/${id}`)
  }
  
  return (
    <>
    <div className="getPost">
        <div className="ranking">
          <p className="rankingTitle">실시간 인기글</p>
          {rankigData.map((i, index) => (
            <div className="rankingContents" key={i.id} >
              <p className="index">{index + 1}</p>
              <p className="title">{i.title}</p>
            </div>
          ))}
        </div>
      <div className="getPostsBox_wrap">
        {postsData.map((i) => (
          <div key={i.id} className="getPostsBox" onClick={() => DetailPosts(i.id)}>
            {CreateTime(i.createTime).indexOf('분전') > 0  || CreateTime(i.createTime).indexOf('시간전') > 0 
              ? <p className="NewPosts">NEW</p>
              : null}
            <div className="mainInfo">
              <div className="mainInfoText">
                <p className="mainInfoTitle">{i.title}</p>  
                <p className="mainInfoContents">{i.content}</p>
                <p className="mainInfoWriter">{i.writer}</p>
              </div>
              {i.image.firstImageUrl !== null ? (
                <div className="ImageInfo">
                  <Image src={i.image.firstImageUrl} width={100} height={100} alt='postImage'/>
                  {i.image.totalImagesCount > 1 ? 
                    <p className="totalImagesCount">{`+${i.image.totalImagesCount - 1}`}</p>
                  : null}
                </div>
              ) : null}
            </div>
            <div className="addInfo">
              <p><EyeOutlined className="addInfoIcons"/> {i.view} Views</p>
              <p><CommentOutlined className="addInfoIcons"/> {i.comments} Comments</p>
              <p><LikeOutlined className="addInfoIcons"/> {i.likes} Likes</p>
              <p><FieldTimeOutlined className="addInfoIcons"/>{CreateTime(i.createTime)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
      <div className="pagination"> 
        <Pagination current={current} onChange={(page) => setCurrent(page)} total={postsCount} />
      </div>
    </>
  )
}

export async function getServerSideProps(ctx) {
  const allCookies = cookies(ctx);
  if(allCookies.refreshToken) {
    const res = await getToken(allCookies.accessToken, allCookies.refreshToken)
    const data = res.data
    return {
      props: {
        name : "main",
        data : data  
      },
    };
  } else return {
    props: {
      name : "main",
      data : null  
    },
  } 
}