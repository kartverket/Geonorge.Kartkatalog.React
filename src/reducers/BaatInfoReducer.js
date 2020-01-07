import { UPDATE_BAAT_INFO } from 'actions/types';

const initialState = []

export default function(state = initialState, action) {
	switch(action.type) {
		case UPDATE_BAAT_INFO:
			return action.payload;
		default:
			return state;
	}

}
