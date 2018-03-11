import { SET_VIDEO_ID, REMOVE_VIDEO_ID } from "../actions/actionTypes";

const videoId = (state = null, action) => {
    switch (action.type) {
        case SET_VIDEO_ID:
            return action.id;
        case REMOVE_VIDEO_ID:
            return null;
        default:
            return state;
    }
};

export default videoId;
