// Dependencies
import { UserManager } from "oidc-client-ts";

const configIsLoaded = () => {
    return new Promise((resolve, reject) => {
        const userManagerConfig = {
            client_id: import.meta.env.VITE_GEOID_CLIENT_ID,
            authority: import.meta.env.VITE_GEOID_AUTHORITY,
            issuer: import.meta.env.VITE_GEOID_ISSUER,
            redirect_uri: import.meta.env.VITE_GEOID_REDIRECT_URI,
            post_logout_redirect_uri: import.meta.env.VITE_GEOID_POST_LOGOUT_REDIRECT_URI,
            metadata: {
                issuer: import.meta.env.VITE_GEOID_ISSUER,
                authorization_endpoint: import.meta.env.VITE_GEOID_AUTHORIZATION_ENDPOINT,
                token_endpoint: import.meta.env.VITE_GEOID_TOKEN_ENDPOINT,
                userinfo_endpoint: import.meta.env.VITE_GEOID_USERINFO_ENDPOINT,
                end_session_endpoint: import.meta.env.VITE_GEOID_END_SESSION_ENDPOINT,
                jwks_uri: import.meta.env.VITE_GEOID_JWKS_URI
            },
            signingKeys: [
                {
                    kty: "RSA",
                    e: "AQAB",
                    use: "sig",
                    kid: import.meta.env.VITE_GEOID_KID,
                    alg: "RS256",
                    n: import.meta.env.VITE_GEOID_N
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
