import { GET_ENVIRONMENT } from './types';

export const getEnvironment = () => dispatch => {
    const environment = process && process.env
    ? {
      buildNumber: process.env.REACT_APP_BUILD_NUMBER ? process.env.REACT_APP_BUILD_NUMBER : null,
      majorMinorVersionMaster: process.env.REACT_APP_MAJOR_MINOR_VERSION_MASTER ? process.env.REACT_APP_MAJOR_MINOR_VERSION_MASTER : null,
      majorMinorVersionDevelopment: process.env.REACT_APP_MAJOR_MINOR_VERSION_DEVELOPMENT ? process.env.REACT_APP_MAJOR_MINOR_VERSION_DEVELOPMENT : null
    } : {};
    dispatch({
        type: GET_ENVIRONMENT,
        payload: environment
    });
}
