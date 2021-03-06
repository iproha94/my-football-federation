import {
    GET_USER_BY_ID,
    GET_FEDERATIONS_USER
}  from '../../constants';

const initialState = {
    name: "",
    _id: "",
    teams: [],
    federations: []
};

export default function(state = initialState, action) {
    switch (action.type) {
        case GET_USER_BY_ID:
            return {...state, ...action.payload};
        case GET_FEDERATIONS_USER:
            var newState = {...state};
            newState.federations = [...action.payload];
            return newState;
        default:
            return state;
    }
}