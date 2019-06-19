import * as Cookies from 'js-cookie';
import {
    FETCH_RESOURCES
} from './types';
import {getKartkatalogApiUrl} from "./ApiUrlActions";


export const fetchResources = () => dispatch => {
    let selectedLanguage = Cookies.get('_culture') ? Cookies.get('_culture') : 'no';
    const fetchOptions = {
        headers: new Headers({
            'Accept-Language': selectedLanguage
        })
    };
    const kartkatalogApiUrl = dispatch(getKartkatalogApiUrl());
    return fetch(`${kartkatalogApiUrl}/resources/`, fetchOptions)
        .then(res => res.json())
        .then(resources => dispatch({
            type: FETCH_RESOURCES,
            payload: resources
        }))
};
