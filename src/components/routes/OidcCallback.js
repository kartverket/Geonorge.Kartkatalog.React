// Dependencies
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CallbackComponent } from "redux-oidc";

const OidcCallback = ({ userManager }) => {
    const navigate = useNavigate();

    const successCallback = () => {};

    useEffect(() => {
        const autoRedirectPath = sessionStorage?.autoRedirectPath || "/";
        sessionStorage.removeItem("autoRedirectPath");
        navigate(autoRedirectPath);
    }, [navigate]);

    return (
        <CallbackComponent
            userManager={userManager}
            successCallback={successCallback}
            errorCallback={() => {
                navigate("/");
            }}
        >
            <div>Logger inn...</div>
        </CallbackComponent>
    );
};

export default OidcCallback;
