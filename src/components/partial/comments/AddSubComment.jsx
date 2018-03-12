import React, { Component } from "react";

import AddComment from "./AddComment";

class AddSubComment extends Component {
    render() {
        return (
            <div className="AddSubComment">
                <div className="AddSubCommentTypes">
                    <button className="selected">COMMENT</button>
                    <button>PHOTO</button>
                    <button>FEEDBACK</button>
                </div>
                <AddComment />
            </div>
        );
    }
}

export default AddSubComment;
