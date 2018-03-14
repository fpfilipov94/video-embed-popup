import React, { PureComponent } from "react";
import { connect } from "react-redux";

import { setVideoId } from "../../store/actions/index";

class VideoInput extends PureComponent {
    handleInput = (event = window.event) => {
        const validFullUrl = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com)\/watch\?v=(.+)$/;
        const validShortUrl = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.?be)\/(.+)$/;

        const videoUrl = event.target.value;

        if (validFullUrl.test(videoUrl)) {
            const result = validFullUrl.exec(videoUrl);

            const videoId = result[1].split("&")[0];

            if (videoId.length !== 11) {
                return;
            }
            this.props.dispatch(setVideoId(videoId));
        } else if (validShortUrl.test(videoUrl)) {
            const result = validShortUrl.exec(videoUrl);

            const videoId =
                result[1].indexOf("?") >= 0
                    ? result[1].substring(0, result[1].indexOf("?"))
                    : result[1];

            if (videoId.length !== 11) {
                return;
            }
            this.props.dispatch(setVideoId(videoId));
        }
    };

    render() {
        return (
            <div className="VideoInput">
                <input
                    type="text"
                    placeholder="Paste YouTube URL..."
                    onChange={this.handleInput}
                />
            </div>
        );
    }
}

VideoInput = connect()(VideoInput);

export default VideoInput;
