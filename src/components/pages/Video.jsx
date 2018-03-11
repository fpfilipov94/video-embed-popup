import React, { Component } from "react";

import Player from "../partial/player/Player";
import VideoButtons from "../partial/video/VideoButtons";
import AddComment from "../partial/comments/AddComment";
import CommentList from "../partial/comments/CommentList";

export default class Video extends Component {
    render() {
        return (
            <div className="Video">
                <Player videoId={this.props.match.params.id} />
                <VideoButtons />
                <AddComment />
                <CommentList />
            </div>
        );
    }
}
