import { GET_ENVIRONMENT } from 'actions/types';

export const getEnvironment = () => dispatch => {
    const environment =  {
      buildNumber: process.env.REACT_APP_BUILD_NUMBER || null,
      majorMinorVersionMaster: process.env.REACT_APP_MAJOR_MINOR_VERSION_MASTER || null,
      majorMinorVersionDevelopment: process.env.REACT_APP_MAJOR_MINOR_VERSION_DEVELOPMENT || null,
      environment: process.env.REACT_APP_ENVIRONMENT || null
    };
    dispatch({
        type: GET_ENVIRONMENT,
        payload: environment
    });
}
