export const getKartkatalogApiUrl = () => () => {
    const environmentSlug = process.env.REACT_APP_ENVIRONMENT === 'dev' || process.env.REACT_APP_ENVIRONMENT === 'test' ? process.env.REACT_APP_ENVIRONMENT + '.' : '';
    return `https://kartkatalog.${environmentSlug}geonorge.no/api`;
};

export const getGeonorgeRegisterApiUrl = () => () => {
    const environmentSlug = process.env.REACT_APP_ENVIRONMENT === 'dev' || process.env.REACT_APP_ENVIRONMENT === 'test' ? process.env.REACT_APP_ENVIRONMENT + '.' : '';
    return `https://register.${environmentSlug}geonorge.no/api`;
};

export const getGeonorgeMenuUrl = (selectedLanguage) => () => {
    const environmentSlug = process.env.REACT_APP_ENVIRONMENT === 'dev' || process.env.REACT_APP_ENVIRONMENT === 'test' ? 'test.' : '';
    const selectedLanguageSlug = selectedLanguage === 'en' ? 'en/' : '';
    return `https://www.${environmentSlug}geonorge.no/${selectedLanguageSlug}api/menu?omitLinks=1`;
};

export const getServiceStatusApiUrl = () => () => {
    const environmentSlug = process.env.REACT_APP_ENVIRONMENT === 'dev' || process.env.REACT_APP_ENVIRONMENT === 'test' ? 'testmonitorApi' : 'monitorApi';
    return `https://status.geonorge.no/${environmentSlug}`;
};
