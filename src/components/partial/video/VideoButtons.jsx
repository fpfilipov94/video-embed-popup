import React from "react";

import LikeIcon from "../icons/LikeIcon";
import ShareIcon from "../icons/ShareIcon";

export default () => (
    <div className="VideoButtons">
        <div className="VideoSocialButtonGroup">
            <button>
                <LikeIcon />
                LIKE
            </button>
            <button>
                <ShareIcon />
                SHARE
            </button>
        </div>
        <div className="VideoActionsButtonGroup">
            <button className="VideoActionsButtonEdit">EDIT</button>
            <button className="VideoActionsButtonDelete">DELETE</button>
        </div>
    </div>
);
