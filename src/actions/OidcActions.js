import * as Cookies from 'js-cookie';

export const updateOidcCookie = () => (dispatch, getState) => {
    const user = getState() && getState().oidc && getState().oidc.user ? getState().oidc.user : null;
    if (user) {
        const accessToken = user.access_token ? user.access_token : null;
        const expiresAt = user.expires_at ? user.expires_at * 1000 : null;
        if (accessToken && expiresAt) {
            Cookies.set('oidcAccessToken', accessToken, { expires: new Date(expiresAt) });
        }
    }
};

