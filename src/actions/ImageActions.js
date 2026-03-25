import logoDev from "@/images/svg/geonorge-navbar-logo_dev.svg";
import logoTest from "@/images/svg/geonorge-navbar-logo_test.svg";
import logo from "@/images/svg/geonorge-navbar-logo.svg";
import { getEnvironment } from "@/utils/runtimeConfig";

export const getGeonorgeLogo = () => () => {
    const imageSrc = () => {
        switch (getEnvironment()) {
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
