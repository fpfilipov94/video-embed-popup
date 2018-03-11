import { combineReducers } from "redux";

import comments from "./comments";
import videoId from "./videoId";

const popupApp = combineReducers({
    comments,
    videoId,
});

export default popupApp;
