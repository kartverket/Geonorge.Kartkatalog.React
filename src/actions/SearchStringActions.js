import { UPDATE_SEARCH_STRING } from '../actions/types';

export const updateSearchString = (searchString) => dispatch => {
    dispatch({
        type: UPDATE_SEARCH_STRING,
        payload: searchString
    })
}
