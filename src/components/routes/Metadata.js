// Dependencies
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import Moment from "react-moment";
import { useDispatch, useSelector } from "react-redux";
import { useLoaderData, useLocation, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DatePicker from "react-datepicker";
import MDEditor from "@uiw/react-md-editor";

// Geonorge WebComponents
// eslint-disable-next-line no-unused-vars
import { BreadcrumbList, GnBadgeList, GnIcon, GnInput, GnList, HeadingText } from "@kartverket/geonorge-web-components";

// Actions
import { getResource } from "actions/ResourceActions";
import { fetchMetadataDistributions } from "actions/MetadataDistributionActions";

// Reducers
import { pushToDataLayer } from "reducers/TagManagerReducer";

// Helpers
import { convertTextToUrlSlug, convertUrlSlugToText } from "helpers/UrlHelpers";

// Components
import { ErrorBoundary } from "components/ErrorBoundary";
import DistributionsList from "components/routes/Metadata/DistributionsList";
import ProductSheetButton from "components/partials/Buttons/ProductsheetButton";
import ProductSpecificationButton from "components/partials/Buttons/ProductSpecificationButton";
import LegendDescriptionButton from "components/partials/Buttons/LegendDescriptionButton";
import ContactOwnerButton from "components/partials/Buttons/ContactOwnerButton";
import ProductPageButton from "components/partials/Buttons/ProductPageButton";
import ApplicationButton from "components/partials/Buttons/ApplicationButton";
import MapButton from "components/partials/Buttons/MapButton";
import DownloadButton from "components/partials/Buttons/DownloadButton";
import HelpButton from "components/partials/Buttons/HelpButton";
import ShowCoverageButton from "components/partials/Buttons/ShowCoverageButton";
import DownloadXmlButton from "components/partials/Buttons/DownloadXmlButton";
import EditMetadataButton from "components/partials/Buttons/EditMetadataButton";

// Stylesheets
import style from "components/routes/Metadata.module.scss";
import "react-datepicker/dist/react-datepicker.css";
import "scss/mdeOverride.scss";

import { registerLocale } from "react-datepicker";
import nb from "date-fns/locale/nb";
registerLocale("nb", nb);

import moment from "moment";

const Metadata = () => {
    const dispatch = useDispatch();
    const params = useParams();
    const location = useLocation();

    const { metadata, metadataDistributions, metadataQuality } = useLoaderData();

    const uuid = params.uuid;
    const title = params.title;
    const dateStart = params.dateStart;
    const dateEnd = params.dateEnd;

    // Redux store
    const selectedLanguage = useSelector((state) => state.selectedLanguage);

    // State
    const [expanded, setExpanded] = useState(false);
    const [showBtns, setShowBtns] = useState(false);
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const [hasPushedPageViewTag, setHasPushedPageViewTag] = useState();

    const handleStartChange = (date) => {
        setStartDate(date);
    };

    const handleEndChange = (date) => {
        setEndDate(date);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const dateStart = moment(startDate).format("YYYY-MM-DD");
        const dateEnd = moment(endDate).format("YYYY-MM-DD");
        dispatch(fetchMetadataDistributions(uuid, dateStart, dateEnd));
    };

    const getTitle = () => {
        if (metadata) {
            return selectedLanguage === "en" && metadata.EnglishTitle ? metadata.EnglishTitle : metadata.Title;
        } else return "";
    };

    const getAbstract = (metadata) => {
        if (metadata) {
            return selectedLanguage === "en" && metadata.EnglishAbstract ? metadata.EnglishAbstract : metadata.Abstract;
        } else return "";
    };

    const urlify = (text) => {
        if (text) {
            const urlRegex = /(https?:\/\/[^\s]+)/g;
            return text.split(urlRegex).map((part, index) => {
                if (part.match(urlRegex)) {
                    return (
                        <a key={index} href={part} target="_blank">
                            {part}
                        </a>
                    );
                }
                return part;
            });
        } else return text;
    };

    const getMetadataLinkedDataSnippet = () => {
        if (metadata && Object.keys(metadata)?.length) {
            const snippet = {
                "@context": "http://schema.org",
                "@type": "Dataset",
                "@id": `https://kartkatalog.geonorge.no/${window.location.pathname}`,
                name: getTitle(),
                description: getAbstract(metadata),
                abstract: getAbstract(metadata),
                datePublished: metadata.DatePublished,
                dateModified: metadata.DateUpdated,
                license:
                    metadata.Constraints && metadata.Constraints.OtherConstraintsLink
                        ? metadata.Constraints.OtherConstraintsLink
                        : "",
                author: {
                    "@type": "Organization",
                    name:
                        metadata.ContactOwner && metadata.ContactOwner.Organization
                            ? metadata.ContactOwner.Organization
                            : "",
                    legalName:
                        metadata.ContactOwner && metadata.ContactOwner.Organization
                            ? metadata.ContactOwner.Organization
                            : "",
                    email: metadata.ContactOwner && metadata.ContactOwner.Email ? metadata.ContactOwner.Email : ""
                },
                publisher: {
                    "@type": "Organization",
                    name:
                        metadata.ContactPublisher && metadata.ContactPublisher.Organization
                            ? metadata.ContactPublisher.Organization
                            : "",
                    legalName:
                        metadata.ContactPublisher && metadata.ContactPublisher.Organization
                            ? metadata.ContactPublisher.Organization
                            : "",
                    email:
                        metadata.ContactPublisher && metadata.ContactPublisher.Email
                            ? metadata.ContactPublisher.Email
                            : ""
                }
            };
            return (
                <Helmet>
                    <script type="application/ld+json">{`${JSON.stringify(snippet)}`}</script>
                </Helmet>
            );
        } else return "";
    };

    const toggleExpand = () => {
        setExpanded(!expanded);
    };
    const toggleBtns = () => {
        setShowBtns(!showBtns);
    };

    useEffect(() => {
        const hasRecievedMetadataProps = metadata && Object.keys(metadata)?.length;
        if (hasRecievedMetadataProps && !hasPushedPageViewTag) {
            pushPageViewTag();
            setHasPushedPageViewTag(true);
        }
    }, [location.pathname, selectedLanguage]);

    const pushPageViewTag = () => {
        const tagData = {
            name: getTitle(),
            uuid: metadata.Uuid,
            accessIsOpendata: metadata.AccessIsOpendata,
            accessIsRestricted: metadata.AccessIsRestricted,
            organizationName:
                metadata.ContactMetadata && metadata.ContactMetadata.Organization
                    ? metadata.ContactMetadata.Organization
                    : null
        };
        dispatch(
            pushToDataLayer({
                event: "showPage",
                category: "metadata",
                activity: "showMetadataPage",
                metadata: tagData
            })
        );
    };

    const renderDatasetLanguage = () => {
        return metadata?.DatasetLanguage ? (
            <div>
                <strong>{dispatch(getResource("LanguageInDataset", "Språk i datasett"))}:</strong>{" "}
                {metadata.DatasetLanguage}
            </div>
        ) : null;
    };

    const renderResourceReferenceCodespace = () => {
        return metadata?.ResourceReferenceCodespace ? (
            <div>
                <strong>{dispatch(getResource("NamespaceToDataset", "Navnerom til datasett"))}:</strong>{" "}
                {metadata.ResourceReferenceCodespace}
            </div>
        ) : null;
    };

    const renderResourceReferenceCode = () => {
        return metadata?.ResourceReferenceCode ? (
            <div>
                <strong>{dispatch(getResource("DatasetName", "Datasett-ID"))}:</strong> {metadata.ResourceReferenceCode}
            </div>
        ) : null;
    };

    const renderContactMetadata = () => {
        if (metadata?.ContactMetadata) {
            return (
                <div>
                    <heading-text>
                        <h3>{dispatch(getResource("ContactMetadata", "Metadatakontakt"))}</h3>
                    </heading-text>
                    {metadata?.ContactMetadata?.Name?.length ? <div>{metadata.ContactMetadata.Name}</div> : null}
                    {metadata?.ContactMetadata?.Email?.length ? (
                        <div>
                            <a href={"mailto:" + metadata.ContactMetadata.Email}>{metadata.ContactMetadata.Email}</a> -{" "}
                            {metadata.ContactMetadata.Organization}
                        </div>
                    ) : null}
                </div>
            );
        } else {
            return "";
        }
    };

    const renderContactOwner = () => {
        if (metadata?.ContactOwner) {
            return (
                <div>
                    <heading-text>
                        <h3>{dispatch(getResource("ContactOwner", "Faglig kontakt"))}</h3>
                    </heading-text>
                    {metadata?.ContactOwner.Name ? <div>{metadata.ContactOwner.Name}</div> : null}
                    {metadata?.ContactOwner?.Email?.length ? (
                        <div>
                            <a href={"mailto:" + metadata.ContactOwner.Email}>{metadata.ContactOwner.Email}</a> -{" "}
                            {metadata.ContactOwner.Organization}
                        </div>
                    ) : null}
                </div>
            );
        } else {
            return null;
        }
    };

    const renderContactPublisher = () => {
        if (metadata?.ContactPublisher) {
            return (
                <div>
                    <heading-text>
                        <h3>{dispatch(getResource("ContactPublisher", "Teknisk kontakt"))}</h3>
                    </heading-text>
                    {metadata?.ContactPublisher?.Name?.length ? <div>{metadata.ContactPublisher.Name}</div> : null}
                    {metadata?.ContactPublisher?.Email?.length ? (
                        <div>
                            <a href={"mailto:" + metadata.ContactPublisher.Email}>{metadata.ContactPublisher.Email}</a>{" "}
                            - {metadata.ContactPublisher.Organization}
                        </div>
                    ) : null}
                </div>
            );
        } else {
            return null;
        }
    };

    const renderSpatialRepresentation = () => {
        return metadata?.SpatialRepresentation ? (
            <div>
                <strong>{dispatch(getResource("SpatialRepresentation", "Representasjonsform"))}: </strong>
                {metadata.SpatialRepresentation}
            </div>
        ) : null;
    };

    const renderDistributionsFormats = () => {
        const distributionsFormats = metadata?.DistributionsFormats;
        if (distributionsFormats?.length) {
            const urls = distributionsFormats
                .map((item) => item.URL)
                .filter((value, index, self) => self.indexOf(value) === index);
            return urls.map((url, urlIndex) => {
                const protocolFormats = distributionsFormats.filter((distribution) => {
                    return distribution.URL == url;
                });
                const protocolFormatElements = protocolFormats.map((protocolFormat, formatIndex) => {
                    return (
                        <li key={formatIndex}>
                            {protocolFormat.FormatName} {protocolFormat.FormatVersion}
                        </li>
                    );
                });

                return (
                    <div key={urlIndex}>
                        <heading-text>
                            <h3>{dispatch(getResource("DistributionType", "Distribusjonstype"))}:</h3>
                        </heading-text>
                        <div>{protocolFormats[0].ProtocolName}</div>
                        {protocolFormats[0].URL ? (
                            <div>
                                <b>URL: </b>
                                <a href={protocolFormats[0].URL}>{protocolFormats[0].URL}</a>
                            </div>
                        ) : null}
                        {protocolFormats[0].UnitsOfDistribution ? (
                            <div>
                                <b>
                                    {dispatch(getResource("UnitsOfDistribution", "Geografisk distribusjonsinndeling"))}:{" "}
                                </b>
                                {selectedLanguage === "en" && protocolFormats[0].EnglishUnitsOfDistribution
                                    ? protocolFormats[0].EnglishUnitsOfDistribution
                                    : protocolFormats[0].UnitsOfDistribution}
                            </div>
                        ) : null}
                        <heading-text>
                            <h3>Format:</h3>
                        </heading-text>
                        <gn-badge-list>
                            <ul>{protocolFormatElements}</ul>
                        </gn-badge-list>
                    </div>
                );
            });
        } else {
            return null;
        }
    };

    const renderOperations = () => {
        const operationsList =
            metadata?.Operations?.length &&
            metadata.Operations.map((operation, index) => {
                return (
                    <li key={index}>
                        <a href={operation.URL} target="_blank" title={operation.Description}>
                            {operation.Name}
                        </a>
                    </li>
                );
            });
        return operationsList?.length ? (
            <div>
                <heading-text>
                    <h3>Kall som tjenesten tilbyr:</h3>
                </heading-text>
                <gn-list>
                    <ul>{operationsList}</ul>
                </gn-list>
            </div>
        ) : null;
    };

    const renderDistributionDetails = () => {
        return metadata?.DistributionDetails?.ProtocolName?.length ? (
            <div>
                <strong>{dispatch(getResource("DistributionType", "Distribusjonstype"))}: </strong>
                {metadata.DistributionDetails.ProtocolName}
            </div>
        ) : null;
    };

    const renderDistributionUrl = () => {
        return metadata?.DistributionUrl?.length ? (
            <div>
                <strong>Get Capabilites Url: </strong>
                <a href={metadata.DistributionUrl}>{metadata.DistributionUrl}</a>
            </div>
        ) : null;
    };

    const renderUnitsOfDistribution = () => {
        return metadata?.UnitsOfDistribution?.length ? (
            <div>
                <strong>{dispatch(getResource("UnitsOfDistribution", "Geografisk distribusjonsinndeling"))}: </strong>
                {metadata.UnitsOfDistribution}
            </div>
        ) : null;
    };

    const renderReferenceSystems = () => {
        const referenceSystemList =
            metadata?.ReferenceSystems?.length &&
            metadata.ReferenceSystems.map((referenceSystem, index) => {
                return <li key={index}>{referenceSystem.CoordinateSystem}</li>;
            });
        return referenceSystemList?.length ? (
            <div>
                <heading-text>
                    <h3>{dispatch(getResource("ReferenceSystems", "Romlig referansesystem"))}:</h3>
                </heading-text>
                <gn-list>
                    <ul>{referenceSystemList}</ul>
                </gn-list>
            </div>
        ) : null;
    };

    const renderUseLimitations = () => {
        return metadata?.Constraints?.UseLimitations?.length ? (
            <div>
                <strong>{dispatch(getResource("UseLimitations", "Bruksbegrensninger"))}: </strong>
                {metadata.Constraints.UseLimitations}
            </div>
        ) : null;
    };

    const renderAccessConstraints = () => {
        return metadata?.Constraints?.AccessConstraints?.length ? (
            <div>
                <strong>{dispatch(getResource("AccessConstraints", "Tilgangsrestriksjoner"))}: </strong>
                {metadata.Constraints.AccessConstraints}
            </div>
        ) : null;
    };

    const renderUseConstraints = () => {
        return metadata?.Constraints?.UseConstraints?.length ? (
            <div>
                <strong>{dispatch(getResource("UseConstraints", "Brukerrestriksjoner"))}: </strong>
                {metadata.Constraints.UseConstraints}
            </div>
        ) : null;
    };

    const renderOtherConstraintsLinkText = () => {
        return metadata?.Constraints?.OtherConstraintsLinkText?.length ? (
            <div>
                <strong>{dispatch(getResource("Licence", "Lisens"))}: </strong>
                <a href={metadata.Constraints.OtherConstraintsLink} target="_blank" rel="noopener noreferrer">
                    {metadata.Constraints.OtherConstraintsLinkText}
                </a>
            </div>
        ) : null;
    };

    const renderOtherConstraints = () => {
        return metadata?.Constraints?.OtherConstraints?.length ? (
            <div>
                <strong>{dispatch(getResource("OtherConstraints", "Andre restriksjoner"))}: </strong>
                {metadata.Constraints.OtherConstraints}
            </div>
        ) : null;
    };

    const renderSecurityConstraintsNote = () => {
        return metadata?.Constraints?.SecurityConstraintsNote?.length ? (
            <div>
                <strong>{dispatch(getResource("SecurityConstraintsNote", "Lovhenvisning"))}: </strong>
                {metadata.Constraints.SecurityConstraintsNote}
            </div>
        ) : null;
    };

    const renderSecurityConstraints = () => {
        return metadata?.Constraints?.SecurityConstraints?.length ? (
            <div>
                <strong>{dispatch(getResource("SecurityConstraints", "Sikkerhetsnivå"))}: </strong>
                {metadata.Constraints.SecurityConstraints}
            </div>
        ) : null;
    };

    const renderResolutionScale = () => {
        return metadata?.ResolutionScale?.length ? (
            <div>
                <strong>{dispatch(getResource("ResolutionScale", "Målestokkstall"))}: </strong>
                {metadata.ResolutionScale}
            </div>
        ) : null;
    };

    const renderResolutionDistance = () => {
        return !isNaN(metadata?.ResolutionDistance) ? (
            <div>
                <strong>{dispatch(getResource("ResolutionDistance", "Distanse i meter"))}: </strong>
                {metadata.ResolutionDistance}
            </div>
        ) : null;
    };

    const renderStatus = () => {
        return metadata?.Status?.length ? (
            <div>
                <strong>Status: </strong>
                {metadata.Status}
            </div>
        ) : null;
    };

    const renderContentInformation = () => {
        return metadata?.ContentInformation?.CloudCoverPercentage !== undefined ? (
            <div>
                <strong>{dispatch(getResource("CloudCoverPercentage", "Skydekke prosent"))}: </strong>
                {metadata.ContentInformation.CloudCoverPercentage}
            </div>
        ) : null;
    };

    const renderProcessHistory = () => {
        return metadata?.ProcessHistory?.length ? (
            <div className={style.flex}>
                <div className={style.textContent}>
                    <div>
                        <strong>{dispatch(getResource("ProcessHistory", "Prosesshistorie"))}: </strong>
                    </div>
                    <div data-color-mode="light">
                        <MDEditor.Markdown id="abstract" source={metadata.ProcessHistory} />
                    </div>
                </div>
            </div>
        ) : null;
    };

    const renderOrderingInstructions = () => {
        return metadata?.OrderingInstructions?.length ? (
            <div>
                <strong>{dispatch(getResource("ServiceDeclaration", "Tjenesteerklæring"))}: </strong>
                <a href={metadata.OrderingInstructions} target="_blank" rel="noopener noreferrer">
                    {metadata.OrderingInstructionsLinkText}
                </a>
                {metadata?.QuantitativeResult?.Availability?.length ? (
                    <div> {metadata.QuantitativeResult.Availability} </div>
                ) : null}
                {metadata?.QuantitativeResult?.Capacity?.length ? (
                    <div> {metadata.QuantitativeResult.Capacity} </div>
                ) : null}
                {metadata?.QuantitativeResult?.Performance?.length ? (
                    <div> {metadata.QuantitativeResult.Performance} </div>
                ) : null}
            </div>
        ) : null;
    };

    const renderDateCreated = () => {
        return metadata?.DateCreated?.length ? (
            <div>
                <strong>
                    {dispatch(getResource("Created", "Oppretet"))} ({dispatch(getResource("Resource", "Ressurs"))}):{" "}
                </strong>
                <Moment format="DD.MM.YYYY" date={metadata.DateCreated} />
            </div>
        ) : null;
    };

    const renderDateUpdated = () => {
        return metadata?.DateUpdated?.length ? (
            <div>
                <strong>
                    {dispatch(getResource("Updated", "Oppdatert"))} ({dispatch(getResource("Resource", "Ressurs"))}):{" "}
                </strong>
                <Moment format="DD.MM.YYYY" date={metadata.DateUpdated} />
            </div>
        ) : null;
    };

    const renderMetadataDateUpdated = () => {
        return metadata?.DateMetadataUpdated?.length ? (
            <div>
                <strong>{dispatch(getResource("Updated", "Oppdatert"))} (Metadata): </strong>
                <Moment format="DD.MM.YYYY" date={metadata.DateMetadataUpdated} />
            </div>
        ) : null;
    };

    const renderDatePublished = () => {
        return metadata?.DatePublished?.length ? (
            <div>
                <strong>{dispatch(getResource("Published", "Publisert"))}: </strong>
                <Moment format="DD.MM.YYYY" date={metadata.DatePublished} />
            </div>
        ) : null;
    };

    const renderDateValidityPeriod = () => {
        const validFrom = metadata?.DatePublished ? metadata?.DateMetadataValidFrom : "";
        const validTo = metadata?.DatePublished ? metadata?.DateMetadataValidTo : "";
        return validFrom || validTo ? (
            <div>
                <strong>{dispatch(getResource("ValidityPeriod", "Gyldighetsperiode"))}: </strong>
                <Moment format="DD.MM.YYYY" date={validFrom} /> - <Moment format="DD.MM.YYYY" date={validTo} />
            </div>
        ) : null;
    };

    const renderMaintenanceFrequency = () => {
        return metadata?.MaintenanceFrequency?.length ? (
            <div>
                <strong>{dispatch(getResource("MaintenanceFrequency", "Oppdateringshyppighet"))}: </strong>
                {metadata.MaintenanceFrequency}
            </div>
        ) : null;
    };

    const renderSpatialScope = () => {
        return metadata?.SpatialScope?.length ? (
            <div>
                <strong>{dispatch(getResource("Facet_spatialscope", "Dekningsområde"))}: </strong>
                {metadata.SpatialScope}
            </div>
        ) : null;
    };

    const renderKeywordsPlace = () => {
        const keywordsPlaceList =
            metadata?.KeywordsPlace?.length &&
            metadata.KeywordsPlace.map((keywordPlace, index) => {
                return (
                    <li key={index}>
                        {selectedLanguage === "en" && keywordPlace.EnglishKeyword && keywordPlace.EnglishKeyword.length
                            ? keywordPlace.EnglishKeyword
                            : keywordPlace.KeywordValue}
                    </li>
                );
            });
        return keywordsPlaceList?.length ? (
            <div>
                <heading-text>
                    <h4>{dispatch(getResource("KeywordsPlace", "Geografisk område"))}:</h4>
                </heading-text>
                <gn-list>
                    <ul>{keywordsPlaceList}</ul>
                </gn-list>
            </div>
        ) : null;
    };

    const renderBoundingBox = () => {
        return metadata?.BoundingBox && Object.keys(metadata?.BoundingBox)?.length ? (
            <div>
                <heading-text>
                    <h4>{dispatch(getResource("BoundingBox", "Geografisk utstrekning"))}:</h4>
                </heading-text>
                <gn-list>
                    <ul>
                        <li>
                            {dispatch(getResource("North", "Nord"))}: {metadata.BoundingBox.NorthBoundLatitude}
                        </li>
                        <li>
                            {dispatch(getResource("South", "Sør"))}: {metadata.BoundingBox.SouthBoundLatitude}
                        </li>
                        <li>
                            {dispatch(getResource("East", "Øst"))}: {metadata.BoundingBox.EastBoundLongitude}
                        </li>
                        <li>
                            {dispatch(getResource("West", "Vest"))}: {metadata.BoundingBox.WestBoundLongitude}
                        </li>
                    </ul>
                </gn-list>
            </div>
        ) : null;
    };

    const renderKeywordsTheme = () => {
        const keywordsThemeList =
            metadata?.KeywordsTheme?.length &&
            metadata.KeywordsTheme.map((keywordTheme, index) => {
                return (
                    <li key={index}>
                        {selectedLanguage === "en" && keywordTheme.EnglishKeyword && keywordTheme.EnglishKeyword.length
                            ? keywordTheme.EnglishKeyword
                            : keywordTheme.KeywordValue}
                    </li>
                );
            });
        return keywordsThemeList?.length ? (
            <div>
                <heading-text>
                    <h4>{dispatch(getResource("Facet_theme", "Tema"))}:</h4>
                </heading-text>
                <gn-list>
                    <ul>{keywordsThemeList}</ul>
                </gn-list>
            </div>
        ) : null;
    };

    const renderKeywordsNationalTheme = () => {
        const keywordsNationalThemeList =
            metadata?.KeywordsNationalTheme?.length &&
            metadata.KeywordsNationalTheme.map((keywordNationalTheme, index) => {
                return (
                    <li key={index}>
                        {selectedLanguage === "en" && keywordNationalTheme?.EnglishKeyword?.length
                            ? keywordNationalTheme.EnglishKeyword
                            : keywordNationalTheme.KeywordValue}
                    </li>
                );
            });
        return keywordsNationalThemeList?.length ? (
            <div>
                <heading-text>
                    <h4>{dispatch(getResource("KeywordsNationalTheme", "Nasjonale tema"))}:</h4>
                </heading-text>
                <gn-list>
                    <ul>{keywordsNationalThemeList}</ul>
                </gn-list>
            </div>
        ) : null;
    };

    const renderKeywordsNationalInitiative = () => {
        const keywordsNationalInitiativeList =
            metadata?.KeywordsNationalInitiative?.length &&
            metadata.KeywordsNationalInitiative.map((keywordNationalInitiative, index) => {
                return (
                    <li key={index}>
                        {selectedLanguage === "en" && keywordNationalInitiative?.EnglishKeyword?.length
                            ? keywordNationalInitiative.EnglishKeyword
                            : keywordNationalInitiative.KeywordValue}
                    </li>
                );
            });
        return keywordsNationalInitiativeList?.length ? (
            <div>
                <heading-text>
                    <h4>{dispatch(getResource("Facet_nationalinitiative", "Samarbeid og lover"))}:</h4>
                </heading-text>
                <gn-list>
                    <ul>{keywordsNationalInitiativeList}</ul>
                </gn-list>
            </div>
        ) : null;
    };

    const renderKeywordsInspire = () => {
        const keywordsInspireList =
            metadata?.KeywordsInspire?.length &&
            metadata.KeywordsInspire.map((keywordInspire, index) => {
                return <li key={index}>{keywordInspire.KeywordValue}</li>;
            });
        return keywordsInspireList?.length ? (
            <div>
                <heading-text>
                    <h3>Inspire:</h3>
                </heading-text>
                <gn-list>
                    <ul>{keywordsInspireList}</ul>
                </gn-list>
            </div>
        ) : null;
    };

    const renderKeywordsConcept = () => {
        const keywordsConceptList =
            metadata?.KeywordsConcept?.length &&
            metadata.KeywordsConcept.map((keywordConcept, index) => {
                return (
                    <li key={index}>
                        <a href={keywordConcept.KeywordLink} target="_blank" rel="noopener noreferrer">
                            {keywordConcept.KeywordValue}
                        </a>
                    </li>
                );
            });
        return keywordsConceptList?.length ? (
            <div>
                <strong>{dispatch(getResource("Concept", "Begreper"))}:</strong>
                <gn-list>
                    <ul>{keywordsConceptList}</ul>
                </gn-list>
            </div>
        ) : null;
    };

    const renderKeywordsInspirePriorityDataset = () => {
        const keywordsInspirePriorityDatasetList =
            metadata?.KeywordsInspirePriorityDataset?.length &&
            metadata.KeywordsInspirePriorityDataset.map((keywordInspirePriorityDataset, index) => {
                return (
                    <li key={index}>
                        <a href={keywordInspirePriorityDataset.KeywordLink} target="_blank" rel="noopener noreferrer">
                            {keywordInspirePriorityDataset.KeywordValue}
                        </a>
                    </li>
                );
            });
        return keywordsInspirePriorityDatasetList?.length ? (
            <div>
                <strong>{dispatch(getResource("EuPriorityDataset", "EU - prioriterte datasett"))}:</strong>
                <gn-list>
                    <ul>{keywordsInspirePriorityDatasetList}</ul>
                </gn-list>
            </div>
        ) : null;
    };

    const renderKeywordsInspireCategory = () => {
        const keywordsInspireList =
            metadata?.KeywordsInspire?.length &&
            metadata.KeywordsInspire.map((keywordInspire, index) => {
                return <li key={index}>{keywordInspire.KeywordValue}</li>;
            });
        return renderKeywordsInspireCategory?.length ? (
            <div>
                <strong>{dispatch(getResource("Metadata_KeywordsInspire_Label", "Inspire kategorier"))}:</strong>
                <gn-list>
                    <ul>{keywordsInspireList}</ul>
                </gn-list>
            </div>
        ) : null;
    };

    const renderKeywordsOther = () => {
        const keywordsOtherList =
            metadata?.KeywordsOther?.length &&
            metadata.KeywordsOther.map((keywordOther, index) => {
                return (
                    <li key={index}>
                        {selectedLanguage === "en" && keywordOther.EnglishKeyword && keywordOther.EnglishKeyword.length
                            ? keywordOther.EnglishKeyword
                            : keywordOther.KeywordValue}
                    </li>
                );
            });
        return keywordsOtherList?.length ? (
            <div>
                <strong>{dispatch(getResource("Metadata_KeywordsOther_Label", "Ukategoriserte nøkkelord"))}:</strong>
                <gn-list>
                    <ul>{keywordsOtherList}</ul>
                </gn-list>
            </div>
        ) : null;
    };

    const renderKeywordsAdministrativeUnits = () => {
        const keywordsAdministrativeUnitsList =
            metadata?.KeywordsAdministrativeUnits?.length &&
            metadata.KeywordsAdministrativeUnits.map((keywordAdministrativeUnits, index) => {
                return keywordAdministrativeUnits?.KeywordLink ? (
                    <li key={index}>
                        <a href={keywordAdministrativeUnits.KeywordLink}>{keywordAdministrativeUnits.KeywordValue}</a>
                    </li>
                ) : (
                    <li key={index}>
                        <span>{keywordAdministrativeUnits.KeywordValue}</span>
                    </li>
                );
            });
        return keywordsAdministrativeUnitsList?.length ? (
            <div>
                <heading-text>
                    <h4>{dispatch(getResource("KeywordsAdministrativeUnits", "Administrative enheter"))}:</h4>
                </heading-text>
                <gn-list>
                    <ul>{keywordsAdministrativeUnitsList}</ul>
                </gn-list>
            </div>
        ) : null;
    };

    const renderTopicCategory = () => {
        return metadata?.TopicCategories?.length ? (
            <div>
                <strong>{dispatch(getResource("TopicCategory", "Tematisk hovedkategori"))}: </strong>
                {metadata.TopicCategories.join(", ")}
            </div>
        ) : null;
    };

    const renderCredits = () => {
        return metadata?.Credits?.length ? <div>{metadata.Credits.join(", ")}</div> : null;
    };

    const renderSpecificUsageSection = () => {
        return metadata?.SpecificUsage?.length ? (
            <div>
                <heading-text>
                    <h2 underline="true">{dispatch(getResource("SpecificUsage", "Bruksområde"))}</h2>
                </heading-text>
                <p style={{ whiteSpace: "pre-line" }}>{urlify(metadata.SpecificUsage)}</p>
            </div>
        ) : null;
    };

    const renderDistributionsListSection = () => {
        const selfDistributionsList =
            metadataDistributions?.SelfDistribution?.length && metadataDistributions?.ShowSelfDistributions ? (
                <div>
                    <heading-text>
                        <h3>{metadataDistributions.TitleSelf}</h3>
                    </heading-text>
                    <ErrorBoundary>
                        <DistributionsList distributions={metadataDistributions.SelfDistribution} />
                    </ErrorBoundary>
                </div>
            ) : null;
        const relatedDatasetList =
            metadataDistributions?.RelatedDataset?.length && metadataDistributions?.ShowRelatedDataset ? (
                <div>
                    <heading-text>
                        <h3>{dispatch(getResource("Facet_type_dataset", "Datasett"))}</h3>
                    </heading-text>
                    <ErrorBoundary>
                        <DistributionsList distributions={metadataDistributions.RelatedDataset} />
                    </ErrorBoundary>
                </div>
            ) : null;
        const relatedSerieDatasetsList =
            (metadataDistributions?.RelatedSerieDatasets?.length && metadataDistributions?.ShowRelatedSerieDatasets) ||
            metadata?.TypeName == "series_time" ? (
                <div>
                    <heading-text>
                        <h3>
                            {dispatch(getResource("Facet_type_seriedatasets", "Datasett som inngår i datasettserien"))}
                        </h3>
                    </heading-text>
                    {metadata.TypeName == "series_time" ? (
                        <form className="form-inline" onSubmit={handleSubmit}>
                            <div className="input-group">
                                <table>
                                    <tbody>
                                        <tr>
                                            <td>
                                                <gn-label>
                                                    <label>Dato fra: </label>
                                                </gn-label>
                                            </td>
                                            <td>
                                                <gn-input>
                                                    <DatePicker
                                                        style={{ display: "inline" }}
                                                        autoComplete="off"
                                                        selectsStart
                                                        startDate={startDate}
                                                        selected={startDate}
                                                        onChange={handleStartChange}
                                                        name="startDate"
                                                        dateFormat="dd.MM.yyyy"
                                                        locale="nb"
                                                    />
                                                </gn-input>
                                            </td>
                                            <td>
                                                <gn-label>
                                                    <label>Dato til: </label>
                                                </gn-label>
                                            </td>
                                            <td>
                                                <gn-input>
                                                    <DatePicker
                                                        style={{ display: "inline" }}
                                                        autoComplete="off"
                                                        selectsEnd
                                                        endDate={endDate}
                                                        selected={endDate}
                                                        onChange={handleEndChange}
                                                        name="endDate"
                                                        dateFormat="dd.MM.yyyy"
                                                        minDate={startDate}
                                                        locale="nb"
                                                    />
                                                </gn-input>
                                            </td>
                                            <td>
                                                <gn-button color="primary">
                                                    <button>Søk</button>
                                                </gn-button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </form>
                    ) : null}
                    <ErrorBoundary>
                        <DistributionsList distributions={metadataDistributions.RelatedSerieDatasets} />
                    </ErrorBoundary>
                </div>
            ) : null;
        const relatedDatasetSerieList =
            metadataDistributions?.RelatedDatasetSerie?.length && metadataDistributions?.ShowRelatedDatasetSerie ? (
                <div>
                    <heading-text>
                        <h3>
                            {dispatch(getResource("Facet_type_datasetserie", "Datasettet inngår i datasettserien"))}
                        </h3>
                    </heading-text>
                    <ErrorBoundary>
                        <DistributionsList distributions={metadataDistributions.RelatedDatasetSerie} />
                    </ErrorBoundary>
                </div>
            ) : null;
        const relatedApplicationsList =
            metadataDistributions?.RelatedApplications?.length && metadataDistributions?.ShowRelatedApplications ? (
                <div>
                    <heading-text>
                        <h3>{metadataDistributions.TitleRelatedApplications}</h3>
                    </heading-text>
                    <ErrorBoundary>
                        <DistributionsList distributions={metadataDistributions.RelatedApplications} />
                    </ErrorBoundary>
                </div>
            ) : null;
        const relatedServiceLayersList =
            metadataDistributions?.RelatedServiceLayer?.length && metadataDistributions?.ShowRelatedServiceLayer ? (
                <div>
                    <heading-text>
                        <h3>{dispatch(getResource("Servicelayers", "Tjenestelag"))}</h3>
                    </heading-text>
                    <ErrorBoundary>
                        <DistributionsList distributions={metadataDistributions.RelatedServiceLayer} />
                    </ErrorBoundary>
                </div>
            ) : null;
        const relatedServicesList =
            metadataDistributions?.RelatedServices?.length && metadataDistributions?.ShowRelatedServices ? (
                <div>
                    <heading-text>
                        <h3>{dispatch(getResource("Services", "Tjenester"))}</h3>
                    </heading-text>
                    <ErrorBoundary>
                        <DistributionsList distributions={metadataDistributions.RelatedServices} />
                    </ErrorBoundary>
                </div>
            ) : null;
        const relatedViewServicesList =
            metadataDistributions?.RelatedViewServices?.length && metadataDistributions?.ShowRelatedViewServices ? (
                <div>
                    <heading-text>
                        <h3>{dispatch(getResource("DisplayServices", "Visningstjenester"))}</h3>
                    </heading-text>
                    <ErrorBoundary>
                        <DistributionsList distributions={metadataDistributions.RelatedViewServices} />
                    </ErrorBoundary>
                </div>
            ) : null;
        const relatedDownloadServicesList =
            metadataDistributions?.RelatedDownloadServices?.length &&
            metadataDistributions?.ShowRelatedDownloadServices ? (
                <div>
                    <heading-text>
                        <h3>{dispatch(getResource("DownloadServices", "Nedlastingstjenester"))}</h3>
                    </heading-text>
                    <ErrorBoundary>
                        <DistributionsList distributions={metadataDistributions.RelatedDownloadServices} />
                    </ErrorBoundary>
                </div>
            ) : null;

        const showDistributions =
            !!selfDistributionsList ||
            !!relatedDatasetList ||
            !!relatedSerieDatasetsList ||
            !!relatedDatasetSerieList ||
            !!relatedApplicationsList ||
            !!relatedServiceLayersList ||
            !!relatedServicesList ||
            !!relatedViewServicesList ||
            !!relatedDownloadServicesList;
        return showDistributions ? (
            <div>
                <heading-text>
                    <h2 underline="true">{dispatch(getResource("Distributions", "Distribusjoner"))}</h2>
                </heading-text>
                {selfDistributionsList}
                {relatedDatasetList}
                {relatedSerieDatasetsList}
                {relatedDatasetSerieList}
                {relatedApplicationsList}
                {relatedServiceLayersList}
                {relatedServicesList}
                {relatedViewServicesList}
                {relatedDownloadServicesList}
            </div>
        ) : null;
    };

    const renderContactSection = () => {
        const hasChildren = renderContactMetadata() || renderContactOwner() || renderContactPublisher();
        return hasChildren ? (
            <div>
                <heading-text>
                    <h2 underline="true">{dispatch(getResource("ContactInformation", "Kontaktinforsmasjon"))}</h2>
                </heading-text>
                <div className={style.flex}>
                    {renderContactMetadata()}
                    {renderContactOwner()}
                    {renderContactPublisher()}
                </div>
            </div>
        ) : null;
    };

    const renderDistributionSection = () => {
        const hasChildren = renderSpatialRepresentation() || renderDistributionsFormats() || renderReferenceSystems();
        return hasChildren ? (
            <div>
                <heading-text>
                    <h2 underline="true">{dispatch(getResource("Distribution", "Distribusjon"))}</h2>
                </heading-text>
                {renderSpatialRepresentation()}
                {renderDistributionsFormats()}
                {renderOperations()}
                {renderReferenceSystems()}
            </div>
        ) : null;
    };

    const renderConstraintsSection = () => {
        const hasChildren =
            renderUseLimitations() ||
            renderAccessConstraints() ||
            renderUseConstraints() ||
            renderOtherConstraints() ||
            renderOtherConstraintsLinkText() ||
            renderSecurityConstraints() ||
            renderSecurityConstraintsNote();
        return hasChildren ? (
            <div>
                <heading-text>
                    <h2 underline="true">{dispatch(getResource("Constraints", "Restriksjoner"))}</h2>
                </heading-text>
                {renderUseLimitations()}
                {renderAccessConstraints()}
                {renderUseConstraints()}
                {renderOtherConstraintsLinkText()}
                {renderOtherConstraints()}
                {renderSecurityConstraintsNote()}
                {renderSecurityConstraints()}
            </div>
        ) : null;
    };

    const renderSupplementalDescriptionSection = () => {
        return metadata?.SupplementalDescription?.length || metadata?.HelpUrl?.length ? (
            <div>
                <heading-text>
                    <h2 underline="true" id="help-info">
                        {dispatch(getResource("Display", "Vis"))} {dispatch(getResource("Help", "Hjelp"))}
                    </h2>
                </heading-text>
                <p style={{ whiteSpace: "pre-line" }}>{urlify(metadata.SupplementalDescription)}</p>
                {metadata.HelpUrl ? (
                    <a href={metadata.HelpUrl}>
                        {dispatch(getResource("Display", "Vis"))} {dispatch(getResource("Help", "Hjelp"))}
                    </a>
                ) : null}
            </div>
        ) : null;
    };

    const renderQualitySection = () => {
        const hasChildren =
            renderResolutionScale() ||
            renderResolutionDistance() ||
            renderStatus() ||
            renderProcessHistory() ||
            renderOrderingInstructions() ||
            renderContentInformation();
        return hasChildren ? (
            <div>
                <heading-text>
                    <h3>{dispatch(getResource("Quality", "Kvalitet"))}</h3>
                </heading-text>
                {renderResolutionScale()}
                {renderResolutionDistance()}
                {renderStatus()}
                {renderProcessHistory()}
                {renderOrderingInstructions()}
                {renderContentInformation()}
            </div>
        ) : (
            ""
        );
    };

    const renderGeneral = () => {
        const hasChildren =
            renderDatasetLanguage() || renderResourceReferenceCodespace() || renderResourceReferenceCode();
        return hasChildren ? (
            <div>
                {renderDatasetLanguage()}
                {renderResourceReferenceCodespace()}
                {renderResourceReferenceCode()}
            </div>
        ) : null;
    };

    const renderQualitySpecificationsSection = () => {
        const qualitySpecificationsList =
            metadata?.QualitySpecifications?.length &&
            metadata?.QualitySpecifications.map((qualitySpecification, index) => {
                return (
                    <div key={index}>
                        <p>
                            <strong>Standard: </strong>
                            {qualitySpecification.Title}
                        </p>
                        {qualitySpecification.SpecificationLink ? (
                            <p>
                                <strong>Link :</strong>{" "}
                                <a
                                    href={qualitySpecification.SpecificationLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {qualitySpecification.SpecificationLink}
                                </a>{" "}
                            </p>
                        ) : (
                            ""
                        )}
                        <p>
                            <strong>{dispatch(getResource("Date", "Dato"))}: </strong>
                            {qualitySpecification.Date !== undefined ? (
                                <Moment date={qualitySpecification.Date} format="DD.MM.YYYY" />
                            ) : (
                                ""
                            )}
                            ({qualitySpecification.DateType})
                        </p>
                        <p>
                            <strong>
                                {dispatch(getResource("QualitySpecificationExplanation", "Forklaring av resultat"))}:{" "}
                            </strong>
                            {qualitySpecification.Explanation}
                        </p>
                        <p>{qualitySpecification.Result ? "Godkjent" : "Ikke godkjent"}</p>
                        <hr />
                    </div>
                );
            });
        return qualitySpecificationsList?.length ? (
            <div>
                <heading-text>
                    <h3>{dispatch(getResource("QualitySpecification", "Konformitet"))}</h3>
                </heading-text>
                {qualitySpecificationsList}
            </div>
        ) : null;
    };

    const renderPurposeSection = () => {
        return metadata?.Purpose?.length ? (
            <div>
                <heading-text>
                    <h3>{dispatch(getResource("Purpose", "Formål"))}</h3>
                </heading-text>
                <p style={{ whiteSpace: "pre-line" }}>{urlify(metadata.Purpose)}</p>
            </div>
        ) : null;
    };

    const renderTimeAndSpaceSection = () => {
        const hasChildren =
            renderDateUpdated() ||
            renderMetadataDateUpdated() ||
            renderDateCreated() ||
            renderDatePublished() ||
            renderDateValidityPeriod() ||
            renderMaintenanceFrequency() ||
            renderKeywordsPlace() ||
            renderKeywordsAdministrativeUnits() ||
            renderBoundingBox() ||
            renderSpatialScope();
        return hasChildren ? (
            <div>
                <heading-text>
                    <h3>{dispatch(getResource("TimeAndSpace", "Tid og rom"))}</h3>
                </heading-text>
                {renderDateCreated()}
                {renderDateUpdated()}
                {renderMetadataDateUpdated()}
                {renderDatePublished()}
                {renderDateValidityPeriod()}
                {renderMaintenanceFrequency()}
                {renderKeywordsPlace()}
                {renderKeywordsAdministrativeUnits()}
                {renderBoundingBox()}
                {renderSpatialScope()}
            </div>
        ) : null;
    };

    const renderKeywordsSection = () => {
        const hasChildren =
            renderKeywordsTheme() ||
            renderKeywordsNationalTheme() ||
            renderKeywordsNationalInitiative() ||
            renderKeywordsInspire() ||
            renderTopicCategory() ||
            renderKeywordsConcept() ||
            renderKeywordsInspirePriorityDataset() ||
            renderKeywordsInspireCategory() ||
            renderKeywordsOther();
        return hasChildren ? (
            <div>
                <heading-text>
                    <h3>{dispatch(getResource("Facet_keyword", "Nøkkelord"))}</h3>
                </heading-text>
                <div className={style.keywordContainer}>
                    {renderKeywordsTheme()}
                    {renderKeywordsNationalTheme()}
                    {renderKeywordsNationalInitiative()}
                    {renderTopicCategory()}
                    {renderKeywordsConcept()}
                    {renderKeywordsInspirePriorityDataset()}
                    {renderKeywordsInspireCategory()}
                    {renderKeywordsOther()}
                </div>
            </div>
        ) : null;
    };

    const renderThumbnail = () => {
        let thumbnailList =
            metadata?.Thumbnails?.length &&
            metadata?.Thumbnails?.filter((thumbnail) => {
                return (
                    thumbnail.Type === "medium" || thumbnail.Type === "thumbnail" || thumbnail.Type === "miniatyrbilde"
                );
            });
        let thumbnail = "";
        if (thumbnailList !== undefined && thumbnailList?.length) {
            thumbnailList.sort((a, b) => (a.Type > b.Type ? 1 : -1));
            thumbnail = (
                <div className={style.thumbnailContent}>
                    <div>
                        <img src={thumbnailList[0].URL} alt={getTitle() + " illustrasjon"} />
                    </div>
                </div>
            );
        }
        return thumbnail;
    };

    const renderMetaDescription = (description) => {
        if (description) {
            const ellipsis = description.length > 155 ? "..." : "";
            return `${description.toString().trim().slice(0, 155)}${ellipsis}`;
        } else {
            return "";
        }
    };

    const getPageTitle = () => {
        if (getTitle()) {
            return getTitle();
        } else if (title) {
            return convertUrlSlugToText(title);
        } else {
            return "";
        }
    };

    const renderType = () => {
        if (metadata?.Type) {
            return <strong>Type: {metadata?.TypeTranslated}</strong>;
        }
    };

    const renderCanonicalTags = () => {
        let canonicalTagElements = [];
        if (uuid && metadata?.Title) {
            canonicalTagElements.push(
                <link
                    rel="canonical"
                    key="canonicalTag"
                    href={`${document.location.origin}/metadata/${convertTextToUrlSlug(metadata.Title)}/${uuid}`}
                />
            );
            canonicalTagElements.push(
                <link
                    rel="alternate"
                    key="norwegianUrl"
                    href={`${document.location.origin}/metadata/${convertTextToUrlSlug(metadata.Title)}/${uuid}`}
                    hrefLang="no"
                />
            );
            canonicalTagElements.push(
                <link
                    rel="alternate"
                    key="englishUrl"
                    href={`${document.location.origin}/metadata/${convertTextToUrlSlug(metadata.Title)}/${uuid}`}
                    hrefLang="en"
                />
            );
            canonicalTagElements.push(
                <link
                    rel="alternate"
                    key="defaultUrl"
                    href={`${document.location.origin}/metadata/${convertTextToUrlSlug(metadata.Title)}/${uuid}`}
                    hrefLang="x-default"
                />
            );
        }
        return canonicalTagElements;
    };

    const renderOpenGraphTags = () => {
        let openGraphTagElements = [];
        openGraphTagElements.push(
            <meta property="og:title" key="ogTitle" content={`${getPageTitle()} - Kartkatalogen`} />
        );
        openGraphTagElements.push(
            <meta
                property="og:description"
                key="ogDescription"
                content={metadata?.Abstract ? renderMetaDescription(getAbstract(metadata)) : ""}
            />
        );
        openGraphTagElements.push(
            <meta property="og:locale" key="ogLocale" content={selectedLanguage === "en" ? "en_US" : "en_NO"} />
        );

        if (uuid && metadata?.Title) {
            openGraphTagElements.push(
                <meta
                    property="og:url"
                    key="ogUrl"
                    content={`${document.location.origin}/metadata/${convertTextToUrlSlug(metadata?.Title)}/${uuid}`}
                />
            );
        }
        return openGraphTagElements;
    };

    const renderTwitterTags = () => {
        let twitterTagElements = [];
        twitterTagElements.push(
            <meta property="twitter:title" key="twitterTitle" content={`${getPageTitle()} - Kartkatalogen`} />
        );
        twitterTagElements.push(
            <meta
                property="twitter:description"
                key="twitterDescription"
                content={metadata?.Abstract ? renderMetaDescription(getAbstract(metadata)) : ""}
            />
        );
        return twitterTagElements;
    };

    const breadcrumbs = [
        {
            name: "Geonorge",
            url: "https://www.geonorge.no/"
        },
        {
            name: dispatch(getResource("AppPageTitle", "Kartkatalogen")),
            url: "/"
        },
        {
            name: getTitle(),
            url: window.location.pathname
        }
    ];

    const getMetadataQualityIconName = (fairStatus) => {
        switch (fairStatus) {
            case "deficient":
                return "status-deficient";
            case "useable":
                return "status-useable";
            case "satisfactory":
                return "status-satisfactory";
            case "good":
                return "status-good";
            default:
                return null;
        }
    };

    const renderMetadataQuality = (metadataQuality) => {
        if (metadataQuality && Object.keys(metadataQuality)?.length) {
            const iconName = getMetadataQualityIconName(metadataQuality?.FairStatus);
            const icon = iconName?.length ? <gn-icon icon={iconName} height="21px" width="21px"></gn-icon> : null;
            const detailsUrl = metadataQuality?.DetailsPage?.length && metadataQuality?.DetailsPage;
            const ariaLabel = `FAIR-status: ${
                metadataQuality.FAIRStatusPerCent
            }%. Klikk for å se detaljer om FAIR-status for ${getTitle()} i Geonorge Register. Åpnes i nytt vindu`;
            return (
                <div className={style.subTitle}>
                    {detailsUrl ? (
                        <a href={detailsUrl} target="_blank" rel="noopener noreferrer" aria-label={ariaLabel}>
                            FAIR-status: {metadataQuality.FAIRStatusPerCent}%
                        </a>
                    ) : (
                        <span>FAIR-status: {metadataQuality.FAIRStatusPerCent}%</span>
                    )}
                    {icon}
                </div>
            );
        } else {
            return null;
        }
    };

    return !metadata || !Object.keys(metadata).length === "An error has occurred." ? (
        <div className={style.searchResultContainer}>
            <span>Kunne ikke finne metadata på Uuid "{uuid}"</span>
        </div>
    ) : (
        <div>
            <Helmet>
                <title>{getPageTitle()} - Kartkatalogen</title>
                {renderCanonicalTags()}
                <meta
                    name="description"
                    content={metadata?.Abstract ? renderMetaDescription(getAbstract(metadata)) : ""}
                />
                <meta name="keywords" content="kartverket, geonorge, kartkatalog, kartkatalogen" />
                {renderOpenGraphTags()}
                {renderTwitterTags()}
            </Helmet>
            {getMetadataLinkedDataSnippet()}
            <breadcrumb-list id="breadcrumb-list" breadcrumbs={JSON.stringify(breadcrumbs)}></breadcrumb-list>
            <div className={style.content}>
                <header>
                    <heading-text>
                        <h1>{getTitle()}</h1>
                    </heading-text>
                </header>
                {renderMetadataQuality(metadataQuality)}
                {renderCredits()}
                <div className={style.openBtns} onClick={() => toggleBtns()}>
                    Velg tjeneste <FontAwesomeIcon icon={showBtns ? "angle-up" : "angle-down"} />
                </div>
                <div className={showBtns ? style.openBtnsContainer : `${style.openBtnsContainer} ${style.closed}`}>
                    <div className={style.btns}>
                        <ErrorBoundary>
                            <MapButton listButton={false} metadata={metadata} />
                        </ErrorBoundary>
                        <ErrorBoundary>
                            <DownloadButton listButton={false} metadata={metadata} />
                        </ErrorBoundary>
                        <ErrorBoundary>
                            <ShowCoverageButton metadata={metadata} />
                        </ErrorBoundary>
                        <ErrorBoundary>
                            <HelpButton metadata={metadata} />
                        </ErrorBoundary>
                        <ErrorBoundary>
                            <ContactOwnerButton metadata={metadata} />
                        </ErrorBoundary>
                        <ErrorBoundary>
                            <ProductSheetButton metadata={metadata} />
                        </ErrorBoundary>
                        <ErrorBoundary>
                            <ProductSpecificationButton metadata={metadata} />
                        </ErrorBoundary>
                        <ErrorBoundary>
                            <LegendDescriptionButton metadata={metadata} />
                        </ErrorBoundary>
                        <ErrorBoundary>
                            <ApplicationButton listButton={false} metadata={metadata} />
                        </ErrorBoundary>
                        <ErrorBoundary>
                            <ProductPageButton metadata={metadata} />
                        </ErrorBoundary>
                        <ErrorBoundary>
                            <DownloadXmlButton metadata={metadata} />
                        </ErrorBoundary>
                        <ErrorBoundary>
                            <EditMetadataButton metadata={metadata} />
                        </ErrorBoundary>
                    </div>
                </div>
                <pre></pre>
                <div className={style.flex}>
                    <div className={style.textContent}>
                        <div>{renderType()}</div>
                        {metadata?.Abstract ? (
                            <div data-color-mode="light">
                                <MDEditor.Markdown id="abstract" source={getAbstract(metadata)} />
                            </div>
                        ) : null}
                    </div>
                    {renderThumbnail()}
                </div>

                {renderSpecificUsageSection()}
                {renderDistributionsListSection()}
                <div className={style.flex2}>
                    {renderDistributionSection()}
                    {renderConstraintsSection()}
                </div>

                {renderContactSection()}

                {renderSupplementalDescriptionSection()}

                <div
                    role="button"
                    aria-expanded={expanded}
                    aria-controls="detailed-information"
                    className={style.opendetails}
                    onClick={() => toggleExpand()}
                >
                    <heading-text>
                        <h2 underline="true">
                            {dispatch(getResource("DetailedInformation", "Detaljert informasjon"))}
                            <FontAwesomeIcon
                                title={
                                    expanded
                                        ? "Trekk sammen"
                                        : `${dispatch(getResource("Display", "Vis"))} ${dispatch(
                                              getResource("DetailedInformation", "Detaljert informasjon")
                                          )}`
                                }
                                icon={expanded ? "angle-up" : "angle-down"}
                            />
                        </h2>
                    </heading-text>
                </div>
                <div id="detailed-information" className={expanded ? style.open : style.closed}>
                    {renderGeneral()}
                    <div className={style.flex}>
                        {renderQualitySection()}
                        {renderTimeAndSpaceSection()}
                        {renderKeywordsSection()}
                    </div>
                    {renderQualitySpecificationsSection()}
                    {renderPurposeSection()}
                </div>
            </div>
        </div>
    );
};

export default Metadata;
