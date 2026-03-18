import { GET_ENVIRONMENT } from 'actions/types';
import { getConfig } from 'utils/runtimeConfig';

export const getEnvironment = () => dispatch => {
    const environment =  {
      buildNumber: getConfig('REACT_APP_BUILD_NUMBER'),
      majorMinorVersionMaster: getConfig('REACT_APP_MAJOR_MINOR_VERSION_MASTER'),
      majorMinorVersionDevelopment: getConfig('REACT_APP_MAJOR_MINOR_VERSION_DEVELOPMENT'),
      environment: getConfig('REACT_APP_ENVIRONMENT'),
      accessibilityStatementUrl: getConfig('REACT_APP_ACCESSIBILITY_STATEMENT_URL')
    };
    dispatch({
        type: GET_ENVIRONMENT,
        payload: environment
    });
}
