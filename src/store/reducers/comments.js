import {
    ADD_COMMENT,
    REMOVE_COMMENT,
    ADD_SUBCOMMENT,
    REMOVE_SUBCOMMENT,
} from "../actions/actionTypes";

const comments = (state = [], action) => {
    switch (action.type) {
        case ADD_COMMENT:
            return [
                ...state,
                {
                    user: action.user,
                    id: action.id,
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
                            { id: newSubId, text: action.text },
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
        default:
            return state;
    }
};

export default comments;
