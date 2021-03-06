import React, { PureComponent } from "react";
import { connect } from "react-redux";

import { addComment, addSubComment } from "../../../store/actions/index";

class AddComment extends PureComponent {
    state = { commentText: "" };

    textarea = null;

    resizeTextArea = () => {
        this.textarea.style.height = "auto";
        this.textarea.style.height = `${this.textarea.scrollHeight}px`;
    };

    handleInput = e => {
        this.resizeTextArea();
        this.setState({ commentText: e.target.value });
    };

    handleSubmit = e => {
        if (!e.shiftKey && e.which === 13) {
            // Prevent adding an empty line
            e.preventDefault();
            // Save the comment here and clear the textarea
            const retrievedText = this.state.commentText;
            this.setState({ commentText: "" });
            // Decide (by type) where to submit the comment
            if (this.props.target === "all") {
                // handle comments
                this.props.dispatch(addComment(retrievedText));
            } else {
                // handle subcomments for comments
                this.props.dispatch(
                    addSubComment(this.props.target, retrievedText)
                );
            }
            // Shrink the textarea back to normal
            this.textarea.style.height = "auto";
        }
    };

    refTextArea = el => (this.textarea = el);

    render() {
        return (
            <div className="AddComment">
                <textarea
                    rows="1"
                    placeholder={this.props.placeholder}
                    ref={this.refTextArea}
                    onChange={this.handleInput}
                    value={this.state.commentText}
                    onKeyDown={this.handleSubmit}
                />
            </div>
        );
    }
}

export default connect()(AddComment);
