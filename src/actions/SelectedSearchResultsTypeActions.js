import { UPDATE_SELECTED_SEARCHRESULTS_TYPE } from '../actions/types';

export const updateSelectedSearchResultsType = (searchResultsType) => dispatch => {
    dispatch({
        type: UPDATE_SELECTED_SEARCHRESULTS_TYPE,
        payload: searchResultsType,
    })
}