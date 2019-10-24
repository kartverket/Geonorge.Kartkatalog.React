import * as Cookies from 'js-cookie';

export const updateOidcCookie = () => (dispatch, getState) => {
    const user = getState() && getState().oidc && getState().oidc.user ? getState().oidc.user : null;
    if (user) {
        console.log(user);
        const accessToken = user.access_token ? user.access_token : null;
        const expiresAt = user.expires_at ? user.expires_at * 1000 : null;
        if (accessToken && expiresAt) {
            Cookies.set('oidcAccessToken', accessToken, { expires: new Date(expiresAt) });
            let userInfoUrl = process.env.REACT_APP_GEOID_BAATAUTHZ_APIURL + "info/" + user.profile.sub;
            console.log(userInfoUrl);
            fetch(userInfoUrl, {
                method: 'GET',
                headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + accessToken,
                },
            })
            .then((res) => res.json())
            .then((json) => {
            console.log(json);
            Cookies.set('baatInfo', json, { expires: new Date(expiresAt) });
            let info = Cookies.get('baatInfo');
            console.log(info);
            console.log(JSON.parse(info).baat_services);
            });
        }
    }
};

