import { FETCH_SELECTED_LANGUAGE } from 'actions/types';

const initialState = ''

export default function(state = initialState, action) {
	switch(action.type) {
		case FETCH_SELECTED_LANGUAGE:
			return action.payload;
		default:
			return state;
	}

}
