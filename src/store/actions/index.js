import {
    ADD_COMMENT,
    REMOVE_COMMENT,
    ADD_SUBCOMMENT,
    REMOVE_SUBCOMMENT,
    SET_VIDEO_ID,
    REMOVE_VIDEO_ID,
} from "./actionTypes";

import MockUser from "../../helpers/userMocker";

export const addComment = text => ({
    type: ADD_COMMENT,
    user: MockUser,
    date: new Date(),
    text,
});

export const removeComment = id => ({
    type: REMOVE_COMMENT,
    id,
});

export const addSubComment = (parentId, text) => ({
    type: ADD_SUBCOMMENT,
    user: MockUser,
    date: new Date(),
    parentId,
    text,
});

export const removeSubComment = (parentId, id) => ({
    type: REMOVE_SUBCOMMENT,
    parentId,
    id,
});

export const setVideoId = id => ({
    type: SET_VIDEO_ID,
    id,
});

export const removeVideoId = () => ({
    type: REMOVE_VIDEO_ID,
});
