import React, { Component } from "react";

class AddComment extends Component {
    constructor(props) {
        super(props);

        this.state = {
            commentText: "",
        };

        this.textarea = null;
    }

    resizeTextArea = () => {
        this.textarea.style.height = "auto";
        this.textarea.style.height = `${this.textarea.scrollHeight}px`;
    };

    handleInput = e => {
        this.resizeTextArea();
        this.setState({
            commentText: e.target.value,
        });
    };

    handleSubmit = e => {
        if (!e.shiftKey && e.which === 13) {
            console.log("submitted!");
        }
    };

    refTextArea = el => {
        this.textarea = el;
    };

    render() {
        return (
            <div className="AddComment">
                <textarea
                    rows="1"
                    placeholder="comment..."
                    ref={this.refTextArea}
                    onChange={this.handleInput}
                    value={this.state.commentText}
                    onKeyDown={this.handleSubmit}
                />
            </div>
        );
    }
}

export default AddComment;
