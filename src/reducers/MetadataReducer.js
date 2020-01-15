import {
    CLEAR_METADATA,
    FETCH_METADATA
} from 'actions/types';

const initialState = {};

export default function (state = initialState, action) {
    switch (action.type) {
        case CLEAR_METADATA:
            return {};
        case FETCH_METADATA:
            return action.payload;
        default:
            return state;
    }
}
