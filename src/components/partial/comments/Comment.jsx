import React from "react";

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
            <div className="CommentText">TEXT GOES ERE</div>
            <div className="CommentActions">
                <div className="CommentActionsSocial">
                    <button>LIKE</button>
                    <button>SHARE</button>
                    <button>COMMENT</button>
                </div>
                <div className="CommentActionsReport">
                    <button>REPORT</button>
                </div>
            </div>
        </section>
    </li>
);
