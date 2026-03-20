const runtimeConfig =
    typeof window !== "undefined" && window.__APP_CONFIG__ ? window.__APP_CONFIG__ : {};

export const getConfig = (key, fallback = null) => {
    const runtimeValue = runtimeConfig[key];

    if (runtimeValue !== undefined && runtimeValue !== "") {
        return runtimeValue;
    }

    const buildValue = process.env[key];

    if (buildValue !== undefined && buildValue !== "") {
        return buildValue;
    }

    return fallback;
};

export const getEnvironment = () => getConfig("REACT_APP_ENVIRONMENT", "");
