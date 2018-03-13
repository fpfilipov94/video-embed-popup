import React from "react";

import Player from "../partial/player/Player";
import VideoButtons from "../partial/video/VideoButtons";
import AddComment from "../partial/comments/AddComment";
import CommentList from "../partial/comments/CommentList";

const Video = ({ videoId }) => (
    <div className="MainContainer">
        <div className="Video">
            <div className="PlayerUIContainer">
                <Player videoId={videoId} />
                <VideoButtons />
                <AddComment target="all" placeholder="Comment..." />
            </div>
            <CommentList />
        </div>
    </div>
);

export default Video;
