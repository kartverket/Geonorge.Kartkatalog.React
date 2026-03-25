// Dependencies
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OidcSignoutCallback = ({ userManager }) => {
    const navigate = useNavigate();

    useEffect(() => {
        userManager.signoutRedirectCallback()
            .then(() => {
                const autoRedirectPath = sessionStorage?.autoRedirectPath || "/";
                sessionStorage.removeItem("autoRedirectPath");
                navigate(autoRedirectPath);
            })
            .catch(() => {
                navigate("/");
            });
    }, [userManager, navigate]);

    return <div>Logger ut...</div>;
};

export default OidcSignoutCallback;
