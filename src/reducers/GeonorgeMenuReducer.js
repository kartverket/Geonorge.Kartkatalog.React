import { FETCH_GEONORGE_MENU } from '../actions/types';

const initialState = []

export default function(state = initialState, action) {
	switch(action.type) {
		case FETCH_GEONORGE_MENU:
			return action.payload;
		default:
			return state;
	}
	
}