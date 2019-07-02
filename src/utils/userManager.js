// Dependencies
import { createUserManager } from 'redux-oidc';

const userManagerConfig = {
    client_id: process.env.REACT_APP_GEOID_CLIENT_ID,
    authority: process.env.REACT_APP_GEOID_AUTHORITY,
    issuer: process.env.REACT_APP_GEOID_ISSUER,
    redirect_uri: process.env.REACT_APP_GEOID_REDIRECT_URI,
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
            kid: "MGMzOTI2M2VjMjU2ZTZkZmNiODA0ZDJhN2NlNDU5M2Q4MDgzOTZjMA",
            alg: "RS256",
            n: "zqaJTH9ST1VetunDiKvj6CXhPiTVE_hOpS-dql9EBMYQ2qAErwRjKUfcZJUzh0d2Lchn0z7kB-fByk6RHPzI89f6cWsk5yn3lnHpYM0p7mM3slQ9Sth_04LWLx8gVngGjqTVkqvtiPWtjkM56G-W3xgWbWRuwqSgxmm89deFubTNAkF3ZywvefyAaVa0WMfN0F7SAAHv1OyvqZ6vnwbbzmgvIPg8vDHGtL1c2smyHDdDFcMFhbxwP7ueAEXAj4dOpBA8zfw_PuH-lkGfrlaXhdgPBmZJJpGFw3RQ7ZDkGe9nV-IpO3nD3wrj1ZqLYK3VxifJeqn5zbpNleQINDW8GQ"
        }
    ],
    response_type: "id_token token",
    scope: "openid profile",
    loadUserInfo: false
}

const userManager = createUserManager(userManagerConfig);

export default userManager;
