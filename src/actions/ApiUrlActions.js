export const getKartkatalogApiUrl = () => () => {
    const environmentSlug = process.env.REACT_APP_ENVIRONMENT === 'dev' || process.env.REACT_APP_ENVIRONMENT === 'test' ? process.env.REACT_APP_ENVIRONMENT + '.' : '';
    return `https://kartkatalog.${environmentSlug}geonorge.no/api`;
};