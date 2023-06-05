import { getGeonorgeRegisterApiUrl } from "actions/ApiUrlActions";

export const fetchMetadataQuality = (uuid) => (dispatch) => {
    if (uuid?.length) {
        const geonorgeRegisterApiUrl = dispatch(getGeonorgeRegisterApiUrl());
        return fetch(`${geonorgeRegisterApiUrl}/fair/${uuid}`).then((res) => {
            if (res.ok) {
                return res.json().then((metadataQuality) => metadataQuality);
            } else {
                return null;
            }
        });
    } else return null;
};
