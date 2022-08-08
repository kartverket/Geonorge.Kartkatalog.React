// Dependencies
import { useNavigate } from "react-router-dom";
import { SignoutCallbackComponent } from "redux-oidc";

const OidcSignoutCallback = ({ userManager }) => {
    const navigate = useNavigate();

    const successCallback = () => {
        navigate("/");
    };

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
