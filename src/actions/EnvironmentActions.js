import { GET_ENVIRONMENT } from '@/actions/types';

export const getEnvironment = () => dispatch => {
    const environment =  {
      buildNumber: import.meta.env.VITE_BUILD_NUMBER || null,
      majorMinorVersionMaster: import.meta.env.VITE_MAJOR_MINOR_VERSION_MASTER || null,
      majorMinorVersionDevelopment: import.meta.env.VITE_MAJOR_MINOR_VERSION_DEVELOPMENT || null,
      environment: import.meta.env.VITE_ENVIRONMENT || null,
      accessibilityStatementUrl: import.meta.env.VITE_ACCESSIBILITY_STATEMENT_URL || null
    };
    dispatch({
        type: GET_ENVIRONMENT,
        payload: environment
    });
}
