import React, { Component } from "react";

import Player from "../partial/player/Player";
import VideoButtons from "../partial/video/VideoButtons";
import AddComment from "../partial/comments/AddComment";
import CommentList from "../partial/comments/CommentList";

const Video = props => (
    <div className="Video">
        <div className="PlayerUIContainer">
            <Player videoId={props.match.params.id} />
            <VideoButtons />
            <AddComment target="all" />
        </div>
        <CommentList />
    </div>
);

export default Video;
