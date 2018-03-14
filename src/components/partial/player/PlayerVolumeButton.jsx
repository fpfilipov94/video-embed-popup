import React, { PureComponent } from "react";

import VolumeOnIcon from "../icons/VolumeOnIcon";
import VolumeOffIcon from "../icons/VolumeOffIcon";

import deviceIsMobile from "../../../helpers/deviceIsMobile";

class PlayerVolumeButton extends PureComponent {
    // Slider should always be visible on mobile (no mouse to trigger hover)
    state = { sliderVisible: deviceIsMobile() };

    // Cache bool whether we're on mobile
    onMobile = deviceIsMobile();

    volumeControlEl = null;
    volumeLevelEl = null;

    handleInput = (e = window.event) =>
        this.props.updateVolume(Number.parseInt(e.target.value, 10));

    showSlider = () => this.setState({ sliderVisible: true });

    hideSlider = () => this.setState({ sliderVisible: this.onMobile });

    refVolumeControlEl = el => (this.volumeControlEl = el);

    refVolumeLevelEl = el => (this.volumeLevelEl = el);

    render() {
        const controlStyle = {
            display: this.state.sliderVisible ? "block" : "none",
        };
        // Use an adjusted percent value for the element
        const fixedPercent = this.props.volume + 5;
        const volumeLevelStyle = { height: fixedPercent + "%" };
        return (
            <div
                className="PlayerControlsButton PlayerVolume"
                onMouseEnter={this.showSlider}
                onMouseLeave={this.hideSlider}
            >
                <button onClick={this.props.toggleVolume}>
                    {this.props.volume > 0 ? (
                        <VolumeOnIcon />
                    ) : (
                        <VolumeOffIcon />
                    )}
                </button>
                <div className="PlayerVolumeControl" style={controlStyle}>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        orient="vertical"
                        onChange={this.handleInput}
                        value={this.props.volume}
                    />
                    <div className="VolumeSliderWrapper">
                        <div className="VolumeSlider">
                            <div
                                className="VolumeLevel"
                                style={volumeLevelStyle}
                            >
                                <div className="VolumeLevelCursor" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default PlayerVolumeButton;
