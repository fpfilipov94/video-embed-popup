import React, { Component } from "react";

import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import "../assets/styles/app.css";

import Home from "./pages/Home";
import Video from "./pages/Video";

import CloseIcon from "./partial/CloseIcon";

export default class App extends Component {
    render() {
        return (
            <Router>
                <div className="App">
                    <Link to="/" className="CloseLink">
                        <CloseIcon />
                    </Link>
                    <div className="MainContainer">
                        <Route exact path="/" component={Home} />
                        <Route path="/video/:id" component={Video} />
                    </div>
                </div>
            </Router>
        );
    }
}
