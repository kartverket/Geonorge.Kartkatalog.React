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
        const searchParams = new URLSearchParams();

        if (!!datefrom?.length && datefrom?.toLowerCase() !== "null") {
            searchParams.append("datefrom", datefrom);
        }
        if (!!dateto?.length && dateto?.toLowerCase() !== "null") {
            searchParams.append("dateto", dateto);
        }
        const searchParamsString = !!searchParams?.size ? `?${searchParams.toString()}` : "";

        return fetch(`${kartkatalogApiUrl}/distribution-lists/${uuid}${searchParamsString}`, fetchOptions)
            .then((res) => {
                if (res.ok) {
                    return res.json();
                } else {
                    return null;
                }
            })
            .then((metadataDistributions) => metadataDistributions);
    };
