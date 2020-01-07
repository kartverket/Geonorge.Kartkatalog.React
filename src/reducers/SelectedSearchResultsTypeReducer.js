import { UPDATE_SELECTED_SEARCHRESULTS_TYPE } from 'actions/types';

const initialState = 'metadata';

export default function (state = initialState, action) {
    switch (action.type) {
        case UPDATE_SELECTED_SEARCHRESULTS_TYPE:
            return action.payload === 'articles' ? 'articles' : 'metadata';
        default:
            return state;
    }
}
