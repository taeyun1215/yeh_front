import { Skeleton } from "antd";
import { useState } from "react";
import { FaCommentDots, FaPen } from "react-icons/fa";
import CreateTime from "../../component/utils/createTime";
import { postNestedComment } from "../api";

export default function Comments({ comments, getPostView, loading }) {
  const Comments = comments.comments;
  const formData = new FormData();
  const [id, setId] = useState("");
  const [value, setValue] = useState("");
  const [active, setActive] = useState(false);

  const handleOnComments = async (id) => {
    setId(id);
    setActive(true);
  };

  const handleOnKeyUp = (e) => {
    if (e.keyCode === 13) insertNestedComments();
    else return;
  };

  const insertNestedComments = async () => {
    if (value.trim() !== "") {
      formData.append("content", value);
      try {
        const res = await postNestedComment(comments.id, id, formData);
        if (res.data.success) {
          getPostView();
          setValue("");
          setActive(false);
        } else alert("잠시 후 다시 시도해 주세요");
      } catch (e) {
        console.log(e);
        alert("잠시 후 다시 시도해 주세요");
      }
    } else alert("댓글을 입력해주세요.");
  };

  return (
    <div className="postComments">
      {Comments !== null ? (
        <div className="postComments_wrap">
          {Comments?.map((v) => (
            <div key={v.id}>
              {loading ? (
                <Skeleton.Input active block key={v.id} />
              ) : (
                <div className="beingComments">
                  <p className="writer">{v.writer}</p>
                  <p className="content">{v.content}</p>
                  <div className="beingCommentsInfo">
                    <p className="createTime">{CreateTime(v.createTime)}</p>
                    <p className="createTime"> · </p>
                    <button className="nestedComments_button" onClick={() => handleOnComments(v.id)}>
                      답글달기
                    </button>
                  </div>
                  {active ? (
                    <div id={v.id} className={v.id === id ? "nestedComments_active" : "nestedComments_notActive"}>
                      <span>@{v.writer}</span>
                      <input
                        autoComplete="off"
                        id={v.id}
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        onKeyUp={(e) => handleOnKeyUp(e)}
                        autoFocus
                      />
                      <button onClick={() => insertNestedComments()}>
                        <FaPen />
                      </button>
                    </div>
                  ) : null}
                </div>
              )}

              {v.children?.map((i) =>
                loading ? (
                  <Skeleton.Input active block key={i} />
                ) : (
                  <div className="nestedComments" key={i.id}>
                    <div className="beingCommentsInfo">
                      <p className="writer">{i.writer}</p>
                      <p className="createTime">{CreateTime(i.createTime)}</p>
                    </div>
                    <p className="content">{i.content}</p>
                  </div>
                )
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="notComments">
          <FaCommentDots className="notCommentsIcon" />
          <p>첫 댓글을 남겨주세요.</p>
        </div>
      )}
    </div>
  );
}
