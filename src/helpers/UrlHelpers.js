export const convertSearchParams = (url) => {
    var convertedUrl = '';
    url = decodeURI(url);
    url = url.substring(url.indexOf("?")); // Removes everything before first parameter

    var urlParams = new URLSearchParams(url);
    var urlParamsGrouped = {};

    const facetOldUrlTypeRegex = /Facets\[[0-9]\]/;
    const isOldUrlType = facetOldUrlTypeRegex.exec(url) && facetOldUrlTypeRegex.exec(url).length ? true : false;

    for (let pair of urlParams.entries()) {
        // Get search string parameters
        if (pair[0] === 'text') {
            const paramGroup = 'searchString';
            urlParamsGrouped[paramGroup] = {
                name: pair[0],
                value: pair[1]
            };
        } else {
            const facetRegex = /Facets\[[0-9]\]/;
            if (facetRegex.exec(pair[0]) && facetRegex.exec(pair[0]).length) { // Get facet parameters
                const paramGroup = facetRegex.exec(pair[0])[0];
                const paramPropName = pair[0].replace(paramGroup + '.', '');
                if (!urlParamsGrouped[paramGroup]) {
                    urlParamsGrouped[paramGroup] = {};
                }
                urlParamsGrouped[paramGroup][paramPropName] = pair[1];
            }
        }
    }

    Object.keys(urlParamsGrouped).forEach(urlParamsGroupName => {
        convertedUrl += convertedUrl && convertedUrl !== '' ? '&' : '?';
        convertedUrl += `${urlParamsGrouped[urlParamsGroupName].name}=${urlParamsGrouped[urlParamsGroupName].value}`;
    });
    return isOldUrlType ? convertedUrl : url;
}

export const convertPath = (urlPathname) => {
    urlPathname = urlPathname.replace("/search", "");
    const metadataOldUrlPathnameTypeRegex = /metadata\/uuid\/[a-z0-9-]*/is;
    const isOldUrlPathnameType = metadataOldUrlPathnameTypeRegex.exec(urlPathname) && metadataOldUrlPathnameTypeRegex.exec(urlPathname).length ? true : false;
    return isOldUrlPathnameType ? urlPathname.replace('uuid/', '') : urlPathname;
}
