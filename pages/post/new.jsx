import { useRef, useState } from "react";
import { useRouter } from "next/router";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { Modal } from "antd";
import { InboxOutlined, DeleteFilled } from "@ant-design/icons";

import { pageState, userState } from "../../store/index";
import { postNew } from "../api";
import { useEffect } from "react";
import setToken from "../../component/utils/setToken";

export default function New() {
  const user = useRecoilValue(userState);
  const PageHandler = useSetRecoilState(pageState);
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [isModal, setIsModal] = useState(false);
  const inputRefTitle = useRef(null);
  const inputRefContent = useRef(null);

  useEffect(() => {
    if (user === undefined || user?.name === null) {
      alert("로그인 후 이용 가능합니다.");
      router.push("/user/signin");
    } else if (user?.loggin && !user.emailAuth) {
      alert("YEH의 모든 기능 사용을 위해 이메일 인증을 완료해 주세요.");
      router.push("/user/signupComplete");
    } else setToken();
  }, [user?.loggin]);

  const handleOnSubmit = async () => {
    const formData = new FormData();

    if (title === "") {
      return inputRefTitle.current.focus();
    } else if (content === "") {
      return inputRefContent.current.focus();
    } else {
      formData.append("title", title);
      formData.append("content", content);

      images.forEach((file) => formData.append("imageFiles", file));

      try {
        const res = await postNew(formData);

        if (res.data.success) {
          alert(res.data.data);
          PageHandler(1);
          router.push("/main", undefined, { shallow: true });
        } else {
          alert("게시글 등록에 실패했습니다. 다시 시도해 주세요");
        }
      } catch (err) {
        console.log(err);
        alert(err.data.data);
      }
    }
  };

  // 이미지 첨부 핸들러
  const handleOnChange = (e) => {
    const tmpFiles = Array.from(e.target.files);
    if ([...images, ...tmpFiles].length < 5) setImages([...images, ...tmpFiles]);
    else {
      setIsModal(true);
      setImages([...images, ...tmpFiles].slice(0, 5));
    }
  };

  const handleOnCancle = () => {
    setTitle("");
    setContent("");
    setImages(null);
  };

  const deleteOnFile = (key) => {
    setImages(images.filter((i) => i.lastModified !== key));
  };

  return (
    <div className="post">
      <input
        type="text"
        placeholder="제목을 입력해 주세요"
        name="title"
        autoComplete="off"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        ref={inputRefTitle}
        className="postTitle"
      />
      <textarea
        placeholder="내용을 입력해 주세요"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        ref={inputRefContent}
        rows="15"
        className="postContents"
      />
      <form className="postFile">
        <label>
          <InboxOutlined className="postFile_Icon" />
          <p>이미지 첨부</p>
          <input type="file" accept="image/jpg,impge/png,image/jpeg,image/gif" onChange={handleOnChange} multiple />
        </label>
      </form>
      <div className="postFileList">
        {images?.map((i) => (
          <div className="postFileList_wrap" key={i.lastModified}>
            <p>{i.name}</p>
            <DeleteFilled onClick={() => deleteOnFile(i.lastModified)} />
          </div>
        ))}
      </div>
      <div className="postBtn">
        <button className="cancle" onClick={() => handleOnCancle()}>
          취소
        </button>
        <button onClick={() => handleOnSubmit()}>등록</button>
      </div>
      {isModal ? (
        <Modal
          open={isModal}
          centered
          onOk={() => setIsModal(false)}
          onCancel={() => setIsModal(false)}
          cancelButtonProps={{ style: { display: "none" } }}
          width="420px"
        >
          <p className="modal_content">첨부 이미지는 최대 5장까지 가능합니다.</p>
        </Modal>
      ) : null}
    </div>
  );
}
