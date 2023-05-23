import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useRecoilState, useRecoilValue } from "recoil";
import { Pagination, Skeleton } from "antd";
import { EyeOutlined, CommentOutlined, LikeOutlined, FieldTimeOutlined } from "@ant-design/icons";
import Image from "next/image";
import dynamic from "next/dynamic";

import CreateTime from "../component/utils/createTime";
import setToken from "../component/utils/setToken";
import { useGrid } from "../component/utils/responsive";
import { keywordState, pageState, userState } from "../store/index";
import { postAll } from "./api";
import { useInView } from "react-intersection-observer";

import { useInfiniteQuery, useQuery } from "react-query";
import axios from "axios";
import AppFooter from "../component/layout/appFooter";

const Rank = dynamic(() => import("./post/rank"));

export default function Main() {
  const router = useRouter();
  const user = useRecoilValue(userState);
  const keywordValue = useRecoilValue(keywordState);

  const [postsData, setPostsData] = useState([]);
  const [current, setCurrent] = useRecoilState(pageState);
  const [postsCount, setPostsCount] = useState(0);
  const { isMobile, isTablet, isDesktop } = useGrid();
  const [loading, setLoading] = useState(false);

  const { ref, inView } = useInView();

  const { data, error, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, status } = useInfiniteQuery(
    "posts",
    async ({ pageParam = 1 }) => {
      const res = await postAll(pageParam);
      return {
        result: res.data.data,
        page: pageParam,
      };
    },
    {
      getNextPageParam: (lastPage) => {
        return lastPage.page + 1;
      },
    }
  );

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  const keyword = useRecoilValue(keywordState);
  // 리프레시 토큰 발급
  useEffect(() => {
    console.log(keyword);
    if (user?.loggin) setToken();
  }, [keyword]);

  // 전체 글 데이터 통신
  const getPosts = async () => {
    await setLoading(true);
    if (keywordValue?.postCount > 0) {
      setPostsData(keywordValue.posts);
      setPostsCount(keywordValue.postCount);
      setLoading(false);
    } else {
      const res = await postAll(current);
      if (res.data.success) {
        // setPostsCount(res.data.data.postCount);
        // setPostsData(res.data.data.posts);
        setLoading(false);
      } else alert("잠시 후 다시 접속해주세요");
    }
  };

  // useEffect(() => {
  //   // router.push(`/main`);
  //   try {
  //     getPosts();
  //   } catch (e) {
  //     console.log(e);
  //     alert("잠시 후 다시 접속해주세요");
  //   }
  // }, [current, keywordValue]);

  const test = data?.pages.map((data) => data.result);
  const test2 = test?.map((i) => i.posts);
  const flattenedArray = test2?.reduce((previousValue, currentValue) => {
    return previousValue.concat(currentValue);
  });
  // console.log(flattenedArray);
  const Data = (
    <div className="getPostsBox_wrap">
      {flattenedArray?.map((i) => (
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
              <p className="addInfo_icons_wrap">
                <FieldTimeOutlined className="addInfoIcons" />
                {CreateTime(i.createTime)}
              </p>
              <p className="addInfo_icons_wrap">
                <EyeOutlined className="addInfoIcons" /> {i.view}
              </p>
              <p className="addInfo_icons_wrap">
                <CommentOutlined className="addInfoIcons" /> {i.comments}
              </p>
              <p className="addInfo_icons_wrap">
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
      {/* {isMobile && <div className="getPost">{Data}</div>}
      {(isTablet || isDesktop) && (
        <div className="getPost">
          <Rank />
          {Data}
        </div>
      )} */}
      <div className="getPost">
        <Rank />
        {Data}
        <div ref={ref}>ㅤ</div>

        {/* <button ref={ref} onClick={() => fetchNextPage()}>
            {isFetchingNextPage ? "Loading more..." : hasNextPage ? "Load Newer" : "Nothing more to load"}
          </button>
        </div> */}
      </div>
      {/* <AppFooter ref={ref} /> */}

      {/* <div className="pagination">
        <Pagination
          current={current}
          onChange={(page) => setCurrent(page)}
          total={postsCount}
          showSizeChanger={false}
        />
      </div> */}
    </>
  );
}
