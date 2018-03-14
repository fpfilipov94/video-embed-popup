import {
    ADD_COMMENT,
    REMOVE_COMMENT,
    ADD_SUBCOMMENT,
    REMOVE_SUBCOMMENT,
    REMOVE_VIDEO_ID,
} from "../actions/actionTypes";

const comments = (state = [], action) => {
    switch (action.type) {
        case ADD_COMMENT:
            return [
                ...state,
                {
                    user: action.user,
                    id: state.length === 0 ? 0 : state[state.length - 1].id + 1,
                    text: action.text,
                    date: action.date,
                    subComments: { lastId: -1, list: [] },
                },
            ];
        case REMOVE_COMMENT:
            return state.filter(c => c.id !== action.id);
        case ADD_SUBCOMMENT:
            return state.map(c => {
                if (c.id === action.parentId) {
                    const newSubId = c.subComments.lastId + 1;
                    const subComments = {
                        lastId: newSubId,
                        list: [
                            ...c.subComments.list,
                            {
                                user: action.user,
                                id: newSubId,
                                date: action.date,
                                text: action.text,
                            },
                        ],
                    };
                    return {
                        ...c,
                        subComments,
                    };
                }
                return c;
            });
        case REMOVE_SUBCOMMENT:
            return state.map(c => {
                if (c.id === action.parentId) {
                    const subComments = {
                        ...c.subComments,
                        list: c.subComments.list.filter(
                            sc => sc.id !== action.id
                        ),
                    };
                    return {
                        ...c,
                        subComments,
                    };
                }
                return c;
            });
        case REMOVE_VIDEO_ID:
            return [];
        default:
            return state;
    }
};

export default comments;
