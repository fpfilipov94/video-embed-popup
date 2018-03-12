import React, { Component } from "react";
import { connect } from "react-redux";

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
            // Prevent adding an empty line
            e.preventDefault();

            // Save the comment here and clear the textarea
            // const retrievedText = this.state.commentText;
            this.setState({ commentText: "" });

            // Shrink the textarea back to normal
            this.textarea.style.height = "auto";
            console.log("submitted!");
        }
    };

    refTextArea = el => (this.textarea = el);

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

AddComment = connect()(AddComment);

export default AddComment;
