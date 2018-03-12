import React from "react";
import { connect } from "react-redux";

import Comment from "./Comment";

const mapStateToProps = state => ({
    comments: state.comments,
});

const CommentList = connect(mapStateToProps)(
    props =>
        props.comments.length === 0 ? (
            <div className="NoComments">No comments yet!</div>
        ) : (
            <ul className="CommentList">
                {props.comments.map(c => <Comment comment={c} key={c.id} />)}
            </ul>
        )
);

export default CommentList;
