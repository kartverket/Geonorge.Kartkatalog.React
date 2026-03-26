import { GET_ENVIRONMENT } from '@/actions/types';
import { getConfig, getEnvironment as getRuntimeEnvironment } from '@/utils/runtimeConfig';

export const getEnvironment = () => dispatch => {
    const environment =  {
      buildNumber: getConfig("VITE_BUILD_NUMBER"),
      majorMinorVersionMaster: getConfig("VITE_MAJOR_MINOR_VERSION_MASTER"),
      majorMinorVersionDevelopment: getConfig("VITE_MAJOR_MINOR_VERSION_DEVELOPMENT"),
      environment: getRuntimeEnvironment(),
      accessibilityStatementUrl: getConfig("VITE_ACCESSIBILITY_STATEMENT_URL")
    };
    dispatch({
        type: GET_ENVIRONMENT,
        payload: environment
    });
}
