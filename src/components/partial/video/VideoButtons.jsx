import React from "react";

import LikeIcon from "../icons/LikeIcon";
import ShareIcon from "../icons/ShareIcon";

export default () => (
    <div className="VideoButtons">
        <div className="VideoActionsButtonGroup">
            <button className="VideoActionsButtonEdit">EDIT</button>
            <button className="VideoActionsButtonDelete">DELETE</button>
        </div>
        <div className="VideoSocialButtonGroup">
            <button className="VideoSocialButtonLike">
                <LikeIcon />
                LIKE
            </button>
            <button className="VideoSocialButtonShare">
                <ShareIcon />
                SHARE
            </button>
        </div>
    </div>
);
