import {GET_ENVIRONMENT} from '../actions/types';

const initialState = {};

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_ENVIRONMENT:
            return action.payload;
        default:
            return state;
    }
}
