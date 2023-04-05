import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useRecoilValue, useResetRecoilState } from "recoil";
import { userState } from "../../store/states";
import { Tabs, List, Modal, Result, Button } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";

import setToken from "../../component/utils/setToken";
import { myInfo, postDelete, userSecession } from "../api";
import MyInfoEdit from "./myInfo";

export default function MyPost() {
  const router = useRouter();
  const user = useRecoilValue(userState);
  const reset = useResetRecoilState(userState);
  const [myData, setMyData] = useState([]);
  const [isModal, setIsModal] = useState(false); //유저 탈퇴 모달 state
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
        router.reload();
      } else alert("잠시 후 다시 시도해주세요");
    } catch (e) {
      console.log(e);
      alert("잠시 후 다시 시도해주세요");
    }
  };

  const myPost =
    myData.length === 0 ? (
      <Result
        icon={<ExclamationCircleOutlined style={{ fontSize: "56px" }} />}
        title="작성된 게시글이 없습니다. 지금 첫 게시글을 작성해보세요!"
        extra={<Button type="primary">글쓰기</Button>}
      />
    ) : (
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
            children: index === 0 ? myPost : <MyInfoEdit />,
          };
        })}
      />

      <Modal
        title="게시글 삭제"
        open={isModal}
        centered
        okText="확인"
        cancelText="취소"
        onOk={() => handleOnDelete()}
        onCancel={() => setIsModal(false)}
      >
        <p>정말 게시글을 삭제하시겠습니까?</p>
      </Modal>
    </div>
  );
}
