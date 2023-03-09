import { useEffect, useState } from "react"
import { FaCommentDots } from 'react-icons/fa';

export default function Comments(props) {
    const Comments = props.Comments

    return (
        <div className="postComments">
            <div className="notComments">
                <FaCommentDots className="notCommentsIcon"/>
                <p>첫 댓글을 남겨주세요.</p>
            </div>
            <input placeholder="따뜻한 답변은 작성자에게 큰 힘이 됩니다 =)"/>
        </div>
    )
}