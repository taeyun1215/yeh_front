import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useRecoilValue, useResetRecoilState } from "recoil";
import { userState } from "../../store/states";
import { Tabs, List, Modal } from "antd";

import setToken from "../../component/utils/setToken";
import { myInfo, postDelete } from "../api";

export default function MyPage() {
  const router = useRouter();
  const user = useRecoilValue(userState);
  const reset = useResetRecoilState(userState);
  const [myData, setMyData] = useState([]);
  const [isModal, setIsModal] = useState(false);
  const [deleteId, setDeleteId] = useState("");

  const tabs = ["내가 작성한 글", "내 정보 수정"];

  const getMyInfo = async () => {
    const res = await myInfo();
    if (res.data.success) setMyData(res.data.data.posts);
  };

  useEffect(() => {
    try {
      if (user === undefined || user?.name === null) {
        alert("로그인 후 이용 가능합니다.");
        router.push("/user/signin");
      } else if (user?.loggin) {
        setToken({ router: router, reset: reset }).then((res) => {
          if (res === "userLogin") getMyInfo();
          else return;
        });
      } else return;
    } catch (e) {
      console.log(e);
      alert("잠시 후 다시 시도해주세요");
    }
  }, [router, user?.loggin]);

  const handleOnDelete = async () => {
    try {
      const res = await postDelete(deleteId);
      if (res.data.success) {
        setIsModal(false);
      } else alert("잠시 후 다시 시도해주세요");
    } catch (e) {
      console.log(e);
      alert("잠시 후 다시 시도해주세요");
    }
  };

  const myPost = (
    <List
      itemLayout="horizontal"
      dataSource={myData}
      renderItem={(item) => (
        <List.Item
          actions={[
            <a
              key="list-loadmore-edit"
              onClick={() =>
                router.push({
                  pathname: "/post/edit",
                  query: { id: item.id },
                })
              }
            >
              수정
            </a>,
            <a
              key="list-loadmore-more"
              onClick={() => {
                setDeleteId(item.id);
                setIsModal(true);
              }}
            >
              삭제
            </a>,
          ]}
        >
          <List.Item.Meta
            title={
              <a
                onClick={() =>
                  router.push({
                    pathname: "/post/read",
                    query: { id: item.id },
                  })
                }
              >
                {item.title}
              </a>
            }
            description={item.content}
          />
        </List.Item>
      )}
    />
  );

  const MyInfo = (
    <div className="myinfo">
      <div className="myinfo_wrap">
        <p>닉네임</p>
        <button>수정</button>
      </div>
      <div className="myinfo_wrap">
        <p>비밀번호</p>
        <button>수정</button>
      </div>
      <span>회원탈퇴</span>
    </div>
  );

  return (
    <div className="myPage">
      <Tabs
        defaultActiveKey="1"
        centered
        size="large"
        items={tabs.map((i, index) => {
          return {
            label: <span>{i}</span>,
            key: index,
            children: index === 0 ? myPost : MyInfo,
          };
        })}
      />
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
}
