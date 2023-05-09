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
            .then((res) => res.json())
            .then((metadata) => metadata);
    };
