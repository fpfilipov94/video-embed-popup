import React, { Component } from "react";

import Player from "../partial/Player";

export default class Video extends Component {
    render() {
        return (
            <div className="Video">
                <Player videoId={this.props.match.params.id} />
            </div>
        );
    }
}
