import React, { Component } from "react";

class ProgressBar extends Component {
    progressDone = null;

    async componentWillReceiveProps(nextProps) {
        // Increment the value for better cursor positioning
        const adjustedPercent = nextProps.percentValue + 1;
        this.progressDone.style.width = adjustedPercent + "%";
    }

    handleInput = (e = window.event) => {
        // Parse the value with parseInt()
        // Fixes a bug when using it for calculations
        const fixedPercentValue = Number.parseInt(e.target.value, 10);
        const fraction = fixedPercentValue / 100;

        const targetSeconds = fraction * this.props.videoDuration;

        this.props.player.seekTo(targetSeconds);
        this.props.updatePercentDone(fixedPercentValue);
        this.props.updateTimeLeft(targetSeconds);
    };

    refProgressDone = el => (this.progressDone = el);

    /*
        A hidden range input works best for the progress bar
        Using the progress bar element itself for input is glitchy
    */
    render() {
        return (
            <div className="PlayerProgress">
                <div className="ProgressWrapper">
                    <div className="ProgressInnerWrapper">
                        <input
                            type="range"
                            min="0"
                            max="100"
                            onInput={this.handleInput}
                            value={this.props.percentValue}
                        />
                        <div className="PlayerProgressBar">
                            <div
                                className="PlayerProgressDone"
                                ref={this.refProgressDone}
                            >
                                <div className="PlayerProgressCursor" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ProgressBar;
