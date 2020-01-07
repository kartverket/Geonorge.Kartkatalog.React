import { FETCH_ITEMS_TO_DOWNLOAD } from 'actions/types';

const initialState = []

export default function(state = initialState, action) {
	switch(action.type) {
		case FETCH_ITEMS_TO_DOWNLOAD:
			return action.payload;
		default:
			return state;
	}

}
