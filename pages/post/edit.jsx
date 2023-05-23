import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useRecoilValue } from "recoil";
import { Modal } from "antd";
import { InboxOutlined, DeleteFilled } from "@ant-design/icons";

import setToken from "../../component/utils/setToken";
import { userState } from "../../store/index";
import { postEdit, postRead } from "../api";

export default function Edit() {
  const router = useRouter();
  const user = useRecoilValue(userState);
  const [title, setTitle] = useState(""); // props 제목
  const [content, setContent] = useState(""); // props 내용
  const [images, setImages] = useState([]); // props 이미지
  const [reuploadImages, setReuploadImages] = useState([]); // 재 업로드 이미지
  const [preView, setPreView] = useState([]); // 업로드 전 미리보기 preview
  const [isModal, setIsModal] = useState(false);

  const formData = new FormData();
  const inputRefTitle = useRef(null);
  const inputRefContent = useRef(null);

  const getPostView = async () => {
    try {
      const res = await postRead(router.query.id);
      if (res.data.success) {
        setTitle(res.data.data.title);
        setContent(res.data.data.content);
        setImages(res.data.data.images);
      } else alert("잠시 후 다시 시도해주세요");
    } catch (e) {
      console.log(e);
      alert("잠시 후 다시 시도해주세요");
    }
  };

  useEffect(() => {
    if (user === undefined || user?.name === null) {
      alert("로그인 후 이용 가능합니다.");
      router.push("/user/signin", undefined, { shallow: true });
    } else if (user?.loggin) {
      setToken();
      getPostView();
    } else return;
  }, [user?.loggin]);

  const handleOnSubmit = async () => {
    if (title === "") {
      return inputRefTitle.current.focus();
    } else if (content === "") {
      return inputRefContent.current.focus();
    } else {
      formData.append("title", title);
      formData.append("content", content);

      reuploadImages.forEach((file) => formData.append("imageFiles", file));
      formData.append("ImagesId", images[0] != null && images.map((i) => i.id));

      try {
        const res = await postEdit(router.query.id, formData);
        console.log(res);
        if (res.data.success) {
          alert(res.data.data);
          router.push(`/post/read?id=${router.query.id}`);
        } else {
          alert("게시글 수정에 실패했습니다. 다시 시도해 주세요");
        }
      } catch (err) {
        console.log(err);
        alert("잠시 후 다시 시도해주세요.");
      }
    }
  };

  // 이미지 첨부 핸들러
  const handleOnChange = (e) => {
    const imageLists = e.target.files;
    const tmpArr = Array.from(imageLists);
    let imageUrlLists = [...preView];
    for (let i = 0; i < imageLists.length; i++) {
      const currentImageUrl = URL.createObjectURL(imageLists[i]);
      imageUrlLists.push(currentImageUrl);
    }
    if ([...reuploadImages, ...tmpArr].length + images.length < 5) {
      setReuploadImages([...reuploadImages, ...tmpArr]);
      setPreView(imageUrlLists);
    } else {
      setIsModal(true);
      setReuploadImages([...reuploadImages, ...tmpArr].slice(0, 5 - images.length));
      setPreView(imageUrlLists.slice(0, 5 - images.length));
    }
  };

  return (
    <div className="post">
      <div>
        <input
          type="text"
          name="title"
          autoComplete="off"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="postTitle"
          ref={inputRefTitle}
          autoFocus
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="postContents"
          ref={inputRefContent}
          style={{ height: "auto", overflowY: "hidden" }}
          rows="15"
        />
        <div className="postImages">
          {images !== undefined && images.every((i) => i !== null)
            ? images.map((i) => (
                <div className="postImages_wrap" key={i.id}>
                  <button onClick={() => setImages(images.filter((v) => i.id !== v.id))}>X</button>
                  <Image
                    src={`https://yeh-bucket.s3.ap-northeast-2.amazonaws.com/${i.imageName}`}
                    key={i.id}
                    fill
                    alt="게시글사진"
                  />
                </div>
              ))
            : null}
          {preView?.map((image, id) => (
            <div className="postImages_wrap" key={id}>
              <button onClick={() => setPreView(preView.filter((i) => i !== image))}>X</button>
              <Image src={image} fill alt="게시글사진" />
            </div>
          ))}
        </div>
        <form className="postFile">
          <label>
            <InboxOutlined className="postFile_Icon" />
            <p>이미지 첨부</p>
            <input type="file" accept="image/jpg,impge/png,image/jpeg,image/gif" onChange={handleOnChange} multiple />
          </label>
        </form>
        <div className="postBtn">
          <button className="cancle" onClick={() => router.push(`/post/read?id=${router.query.id}`)}>
            취소
          </button>
          <button onClick={() => handleOnSubmit()}>등록</button>
        </div>
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
          <p className="modal_content"> 첨부 이미지는 최대 5장까지 가능합니다.</p>
        </Modal>
      ) : null}
    </div>
  );
}
