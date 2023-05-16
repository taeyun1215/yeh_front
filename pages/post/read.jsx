import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Dropdown, Modal, Skeleton } from "antd";
import { resetRecoil } from "recoil-nexus";

import {
  EyeOutlined,
  FieldTimeOutlined,
  CommentOutlined,
  LikeOutlined,
  ShareAltOutlined,
  EllipsisOutlined,
} from "@ant-design/icons";
import { useRecoilValue, useSetRecoilState } from "recoil";
import Image from "next/image";
import dynamic from "next/dynamic";
import { FaPen } from "react-icons/fa";

import CreateTime from "../../component/utils/createTime";
import setToken from "../../component/utils/setToken";
import { pageState, userState } from "../../store/index";
import { postComment, postLike, postDelete, postRead } from "../api";
import { useGrid } from "../../component/utils/responsive";

const Rank = dynamic(() => import("./rank"));
const Comments = dynamic(() => import("./comments"));

export default function Details() {
  const formData = new FormData();
  const router = useRouter();
  const user = useRecoilValue(userState);
  const PageHandler = useSetRecoilState(pageState);
  const { isMobile, isTablet, isDesktop } = useGrid();

  const [detailData, setDetailData] = useState([]);
  const [comments, setCommnets] = useState("");
  const [isModal, setIsModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const items = [
    {
      key: "1",
      label: (
        <a
          onClick={() =>
            router.push({
              pathname: "/post/edit",
              query: { id: detailData.id },
            })
          }
        >
          수정
        </a>
      ),
    },
    {
      key: "2",
      label: <a onClick={() => setIsModal(true)}>삭제</a>,
    },
  ];

  const userConfirm = async () => {
    await setLoading(true);
    getPostView();
  };

  // 상세 게시글 받아오기
  const getPostView = async () => {
    const res = await postRead(router.query.id);
    if (res.data.success) setDetailData(res.data.data);
    setLoading(false);
  };

  useEffect(() => {
    try {
      if (user === undefined || user?.name === null) {
        alert("로그인 후 이용 가능합니다.");
        router.push("/user/signin", undefined, { shallow: true });
      } else if (user?.loggin) {
        setToken().then((res) => {
          if (res === "userLogin") userConfirm();
        });
      } else return;
    } catch (e) {
      console.log(e);
      alert("잠시 후 다시 시도해주세요");
    }
  }, [router, user?.loggin]);

  // 게시글 공유
  const doCopy = (url) => {
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(url)
        .then(() => {
          alert("클립보드에 복사되었습니다.");
        })
        .catch(() => {
          alert("잠시 후 다시 시도해주세요.");
        });
    }
  };

  // 대댓글까지의 총 개수
  const handleOnComments = (data) => {
    let CommentsLength = 0;
    CommentsLength =
      data
        ?.map((i) => i.children)
        .map((v) => v.length)
        .reduce((cum, n) => cum + n) + data?.length;
    if (CommentsLength > 0) return CommentsLength;
    else return 0;
  };

  // 게시글 좋아요
  const handleOnLike = async () => {
    try {
      const res = await postLike(detailData.id);
      if (res.data.success) getPostView();
      else alert("잠시 후 다시 시도해주세요");
    } catch (e) {
      console.log(e);
      alert("잠시 후 다시 시도해주세요");
    }
  };

  // 댓글 작성
  const insertComments = async () => {
    if (comments.trim() !== "") {
      formData.append("content", comments);
      try {
        const res = await postComment(detailData.id, formData);
        if (res.data.success) {
          alert(res.data.data);
          getPostView();
          setCommnets("");
        } else alert("잠시 후 다시 시도해 주세요");
      } catch (e) {
        console.log(e);
        alert("잠시 후 다시 시도해 주세요");
      }
    } else alert("댓글을 입력해주세요.");
  };

  const handleOnKeyup = (e) => {
    if (e.keyCode === 13) insertComments();
    else return;
  };

  // 게시글 삭제
  const handleOnDelete = async () => {
    try {
      const res = await postDelete(detailData.id);
      if (res.data.success) {
        setIsModal(false);
        PageHandler(1);
        router.push("/main");
      } else alert("잠시 후 다시 시도해주세요");
    } catch (e) {
      console.log(e);
      alert("잠시 후 다시 시도해주세요");
    }
  };

  const Data = (
    <div className="detailPostBox">
      <div className="detailPostBox_header">
        {loading ? <Skeleton.Input active block /> : <h2>{detailData.title}</h2>}
        <div className="detailPostBox_header_info">
          {loading ? (
            <Skeleton.Input active size="small" />
          ) : (
            <div style={{ display: "flex", gap: "10px" }}>
              <p>
                <FieldTimeOutlined />
                {CreateTime(detailData.createTime)}
              </p>
              <p>
                <EyeOutlined />
                {detailData.view}
              </p>
            </div>
          )}
          {loading ? <Skeleton.Input active size="small" /> : <p>{detailData.writer}</p>}
        </div>
      </div>
      <div className="detailPostBox_contents">
        {loading ? <Skeleton.Input active block /> : <p>{detailData.content}</p>}
        {detailData.images !== undefined && detailData?.images.every((i) => i !== null)
          ? detailData.images.map((i) =>
              loading ? (
                <Skeleton.Image active key={i} />
              ) : (
                <Image
                  src={`https://yeh-bucket.s3.ap-northeast-2.amazonaws.com/${i.imageName}`}
                  key={i.id}
                  fill
                  alt="게시글사진"
                />
              )
            )
          : null}
      </div>
      <div className="detailPostBox_footer">
        <div className="detailPostBox_footer_info">
          <button onClick={() => handleOnLike()}>
            <LikeOutlined />
            {detailData.likes}
          </button>
          <p>
            <CommentOutlined />
            {handleOnComments(detailData.comments)}
          </p>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          {detailData.writeStatus ? (
            <Dropdown trigger={["click"]} menu={{ items }} placement="bottom">
              <p style={{ cursor: "pointer" }}>
                <EllipsisOutlined style={{ fontSize: "24px", fontWeight: "bold" }} />
              </p>
            </Dropdown>
          ) : null}
          <button onClick={() => doCopy(`https://www.devyeh.com${router.asPath}`)} className="detailPostBox_share">
            <p>
              <ShareAltOutlined />
            </p>
          </button>
        </div>
      </div>
      <div className="comments_input">
        <input
          placeholder="따뜻한 답변은 작성자에게 큰 힘이 됩니다 =)"
          value={comments}
          onChange={(e) => setCommnets(e.target.value)}
          onKeyUp={(e) => handleOnKeyup(e)}
        />
        <button onClick={() => insertComments()}>
          <FaPen />
        </button>
      </div>
      <Comments comments={detailData} getPostView={getPostView} loading={loading} />
      <Modal
        title="게시글 삭제"
        open={isModal}
        centered
        okText="확인"
        cancelText="취소"
        onOk={handleOnDelete}
        onCancel={() => setIsModal(false)}
      >
        <p>정말 게시글을 삭제하시겠습니까?</p>
      </Modal>
    </div>
  );

  return (
    <>
      {isMobile && <div className="detailPost">{Data}</div>}
      {(isTablet || isDesktop) && (
        <div className="detailPost">
          <Rank />
          {Data}
        </div>
      )}
    </>
  );
}
