// Dependencies
import { createUserManager } from 'redux-oidc';

const userManagerConfig = {
    client_id: process.env.REACT_APP_GEOID_CLIENT_ID,
    authority: process.env.REACT_APP_GEOID_AUTHORITY,
    issuer: process.env.REACT_APP_GEOID_ISSUER,
    redirect_uri: process.env.REACT_APP_GEOID_REDIRECT_URI,
    post_logout_redirect_uri: process.env.REACT_APP_GEOID_POST_LOGOUT_REDIRECT_URI,
    metadata: {
        issuer: process.env.REACT_APP_GEOID_ISSUER,
        authorization_endpoint: process.env.REACT_APP_GEOID_AUTHORIZATION_ENDPOINT,
        userinfo_endpoint: process.env.REACT_APP_GEOID_USERINFO_ENDPOINT,
        end_session_endpoint: process.env.REACT_APP_GEOID_END_SESSION_ENDPOINT,
        jwks_uri: process.env.REACT_APP_GEOID_JWKS_URI
    },
    signingKeys: [
        {
            kty: "RSA",
            e: "AQAB",
            use: "sig",
            kid: process.env.REACT_APP_GEOID_KID,
            alg: "RS256",
            n: process.env.REACT_APP_GEOID_N
        }
    ],
    response_type: "id_token token",
    scope: "openid profile",
    loadUserInfo: false
}

const userManager = createUserManager(userManagerConfig);

export default userManager;
