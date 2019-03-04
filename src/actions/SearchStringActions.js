import {UPDATE_SEARCH_STRING, UPDATE_SEARCH_STRING_FROM_URL} from '../actions/types';

export const updateSearchString = (searchString) => dispatch => {
    dispatch({
        type: UPDATE_SEARCH_STRING,
        payload: searchString
    })
};

export const updateSearchStringFromUrl = () => dispatch => {
    if (!window.location.search) {
        return;
    }
    const urlParameters = decodeURI(window.location.search);
    const regex = /\A?text=[^&]*/;
    const searchString = regex.exec(urlParameters) !== null
        ? regex.exec(urlParameters)[0].replace('text=', '')
        : null;

    if (searchString) {
        dispatch({
            type: UPDATE_SEARCH_STRING_FROM_URL,
            payload: searchString
        });
    }
};
