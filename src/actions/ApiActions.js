export const getApiData = (url) => (dispatch, getState) => {
  const fetchOptions = {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  };
  return fetch(url, fetchOptions).then(res => res.json()).then(
    apiData => {
      return apiData
    }
  ).catch(error => {
    console.log(error);
  })
}
