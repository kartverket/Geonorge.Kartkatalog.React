// Dependencies
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SignoutCallbackComponent } from "redux-oidc";

const OidcSignoutCallback = ({ userManager }) => {
    const navigate = useNavigate();

    const successCallback = () => {};

    useEffect(() => {
        const autoRedirectPath = sessionStorage?.autoRedirectPath || "/";
        sessionStorage.removeItem("autoRedirectPath");
        navigate(autoRedirectPath);
    }, [navigate]);

    return (
        <SignoutCallbackComponent
            userManager={userManager}
            successCallback={successCallback}
            errorCallback={() => {
                navigate("/");
            }}
        >
            <div>Logger ut...</div>
        </SignoutCallbackComponent>
    );
};

export default OidcSignoutCallback;
