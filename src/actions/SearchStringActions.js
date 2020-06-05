import {UPDATE_SEARCH_STRING, UPDATE_SEARCH_STRING_FROM_URL} from 'actions/types';

export const updateSearchString = (searchString) => dispatch => {
    dispatch({
        type: UPDATE_SEARCH_STRING,
        payload: searchString
    })
};

export const updateSearchStringFromUrl = () => dispatch => {
    const urlParameters = decodeURI(window.location.search);
    const regex = /A?text=[^&]*/;
    const searchString = regex.exec(urlParameters) !== null
        ? regex.exec(urlParameters)[0].replace('text=', '')
        : '';

    dispatch({
        type: UPDATE_SEARCH_STRING_FROM_URL,
        payload: searchString
    });
    return searchString;
};
