import Cookies from "js-cookie";

export const getApiData = (url) => (dispatch, getState) => {
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  };
  
  // Add Bearer token if available
  const bearerToken = Cookies.get("oidcAccessToken");
  if (bearerToken) {
    headers['Authorization'] = `Bearer ${bearerToken}`;
  }
  
  const fetchOptions = {
    method: 'GET',
    headers
  };
  
  return fetch(url, fetchOptions).then(res => res.json()).then(
    apiData => {
      return apiData
    }
  ).catch(error => {
    console.log(error);
  })
}
