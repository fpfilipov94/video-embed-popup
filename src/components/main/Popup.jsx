import React from "react";
import { connect } from "react-redux";

import VideoInput from "./VideoInput";
import Video from "./Video";

import CloseIcon from "../partial/icons/CloseIcon";

import { Link } from "react-router-dom";

const mapStateToProps = state => ({
    videoId: state.videoId,
});

const Popup = connect(mapStateToProps)(({ videoId }) => (
    <div className="MainContainer">
        <Link to="/" className="CloseLink">
            <CloseIcon />
        </Link>
        {videoId ? <Video videoId={videoId} /> : <VideoInput />}
    </div>
));

export default Popup;
