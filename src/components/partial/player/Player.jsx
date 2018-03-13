import React, { Component } from "react";
import { connect } from "react-redux";

import YouTubePlayer from "youtube-player";

import { setVideoId } from "../../../store/actions/index";

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
            aspectRatio: null,
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
        this.createPlayer();
    }

    componentWillUnmount() {
        this.player.destroy();
    }

    adjustPlayerSize = async () => {
        /*
        Remove listener to avoid overcalling

        Comment this out and try resizing the window if you dare

        Even with it, continuous resizing will heat up your CPU
        because of the continuous calculations
        */
        window.removeEventListener("resize", this.adjustPlayerSize);

        const frame = await this.player.getIframe();

        // Fix the frame's position (the style gets overriden on init)
        frame.style.margin = "0 auto";

        // Cache the initial aspect ratio in state
        if (!this.state.aspectRatio) {
            this.setState({
                aspectRatio:
                    frame.getAttribute("height") / frame.getAttribute("width"),
            });
        }

        const wrapperWidth = this.wrapper.getBoundingClientRect().width;
        const properHeight = wrapperWidth * this.state.aspectRatio;

        frame.setAttribute("width", wrapperWidth);
        frame.setAttribute("height", properHeight);

        this.wrapper.style.height = `${properHeight}px`;

        // Set iframe to resize on window resize
        window.addEventListener("resize", this.adjustPlayerSize);
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
            // Save the video id in the store
            this.props.dispatch(setVideoId(this.props.videoId));
            // Prevent unpredictable autoplaying
            this.player.stopVideo();
            // Fix the player size by aspect ratio
            this.adjustPlayerSize();
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

    updateTimeLeft = async val => {
        // const currentTime = await this.player.getCurrentTime();
        this.setState({
            videoTimeLeft: timeFormatter(this.state.videoDuration - val),
        });
    };

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

Player = connect()(Player);

export default Player;
