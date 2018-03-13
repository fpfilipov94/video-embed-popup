import React from "react";

import { BrowserRouter as Router, Route } from "react-router-dom";

import { PersistGate } from "redux-persist/integration/react";

import "../assets/styles/app.css";

import Home from "./main/Home";
import Popup from "./main/Popup";
import Loading from "./main/Loading";

const App = ({ persistor }) => (
    <PersistGate loading={<Loading />} persistor={persistor}>
        <Router>
            <div className="App">
                <Route exact path="/" component={Home} />
                <Route path="/popup" component={Popup} />
            </div>
        </Router>
    </PersistGate>
);

export default App;
