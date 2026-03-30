// Dependencies
import React, { useState } from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { CopyToClipboard } from "react-copy-to-clipboard";

// Actions
import { getResource } from "@/actions/ResourceActions";

// Helpers
import { convertTextToUrlSlug } from "@/helpers/UrlHelpers";

// Components
import { ErrorBoundary } from "@/components/ErrorBoundary";
import MapButton from "@/components/partials/Buttons/MapButton";
import DownloadButton from "@/components/partials/Buttons/DownloadButton";
import ApplicationButton from "@/components/partials/Buttons/ApplicationButton";

//Designsystemet
import {Card, Heading} from "@digdir/designsystemet-react";
import { Button } from  "@digdir/designsystemet-react";
import "@digdir/designsystemet-css";



// Geonorge WebComponents
// eslint-disable-next-line no-unused-vars
import { GnBadgeList } from "@kartverket/geonorge-web-components";

// Stylesheets
import style from "@/components/partials/SearchResults/MetadataSearchResult.module.scss";

const MetadataSearchResult = (props) => {
    const dispatch = useDispatch();

    // State
    const [copied, setCopied] = useState(false);

    const restrictionsClassnames = () => {
        if (props.searchResult.AccessConstraint === "restricted" || props.searchResult.AccessIsProtected) {
            return style.red;
        }
        if (
            (props.searchResult.AccessConstraint === "otherRestrictions" &&
                props.searchResult.OtherConstraintsAccess === "norway digital restricted") ||
            props.searchResult.AccessIsRestricted ||
            props.searchResult.AccessConstraint === "norway digital restricted"
        ) {
            return style.yellow;
        } else {
            return style.green;
        }
    };

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
                  return <li key={i}>{distributionFormat.Name} </li>;
              })
            : null;
        return props.searchResult.DistributionFormats && props.visibleFields.includes("DistributionFormats") ? (
            <div>
                <ErrorBoundary>
                    {dispatch(getResource("Formats", "Formater"))}:
                    <gn-badge-list>
                        <ul>{dirstibutionFormatsElement}</ul>
                    </gn-badge-list>
                </ErrorBoundary>
            </div>
        ) : null;
    };

    const renderListItemInfo = () => {
        const openDataSymbolClass = restrictionsClassnames();
        let openDataSymbolTitle =
            props.searchResult.IsOpenData || props.searchResult.AccessIsOpendata
                ? "Åpne datasett"
                : "Krever innlogging";
            if (props.searchResult.AccessConstraint && (props.searchResult.AccessConstraint === "Personvern begrenset" || props.searchResult.AccessConstraint === "Privacy restricted")
            || props.searchResult.DataAccess &&(props.searchResult.DataAccess === "Personvern begrenset" || props.searchResult.DataAccess === "Privacy restricted")
            || props.searchResult.DataAccess &&(props.searchResult.DataAccess === "Skjermede data" || props.searchResult.DataAccess === "Restricted data")
            ) {
                openDataSymbolTitle = "Kontakt dataeieren for tilgang";
            }
        const openDataSymbolIcon =
            props.searchResult.IsOpenData || props.searchResult.AccessIsOpendata
                ? ["fas", "lock-open"]
                : ["fas", "lock"];

        const listItemType = props.searchResult.TypeTranslated || props.searchResult.Type;
        const listItemOrganizations = props.searchResult.Organizations;
        const listItemOrganization = props.searchResult.Organization;

        // Handle array of organizations
        const organizationLinks = listItemOrganizations && Array.isArray(listItemOrganizations) 
            ? listItemOrganizations.map((org, index) => {
                const linkTitle = dispatch(
                    getResource("DisplayEverythingByVariable", "Vis alt fra {0}", [org])
                );
                
                return (
                    <span key={index}>
                        <Link title={linkTitle} to={"/?organizations=" + org}>
                            {org}
                        </Link>
                        {index < listItemOrganizations.length - 1 ? ", " : ""}
                    </span>
                );
            })
            : null;

        // For single organization (fallback)
        const singleOrganization = listItemOrganization && !Array.isArray(listItemOrganization) 
            ? listItemOrganization
            : null;

        const singleLinkTitle = singleOrganization ? dispatch(
            getResource("DisplayEverythingByVariable", "Vis alt fra {0}", [singleOrganization])
        ) : null;

        const singleLinkElement = singleOrganization ? (
            <Link title={singleLinkTitle} to={"/?organizations=" + singleOrganization}>
                {singleOrganization}
            </Link>
        ) : null;

        const linkElement = organizationLinks || singleLinkElement;

        return (
            <span className={style.listItemInfo}>
                <FontAwesomeIcon
                    key="lock"
                    className={openDataSymbolClass}
                    title={openDataSymbolTitle}
                    icon={openDataSymbolIcon}
                />
                {dispatch(getResource("VariableBy", "{0} fra", [listItemType]))} {linkElement}
            </span>
        );
    };

    const renderLink = () => {
        return props.metadata?.Uuid === props.searchResult.Uuid ? (
            <span>{props.searchResult.Title}</span>
        ) : (
            <Heading>
                <Link id={`card-link-${props.searchResult.Uuid}`} to={`/metadata/${convertTextToUrlSlug(props.searchResult.Title)}/${props.searchResult.Uuid}`}>
                    {props.searchResult.Title}
                </Link>
            </Heading>
        );
    };


        const renderCopyUrl = () => {
        return (props.searchResult.Type === "service" || props.searchResult.Type === "Tjeneste") &&
            props.searchResult.GetCapabilitiesUrl !== undefined ? (
            <ErrorBoundary>
                <CopyToClipboard onCopy={() => setCopied(true)} text={props.searchResult.GetCapabilitiesUrl}>
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

        // TESTER UT BILDE
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
        <div className={style.listItem}>
            <Card color="neutral" variant="outline">
                {props.enableThumbnail ? renderThumbnail() : null}
                {renderListItemInfo()}
                <span className={style.listItemTitle}>
                    <ErrorBoundary>{renderLink()}</ErrorBoundary>
                </span>
                <div className={style.flex}>
                    {renderType()} {renderDistributionFormats()}
                </div>
                {renderButtons()}
            </Card>
        </div>
    );
   
};


MetadataSearchResult.propTypes = {
    searchResult: PropTypes.object.isRequired,
    visibleFields: PropTypes.array
};

MetadataSearchResult.defaultProps = {
    visibleFields: [],
    enableThumbnail: true
};

export default MetadataSearchResult;
