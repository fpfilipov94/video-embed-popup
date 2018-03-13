import React, { Component } from "react";

import LikeIcon from "../icons/LikeIcon";
import ShareIcon from "../icons/ShareIcon";
import CommentIcon from "../icons/CommentIcon";
import FlagIcon from "../icons/FlagIcon";

import AddSubComment from "./AddSubComment";

import dateFormatter from "../../../helpers/dateFormatter";

class Comment extends Component {
    constructor(props) {
        super(props);

        this.state = { addSubCommentVisible: false };
    }

    showAddSubComment = () => {
        this.setState({ addSubCommentVisible: true });
    };

    // Abstract the render logic away here for reuse as a subcomment
    renderComment = (comment, isMain) => {
        return (
            <li className="CommentContainer" key={comment.id}>
                <section className="CommentInfo">
                    <div className="CommentUserAvatar">
                        <img src={comment.user.avatar} alt="" />
                    </div>
                    <div className="CommentUserInfo">
                        <p className="CommentUserName">
                            {comment.user.fullName}
                        </p>
                        <p className="CommentUserPostDate">
                            {dateFormatter(comment.date)}
                        </p>
                    </div>
                </section>
                <section className="CommentBody">
                    <div className="CommentText">{comment.text}</div>
                    <div className="CommentActions">
                        <div className="CommentActionsSocial">
                            <button className="CommentActionsLike">
                                <LikeIcon />
                                LIKE
                            </button>
                            <button className="CommentActionsShare">
                                <ShareIcon />
                                SHARE
                            </button>
                            {isMain && (
                                <button
                                    className="CommentActionsComment"
                                    onClick={this.showAddSubComment}
                                >
                                    <CommentIcon />
                                    COMMENT
                                </button>
                            )}
                        </div>
                        <div className="CommentActionsReport">
                            <button>
                                <FlagIcon />
                                REPORT
                            </button>
                        </div>
                    </div>
                </section>
                <section className="CommentSubComments">
                    {isMain &&
                        comment.subComments.list.map(sc =>
                            this.renderComment(sc, false)
                        )}
                    {isMain &&
                        this.state.addSubCommentVisible && (
                            <AddSubComment target={comment.id} />
                        )}
                </section>
            </li>
        );
    };

    render() {
        return this.renderComment(this.props.comment, true);
    }
}

export default Comment;
