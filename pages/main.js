import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useRecoilState, useRecoilValue, useResetRecoilState } from "recoil";
import { Pagination, Skeleton } from "antd";
import {
  EyeOutlined,
  CommentOutlined,
  LikeOutlined,
  FieldTimeOutlined,
} from "@ant-design/icons";
import Image from "next/image";
import axios from "axios";

import CreateTime from "../component/utils/createTime";
import setToken from "../component/utils/setToken";
import Rank from "./post/rank";
import { pageState, userState } from "../store/states";
import { useCookies } from "react-cookie";

export default function Main() {
  const router = useRouter();
  const user = useRecoilValue(userState);
  const reset = useResetRecoilState(userState);
  const [cookie, setCookie, removecookie] = useCookies(['refreshToken','accessToken']);
  const [datailData, setDetailData] = useState([]);
  const [postsData, setPostsData] = useState([]);
  const [current, setCurrent] = useRecoilState(pageState);
  const [postsCount, setPostsCount] = useState(0);

  // 리프레시 토큰 재발급

  // 검색 결과
  // useEffect(() => {
  //   if(keywordValue.postCount !== 0) {
  //     setPostsData(keywordValue.posts);
  //     setPostsCount(keywordValue.postCount)
  //   } else return
  // },[keywordValue])

  // 리프레시 토큰 발급
  useEffect(() => {
    if(user.loggin) setToken({cookie:cookie, setCookie : setCookie, router : router, reset : reset})  
  },[])

  // 전체 글 데이터 통신
  useEffect(() => {
    router.push(`/main?page=${current}`);
    async function getPosts() {
      const res = await axios.get("/post/all", { params: { page: current } });
      if (res.data.success) {
        setPostsCount(res.data.data.postCount);
        setPostsData(res.data.data.posts);
      } else alert("잠시 후 다시 접속해주세요");
    }
    try {
      getPosts();
    } catch (e) {
      console.log(e);
      alert("잠시 후 다시 접속해주세요");
    }
  }, [current]);

  return (
    <>
      <div className="getPost">
        <Rank/>
        <div className="getPostsBox_wrap">
          {postsData.map((i) => (
            <div
              key={i.id}
              className="getPostsBox"
              onClick={() => router.push(`/post/${i.id}`)}
            >
              {CreateTime(i.createTime).indexOf("방금전") > 0 ||
              CreateTime(i.createTime).indexOf("분전") > 0 ||
              CreateTime(i.createTime).indexOf("시간전") > 0 ? (
                <p className="NewPosts">NEW</p>
              ) : null}
              <div className="mainInfo">
                <div className="mainInfoText">
                  <p className="mainInfoTitle">{i.title}</p>
                  <p className="mainInfoContents">{i.content}</p>
                </div>
                {i.image.firstImageUrl !== null ? (
                  <div className="ImageInfo">
                    <Image
                      src={i.image.firstImageUrl}
                      width={100}
                      height={100}
                      alt="postImage"
                    />
                    {i.image.totalImagesCount > 1 ? (
                      <p className="totalImagesCount">{`+${
                        i.image.totalImagesCount - 1
                      }`}</p>
                    ) : null}
                  </div>
                ) : null}
              </div>
              <div className="addInfo">
                <p className="addInfoWriter">{i.writer}</p>
                <div className="addInfo_wrap">
                  <p>
                    <FieldTimeOutlined className="addInfoIcons" />
                    {CreateTime(i.createTime)}
                  </p>
                  <p>
                    <EyeOutlined className="addInfoIcons" /> {i.view}
                  </p>
                  <p>
                    <CommentOutlined className="addInfoIcons" /> {i.comments}
                  </p>
                  <p>
                    <LikeOutlined className="addInfoIcons" /> {i.likes}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="pagination">
        <Pagination
          current={current}
          onChange={(page) => setCurrent(page)}
          total={postsCount}
        />
      </div>
    </>
  );
}
