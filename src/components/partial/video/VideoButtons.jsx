import React from "react";

import { connect } from "react-redux";
import { removeVideoId } from "../../../store/actions/index";

import LikeIcon from "../icons/LikeIcon";
import ShareIcon from "../icons/ShareIcon";

const VideoButtons = ({ deleteVideo }) => (
    <div className="VideoButtons">
        <div className="VideoActionsButtonGroup">
            <button className="VideoActionsButtonEdit">EDIT</button>
            <button className="VideoActionsButtonDelete" onClick={deleteVideo}>
                DELETE
            </button>
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

const mapDispatchToProps = {
    deleteVideo: removeVideoId,
};

export default connect(() => ({}), mapDispatchToProps)(VideoButtons);
