// Dependencies
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { usePostHog } from "@posthog/react";

// Utils
import userManager from "@/utils/userManager";
import userManagerPromise from "@/utils/userManager";

// Actions
import { removeItemSelectedForDownload, addItemSelectedForDownload } from "@/actions/DownloadItemActions";
import { getApiData } from "@/actions/ApiActions";
import { getResource } from "@/actions/ResourceActions";

// Reducers
import { pushToDataLayer } from "@/reducers/TagManagerReducer";

// Assets
import loadingAnimation from "@/images/gif/loading.gif";

// Stylesheets
import style from "@/components/partials/Buttons/Buttons2.module.scss";
import { Button } from "@digdir/designsystemet-react";
import { DownloadIcon, XMarkIcon } from "@navikt/aksel-icons";

const DownloadButton = (props) => {
    const dispatch = useDispatch();
    const posthog = usePostHog();

    // Redux store
    const itemsToDownload = useSelector((state) => state.itemsToDownload);
    const auth = useSelector((state) => state.auth);

    // State
    const [isAdded, setIsAdded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [hasError, setHasError] = useState(false);

    const buttonClass = `${style.listButton} `;

    const handleLoginClick = () => {
        userManagerPromise.then((userManagerConfig) => {
            const userManager = userManagerConfig;
            userManager.signinRedirect();
        });
    };

    const renderDownloadIcon = () =>
        isAdded ? (
            <XMarkIcon aria-hidden="true" />
        ) : (
            <DownloadIcon aria-hidden="true" fontSize="1.5rem" />
        );

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
                            apiRequests.areas = dispatch(getApiData(link.href)).then((areas) => {
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
                setHasError(true);
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
        posthog?.capture("download_link_clicked", {
            title: props.metadata.Title,
            uuid: props.metadata.Uuid,
            distribution_url: props.metadata.DistributionUrl,
            protocol: props.metadata.Protocol,
            organization: props.metadata.Organization,
        });
    };

    const addToDownloadListAction = () => {
        const metadata = props.metadata;
        setIsLoading(true);
        posthog?.capture("download_added_to_basket", {
            title: metadata.Title,
            uuid: metadata.Uuid,
            type_name: metadata.TypeName,
            organization: metadata.Organization || metadata.ContactMetadata?.Organization,
            access_is_open_data: metadata.AccessIsOpendata,
            access_is_restricted: metadata.AccessIsRestricted,
        });

        if (metadata.TypeName === "series_historic" || metadata.TypeName === "series_collection") {
            if (metadata.SerieDatasets) {
                const serieDatasets = metadata.SerieDatasets.filter((dataset) => dataset.DistributionProtocol.includes('GEONORGE:DOWNLOAD'));
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

            const serieDatasets = metadata.SerieDatasets.filter((dataset) => dataset.DistributionProtocol.includes('GEONORGE:DOWNLOAD'));

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


            return (
                //knapp importert fra digdir sitt designssystem

                <Button
                    variant='primary'
                    title={buttonDescription}
                    className={buttonClass}
                    onClick={() => (isAdded ? removeFromDownloadListAction() : addToDownloadListAction())}
                >
                    {buttonDescription}

                </Button>

            );


        } else if (showDownloadLink()) {
            let buttonDescription = (props.metadata.Protocol === "OGC API - Features" || props.metadata.Protocol === "OPeNDAP") ? "Vis API"
                : dispatch(getResource("ToBasket", "Til nedlasting"));
            if (props.metadata.Protocol === "Webside") {
                buttonDescription = dispatch(getResource("Webpage", "Webside"));
            }
            const distributionUrl = props.metadata.DistributionUrl;
            const buttonClass = `${style.listButton} ${style.on}`;


            return (
                <Button
                    asChild variant="primary" className={buttonClass}
                >
                    <a href={distributionUrl}
                        onClick={handleExternalDownloadButtonClick}
                        target="_blank"
                        rel="noopener noreferrer"
                    >


                        {buttonDescription}
                    </a>


                </Button>
            );
        } else return null;
    };

    const renderButton = () => {
        if (!props.metadata.CanShowDownloadService) return null;

        const buttonDescription = isAdded
            ? dispatch(getResource("RemoveFromBasket", "Fjern nedlasting"))
            : isSeries()
                ? dispatch(getResource("DownloadSeries", "Last ned serie"))
                : dispatch(getResource("Download", "Last ned"));

        const buttonClass = props.listButton
            ? style.listButton
            : `${style.detailButton} ${style.primaryButton}`;

        return (
            <Button
                variant="primary"
                onClick={() =>
                    isAdded
                        ? removeFromDownloadListAction()
                        : addToDownloadListAction()
                }
                className={buttonClass}
            >
                {renderDownloadIcon()}
                <span className={style.buttonText}>{buttonDescription}</span>
            </Button>
        );
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
            <Button variant="primary" className={buttonClass}>
                <span className={style.buttonText}>
                    {dispatch(getResource("CanNotBeAddedToBasket", "Kan ikke legges til nedlasting"))}
                </span>
            </Button>
        );
    }

    if (isLoading) {

        const buttonClass = props.listButton
            ? style.listButton
            : `${style.detailButton} ${style.primaryButton}`;
        return (
            <Button variant="secondary" className={buttonClass}>
                <img src={loadingAnimation} alt="Loading animation" />
            </Button>
        );
    }

    return props.listButton ? renderListButton() : renderButton();
};

DownloadButton.propTypes = {
    metadata: PropTypes.object.isRequired,
    listButton: PropTypes.bool
};

DownloadButton.defaultProps = {
    listButton: true
};

export default DownloadButton;
