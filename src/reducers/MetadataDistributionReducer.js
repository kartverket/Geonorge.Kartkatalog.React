import {
    FETCH_METADATADISTRIBUTIONS,
} from '../actions/types';

const initialState = {};

export default function (state = initialState, action) {
    switch (action.type) {
        case FETCH_METADATADISTRIBUTIONS:
            return action.payload;
        default:
            return state;
    }
}