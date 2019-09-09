import * as Cookies from 'js-cookie';
import { fetchResources } from './ResourceActions';
import { FETCH_SELECTED_LANGUAGE } from './types';

export const fetchSelectedLanguage = () => dispatch => {
    let selectedLanguage = Cookies.get('_culture') ? Cookies.get('_culture') : 'no';
    dispatch({
        type: FETCH_SELECTED_LANGUAGE,
        payload: selectedLanguage
    });
}

export const updateSelectedLanguage = (language) => dispatch => {
    Cookies.set('_culture', language, { expires: 7, path: '/', domain: '.geonorge.no' });
    dispatch({
        type: FETCH_SELECTED_LANGUAGE,
        payload: language
    });
    dispatch(fetchResources());
}
