import { GET_ENVIRONMENT } from './types';

export const getEnvironment = () => dispatch => {
    const environment = process && process.env
    ? {
      buildNumber: process.env.BUILD_NUMBER ? process.env.BUILD_NUMBER : null,
    } : {};
    dispatch({
        type: GET_ENVIRONMENT,
        payload: environment
    });
}
