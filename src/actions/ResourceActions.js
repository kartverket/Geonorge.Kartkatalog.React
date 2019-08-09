import {
    FETCH_RESOURCES
} from './types';
import { getKartkatalogApiUrl } from "./ApiUrlActions";


export const fetchResources = () => (dispatch, getState) => {
    let selectedLanguage = getState() && getState().selectedLanguage ? getState().selectedLanguage : 'no';
    const fetchOptions = {
        headers: new Headers({
            'Accept-Language': selectedLanguage
        })
    };
    const kartkatalogApiUrl = dispatch(getKartkatalogApiUrl());
    console.log('kartkatalogApiUrl', kartkatalogApiUrl)
    return fetch(`${kartkatalogApiUrl}/resources/`, fetchOptions)
        .then(res => res.json())
        .then(resources => dispatch({
            type: FETCH_RESOURCES,
            payload: resources
        }))
};


const insertResourceVariables = (resourceValue, resourceVariables) => {
    const resourceRegex = /{[0-9]}/gm;
    let m;
    while ((m = resourceRegex.exec(resourceValue)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === resourceRegex.lastIndex) {
            resourceRegex.lastIndex++;
        }
        const match = m[0];
        const index = match.substring(match.lastIndexOf("{") + 1, match.lastIndexOf("}"));
        if (resourceVariables && resourceVariables[index] !== undefined) {
            resourceValue = resourceValue.replace(match, resourceVariables[index])
        }
    };

    return resourceValue;
}

export const getResource = (resourceKey, fallbackValue, resourceVariables = []) => (dispacth, getState) => {
    const resources = getState().resources;
    if (resources && Array.isArray(resources) && resources.length) {
        let resource = resources.find(x => x.Key === resourceKey);
        if (resource && resource.Value) {
            return insertResourceVariables(resource.Value, resourceVariables);
        } else if (fallbackValue) {
            console.warn(`Resource for ${resourceKey} is missing for selected language \n Fallback value: ${fallbackValue}`);
            return insertResourceVariables(fallbackValue, resourceVariables);
        } else {
            console.warn(`Resource for ${resourceKey} is missing for selected language \n No fallback value is set`);
            return '';
        }
    } else {
        return fallbackValue ? fallbackValue : '';
    }
}
