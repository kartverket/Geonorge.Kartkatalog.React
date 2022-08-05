import { useNavigate } from "react-router-dom";
import { SignoutCallbackComponent } from "redux-oidc";

const OidcSignoutCallback = ({ userManager }) => {
    const navigate = useNavigate();

    return (
        <SignoutCallbackComponent
            userManager={userManager}
            errorCallback={() => {
                navigate("/");
            }}
        >
            <div>Logger ut...</div>
        </SignoutCallbackComponent>
    );
};

export default OidcSignoutCallback;
