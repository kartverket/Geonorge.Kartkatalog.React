import {UPDATE_BAAT_INFO} from 'actions/types';
import * as Cookies from 'js-cookie';
import {pushToDataLayer} from 'reducers/TagManagerReducer';

export const updateOidcCookie = () => (dispatch, getState) => {
  const user = getState() && getState().oidc && getState().oidc.user
    ? getState().oidc.user
    : null;
  if (user) {
    const accessToken = user.access_token
      ? user.access_token
      : null;
    const expiresAt = user.expires_at
      ? user.expires_at * 1000
      : null;
    if (accessToken && expiresAt) {
      Cookies.set('oidcAccessToken', accessToken, {expires: new Date(expiresAt)});
    }
  }
};

export const updateBaatInfo = () => (dispatch, getState) => {
  const user = getState() && getState().oidc && getState().oidc.user
    ? getState().oidc.user
    : null;
  const savedBaatInfo = getState() && getState().baatInfo && Object.keys(getState().baatInfo).length
    ? getState().baatInfo
    : null;
  if (user && user.profile && user.profile.sub && !savedBaatInfo) {
    const accessToken = user.access_token
      ? user.access_token
      : null;
    const expiresAt = user.expires_at
      ? user.expires_at * 1000
      : null;
    if (accessToken && expiresAt) {
      const userInfoUrl = `${process.env.REACT_APP_GEOID_BAATAUTHZ_APIURL}info/${user.profile.sub}`;
      fetch(userInfoUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + accessToken
        }
      }).then((res) => res.json()).then((baatInfo) => {
        Cookies.set('baatInfo', baatInfo, {expires: new Date(expiresAt)});
        const baatOrganizationName = baatInfo && baatInfo.baat_organization && baatInfo.baat_organization.name
          ? baatInfo.baat_organization.name
          : null;
          console.log("baatInfo", baatInfo)
          console.log("baatOrganizationName", baatOrganizationName)
        if (baatOrganizationName) {
          console.log("to dataLayer: ", {
            event: 'signIn',
            category: 'baatOrganizationName',
            activity: 'authentication',
            baatOrganizationName: baatOrganizationName
          });
          dispatch(pushToDataLayer(
            {
              event: 'signIn',
              category: 'baatOrganizationName',
              activity: 'authentication',
              baatOrganizationName: baatOrganizationName
            }
          ));

        }
        dispatch({type: UPDATE_BAAT_INFO, payload: baatInfo});
      });
    }
  }
}
