import {UPDATE_SEARCH_STRING, UPDATE_SEARCH_STRING_FROM_URL} from 'actions/types';

const initialState = '';

export default function (state = initialState, action) {
    switch (action.type) {
        case UPDATE_SEARCH_STRING:
            return action.payload;
        case UPDATE_SEARCH_STRING_FROM_URL: {
            return action.payload;
        }
        default:
            return state;
    }
}
