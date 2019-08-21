import { getGeonorgeMenuUrl } from './ApiUrlActions';
import {
    FETCH_GEONORGE_MENU,
} from './types';


export const fetchGeonorgeMenu = () => (dispatch, getState) => {
    let selectedLanguage = getState() && getState().selectedLanguage ? getState().selectedLanguage : 'no';
    const fetchOptions = {
        headers: new Headers({
            'Accept-Language': selectedLanguage
        })
    };
    const geonorgeMenuApiUrl = dispatch(getGeonorgeMenuUrl(selectedLanguage));
    return fetch(`${geonorgeMenuApiUrl}`, fetchOptions)
        .then(res => res.json())
        .then(geonorgeMenu => dispatch({
            type: FETCH_GEONORGE_MENU,
            payload: geonorgeMenu
        }))
};

