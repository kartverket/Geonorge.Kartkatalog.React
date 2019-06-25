import * as Cookies from 'js-cookie';
import {
    FETCH_RESOURCES
} from './types';
import {getKartkatalogApiUrl} from "./ApiUrlActions";


export const fetchResources = () => (dispatch, getState) => {
    let selectedLanguage = getState().selectedLanguage;
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

export const getResource = (resourceKey, fallbackValue) => (dispacth, getState) => {
    const resources = getState().resources;
    if (resources && Array.isArray(resources) && resources.length) {
        let resource = resources.find(x => x.Key === resourceKey);
        if (resource && resource.Value) {
            return resource.Value;
        } else if (fallbackValue) {
            console.warn(`Resource for ${resourceKey} is missing for selected language \n Fallback value: ${fallbackValue}`);
            return fallbackValue;
        } else {
            console.warn(`Resource for ${resourceKey} is missing for selected language \n No fallback value is set`);
            return '';
        }
    }else {
        return fallbackValue ? fallbackValue : '';
    }
}
