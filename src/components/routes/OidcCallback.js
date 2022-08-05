// Dependencies
import { useNavigate } from "react-router-dom";
import { CallbackComponent } from "redux-oidc";

const OidcCallback = ({ userManager }) => {
    navigate = useNavigate();

    const successCallback = () => {
        navigate("/");
    };

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
