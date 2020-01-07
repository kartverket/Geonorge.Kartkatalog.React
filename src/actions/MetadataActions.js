import * as Cookies from 'js-cookie';
import {
    CLEAR_METADATA,
    FETCH_METADATA
} from 'actions/types';
import {getKartkatalogApiUrl} from "actions/ApiUrlActions";

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
    const kartkatalogApiUrl = dispatch(getKartkatalogApiUrl());
    return fetch(`${kartkatalogApiUrl}/getdata/${uuid}`, fetchOptions)
        .then(res => res.json())
        .then(metadata => dispatch({
            type: FETCH_METADATA,
            payload: metadata
        }))
};
