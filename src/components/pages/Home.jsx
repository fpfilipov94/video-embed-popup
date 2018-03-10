import React, { Component } from "react";
import { Redirect } from "react-router";

export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            goToVideo: false,
            videoId: "",
        };
        this.handleInput = this.handleInput.bind(this);
    }

    handleInput(event) {
        const validFullUrl = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com)\/watch\?v=(.+)$/;
        const validShortUrl = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.?be)\/(.+)$/;

        const videoUrl = event.target.value;

        if (validFullUrl.test(videoUrl)) {
            const result = validFullUrl.exec(videoUrl);

            const videoId = result[1].split("&")[0];
            // console.log(videoId);

            this.setState({
                videoId,
                goToVideo: true,
            });
        } else if (validShortUrl.test(videoUrl)) {
            const result = validShortUrl.exec(videoUrl);

            const videoId = result[1].indexOf("?")
                ? result[1].substring(0, result[1].indexOf("?"))
                : result[1];
            // console.log(videoId);

            this.setState({
                videoId,
                goToVideo: true,
            });
        }
    }

    render() {
        const { goToVideo, videoId } = this.state;

        if (goToVideo === true) {
            const redirectPath = `/video/${encodeURIComponent(videoId)}`;

            return <Redirect to={redirectPath} />;
        }

        return (
            <div className="Home">
                <input
                    type="text"
                    placeholder="Paste YouTube URL..."
                    onChange={this.handleInput}
                />
            </div>
        );
    }
}
