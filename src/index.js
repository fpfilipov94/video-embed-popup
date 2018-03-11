import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore } from "redux";

import popupApp from "./store/reducers/index";

import App from "./components/App";

import registerServiceWorker from "./helpers/registerServiceWorker";

let store;
if (process.env.NODE_ENV === "development") {
    /* eslint-disable no-underscore-dangle */
    store = createStore(
        popupApp,
        window.__REDUX_DEVTOOLS_EXTENSION__ &&
            window.__REDUX_DEVTOOLS_EXTENSION__()
    );
    /* eslint-enable */
} else {
    store = createStore(popupApp);
}

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById("root")
);
registerServiceWorker();
