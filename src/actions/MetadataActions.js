import Cookies from "js-cookie";
import { getKartkatalogApiUrl } from "actions/ApiUrlActions";


export const fetchMetadata =
    (uuid = "") =>
    (dispatch) => {
        let selectedLanguage = Cookies.get("_culture") ? Cookies.get("_culture") : "no";
        const fetchOptions = {
            headers: new Headers({
                "Accept-Language": selectedLanguage
            })
        };
        const kartkatalogApiUrl = dispatch(getKartkatalogApiUrl());
        return fetch(`${kartkatalogApiUrl}/getdata/${uuid}`, fetchOptions)
            .then((res) => {
                if (res.status === 404) {
                    return null; // Return null for 404, let caller decide what to do
                }
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
            })
            .then((metadata) => metadata);
    };
