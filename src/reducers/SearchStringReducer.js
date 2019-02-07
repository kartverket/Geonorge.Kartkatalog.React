import { UPDATE_SEARCH_STRING } from '../actions/types';

const initialState = '';

export default function (state = initialState, action) {
    switch (action.type) {
        case UPDATE_SEARCH_STRING:
            return action.payload;
        default:
            return state;
    }
}
