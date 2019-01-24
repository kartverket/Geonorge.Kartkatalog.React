import { FETCH_AVAILABLEFACETS } from '../actions/types';

const initialState = {}

export default function(state = initialState, action) {
	switch(action.type) {
		case FETCH_AVAILABLEFACETS:
			return action.payload;
		default:
			return state;
	}
}