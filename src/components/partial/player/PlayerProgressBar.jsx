import React, { Component } from "react";

import Draggable from "react-draggable";

class ProgressBar extends Component {
    constructor(props) {
        super(props);

        this.seekBar = null;
        this.seekCursor = null;
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
    };

    refSeekBar = el => (this.seekBar = el);

    refSeekCursor = el => (this.seekCursor = el);

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
                    <Draggable axis="x" onStop={this.seekVideo}>
                        <div
                            className="PlayerProgressCursor"
                            ref={this.refSeekCursor}
                            style={{
                                transform: `translateX(${this.props
                                    .percentValue - 1.5}%)`,
                            }}
                        />
                    </Draggable>
                </div>
            </div>
        );
    }
}

export default ProgressBar;
