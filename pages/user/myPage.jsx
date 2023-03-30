import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useRecoilValue, useResetRecoilState } from "recoil";
import { userState } from "../../store/states";
import { Tabs, Avatar, Button, List, Skeleton } from "antd";

import setToken from "../../component/utils/setToken";
import { myInfo } from "../api";
import CreateTime from "../../component/utils/createTime";

export default function MyPage() {
  const router = useRouter();
  const user = useRecoilValue(userState);
  const reset = useResetRecoilState(userState);

  const [myData, setMyData] = useState([]);
  const tabs = ["내가 작성한 글", "정보 수정"];

  const getMyInfo = async () => {
    const res = await myInfo();
    if (res.data.success) setMyData(res.data.data.posts);
  };
  // 리프레시 토큰 발급
  useEffect(() => {
    try {
      if (user?.loggin) {
        setToken({ router: router, reset: reset }).then((res) => {
          if (res === "userLogin") getMyInfo();
          else return;
        });
      } else return;
    } catch (e) {
      console.log(e);
      alert("잠시 후 다시 시도해주세요");
    }
  }, []);
  console.log(myData);
  const myPost = myData?.map((i) => (
    <div key={i.id} className="myPost">
      <p className="myPostTitle">{i.title}</p>
      <p>{CreateTime(i.createTime)}</p>
    </div>
  ));
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
            children: index === 0 ? myPost : null,
          };
        })}
      />
    </div>
  );
}
