import React, { Component } from "react";

import Draggable from "react-draggable";

class ProgressBar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dragging: false,
        };

        this.seekBar = null;
        this.seekCursor = null;
    }

    // Update trick to stop cursor disappearing on resize
    componentDidMount() {
        window.addEventListener("resize", () => {
            this.props.updatePercentDone(this.props.percentValue);
        });
    }

    componentWillUnmount() {
        window.addEventListener("resize", () => {
            this.props.updatePercentDone(this.props.percentValue);
        });
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.dragging) {
            return;
        }
        const seekBarWidth = this.seekBar.getBoundingClientRect().width;
        const fixedPercentage = nextProps.percentValue - 1;
        const fraction = nextProps.percentValue / 100;
        const position = fraction * seekBarWidth;

        this.seekCursor.style.transform = `translateX(${position - 9}px)`;
    }

    seekVideo = async e => {
        e = e || window.event;

        this.setState({ dragging: false });

        const pageX =
            e.type === "touchend" ? e.changedTouches[0].pageX : e.pageX;
        const pageY =
            e.type === "touchend" ? e.changedTouches[0].pageY : e.pageY;

        const seekBarPageOffset = this.seekBar.getBoundingClientRect().left;
        const seekBarWidth = this.seekBar.getBoundingClientRect().width;
        const diff = pageX - seekBarPageOffset;

        const percentage = Math.round(100 * diff / seekBarWidth);
        const fraction = percentage / 100;

        const videoDuration = await this.props.player.getDuration();
        const targetSeconds = Math.floor(fraction * videoDuration);

        await this.props.player.seekTo(targetSeconds);

        this.props.updatePercentDone(percentage);
    };

    onDragStart = () => this.setState({ dragging: true });

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
                    <Draggable
                        axis="x"
                        bounds="parent"
                        onStart={this.onDragStart}
                        onStop={this.seekVideo}
                    >
                        <div
                            className="PlayerProgressCursor"
                            ref={this.refSeekCursor}
                        />
                    </Draggable>
                </div>
            </div>
        );
    }
}

export default ProgressBar;
