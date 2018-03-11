import React, { Component } from "react";

class ProgressBar extends Component {
    constructor(props) {
        super(props);

        this.seekBar = null;
    }

    seekVideo = async e => {
        const seekBarPageOffset = this.seekBar.getBoundingClientRect().left;
        const seekBarWidth = this.seekBar.getBoundingClientRect().width;
        const diff = e.pageX - seekBarPageOffset;

        const percentage = Math.round(100 * diff / seekBarWidth);
        const fraction = percentage / 100;

        const videoDuration = await this.props.player.getDuration();
        const targetSeconds = Math.floor(fraction * videoDuration);

        await this.props.player.seekTo(targetSeconds);
        this.props.updatePercentDone(percentage);
        this.props.player.playVideo();
    };

    refSeekBar = seekBar => {
        this.seekBar = seekBar;
    };

    render() {
        return (
            <div className="PlayerProgress">
                <div
                    className="PlayerProgressBar"
                    onClick={this.seekVideo}
                    ref={this.refSeekBar}
                >
                    <div
                        className="PlayerProgressDone"
                        style={{
                            width: this.props.percentValue + "%",
                        }}
                    />
                </div>
            </div>
        );
    }
}

export default ProgressBar;
