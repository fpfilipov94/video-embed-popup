import React, { Component } from "react";
import { connect } from "react-redux";

import YouTubePlayer from "youtube-player";

import { setVideoId } from "../../../store/actions/index";

import PlayIcon from "../icons/PlayIcon";
import PauseIcon from "../icons/PauseIcon";
import VolumeOnIcon from "../icons/VolumeOnIcon";
import VolumeOffIcon from "../icons/VolumeOffIcon";

import PlayerProgressBar from "./PlayerProgressBar";

import Fade from "../transitions/SlideUp";

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

        frame.style.margin = "0 auto";

        if (!this.state.aspectRatio) {
            this.setState({
                aspectRatio:
                    frame.getAttribute("height") / frame.getAttribute("width"),
            });
        }

        const aspectRatio = this.state.aspectRatio;

        const wrapperWidth = this.wrapper.getBoundingClientRect().width;
        const properHeight = wrapperWidth * aspectRatio;

        frame.setAttribute("width", wrapperWidth);
        frame.setAttribute("height", properHeight);

        this.wrapper.style.height = `${properHeight}px`;

        // Set iframe to resize on every window resize
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
            },
        });
        this.bindPlayerEvents();
    };

    bindPlayerEvents = () => {
        this.player.on("ready", e => {
            this.props.dispatch(setVideoId(this.props.videoId));
            this.player.stopVideo();
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

    showControls = () => this.setState({ controlsVisible: true });

    hideControls = () => this.setState({ controlsVisible: false });

    refContainer = container => (this.container = container);

    refWrapper = wrapper => (this.wrapper = wrapper);

    render() {
        return (
            <span
                className="Player"
                ref={this.refWrapper}
                onMouseEnter={this.showControls}
                onMouseLeave={this.hideControls}
            >
                <div ref={this.refContainer} />
                <div className="PlayerGuard" />
                <Fade
                    in={this.state.controlsVisible}
                    className="PlayerControls"
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
                        percentValue={this.state.percentDone}
                        updatePercentDone={this.updatePercentDone}
                    />
                </Fade>
            </span>
        );
    }
}

Player = connect()(Player);

export default Player;
