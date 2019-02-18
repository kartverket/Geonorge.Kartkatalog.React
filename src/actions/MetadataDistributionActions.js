import * as Cookies from 'js-cookie';
import {
    CLEAR_METADATADISTRIBUTIONS,
    FETCH_METADATADISTRIBUTIONS
} from './types';

export const clearMetadataDistributions = () => dispatch => {
    return dispatch({
        type: CLEAR_METADATADISTRIBUTIONS
    })
};

export const fetchMetadataDistributions = (uuid = "") => dispatch => {
    let selectedLanguage = Cookies.get('_culture') ? Cookies.get('_culture') : 'no';
    const fetchOptions = {
        headers: new Headers({
            'Accept-Language': selectedLanguage
        })
    };
    return fetch(`https://kartkatalog.dev.geonorge.no/api/distribution-lists/${uuid}`, fetchOptions)
        .then(res => res.json())
        .then(metadata => dispatch({
            type: FETCH_METADATADISTRIBUTIONS,
            payload: metadata
        }))
};
