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
import cookies from "next-cookies";
import Image from "next/image";
import axios from "axios";

import getToken from "../component/utils/getToken";
import setToken from "../component/utils/setToken";
import CreateTime from "../component/utils/createTime";
import { keywordState, pageState, userState } from "../store/states";

export default function Main(props) {
  const reset = useResetRecoilState(userState);
  const keywordValue = useRecoilValue(keywordState);
  const user = useRecoilValue(userState);
  const router = useRouter();

  const [postsData, setPostsData] = useState([]);
  const [current, setCurrent] = useRecoilState(pageState);
  const [postsCount, setPostsCount] = useState(0);

  // 검색 결과
  // useEffect(() => {
  //   if(keywordValue.postCount !== 0) {
  //     setPostsData(keywordValue.posts);
  //     setPostsCount(keywordValue.postCount)
  //   } else return
  // },[keywordValue])

  useEffect(() => {
    setToken({ user, props }).then((res) => {
      if (res === "logout") {
        reset();
        router.push("/user/signin");
      }
    });
  }, []);

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

export async function getServerSideProps(ctx) {
  const allCookies = cookies(ctx);
  if (allCookies.refreshToken) {
    const res = await getToken(allCookies.accessToken, allCookies.refreshToken);
    const data = res.data;
    return {
      props: {
        name: "main",
        data: data,
      },
    };
  } else
    return {
      props: {
        name: "main",
        data: null,
      },
    };
}
