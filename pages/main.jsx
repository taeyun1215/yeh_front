import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useRecoilState, useRecoilValue, useResetRecoilState } from "recoil";
import { Pagination, Skeleton } from "antd";
import { EyeOutlined, CommentOutlined, LikeOutlined, FieldTimeOutlined } from "@ant-design/icons";
import Image from "next/image";
import axios from "axios";
import dynamic from "next/dynamic";

import CreateTime from "../component/utils/createTime";
import setToken from "../component/utils/setToken";
import { useGrid } from "../component/utils/responsive";
import { keywordState, pageState, userState } from "../store/states";
import { postAll } from "./api";

const Rank = dynamic(() => import("./post/rank"));

export default function Main() {
  const router = useRouter();
  const user = useRecoilValue(userState);
  const reset = useResetRecoilState(userState);
  const keywordValue = useRecoilValue(keywordState);

  const [postsData, setPostsData] = useState([]);
  const [current, setCurrent] = useRecoilState(pageState);
  const [postsCount, setPostsCount] = useState(0);
  const { isMobile, isTablet, isDesktop } = useGrid();

  // 리프레시 토큰 발급
  useEffect(() => {
    if (user?.loggin) setToken({ router: router, reset: reset });
  }, []);

  // 전체 글 데이터 통신
  const getPosts = async () => {
    if (keywordValue?.postCount > 0) {
      setPostsData(keywordValue.posts);
      setPostsCount(keywordValue.postCount);
    } else {
      const res = await postAll(current);
      if (res.data.success) {
        setPostsCount(res.data.data.postCount);
        setPostsData(res.data.data.posts);
      } else alert("잠시 후 다시 접속해주세요");
    }
  };

  useEffect(() => {
    router.push(`/main?page=${current}`);
    try {
      getPosts();
    } catch (e) {
      console.log(e);
      alert("잠시 후 다시 접속해주세요");
    }
  }, [current, keywordValue]);

  const Data = (
    <div className="getPostsBox_wrap">
      {postsData.map((i) => (
        <div
          key={i.id}
          className="getPostsBox"
          onClick={() =>
            router.push({
              pathname: "/post/read",
              query: { id: i.id },
            })
          }
        >
          {CreateTime(i.createTime).includes("방금전") ||
          CreateTime(i.createTime).includes("분전") ||
          CreateTime(i.createTime).includes("시간전") ? (
            <p className="NewPosts">NEW</p>
          ) : null}
          <div className="mainInfo">
            <div className="mainInfoText">
              <p className="mainInfoTitle">{i.title}</p>
              <p className="mainInfoContents">{i.content}</p>
            </div>
            {i.image.firstImageUrl !== null ? (
              <div className="ImageInfo">
                <Image src={i.image.firstImageUrl} width={100} height={100} alt="postImage" />
                {i.image.totalImagesCount > 1 ? (
                  <p className="totalImagesCount">{`+${i.image.totalImagesCount - 1}`}</p>
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
  );

  return (
    <>
      {isMobile && <div className="getPost">{Data}</div>}
      {(isTablet || isDesktop) && (
        <div className="getPost">
          <Rank />
          {Data}
        </div>
      )}
      {/* {isDesktop && (
        <div className="getPost">
          <Rank />
          {Data}
        </div>
      )} */}
      <div className="pagination">
        <Pagination
          current={current}
          onChange={(page) => setCurrent(page)}
          total={postsCount}
          showSizeChanger={false}
        />
      </div>
    </>
  );
}
