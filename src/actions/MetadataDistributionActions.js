import {
    CLEAR_METADATADISTRIBUTIONS,
    FETCH_METADATADISTRIBUTIONS
} from 'actions/types';
import { getKartkatalogApiUrl } from "actions/ApiUrlActions";

export const clearMetadataDistributions = () => dispatch => {
    return dispatch({
        type: CLEAR_METADATADISTRIBUTIONS
    })
};

export const fetchMetadataDistributions = (uuid = "", datefrom = "", dateto ="") => (dispatch, getState) => {
    const selectedLanguage = getState() && getState().selectedLanguage ? getState().selectedLanguage : 'no';
    const fetchOptions = {
        headers: new Headers({
            'Accept-Language': selectedLanguage
        })
    };
    const kartkatalogApiUrl = dispatch(getKartkatalogApiUrl());
    return fetch(`${kartkatalogApiUrl}/distribution-lists/${uuid}?datefrom=${datefrom}&dateto=${dateto}`, fetchOptions)
        .then(res => res.json())
        .then(metadata => dispatch({
            type: FETCH_METADATADISTRIBUTIONS,
            payload: metadata
        }))
};
