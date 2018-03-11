import React, { Component } from "react";

import Comment from "./Comment";

class CommentList extends Component {
    render() {
        return (
            <ul>
                <li>
                    <Comment />
                </li>
            </ul>
        );
    }
}

export default CommentList;
