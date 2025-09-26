// Dependencies
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Utils
import userManager from "utils/userManager";
import userManagerPromise from "utils/userManager";

// Actions
import { removeItemSelectedForDownload, addItemSelectedForDownload } from "actions/DownloadItemActions";
import { getApiData } from "actions/ApiActions";
import { getResource } from "actions/ResourceActions";

// Reducers
import { pushToDataLayer } from "reducers/TagManagerReducer";

// Assets
import loadingAnimation from "images/gif/loading.gif";

// Stylesheets
import style from "components/partials/Buttons/Buttons.module.scss";

const DownloadButton = (props) => {
    const dispatch = useDispatch();

    // Redux store
    const itemsToDownload = useSelector((state) => state.itemsToDownload);
    const auth = useSelector((state) => state.auth);

    // State
    const [isAdded, setIsAdded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [hasError, setHasError] = useState(false);

    const handleLoginClick = () => {
        userManagerPromise.then((userManagerConfig) => {
            const userManager = userManagerConfig;
            userManager.signinRedirect();
        });
    };

    const getDownloadItem = (metadata) => {
        return {
            uuid: metadata.Uuid,
            url: "/metadata/" + metadata.Uuid,
            theme: metadata.Theme ? metadata.Theme : "",
            organizationName: metadata.Organization || metadata.ContactMetadata?.Organization,
            name: metadata.Title,
            distributionUrl: metadata.DistributionUrl,
            getCapabilitiesUrl: metadata.GetCapabilitiesUrl || metadata.DistributionUrl,
            accessIsRestricted: metadata.AccessIsRestricted,
            accessIsOpendata: metadata.AccessIsOpendata
        };
    };

    const addAccessToken = (fileUrl) => {
        const bearerToken = Cookies.get("oidcAccessToken");
        if (bearerToken) {
            if (bearerToken.indexOf("?") > -1) fileUrl = fileUrl + "&access_token=" + bearerToken;
            else fileUrl = fileUrl + "?access_token=" + bearerToken;
        }
        return fileUrl;
    };

    const addToDownloadList = (item) => {
        const isNotAuthenticated = !auth?.user;
        const requestAction = dispatch(getApiData(`${item.getCapabilitiesUrl}${item.uuid}`))
            .then((capabilities) => {
                let apiRequests = {};
                if (capabilities && Object.keys(capabilities).length) {
                    item.capabilities = capabilities;
                    item.capabilities._links.forEach((link) => {
                        if (link.rel === "http://rel.geonorge.no/download/order") {
                            item.orderDistributionUrl = link.href;
                        }
                        if (link.rel === "http://rel.geonorge.no/download/can-download") {
                            item.canDownloadUrl = link.href;
                        }
                        if (link.rel === "http://rel.geonorge.no/download/area") {
                            apiRequests.areas = dispatch(getApiData(addAccessToken(link.href))).then((areas) => {
                                return areas;
                            });
                        }
                        if (link.rel === "http://rel.geonorge.no/download/projection") {
                            apiRequests.projections = dispatch(getApiData(link.href)).then((projections) => {
                                return projections;
                            });
                        }
                        if (link.rel === "http://rel.geonorge.no/download/format") {
                            apiRequests.formats = dispatch(getApiData(link.href)).then((formats) => {
                                return formats;
                            });
                        }
                    });
                }
                return Promise.all([apiRequests.areas, apiRequests.projections, apiRequests.formats]).then(
                    ([areas, projections, formats]) => {
                        item = {
                            ...item,
                            areas,
                            projections,
                            formats
                        };
                        if (item.accessIsRestricted && isNotAuthenticated) {
                            localStorage.setItem("autoAddDownloadItemOnLoad", JSON.stringify(item));
                            handleLoginClick();
                        } else {
                            dispatch(addItemSelectedForDownload(item));
                        }
                    }
                );
            })
            .catch((error) => {
                console.error(error.message);
                return Promise.reject(error);
            });
        return Promise.resolve(requestAction);
    };

    const removeFromDownloadList = (item) => {
        dispatch(removeItemSelectedForDownload(item));
    };

    const isGeonorgeDownload = () => {
        return (
            props.metadata.DistributionProtocol === "GEONORGE:DOWNLOAD" ||
            props.metadata.Protocol === "Geonorge nedlastning" ||
            props.metadata.Protocol === "Geonorge download"
        );
    };

    const showDownloadLink = () => {
        const distributionUrl = props.metadata.DistributionUrl;
        const type = props.metadata.Type;
        const distributionProtocol = props.metadata.DistributionProtocol;
        const protocol = props.metadata.Protocol;

        const typeIsDataset = type === "dataset" || type === "Datasett";
        const distributionProtocolIsDownload =
            distributionProtocol === "WWW:DOWNLOAD-1.0-http--download" ||
            distributionProtocol === "GEONORGE:FILEDOWNLOAD" ||
            protocol === "Egen nedlastningsside" ||
            protocol === "OPeNDAP" ||
            distributionProtocol === "OPENDAP:OPENDAP" ||
            protocol === "Webside" ||
            protocol === "OGC API - Features";

        return distributionUrl && typeIsDataset && distributionProtocolIsDownload;
    };

    const isSeries = () => {
        return props.metadata.Type === "series";
    };

    const handleExternalDownloadButtonClick = () => {
        const tagData = {
            name: props.metadata.Title,
            uuid: props.metadata.Uuid
        };
        dispatch(
            pushToDataLayer({
                event: "download",
                category: "metadataDetails",
                activity: "visitExternalDownloadPage",
                metadata: tagData
            })
        );
    };

    const addToDownloadListAction = () => {
        const metadata = props.metadata;
        setIsLoading(true);

        if (metadata.TypeName === "series_historic" || metadata.TypeName === "series_collection") {
            if (metadata.SerieDatasets) {
                const serieDatasets = metadata.SerieDatasets.filter( (dataset) => dataset.DistributionProtocol.includes('GEONORGE:DOWNLOAD'));
                let asyncActions = serieDatasets.map((serieDataset) => {
                    const item = getDownloadItem(serieDataset);
                    return addToDownloadList(item);
                });
                Promise.allSettled(asyncActions)
                    .then(() => {
                        setIsLoading(false);
                    })
                    .catch((error) => {
                        setHasError(true);
                    });
            }
        } else if (metadata.Serie?.TypeName === "series_thematic") {
            const item = getDownloadItem(metadata.Serie);
            Promise.resolve(addToDownloadList(item))
                .then(() => {
                    setIsLoading(false);
                })
                .catch((error) => {
                    setHasError(true);
                });
        } else {
            const item = getDownloadItem(metadata);
            Promise.resolve(addToDownloadList(item))
                .then(() => {
                    setIsLoading(false);
                })
                .catch((error) => {
                    setHasError(true);
                });
        }
    };

    const removeFromDownloadListAction = () => {
        const metadata = props.metadata;
        if (metadata.TypeName === "series_historic" || metadata.TypeName === "series_collection") {

            const serieDatasets = metadata.SerieDatasets.filter( (dataset) => dataset.DistributionProtocol.includes('GEONORGE:DOWNLOAD'));

                serieDatasets.forEach((serieDataset) => {
                const item = getDownloadItem(serieDataset);
                removeFromDownloadList(item);
            });
        } else if (metadata.Serie?.TypeName === "series_thematic") {
            const item = getDownloadItem(metadata.Serie);
            removeFromDownloadList(item);
        } else {
            const item = getDownloadItem(metadata);
            removeFromDownloadList(item);
        }
    };

    const renderListButton = () => {
        if (isGeonorgeDownload()) {
            const buttonDescription = isAdded
                ? dispatch(getResource("RemoveFromBasket", "Fjern nedlasting"))
                : isSeries()
                ? dispatch(getResource("DownloadSeries", "Last ned serie"))
                : dispatch(getResource("Download", "Last ned"));
            const buttonClass = `${style.listButton} ${isAdded ? style.off : style.on}`;

            return (
                <button
                    onClick={() => (isAdded ? removeFromDownloadListAction() : addToDownloadListAction())}
                    className={buttonClass}
                >
                    <FontAwesomeIcon
                        title={buttonDescription}
                        icon={isAdded ? ["far", "trash"] : ["fas", "cloud-download"]}
                        key="icon"
                    />
                    <span>{buttonDescription}</span>
                </button>
            );
        } else if (showDownloadLink()) {
            let buttonDescription = (props.metadata.Protocol === "OGC API - Features" || props.metadata.Protocol === "OPeNDAP") ? "Vis API" 
            : dispatch(getResource("ToBasket", "Til nedlasting"));
            if(props.metadata.Protocol === "Webside") 
            {
                buttonDescription = dispatch(getResource("Webpage", "Webside")); 
            }
            const distributionUrl = props.metadata.DistributionUrl;
            const buttonClass = `${style.listButton} ${style.on}`;

            return (
                <a
                    href={distributionUrl}
                    onClick={handleExternalDownloadButtonClick}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={buttonClass}
                >
                    <FontAwesomeIcon title={buttonDescription} icon={["far", "external-link-square"]} key="icon" />
                    <span>{buttonDescription}</span>
                </a>
            );
        } else return null;
    };

    const renderButton = () => {
        if (props.metadata.CanShowDownloadService) {
            const buttonDescription = isAdded
                ? dispatch(getResource("RemoveFromBasket", "Fjern nedlasting"))
                : isSeries()
                ? dispatch(getResource("DownloadSeries", "Last ned serie"))
                : dispatch(getResource("Download", "Last ned"));
            const buttonClass = isAdded ? `${style.btn}  ${style.remove}` : `${style.btn}  ${style.download}`;

            return (
                <button
                    onClick={() => (isAdded ? removeFromDownloadListAction() : addToDownloadListAction())}
                    className={buttonClass}
                >
                    <FontAwesomeIcon
                        title={buttonDescription}
                        icon={isAdded ? ["far", "trash"] : ["fas", "cloud-download"]}
                        key="icon"
                    />
                    <span>{buttonDescription}</span>
                </button>
            );
        } else if (props.metadata.CanShowDownloadUrl) {
            const buttonDescription = dispatch(getResource("ToBasket", "Til nedlasting"));
            const distributionUrl = props.metadata.DistributionUrl;
            const buttonClass = style.btn;
            return (
                <a href={distributionUrl} className={buttonClass}>
                    <FontAwesomeIcon title={buttonDescription} icon={["far", "external-link-square"]} key="icon" />
                    <span>{buttonDescription}</span>
                </a>
            );
        } else {
            const buttonDescription = isSeries()
                ? dispatch(getResource("DownloadSeries", "Last ned serie"))
                : dispatch(getResource("Download", "Last ned"));
            const buttonClass = `${style.btn}  ${style.disabled}`;

            return (
                <button className={buttonClass}>
                    <FontAwesomeIcon title={buttonDescription} icon={["fas", "cloud-download"]} key="icon" />
                    <span>{buttonDescription}</span>
                </button>
            );
        }
    };

    const metadataIsAdded = (metadata) => {
        if (metadata.TypeName === "series_historic" || metadata.TypeName === "series_collection") {
            return (
                metadata.SerieDatasets &&
                metadata.SerieDatasets.find((serieDataset) => {
                    return (
                        itemsToDownload.filter((downloadItem) => {
                            return serieDataset.Uuid === downloadItem;
                        }).length > 0
                    );
                })
            );
        } else if (metadata.Serie && metadata.Serie.TypeName === "series_thematic") {
            return (
                itemsToDownload.filter((downloadItem) => {
                    return metadata.Serie.Uuid === downloadItem;
                }).length > 0
            );
        } else {
            return (
                itemsToDownload.filter((downloadItem) => {
                    return metadata.Uuid === downloadItem;
                }).length > 0
            );
        }
    };

    useEffect(() => {
        setIsAdded(metadataIsAdded(props.metadata));
    }, [props.metadata, itemsToDownload]);

    if (hasError) {
        return (
            <span className={`${style.loading} ${props.listButton ? style.listButton : style.btn}`}>
                <span className={style.errorMessage}>
                    {dispatch(getResource("CanNotBeAddedToBasket", "Kan ikke legges til nedlasting"))}
                </span>
            </span>
        );
    }
    if (isLoading) {
        return (
            <span className={`${style.loading} ${props.listButton ? style.listButton : style.btn}`}>
                <img src={loadingAnimation} alt="Loading animation" />
            </span>
        );
    } else if (props.listButton) {
        return renderListButton();
    } else {
        return renderButton();
    }
};

DownloadButton.propTypes = {
    metadata: PropTypes.object.isRequired,
    listButton: PropTypes.bool
};

DownloadButton.defaultProps = {
    listButton: true
};

export default DownloadButton;
