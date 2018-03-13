import React from "react";

import AddComment from "./AddComment";

const AddSubComment = ({ target }) => (
    <div className="AddSubComment">
        <div className="AddSubCommentTypes">
            <button className="selected">COMMENT</button>
            <button>PHOTO</button>
            <button>FEEDBACK</button>
        </div>
        <AddComment target={target} />
    </div>
);

export default AddSubComment;
