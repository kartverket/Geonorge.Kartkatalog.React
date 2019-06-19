export const getResource = (resources, resourceKey, fallbackValue) => {
    let resource = resources && Array.isArray(resources) && resources.length ? resources.find(x => x.Key === resourceKey) : null;
    if (resource && resource.Value) {
        return resource.Value;
    } else if (fallbackValue) {
        console.warn(`Resource for ${resourceKey} is missing for selected language \n Fallback value: ${fallbackValue}`);
        return fallbackValue;
    } else {
        console.warn(`Resource for ${resourceKey} is missing for selected language \n No fallback value is set`);
        return '';
    }
}
