import { useState } from 'react';
import { FaCommentDots } from 'react-icons/fa';
import CreateTime from '../../component/utils/createTime';

export default function Comments(props) {
    const Comments = props.comments.comments
    const [active, setActive] = useState(false)
    const handleOnComments = async(id) => {
        console.log(id)
        setActive(true);
    }
     return (
        <div className="postComments">
            {Comments !==null ? 
            <div className="postComments_wrap">
                {Comments?.map((v) => (
                    <div key={v.id}> 
                        <div className="beingComments">
                            <p className="writer">{v.writer}</p>
                            <p className="content">{v.content}</p>
                            <div className="beingCommentsInfo">
                                <p className="createTime">{CreateTime(v.createTime)}</p>
                                <p className="createTime"> · </p>
                                <button className="nestedComments_button" onClick={() => handleOnComments(v.id)}>답글달기</button>
                            </div>
                            {active ? 
                                <>
                                    <span>{v.writer}</span>
                                    <input className="nestedComments_input" autoFocus/>
                                </>
                            : null}
                        </div>
                        <div>
                            {v.children?.map((i) => (
                                <div className="nestedComments" key={i.id}>
                                    <div className="beingCommentsInfo">
                                        <p className="writer">{i.writer}</p>
                                        <p className="createTime">{CreateTime(i.createTime)}</p>
                                    </div>
                                    <p className="content">{i.content}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div> :
            <div className="notComments">
                <FaCommentDots className="notCommentsIcon"/>
                <p>첫 댓글을 남겨주세요.</p>
            </div>
            }
        </div>
    )
}