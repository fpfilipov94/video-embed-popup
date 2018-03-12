import React from "react";

import LikeIcon from "../icons/LikeIcon";
import ShareIcon from "../icons/ShareIcon";
import CommentIcon from "../icons/CommentIcon";
import FlagIcon from "../icons/FlagIcon";

import AddSubComment from "./AddSubComment";

import dateFormatter from "../../../helpers/dateFormatter";

export default ({ comment }) => (
    <li className="CommentContainer">
        <section className="CommentInfo">
            <div className="CommentUserAvatar">
                <img src={comment.user.avatar} alt="" />
            </div>
            <div className="CommentUserInfo">
                <p className="CommentUserName">{comment.user.fullName}</p>
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
                    <button className="CommentActionsComment">
                        <CommentIcon />
                        COMMENT
                    </button>
                </div>
                <div className="CommentActionsReport">
                    <button>
                        <FlagIcon />
                        REPORT
                    </button>
                </div>
            </div>
        </section>
        <AddSubComment />
    </li>
);
