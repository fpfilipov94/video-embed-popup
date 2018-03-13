import React, { Component } from "react";

import YouTubePlayer from "youtube-player";

import PlayIcon from "../icons/PlayIcon";
import PauseIcon from "../icons/PauseIcon";
import VolumeOnIcon from "../icons/VolumeOnIcon";
import VolumeOffIcon from "../icons/VolumeOffIcon";

import PlayerProgressBar from "./PlayerProgressBar";

import timeFormatter from "../../../helpers/timeFormatter";

/*
    It's not feasible to split this component into smaller pieces
    All the logic needs to be centralized here for proper control
*/

class Player extends Component {
    constructor(props) {
        super(props);

        this.state = {
            controlsVisible: false,
            playing: false,
            volume: 100,
            timeInterval: null,
            percentDone: 0,
            videoTimeLeft: null,
            videoDuration: null,
        };

        this.wrapper = null;
        this.container = null;
        this.player = null;
        this.playerControls = null;
        this.timer = null;
    }

    componentDidMount() {
        // Adjust the wrapper size
        this.adjustWrapperSize();
        // Hide the controls and timer
        this.playerControls.style.height = "0";
        this.timer.style.display = "none";
        // Initialize the player into its container
        this.createPlayer();
    }

    componentWillUnmount() {
        // Destroy the player instance linked to the container
        this.player.destroy();
    }

    adjustWrapperSize = () => {
        // Use the aspect ratio that applies to modern content
        const aspectRatio = 9 / 16;
        // Use the wrapper width to calculate its desired height
        const wrapperWidth = this.wrapper.getBoundingClientRect().width;
        const properHeight = wrapperWidth * aspectRatio;
        // Set the height in wrapper's style
        this.wrapper.style.height = `${properHeight}px`;
    };

    adjustPlayerSize = async () => {
        // Grab the iframe
        const frame = await this.player.getIframe();
        // Fix the frame's position (the style gets overriden on init)
        frame.style.margin = "0 auto";
        // Add a transition
        frame.style.transition = "height 200ms ease-in-out";
        // Hard code the aspect ratio
        const aspectRatio = 9 / 16;
        // Calculate the desired height
        const wrapperWidth = this.wrapper.getBoundingClientRect().width;
        const properHeight = wrapperWidth * aspectRatio;
        // Fit the iframe properly into the wrapper
        frame.setAttribute("width", wrapperWidth);
        frame.setAttribute("height", properHeight);
    };

    createPlayer = () => {
        this.player = YouTubePlayer(this.container, {
            videoId: this.props.videoId,
            playerVars: {
                border: 0,
                fs: 0,
                modestbranding: 1,
                showinfo: 0,
                controls: 0,
                rel: 0,
                playsinline: 1,
                cc_load_policy: 0,
                iv_load_policy: 0,
            },
        });
        this.bindPlayerEvents();
    };

    bindPlayerEvents = () => {
        this.player.on("ready", async e => {
            // Prevent unpredictable autoplaying
            this.player.stopVideo();
            // Fix the iframe size
            this.adjustPlayerSize();
            // Show the wrapper
            this.wrapper.style.opacity = "1";
            // Cache the video duration and set time left
            const videoDuration = await this.player.getDuration();
            this.setState({
                videoDuration,
                videoTimeLeft: timeFormatter(videoDuration),
            });
        });

        this.player.on("stateChange", e => {
            // https://developers.google.com/youtube/iframe_api_reference#Playback_status
            switch (e.data) {
                case -1:
                case 0:
                case 3:
                    // Clear the update interval and its in-state reference
                    clearInterval(this.state.timeInterval);
                    this.setState({ playing: false });
                    break;
                case 1:
                    // Show the controls and timer
                    this.playerControls.style.height = "30%";
                    this.timer.style.display = "block";
                    this.setState({ playing: true });
                    // Update the progress bar ASAP
                    this.calculatePercentDone().then(done =>
                        this.setState({ percentDone: done })
                    );
                    // Set an interval to auto-update the progress bar
                    this.setState({
                        timeInterval: setInterval(async () => {
                            const currentTime = await this.player.getCurrentTime();
                            this.setState({
                                percentDone: await this.calculatePercentDone(),
                                videoTimeLeft: timeFormatter(
                                    this.state.videoDuration - currentTime
                                ),
                            });
                        }, 1000),
                    });
                    break;
                default:
                    // Hide controls to prevent accidental clicking
                    this.playerControls.style.height = "0";
                    // Hide the timer
                    this.timer.style.display = "none";
                    // Clear the update interval
                    clearInterval(this.state.timeInterval);
                    this.setState({ playing: false });
            }
        });
    };

    updatePercentDone = val => this.setState({ percentDone: val });

    updateTimeLeft = async val =>
        this.setState({
            videoTimeLeft: timeFormatter(this.state.videoDuration - val),
        });

    togglePlayBack = async (e = window.event) => {
        const playerState = await this.player.getPlayerState();

        // https://developers.google.com/youtube/iframe_api_reference#Playback_status
        switch (playerState) {
            case -1:
            case 0:
            case 2:
            case 5:
                this.player.playVideo();
                this.setState({ controlsVisible: true });
                break;
            default:
                this.player.pauseVideo();
        }
    };

    toggleSound = async (e = window.event) => {
        const muted = await this.player.isMuted();

        if (muted) {
            this.setState({ volume: 100 });
            this.player.unMute();
        } else {
            this.setState({ volume: 0 });
            this.player.mute();
        }
    };

    calculatePercentDone = async () => {
        const done = await this.player.getCurrentTime();
        const total = await this.player.getDuration();
        const fraction = done / total;
        return Math.ceil(fraction * 100);
    };

    showControls = () => this.setState({ controlsVisible: true });

    hideControls = () => this.setState({ controlsVisible: false });

    refContainer = container => (this.container = container);

    refWrapper = wrapper => (this.wrapper = wrapper);

    refPlayerControls = el => (this.playerControls = el);

    refTimer = el => (this.timer = el);

    render() {
        return (
            <span
                className="Player"
                ref={this.refWrapper}
                onMouseEnter={this.showControls}
                onMouseLeave={this.hideControls}
                onFocus={this.showControls}
                onBlur={this.hideControls}
            >
                <div className="PlayerGuard" onClick={this.togglePlayBack}>
                    <div ref={this.refContainer} />
                </div>
                <div
                    className="PlayerTimeLeft"
                    ref={this.refTimer}
                    style={{
                        opacity: this.state.controlsVisible ? "1" : "0",
                    }}
                >
                    -{this.state.videoTimeLeft}
                </div>
                <section
                    className="PlayerControls"
                    ref={this.refPlayerControls}
                    style={{
                        opacity: this.state.controlsVisible ? "1" : "0",
                    }}
                >
                    <button
                        className="PlayerButton"
                        onClick={this.togglePlayBack}
                    >
                        {this.state.playing ? <PauseIcon /> : <PlayIcon />}
                    </button>
                    <button className="PlayerVolume" onClick={this.toggleSound}>
                        {this.state.volume > 0 ? (
                            <VolumeOnIcon />
                        ) : (
                            <VolumeOffIcon />
                        )}
                    </button>
                    <PlayerProgressBar
                        player={this.player}
                        playing={this.state.playing}
                        videoDuration={this.state.videoDuration}
                        percentValue={this.state.percentDone}
                        updatePercentDone={this.updatePercentDone}
                        updateTimeLeft={this.updateTimeLeft}
                    />
                </section>
            </span>
        );
    }
}

export default Player;
