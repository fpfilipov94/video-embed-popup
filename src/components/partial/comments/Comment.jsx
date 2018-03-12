import React from "react";

import LikeIcon from "../icons/LikeIcon";
import ShareIcon from "../icons/ShareIcon";
import CommentIcon from "../icons/CommentIcon";
import FlagIcon from "../icons/FlagIcon";

import AddSubComment from "./AddSubComment";

export default () => (
    <li className="CommentContainer">
        <section className="CommentInfo">
            <div className="CommentUserAvatar">MEH</div>
            <div className="CommentUserInfo">
                <p className="CommentUserName">Some Weird Rascal</p>
                <p className="CommentUserPostDate">MARCH 7, 2013 AT 7:30 PM</p>
            </div>
        </section>
        <section className="CommentBody">
            <div className="CommentText">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Suspendisse varius commodo dui, vel commodo nisi ultricies nec.
                Praesent sodales ligula et eros lacinia ultricies. Etiam at
                laoreet nibh. Suspendisse facilisis risus purus. In malesuada
                libero quam. Integer a finibus ligula. Vestibulum condimentum at
                ligula et pretium. Ut ut eleifend dui, eu condimentum quam.
                Donec blandit hendrerit eros, id dignissim nulla maximus id.
            </div>
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
