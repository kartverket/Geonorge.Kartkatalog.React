// Dependencies
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { userLoaded } from "reducers/authActions";

const OidcCallback = ({ userManager }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    userManager
      .signinRedirectCallback()
      .then((user) => {
        dispatch(userLoaded(user));
        const autoRedirectPath = sessionStorage?.autoRedirectPath || "/";
        sessionStorage.removeItem("autoRedirectPath");
        navigate(autoRedirectPath);
      })
      .catch((error) => {
        console.error("Sign-in response error:", error);
        navigate("/");
      });
  }, [userManager, navigate, dispatch]);

  return <div>Logger inn...</div>;
};

export default OidcCallback;
