export const getKartkatalogApiUrl = () => () => {
    const environmentSlug = import.meta.env.VITE_ENVIRONMENT === 'dev' || import.meta.env.VITE_ENVIRONMENT === 'test' ? import.meta.env.VITE_ENVIRONMENT + '.' : '';
    return `https://kartkatalog.${environmentSlug}geonorge.no/api`;
};

export const getGeonorgeRegisterApiUrl = () => () => {
    const environmentSlug = import.meta.env.VITE_ENVIRONMENT === 'dev' || import.meta.env.VITE_ENVIRONMENT === 'test' ? import.meta.env.VITE_ENVIRONMENT + '.' : '';
    return `https://register.${environmentSlug}geonorge.no/api`;
};

export const getGeonorgeMenuUrl = (selectedLanguage) => () => {
    const environmentSlug = import.meta.env.VITE_ENVIRONMENT === 'dev' || import.meta.env.VITE_ENVIRONMENT === 'test' ? 'test.' : '';
    const selectedLanguageSlug = selectedLanguage === 'en' ? 'en/' : '';
    return `https://www.${environmentSlug}geonorge.no/${selectedLanguageSlug}api/menu?omitLinks=1`;
};

export const getServiceStatusApiUrl = () => () => {
    const environmentSlug = import.meta.env.VITE_ENVIRONMENT === 'dev' || import.meta.env.VITE_ENVIRONMENT === 'test' ? 'testmonitorApi' : 'monitorApi';
    return `https://status.geonorge.no/${environmentSlug}`;
};
