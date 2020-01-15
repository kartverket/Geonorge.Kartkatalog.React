import {
    FETCH_RESOURCES
} from 'actions/types';

const initialState = {};

export default function (state = initialState, action) {
    switch (action.type) {
        case FETCH_RESOURCES:
            return action.payload;
        default:
            return state;
    }
}
