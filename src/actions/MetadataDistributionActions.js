import { getKartkatalogApiUrl } from "actions/ApiUrlActions";

export const fetchMetadataDistributions =
    (uuid = "", datefrom = "", dateto = "") =>
    (dispatch, getState) => {
        const selectedLanguage = getState() && getState().selectedLanguage ? getState().selectedLanguage : "no";
        const fetchOptions = {
            headers: new Headers({
                "Accept-Language": selectedLanguage
            })
        };
        const kartkatalogApiUrl = dispatch(getKartkatalogApiUrl());
        return fetch(
            `${kartkatalogApiUrl}/distribution-lists/${uuid}?datefrom=${datefrom}&dateto=${dateto}`,
            fetchOptions
        )
            .then((res) => res.json())
            .then((metadataDistributions) => metadataDistributions);
    };
