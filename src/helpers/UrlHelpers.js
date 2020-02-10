import 'url-search-params-polyfill';

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
                const isMunicipalityRegex = /[0-9]+\/[0-9]+\/[0-9]+/;
                const isMunicipality = isMunicipalityRegex.exec(pair[1]) ? true : false;

                if (isMunicipality) { // Map facetValues from "0/02/0220" to "0/02|0/02/0220"
                    const stateCode = pair[1].match(/[^\/]*\/[^\/]*/)[0]; // stateCode e.g. 0/02, (Akershus)
                    const municipalityCode = pair[1]; // municipalityCode e.g. 0/02/0220, (Asker)
                    pair[1] = `${stateCode}|${municipalityCode}`;
                }

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
    return isOldUrlType ? encodeURI(convertedUrl) : encodeURI(url);
}

export const convertPath = (urlPathname) => {
    urlPathname = urlPathname.replace("/search", "");
    const metadataOldUrlPathnameTypeRegex = /metadata\/uuid\/[a-z0-9-]*/is;
    const isOldUrlPathnameType = metadataOldUrlPathnameTypeRegex.exec(urlPathname) && metadataOldUrlPathnameTypeRegex.exec(urlPathname).length ? true : false;
    return isOldUrlPathnameType ? urlPathname.replace(/metadata\/[a-z0-9-]*/is, 'metadata') : urlPathname;
}

const replaceAndAddSpace = (string, replace, replaceWith) => {
  string = string.replace(new RegExp(`([^\s])([${replace}])([^\s])`, 'ig'), `\$1 ${replaceWith} \$3`); // Character right before and after
  string = string.replace(new RegExp(`([^\s])([${replace}])`, 'ig'), `\$1 ${replaceWith}`); // Character right before
  string = string.replace(new RegExp(`([${replace}])([^\s])`, 'ig'), `${replaceWith} \$2`); // Character right after
  string = string.replace(new RegExp(`[${replace}]`, 'ig'), replaceWith); // No character right before or after

  return string;
}

export const convertTextToUrlSlug = string => {
  if (string) {
    // To lower case
    string = string.toLowerCase();

    // Character replace
    string = replaceAndAddSpace(string, "&", "and");
    string = replaceAndAddSpace(string, "+", "plus");
    string = string.replace("æ", "ae");
    string = string.replace("ø", "oe");
    string = string.replace("å", "aa");

    // Whitespace replace
    string = string.replace(" - ", "-");
    string = string.replace(/[\s]+/g, "-");

    // Unwated character replace
    string = string.replace(/[^a-z0-9-]+/ig, "");

    // Remove any character before first and after last A-Z or 0-9
    string = string.replace(/^[^A-Z0-9]*|[^a-z0-9]*$/ig, "");

    return string;
  } else {
    return '';
  }
}

export const convertUrlSlugToText = urlSlug => {
  let convertedUrlSlug = urlSlug.replace(/-/g, ' '); // Replace all dashes with whiteSpaces
  return convertedUrlSlug.charAt(0).toUpperCase() + convertedUrlSlug.slice(1); // Capitalize first word
}
