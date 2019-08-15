import * as Cookies from 'js-cookie';
import {getGeonorgeMenuUrl} from './ApiUrlActions';
import {
    FETCH_GEONORGE_MENU,
} from './types';


export const fetchGeonorgeMenu = () => dispatch => {
    let selectedLanguage = Cookies.get('_culture') ? Cookies.get('_culture') : 'no';
    const fetchOptions = {
        headers: new Headers({
            'Accept-Language': selectedLanguage
        })
    };
    const geonorgeMenuApiUrl = dispatch(getGeonorgeMenuUrl());
    return fetch(`${geonorgeMenuApiUrl}`, fetchOptions)
        .then(res => res.json())
        .then(geonorgeMenu => dispatch({
            type: FETCH_GEONORGE_MENU,
            payload: geonorgeMenu
        }))
};

