import React, { Component } from "react";
import { connect } from "react-redux";

import YouTubePlayer from "youtube-player";

import { setVideoId } from "../../../store/actions/index";

import PlayIcon from "../icons/PlayIcon";
import PauseIcon from "../icons/PauseIcon";
import VolumeOnIcon from "../icons/VolumeOnIcon";
import VolumeOffIcon from "../icons/VolumeOffIcon";

import PlayerProgressBar from "./PlayerProgressBar";

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
            resizing: false,
        };

        this.wrapper = null;
        this.container = null;
        this.player = null;
        this.playerControls = null;
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
        this.player.on("ready", e => {
            this.props.dispatch(setVideoId(this.props.videoId));
            this.player.stopVideo();
            this.player.getIframe().then(el => {
                // el.classList.add("PlayerGuard");
            });
            this.adjustPlayerSize();
        });
        this.player.on("stateChange", e => {
            // https://developers.google.com/youtube/iframe_api_reference#Playback_status
            switch (e.data) {
                case 1:
                    this.setState({ playing: true });
                    // Update the progress bar ASAP
                    this.calculatePercentDone().then(done =>
                        this.setState({ percentDone: done })
                    );
                    // Set an interval to auto-update the progress bar
                    this.setState({
                        timeInterval: setInterval(async () => {
                            this.setState({
                                percentDone: await this.calculatePercentDone(),
                            });
                        }, 1000),
                    });
                    break;
                default:
                    // Clear the interval and its in-state reference
                    clearInterval(this.state.timeInterval);
                    this.setState({ playing: false, timeInterval: null });
            }
        });
    };

    updatePercentDone = val => this.setState({ percentDone: val });

    togglePlayBack = async e => {
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

    toggleSound = async e => {
        const muted = await this.player.isMuted();

        if (muted) {
            this.setState({
                volume: 100,
            });
            this.player.unMute();
        } else {
            this.setState({
                volume: 0,
            });
            this.player.mute();
        }
    };

    calculatePercentDone = async () => {
        const done = await this.player.getCurrentTime();
        const total = await this.player.getDuration();
        const fraction = done / total;
        return Math.ceil(fraction * 100);
    };

    showControls = async () => {
        const playerState = await this.player.getPlayerState();
        const allowed = playerState === 1 || playerState === 2;

        this.setState({ controlsVisible: allowed });
        this.playerControls.classList.add("FadeAnimation");
    };

    hideControls = () => {
        this.setState({ controlsVisible: false });
    };

    refContainer = container => (this.container = container);

    refWrapper = wrapper => (this.wrapper = wrapper);

    refPlayerControls = el => (this.playerControls = el);

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
                <section
                    className="PlayerControls"
                    ref={this.refPlayerControls}
                    style={{
                        display: this.state.controlsVisible ? "flex" : "none",
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
                        percentValue={this.state.percentDone}
                        updatePercentDone={this.updatePercentDone}
                    />
                </section>
            </span>
        );
    }
}

Player = connect()(Player);

export default Player;
