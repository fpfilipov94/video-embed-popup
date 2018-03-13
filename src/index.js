import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import popupApp from "./store/reducers/index";

import App from "./components/App";

import registerServiceWorker from "./helpers/registerServiceWorker";

const persistConfig = {
    key: "root",
    storage,
};

const persistedReducer = persistReducer(persistConfig, popupApp);

let store;
if (process.env.NODE_ENV === "development") {
    /* eslint-disable no-underscore-dangle */
    store = createStore(
        persistedReducer,
        window.__REDUX_DEVTOOLS_EXTENSION__ &&
            window.__REDUX_DEVTOOLS_EXTENSION__()
    );
    /* eslint-enable */
} else {
    store = createStore(persistedReducer);
}

const persistor = persistStore(store);

ReactDOM.render(
    <Provider store={store}>
        <App persistor={persistor} />
    </Provider>,
    document.getElementById("root")
);
registerServiceWorker();
