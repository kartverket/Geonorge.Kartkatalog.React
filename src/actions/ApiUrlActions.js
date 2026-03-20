import { getEnvironment } from 'utils/runtimeConfig';

export const getKartkatalogApiUrl = () => () => {
    const environment = getEnvironment();
    const environmentSlug = environment === 'dev' || environment === 'test' ? environment + '.' : '';
    return `https://kartkatalog.${environmentSlug}geonorge.no/api`;
};

export const getGeonorgeRegisterApiUrl = () => () => {
    const environment = getEnvironment();
    const environmentSlug = environment === 'dev' || environment === 'test' ? environment + '.' : '';
    return `https://register.${environmentSlug}geonorge.no/api`;
};

export const getGeonorgeMenuUrl = (selectedLanguage) => () => {
    const environment = getEnvironment();
    const environmentSlug = environment === 'dev' || environment === 'test' ? 'test.' : '';
    const selectedLanguageSlug = selectedLanguage === 'en' ? 'en/' : '';
    return `https://www.${environmentSlug}geonorge.no/${selectedLanguageSlug}api/menu?omitLinks=1`;
};

export const getServiceStatusApiUrl = () => () => {
    const environment = getEnvironment();
    const environmentSlug = environment === 'dev' || environment === 'test' ? 'testmonitorApi' : 'monitorApi';
    return `https://status.geonorge.no/${environmentSlug}`;
};
