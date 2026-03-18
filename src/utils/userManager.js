// Dependencies
import { UserManager } from "oidc-client-ts";
import { getConfig } from "utils/runtimeConfig";

const configIsLoaded = () => {
    return new Promise((resolve, reject) => {
        const userManagerConfig = {
            client_id: getConfig("REACT_APP_GEOID_CLIENT_ID", ""),
            authority: getConfig("REACT_APP_GEOID_AUTHORITY", ""),
            issuer: getConfig("REACT_APP_GEOID_ISSUER", ""),
            redirect_uri: getConfig("REACT_APP_GEOID_REDIRECT_URI", ""),
            post_logout_redirect_uri: getConfig("REACT_APP_GEOID_POST_LOGOUT_REDIRECT_URI", ""),
            metadata: {
                issuer: getConfig("REACT_APP_GEOID_ISSUER", ""),
                authorization_endpoint: getConfig("REACT_APP_GEOID_AUTHORIZATION_ENDPOINT", ""),
                token_endpoint: getConfig("REACT_APP_GEOID_TOKEN_ENDPOINT", ""),
                userinfo_endpoint: getConfig("REACT_APP_GEOID_USERINFO_ENDPOINT", ""),
                end_session_endpoint: getConfig("REACT_APP_GEOID_END_SESSION_ENDPOINT", ""),
                jwks_uri: getConfig("REACT_APP_GEOID_JWKS_URI", "")
            },
            signingKeys: [
                {
                    kty: "RSA",
                    e: "AQAB",
                    use: "sig",
                    kid: getConfig("REACT_APP_GEOID_KID", ""),
                    alg: "RS256",
                    n: getConfig("REACT_APP_GEOID_N", "")
                }
            ],
            response_type: "code",
            scope: "openid profile",
            loadUserInfo: true,
            pkceMethod: "S256",
            automaticSilentRenew: true,
        };
        resolve(userManagerConfig);
    });
};
const getUserManagerConfigWhenReady = configIsLoaded().then((userManagerConfig) => {
    return new UserManager(userManagerConfig);
});

export default getUserManagerConfigWhenReady;
