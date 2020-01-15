import logoDev from "images/svg/geonorge-navbar-logo_dev.svg";
import logoTest from "images/svg/geonorge-navbar-logo_test.svg";
import logo from "images/svg/geonorge-navbar-logo.svg";

export const getGeonorgeLogo = () => () => {
    const imageSrc = () => {
        switch (process.env.REACT_APP_ENVIRONMENT) {
            case 'dev':
                return logoDev;
            case 'test':
                return logoTest;
            default:
                return logo;
        }
    };
    return imageSrc();
};
