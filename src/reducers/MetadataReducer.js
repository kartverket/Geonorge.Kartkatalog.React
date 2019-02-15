import {
    FETCH_METADATA,
} from '../actions/types';

const initialState = {};

export default function (state = initialState, action) {
    switch (action.type) {
        case FETCH_METADATA:
            return action.payload;
        default:
            return state;
    }
}