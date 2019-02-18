import {
    CLEAR_METADATADISTRIBUTIONS,
    FETCH_METADATADISTRIBUTIONS
} from '../actions/types';

const initialState = {};

export default function (state = initialState, action) {
    switch (action.type) {
        case CLEAR_METADATADISTRIBUTIONS:
            return {};
        case FETCH_METADATADISTRIBUTIONS:
            return action.payload;
        default:
            return state;
    }
}
