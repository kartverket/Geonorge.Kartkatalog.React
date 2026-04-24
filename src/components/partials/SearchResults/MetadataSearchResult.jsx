// Dependencies
import React, { useState } from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { usePostHog } from "@posthog/react";

// Actions
import { getResource } from "@/actions/ResourceActions";

// Helpers
import { convertTextToUrlSlug } from "@/helpers/UrlHelpers";

// Components
import { ErrorBoundary } from "@/components/ErrorBoundary";
import MapButton from "@/components/partials/Buttons/MapButton";
import DownloadButton from "@/components/partials/Buttons/DownloadButton";
import ApplicationButton from "@/components/partials/Buttons/ApplicationButton";
import { renderMetadataOwnership } from "./parts/MetadataOwnership";

//Designsystemet
import {Card, Heading} from "@digdir/designsystemet-react";
import { Button } from  "@digdir/designsystemet-react";
import { Tag } from "@digdir/designsystemet-react";
import "@digdir/designsystemet-css";



// Geonorge WebComponents
// eslint-disable-next-line no-unused-vars
import { GnBadgeList } from "@kartverket/geonorge-web-components";

// Stylesheets
import style from "@/components/partials/SearchResults/MetadataSearchResult.module.scss";

const MetadataSearchResult = (props) => {
    const dispatch = useDispatch();
    const posthog = usePostHog();



    // State
    const [copied, setCopied] = useState(false);



    const renderType = () => {
        return props.searchResult.Type && props.visibleFields.includes("Type") ? (
            <div className={style.typeContainer}>
                <span>Type: {props.searchResult.Protocol}</span>
            </div>
        ) : null;
    };

    const renderButtons = () => {
        const downloadButtonElement = props.visibleFields?.includes("DownloadButton") ? (
            <ErrorBoundary>
                <DownloadButton metadata={props.searchResult}></DownloadButton>
            </ErrorBoundary>
        ) : null;

        const mapButtonElement = props.visibleFields?.includes("MapButton") ? (
            <ErrorBoundary>
                <MapButton metadata={props.searchResult}></MapButton>
            </ErrorBoundary>
        ) : null;

        const applicationButtonElement = props.visibleFields?.includes("ApplicationButton") ? (
            <ErrorBoundary>
                <ApplicationButton metadata={props.searchResult}></ApplicationButton>
            </ErrorBoundary>
        ) : null;

        const containerClass = [
            style.buttonGroupContainer,
            props.stretchButtons ? style.stretch : null,
            props.buttonAlignment === "left" ? style.forceLeft : null,
        ].filter(Boolean).join(" ");
        const copyUrlElement = renderCopyUrl();

        return (
            <div className={containerClass}>
                {applicationButtonElement}
                {mapButtonElement}
                {downloadButtonElement}
                {copyUrlElement}
    </div>
        );
    };

    const renderDistributionFormats = () => {
        const dirstibutionFormatsElement = props.searchResult.DistributionFormats
            ? props.searchResult.DistributionFormats.map((distributionFormat, i) => {
                  return <li key={i}><Tag>{distributionFormat.Name}</Tag></li> ;
              })
            : null;
        return props.searchResult.DistributionFormats && props.visibleFields.includes("DistributionFormats") ? (
            <div>
                <ErrorBoundary>
                    {dispatch(getResource("Formats", "Formater"))}:
                    <ul>
                        {dirstibutionFormatsElement}
                    </ul>
                </ErrorBoundary>
            </div>
        ) : null;
    };


    const handleResultClick = () => {
        posthog?.capture("search_result_clicked", {
            title: props.searchResult.Title,
            uuid: props.searchResult.Uuid,
            type: props.searchResult.Type,
            organization: props.searchResult.Organization,
            is_open_data: props.searchResult.IsOpenData || props.searchResult.AccessIsOpendata,
        });
    };

    const renderLink = () => {
        return props.metadata?.Uuid === props.searchResult.Uuid ? (
            <span>{props.searchResult.Title}</span>
        ) : (
            <Heading>
                <Link
               id={`card-link-${props.searchResult.Uuid}`} to={`/metadata/${convertTextToUrlSlug(props.searchResult.Title)}/${props.searchResult.Uuid}`}
                onClick={handleResultClick}
            >
                {props.searchResult.Title}
            </Link></Heading>
        );
    };


        const handleCopyUrl = () => {
        setCopied(true);
        posthog?.capture("service_url_copied", {
            title: props.searchResult.Title,
            uuid: props.searchResult.Uuid,
            get_capabilities_url: props.searchResult.GetCapabilitiesUrl,
        });
    };

    const renderCopyUrl = () => {
        return (props.searchResult.Type === "service" || props.searchResult.Type === "Tjeneste") &&
            props.searchResult.GetCapabilitiesUrl !== undefined ? (
            <ErrorBoundary>
                <CopyToClipboard onCopy={handleCopyUrl} text={props.searchResult.GetCapabilitiesUrl}>
                        <Button variant= "primary"
                        title={props.searchResult.GetCapabilitiesUrl} className={style.url}>

                            <span>
                        {copied ? "Lenke kopiert": "Kopier lenke"}
                        </span>
                        </Button>

                </CopyToClipboard>
            </ErrorBoundary>
        ) : null;
    };

        
    const renderThumbnail = () => {
    const thumbnailUrl = props.searchResult?.ThumbnailUrl;
    const title = props.searchResult?.Title || "Forhåndsvisning av datasett";

    if (!thumbnailUrl) {
        return (
            <div className={style.thumbnailContainer}>
                <div className={style.thumbnailFallback}>
                    Ingen forhåndsvisning
                </div>
            </div>
        );
    }

    return (
        <div className={style.thumbnailContainer}>
            <img
                src={thumbnailUrl}
                alt={title}
                className={style.thumbnail}
                onError={(e) => {
                    e.currentTarget.style.display = "none";
                    const fallback = e.currentTarget.nextElementSibling;
                    if (fallback) {
                        fallback.style.display = "flex";
                    }
                }}
            />
            <div className={style.thumbnailFallback} style={{ display: "none" }}>
                Ingen forhåndsvisning
            </div>
        </div>
    );
};


    return (
        //designsystemet list card element
        <div className={`${style.listItem} ${props.viewMode === "list" ? style.listMode : style.gridMode}`}>
            <Card color="neutral" variant="outline">
                {props.enableThumbnail ? renderThumbnail() : null}
                <div className={style.contentWrapper}>
                    
                    {renderMetadataOwnership(
                        props.searchResult,
                        props.viewMode,
                        dispatch
                    )}
                    <span className={style.listItemTitle}>
                        <ErrorBoundary>
                            {renderLink()}
                        </ErrorBoundary>
                    </span>
                    <div className={style.flex}>
                        {renderType()} 
                        {renderDistributionFormats()}
                    </div>
                </div>
                
                {renderButtons()}
            </Card>
        </div>
    );
   
};

MetadataSearchResult.propTypes = {
    searchResult: PropTypes.object.isRequired,
    visibleFields: PropTypes.array,
    viewMode: PropTypes.oneOf(["grid", "list"])
};

MetadataSearchResult.defaultProps = {
    visibleFields: [],
    enableThumbnail: true,
    viewMode: "grid"
};

export default MetadataSearchResult;
