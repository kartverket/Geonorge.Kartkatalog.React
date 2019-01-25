import { FETCH_MAPITEMS } from '../actions/types';

const initialState = []

export default function(state = initialState, action) {
	switch(action.type) {
		case FETCH_MAPITEMS:
			return action.payload;
		default:
			return state;
	}
	
}