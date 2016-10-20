import {
    GET_MATCH,
    ADD_MESSAGE_IN_CHAT,
    GET_MATCHES_IN_STAGE
} from '../../constants';


export function getMatch(_id) {
    return (dispatch, getState) => {
        return $.when($.get("/api/match/" + _id)).then(function (result) {
            return dispatch({
                type: GET_MATCH,
                payload: result
            });
        });
    };
}
export function getMatchesInStage(_id) {
    return (dispatch, getState) => {
        return $.when($.get("/api/stage/get-matches/:" + _id)).then(function (result) {
            return dispatch({
                type: GET_MATCHES_IN_STAGE,
                payload: result
            });
        });
    };
}

export function addMessageInChat(object) {
    return (dispatch, getState) => {
        return dispatch({
            type: ADD_MESSAGE_IN_CHAT,
            payload: object
        });
    };
}