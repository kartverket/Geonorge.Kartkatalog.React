// Dependencies
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { userLoaded } from "reducers/authActions";

const processSigninResponse = async (userManager, navigate, dispatch) => {
  try {
    const user = await userManager.signinRedirectCallback();
    console.log(user);
    dispatch(userLoaded(user)); // Dispatch to Redux
    const autoRedirectPath = sessionStorage?.autoRedirectPath || "/";
    sessionStorage.removeItem("autoRedirectPath");
    navigate(autoRedirectPath);
  } catch (error) {
    console.error("Sign-in response error:", error);
    navigate("/");
  }
};

const OidcCallback = ({ userManager }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    processSigninResponse(userManager, navigate, dispatch);
  }, [navigate, userManager, dispatch]);

  return <div>Logger inn...</div>;
};

export default OidcCallback;
