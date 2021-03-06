import {
    GET_MATCH,
    GET_MATCHES_IN_STAGE,
    ADD_EVENT_IN_LOG,
    DEL_EVENT_IN_LOG,
    ROUTING
} from '../../constants';


export function getMatch(_id) {
    return (dispatch, getState) => {
        $.get("/api/match/" + _id, function (result) {
            if(result.status == 404) {
                return dispatch({
                    type: ROUTING,
                    payload: {
                        nextUrl: "/404"
                    }

                });
            }

            dispatch({
                type: GET_MATCH,
                payload: result
            });
        });
    };
}


export function getMatchesInStage(_id) {
    return (dispatch, getState) => {
        return $.when($.get("/api/stage/get-matches/" + _id)).then(function (result) {
            return dispatch({
                type: GET_MATCHES_IN_STAGE,
                payload: result
            });
        });
    };
}

export function addEventInLog(object) {
    return (dispatch, getState) => {
        return dispatch({
            type: ADD_EVENT_IN_LOG,
            payload: object
        });
    };
}

export function delEventInLog(object) {
    return (dispatch, getState) => {
        return dispatch({
            type: DEL_EVENT_IN_LOG,
            payload: object
        });
    };
}