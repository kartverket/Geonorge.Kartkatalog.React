import * as Cookies from 'js-cookie';
import {
    CLEAR_METADATA,
    FETCH_METADATA
} from './types';

export const clearMetadata = () => dispatch => {
    return dispatch({
        type: CLEAR_METADATA
    })
};

export const fetchMetadata = (uuid = "") => dispatch => {
    let selectedLanguage = Cookies.get('_culture') ? Cookies.get('_culture') : 'no';
    const fetchOptions = {
        headers: new Headers({
            'Accept-Language': selectedLanguage
        })
    };

    return fetch(`https://kartkatalog.dev.geonorge.no/api/getdata/${uuid}`, fetchOptions)
        .then(res => res.json())
        .then(metadata => dispatch({
            type: FETCH_METADATA,
            payload: metadata
        }))
};
