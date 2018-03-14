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
    // Cache a static aspect ratio
    static aspectRatio = 9 / 16;

    state = {
        controlsVisible: false,
        playing: false,
        volume: 100,
        timeInterval: null,
        percentDone: 0,
        videoTimeLeft: null,
        videoDuration: null,
    };

    wrapperHeight = null;

    wrapper = null;
    container = null;
    player = null;
    playerControls = null;
    timer = null;

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
        // Clear resize listeners
        window.removeEventListener("resize", this.adjustWrapperSize);
        window.removeEventListener("resize", this.adjustIframeSize);
    }

    adjustWrapperSize = () => {
        // Remove listener to avoid overcalling
        window.removeEventListener("resize", this.adjustWrapperSize);
        // Use the wrapper width to calculate its desired height
        const wrapperWidth = this.wrapper.getBoundingClientRect().width;
        const properHeight = wrapperWidth * Player.aspectRatio;
        // Cache the height
        this.wrapperHeight = properHeight;
        // Set the height in wrapper's style
        this.wrapper.style.height = `${properHeight}px`;
        // Add resize listener
        window.addEventListener("resize", this.adjustWrapperSize);
    };

    // Call only after player ready and adjustWrapperSize() consecutively
    adjustIframeSize = async () => {
        // Remove resize listener to avoid overcalling
        window.removeEventListener("resize", this.adjustIframeSize);
        // Grab the iframe
        const frame = await this.player.getIframe();
        // Add a transition
        frame.style.transition = "height 200ms ease-in-out";
        // Set frame height to wrapper height
        frame.setAttribute("height", this.wrapperHeight);
        // Add resize listener
        window.addEventListener("resize", this.adjustIframeSize);
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
            // Adjust the iframe size
            this.adjustIframeSize();
            // Show the wrapper
            this.wrapper.style.opacity = "1";
            // Cache the video duration and set time left ASAP
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
                case 2:
                case 3:
                    // Clear the update interval
                    clearInterval(this.state.timeInterval);
                    // Update playing state
                    this.setState({ playing: false });
                    break;
                case 1:
                    // Show the controls and timer
                    this.playerControls.style.height = "30%";
                    this.timer.style.display = "block";
                    // Update playing state
                    this.setState({ playing: true });
                    // Update the progress bar ASAP
                    this.refreshPercentDone();
                    // Set an interval to auto-update the progress bar
                    this.setState({
                        timeInterval: setInterval(async () => {
                            this.refreshPercentDone();
                            this.refreshTimeDifference();
                        }, 1000),
                    });
                    break;
                default:
                    // Hide the controls and timer
                    this.playerControls.style.height = "0";
                    this.timer.style.display = "none";
                    // Clear the update interval
                    clearInterval(this.state.timeInterval);
                    // Update playing state
                    this.setState({ playing: false });
            }
        });
    };

    // Used to update percent from the progress bar
    updatePercentDone = val => this.setState({ percentDone: val });

    // Used to update time left from the progress bar
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

    refreshTimeDifference = async () => {
        const currentTime = await this.player.getCurrentTime();
        this.setState({
            videoTimeLeft: timeFormatter(
                this.state.videoDuration - currentTime
            ),
        });
    };

    refreshPercentDone = async () => {
        const currentTime = await this.player.getCurrentTime();
        const fraction = currentTime / this.state.videoDuration;
        this.setState({ percentDone: Math.ceil(fraction * 100) });
    };

    showControls = () => this.setState({ controlsVisible: true });

    hideControls = () => this.setState({ controlsVisible: false });

    refContainer = container => (this.container = container);

    refWrapper = wrapper => (this.wrapper = wrapper);

    refPlayerControls = el => (this.playerControls = el);

    refTimer = el => (this.timer = el);

    render() {
        const interfaceStyle = {
            opacity: this.state.controlsVisible ? "1" : "0",
        };
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
                    style={interfaceStyle}
                >
                    -{this.state.videoTimeLeft}
                </div>
                <section
                    className="PlayerControls"
                    ref={this.refPlayerControls}
                    style={interfaceStyle}
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
