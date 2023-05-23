import { use, useEffect, useRef, useState } from "react";
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
import { postAll, postSearch } from "./api";
import { useInView } from "react-intersection-observer";

import { useInfiniteQuery, useQuery } from "react-query";
import axios from "axios";
import AppFooter from "../component/layout/appFooter";

const Rank = dynamic(() => import("./post/rank"));

export default function Main() {
  const router = useRouter();
  const user = useRecoilValue(userState);
  const keyword = useRecoilValue(keywordState);

  const { isMobile, isTablet, isDesktop } = useGrid();
  const { ref, inView } = useInView();
  const { data, isLoading, error, refetch, fetchNextPage, status } = useInfiniteQuery(
    "posts",
    async ({ pageParam = 1 }) => {
      const res = await postSearch(keyword, pageParam);
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

  const POST = data?.pages.map((data) => data.result)?.map((val) => val.posts);
  const flattenedArray = POST?.reduce((previousValue, currentValue) => {
    return previousValue.concat(currentValue);
  });

  useEffect(() => {
    refetch();
  }, [keyword]);

  useEffect(() => {
    if (inView) fetchNextPage();
  }, [inView]);

  // 리프레시 토큰 발급
  useEffect(() => {
    if (user?.loggin) setToken();
  }, []);

  const Data = (
    <div className="getPostsBox_wrap">
      {flattenedArray?.map((i) =>
        isLoading ? (
          <Skeleton key={i} active />
        ) : (
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
        )
      )}
    </div>
  );
  return (
    <div className="getPost_container">
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
      </div>
      <p className="scrollRef" ref={ref}>
        ㅤ
      </p>
      {/* <AppFooter /> */}
    </div>
  );
}
