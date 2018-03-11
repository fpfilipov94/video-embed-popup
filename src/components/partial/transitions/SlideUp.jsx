import React from "react";
import Transition from "react-transition-group/Transition";

const duration = 100;

const defaultStyle = {
    transition: `opacity ${duration}ms ease-in-out`,
    opacity: "0",
};

const transitionStyles = {
    entering: {
        opacity: "0",
    },
    entered: {
        opacity: "1",
    },
};

const Fade = props => (
    <Transition in={props.in} timeout={11}>
        {state => (
            <div
                className={props.className}
                style={{
                    ...defaultStyle,
                    ...transitionStyles[state],
                }}
            >
                {props.children}
            </div>
        )}
    </Transition>
);

export default Fade;
