export const getKartkatalogApiUrl = () => () => {
    const environmentSlug = process.env.REACT_APP_ENVIRONMENT === 'dev' || process.env.REACT_APP_ENVIRONMENT === 'test' ? process.env.REACT_APP_ENVIRONMENT + '.' : '';
    return `https://kartkatalog.${environmentSlug}geonorge.no/api`;
};

export const getGeonorgeMenuUrl = () => () => {
    const environmentSlug = process.env.REACT_APP_ENVIRONMENT === 'dev' || process.env.REACT_APP_ENVIRONMENT === 'test' ? 'test.' : '';
    return `https://www.${environmentSlug}geonorge.no//api/menu?omitLinks=1`;
};