import React, { PureComponent } from "react";

import VolumeOnIcon from "../icons/VolumeOnIcon";
import VolumeOffIcon from "../icons/VolumeOffIcon";

import deviceIsMobile from "../../../helpers/deviceIsMobile";
import browserIsFirefox from "../../../helpers/browserIsFirefox";

class PlayerVolumeButton extends PureComponent {
    // Slider should always be visible on mobile (no mouse to trigger hover)
    state = { sliderVisible: deviceIsMobile() };

    // Cache bool whether we're on mobile
    onMobile = deviceIsMobile();
    inFirefox = browserIsFirefox();

    volumeControlEl = null;
    volumeLevelEl = null;

    handleInput = (e = window.event) => {
        // Disable slider on Firefox (doesn't work - can't figure out why)
        if (this.inFirefox) {
            return;
        }
        // Fix the operation glitch
        const percent = Number.parseInt(e.target.value, 10);
        // Update player volume
        this.props.updateVolume(percent);
    };

    showSlider = () => this.setState({ sliderVisible: true });

    hideSlider = () => this.setState({ sliderVisible: this.onMobile });

    refVolumeControlEl = el => (this.volumeControlEl = el);

    refVolumeLevelEl = el => (this.volumeLevelEl = el);

    render() {
        // Disable slider on Firefox (doesn't work - can't figure out why)
        if (this.inFirefox) {
            return (
                <div className="PlayerControlsButton PlayerVolume">
                    <button onClick={this.props.toggleVolume}>
                        {this.props.volume > 0 ? (
                            <VolumeOnIcon />
                        ) : (
                            <VolumeOffIcon />
                        )}
                    </button>
                </div>
            );
        }
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
