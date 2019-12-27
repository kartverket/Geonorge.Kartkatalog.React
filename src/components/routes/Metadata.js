// Dependencies
import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import Moment from 'react-moment';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// Actions
import { getResource } from '../../actions/ResourceActions'
import { clearMetadata, fetchMetadata } from '../../actions/MetadataActions'
import { clearMetadataDistributions, fetchMetadataDistributions } from '../../actions/MetadataDistributionActions'

// Helpers
import { convertTextToUrlSlug, convertUrlSlugToText } from '../../helpers/UrlHelpers';

// Components
import { ErrorBoundary } from '../ErrorBoundary'
import DistributionsList from "./Metadata/DistributionsList";
import ProductSheetButton from '../partials/Buttons/ProductsheetButton';
import ProductSpecificationButton from '../partials/Buttons/ProductSpecificationButton';
import LegendDescriptionButton from '../partials/Buttons/LegendDescriptionButton';
import ContactOwnerButton from '../partials/Buttons/ContactOwnerButton';
import ProductPageButton from '../partials/Buttons/ProductPageButton';
import ApplicationButton from '../partials/Buttons/ApplicationButton';
import MapButton from '../partials/Buttons/MapButton';
import DownloadButton from '../partials/Buttons/DownloadButton';
import HelpButton from '../partials/Buttons/HelpButton';
import ShowCoverageButton from '../partials/Buttons/ShowCoverageButton';
import DownloadXmlButton from '../partials/Buttons/DownloadXmlButton';
import EditMetadataButton from '../partials/Buttons/EditMetadataButton';
import Breadcrumb from '../partials/Breadcrumb';

// Stylesheets
import style from "./Metadata.scss";

class Metadata extends Component {

    constructor(props) {
        super(props);
        this.state = {
            expanded: false,
            showBtns: false
        };
    }

    getMetadataLinkedDataSnippet(metadata) {
      if (metadata && Object.keys(metadata).length){
        const snippet = {
          "@context": "http://schema.org",
          "@type": "Dataset",
          "@id": `https://kartkatalog.geonorge.no/${window.location.pathname}`,
          "name": metadata.Title,
          "description": metadata.Abstract,
          "abstract": metadata.Abstract,
          "datePublished": metadata.DatePublished,
          "dateModified": metadata.DateUpdated,
          "license": metadata.Constraints && metadata.Constraints.OtherConstraintsLink ? metadata.Constraints.OtherConstraintsLink : '',
          "author": {
            "@type": "Organization",
            "name": metadata.ContactOwner && metadata.ContactOwner.Organization ? metadata.ContactOwner.Organization : '',
            "legalName": metadata.ContactOwner && metadata.ContactOwner.Organization ? metadata.ContactOwner.Organization : '',
            "email": metadata.ContactOwner && metadata.ContactOwner.Email ? metadata.ContactOwner.Email : ''
          },
          "publisher": {
            "@type": "Organization",
            "name": metadata.ContactPublisher && metadata.ContactPublisher.Organization ? metadata.ContactPublisher.Organization : '',
            "legalName": metadata.ContactPublisher && metadata.ContactPublisher.Organization ? metadata.ContactPublisher.Organization : '',
            "email": metadata.ContactPublisher && metadata.ContactPublisher.Email ? metadata.ContactPublisher.Email: ''
          }
        }
        return (<Helmet>
          <script type="application/ld+json">{`${JSON.stringify(snippet)}`}</script>
        </Helmet>)
      }else return '';
  }

    toggleExpand() {
        this.setState(prevState => ({
            expanded: !prevState.expanded && !prevState.expandedDownload
        }))
    }
    toggleBtns() {
        this.setState(prevState => ({
            showBtns: !prevState.showBtns && !prevState.expandedBtns
        }))
    }

    fetchApiData() {
        this.props.clearMetadata();
        this.props.fetchMetadata(this.props.match.params.uuid);
        this.props.clearMetadataDistributions();
        this.props.fetchMetadataDistributions(this.props.match.params.uuid);
    }

    componentDidMount() {
        this.fetchApiData();
    }

    componentDidUpdate(prevProps) {
        if (this.props.location.pathname !== prevProps.location.pathname || this.props.selectedLanguage !== prevProps.selectedLanguage) {
            this.fetchApiData();
        }
    }

    renderDatasetLanguage() {
        return this.props.metadata && this.props.metadata.DatasetLanguage ? (
            <div>
                <strong>{this.props.getResource('LanguageInDataset', 'Språk i datasett')}:</strong> {this.props.metadata.DatasetLanguage}
            </div>
        ) : ''
    }

    renderResourceReferenceCodespace() {
        return this.props.metadata && this.props.metadata.ResourceReferenceCodespace ? (
            <div>
                <strong>{this.props.getResource('NamespaceToDataset', 'Navnerom til datasett')}:</strong> {this.props.metadata.ResourceReferenceCodespace}
            </div>
        ) : ''
    }

    renderResourceReferenceCode() {
        return this.props.metadata && this.props.metadata.ResourceReferenceCode ? (
            <div>
                <strong>{this.props.getResource('DatasetName', 'Datasett-ID')}:</strong> {this.props.metadata.ResourceReferenceCode}
            </div>
        ) : ''
    }  


    renderContactMetadata() {
        if (this.props.metadata && this.props.metadata.ContactMetadata) {
            return (
                <div>
                    <h3>{this.props.getResource('ContactMetadata', 'Metadatakontakt')}</h3>
                    <div>
                        <a href={"mailto:" + this.props.metadata.ContactMetadata.Email}>{this.props.metadata.ContactMetadata.Name}</a>
                    </div>
                    <div>
                        <a href={"mailto:" + this.props.metadata.ContactMetadata.Email}>{this.props.metadata.ContactMetadata.Email}</a> - {this.props.metadata.ContactMetadata.Organization}
                    </div>
                </div>
            )
        } else {
            return "";
        }
    }

    renderContactOwner() {
        if (this.props.metadata && this.props.metadata.ContactOwner) {
            return (
                <div>
                    <h3>{this.props.getResource('ContactOwner', 'Faglig kontakt')}</h3>
                    <div>
                        <a href={"mailto:" + this.props.metadata.ContactOwner.Email}>{this.props.metadata.ContactOwner.Name}</a>
                    </div>
                    <div>
                        <a href={"mailto:" + this.props.metadata.ContactOwner.Email}>{this.props.metadata.ContactOwner.Email}</a> - {this.props.metadata.ContactOwner.Organization}
                    </div>
                </div>
            )
        } else {
            return "";
        }
    }

    renderContactPublisher() {
        if (this.props.metadata && this.props.metadata.ContactPublisher) {
            return (
                <div>
                    <h3>{this.props.getResource('ContactPublisher', 'Teknisk kontakt')}</h3>
                    <div>
                        <a href={"mailto:" + this.props.metadata.ContactPublisher.Email}>{this.props.metadata.ContactPublisher.Email}</a> - {this.props.metadata.ContactPublisher.Organization}
                    </div>
                </div>
            )
        } else {
            return "";
        }
    }

    renderSpatialRepresentation() {
        return this.props.metadata && this.props.metadata.SpatialRepresentation ? (
            <div>
                <strong>{this.props.getResource('SpatialRepresentation', 'Representasjonsform')}: </strong>{this.props.metadata.SpatialRepresentation}
            </div>
        ) : '';
    }

    renderDistributionFormats() {
        const hasDistributionFormats = this.props.metadata.DistributionFormats && this.props.metadata.DistributionFormats.length;
        const distributionFormatsList = hasDistributionFormats && this.props.metadata.DistributionFormats.map((distributionFormat, index) => {
            return (
                <li key={index}>
                    {distributionFormat.Name} {distributionFormat.Version}
                </li>
            )
        });
        return hasDistributionFormats ? (
            <div>
                <h3>Format:</h3>
                {distributionFormatsList}
            </div>
        ) : '';
    }

    renderDistributionDetails() {
        const hasProtocolName = this.props.metadata && this.props.metadata.DistributionDetails && this.props.metadata.DistributionDetails.ProtocolName;
        return hasProtocolName ? (
            <div>
                <strong>{this.props.getResource('DistributionType', 'Distribusjonstype')}: </strong>{this.props.metadata.DistributionDetails.ProtocolName}
            </div>
        ) : '';
    }

    renderDistributionUrl() {
        const distributionUrl = this.props.metadata && this.props.metadata.DistributionUrl;
        return distributionUrl ? (
            <div>
                <strong>Get Capabilites Url: </strong><a href={this.props.metadata.DistributionUrl}>{this.props.metadata.DistributionUrl}</a>
            </div>
        ) : '';
    }

    renderUnitsOfDistribution() {
        return this.props.metadata.UnitsOfDistribution ? (
            <div>
                <strong>{this.props.getResource('UnitsOfDistribution', 'Geografisk distribusjonsinndeling')}: </strong>{this.props.metadata.UnitsOfDistribution}
            </div>
        ) : '';
    }

    renderReferenceSystems() {
        const hasReferenceSystems = this.props.metadata && this.props.metadata.ReferenceSystems && this.props.metadata.ReferenceSystems.length;
        const referenceSystemList = hasReferenceSystems && this.props.metadata.ReferenceSystems.map((referenceSystem, index) => {
            return (
                <li key={index}>
                    {referenceSystem.CoordinateSystem}
                </li>
            )
        });
        return hasReferenceSystems ? (
            <div>
                <h3>{this.props.getResource('ReferenceSystems', 'Romlig referansesystem')}:</h3>
                {referenceSystemList}
            </div>
        ) : '';
    }

    renderUseLimitations() {
        const hasUseLimitations = this.props.metadata && this.props.metadata.Constraints && this.props.metadata.Constraints.UseLimitations;
        return hasUseLimitations ? (
            <div>
                <strong>{this.props.getResource('UseLimitations', 'Bruksbegrensninger')}: </strong>{this.props.metadata.Constraints.UseLimitations}
            </div>
        ) : '';
    }

    renderAccessConstraints() {
        const hasAccessConstraints = this.props.metadata && this.props.metadata.Constraints && this.props.metadata.Constraints.AccessConstraints;
        return hasAccessConstraints ? (
            <div>
                <strong>{this.props.getResource('AccessConstraints', 'Tilgangsrestriksjoner')}: </strong>{this.props.metadata.Constraints.AccessConstraints}
            </div>
        ) : '';
    }

    renderUseConstraints() {
        const hasUseConstraints = this.props.metadata && this.props.metadata.Constraints && this.props.metadata.Constraints.UseConstraints;
        return hasUseConstraints ? (
            <div>
                <strong>{this.props.getResource('UseConstraints', 'Brukerrestriksjoner')}: </strong>{this.props.metadata.Constraints.UseConstraints}
            </div>
        ) : '';
    }

    renderOtherConstraintsLinkText() {
        const hasOtherConstraintsLinkText = this.props.metadata && this.props.metadata.Constraints && this.props.metadata.Constraints.OtherConstraintsLinkText;
        return hasOtherConstraintsLinkText ? (
            <div>
                <strong>{this.props.getResource('Licence', 'Lisens')}: </strong>{this.props.metadata.Constraints.OtherConstraintsLinkText}
            </div>
        ) : '';
    }

    renderOtherConstraints() {
        const hasOtherConstraints = this.props.metadata && this.props.metadata.Constraints && this.props.metadata.Constraints.OtherConstraints;
        return hasOtherConstraints ? (
            <div>
                <strong>{this.props.getResource('OtherConstraints', 'Andre restriksjoner')}: </strong>{this.props.metadata.Constraints.OtherConstraints}
            </div>
        ) : '';
    }

    renderSecurityConstraintsNote() {
        const hasSecurityConstraintsNote = this.props.metadata && this.props.metadata.Constraints && this.props.metadata.Constraints.SecurityConstraintsNote;
        return hasSecurityConstraintsNote ? (
            <div>
                <strong>{this.props.getResource('SecurityConstraintsNote', 'Lovhenvisning')}: </strong>{this.props.metadata.Constraints.SecurityConstraintsNote}
            </div>
        ) : '';
    }

    renderSecurityConstraints() {
        const hasSecurityConstraints = this.props.metadata && this.props.metadata.Constraints && this.props.metadata.Constraints.SecurityConstraints;
        return hasSecurityConstraints ? (
            <div>
                <strong>{this.props.getResource('SecurityConstraints', 'Sikkerhetsnivå')}: </strong>{this.props.metadata.Constraints.SecurityConstraints}
            </div>
        ) : '';
    }

    renderResolutionScale() {
        return this.props.metadata && this.props.metadata.ResolutionScale ? (
            <div>
                <strong>{this.props.getResource('ResolutionScale', 'Målestokkstall')}: </strong>{this.props.metadata.ResolutionScale}
            </div>
        ) : ''
    }

    renderStatus() {
        return this.props.metadata && this.props.metadata.Status ? (
            <div>
                <strong>Status: </strong>{this.props.metadata.Status}
            </div>
        ) : ''
    }

    renderProcessHistory() {
        return this.props.metadata && this.props.metadata.ProcessHistory ? (
            <div>
                <strong>{this.props.getResource('ProcessHistory', 'Prosesshistorie')}: </strong>{this.props.metadata.ProcessHistory}
            </div>
        ) : ''
    }

    renderOrderingInstructions() {
        return this.props.metadata && this.props.metadata.OrderingInstructions ? (
            <div>
    <strong>{this.props.getResource('ServiceDeclaration', 'Tjenesteerklæring')}: </strong><a href={this.props.metadata.OrderingInstructions} target="_blank">{this.props.metadata.OrderingInstructionsLinkText}</a>
            </div>
        ) : ''
    }

    renderDateCreated() {
        return this.props.metadata && this.props.metadata.DateCreated ? (
            <div>
                <strong>{this.props.getResource('Created', 'Oppretet')} ({this.props.getResource('Resource', 'Ressurs')}): </strong><Moment format="DD.MM.YYYY" date={this.props.metadata.DateCreated} />
            </div>
        ) : ''
    }

    renderDateUpdated() {
        return this.props.metadata && this.props.metadata.DateUpdated ? (
            <div>
                <strong>{this.props.getResource('Updated', 'Oppdatert')} ({this.props.getResource('Resource', 'Ressurs')}): </strong><Moment format="DD.MM.YYYY" date={this.props.metadata.DateUpdated} />
            </div>
        ) : ''
    }

    renderMetadataDateUpdated() {
        return this.props.metadata && this.props.metadata.MetadataDateUpdated ? (
            <div>
                <strong>{this.props.getResource('Updated', 'Oppdatert')} (Metadata): </strong><Moment format="DD.MM.YYYY" date={this.props.metadata.MetadataDateUpdated} />
            </div>
        ) : ''
    }

    renderDatePublished() {
        return this.props.metadata && this.props.metadata.DatePublished ? (
            <div>
                <strong>{this.props.getResource('Published', 'Publisert')}: </strong><Moment format="DD.MM.YYYY" date={this.props.metadata.DatePublished} />
            </div>
        ) : ''
    }

    renderDateValidityPeriod() {
        const validFrom = this.props.metadata && this.props.metadata.DatePublished ? this.props.metadata.DateMetadataValidFrom : '';
        const validTo = this.props.metadata && this.props.metadata.DatePublished ? this.props.metadata.DateMetadataValidTo : '';
        return validFrom || validTo ? (
            <div>
                <strong>{this.props.getResource('ValidityPeriod', 'Gyldighetsperiode')}: </strong><Moment format="DD.MM.YYYY" date={validFrom} />  - <Moment format="DD.MM.YYYY" date={validTo} />
            </div>
        ) : ''
    }

    renderMaintenanceFrequency() {
        return this.props.metadata && this.props.metadata.MaintenanceFrequency ? (
            <div>
                <strong>{this.props.getResource('MaintenanceFrequency', 'Oppdateringshyppighet')}: </strong>{this.props.metadata.MaintenanceFrequency}
            </div>
        ) : ''
    }

    renderSpatialScope() {
        return this.props.metadata && this.props.metadata.SpatialScope ? (
            <div>
                <strong>{this.props.getResource('Facet_spatialscope', 'Dekningsområde')}: </strong>{this.props.metadata.SpatialScope}
            </div>
        ) : ''
    }

    renderKeywordsPlace() {
        const hasKeywordsPlace = this.props.metadata.KeywordsPlace && this.props.metadata.KeywordsPlace.length;
        const keywordsPlaceList = hasKeywordsPlace && this.props.metadata.KeywordsPlace.map((keywordPlace, index) => {
            return (
                <li key={index}>
                    {keywordPlace.KeywordValue}
                </li>
            )
        });
        return hasKeywordsPlace ? (
            <div>
                <h3>{this.props.getResource('KeywordsPlace', 'Geografisk område')}:</h3>
                {keywordsPlaceList}
            </div>
        ) : '';
    }

    renderBoundingBox() {
        return this.props.metadata.BoundingBox ? (
            <div>
                <h3>{this.props.getResource('BoundingBox', 'Geografisk utstrekning')}:</h3>
                <ul>
                    <li>{this.props.getResource('North', 'Nord')}: {this.props.metadata.BoundingBox.NorthBoundLatitude}</li>
                    <li>{this.props.getResource('South', 'Sør')}: {this.props.metadata.BoundingBox.SouthBoundLatitude}</li>
                    <li>{this.props.getResource('East', 'Øst')}: {this.props.metadata.BoundingBox.EastBoundLongitude}</li>
                    <li>{this.props.getResource('West', 'Vest')}: {this.props.metadata.BoundingBox.WestBoundLongitude}</li>
                </ul>
            </div>
        ) : '';
    }

    renderKeywordsTheme() {
        const hasKeywordsTheme = this.props.metadata.KeywordsTheme && this.props.metadata.KeywordsTheme.length;
        const keywordsThemeList = hasKeywordsTheme && this.props.metadata.KeywordsTheme.map((keywordTheme, index) => {
            return (
                <li key={index}>
                    {keywordTheme.KeywordValue}
                </li>
            )
        });
        return hasKeywordsTheme ? (
            <div>
                <h3>{this.props.getResource('Facet_theme', 'Tema')}:</h3>
                {keywordsThemeList}
            </div>
        ) : '';
    }

    renderKeywordsNationalTheme() {
        const hasKeywordsNationalTheme = this.props.metadata.KeywordsNationalTheme && this.props.metadata.KeywordsNationalTheme.length;
        const keywordsNationalThemeList = hasKeywordsNationalTheme && this.props.metadata.KeywordsNationalTheme.map((keywordNationalTheme, index) => {
            return (
                <li key={index}>
                    {keywordNationalTheme.KeywordValue}
                </li>
            )
        });
        return hasKeywordsNationalTheme ? (
            <div>
                <h3>{this.props.getResource('KeywordsNationalTheme', 'Nasjonale tema')}:</h3>
                {keywordsNationalThemeList}
            </div>
        ) : '';
    }

    renderKeywordsNationalInitiative() {
        const hasKeywordsNationalInitiative = this.props.metadata.KeywordsNationalInitiative && this.props.metadata.KeywordsNationalInitiative.length;
        const keywordsNationalInitiativeList = hasKeywordsNationalInitiative && this.props.metadata.KeywordsNationalInitiative.map((keywordNationalInitiative, index) => {
            return (
                <li key={index}>
                    {keywordNationalInitiative.KeywordValue}
                </li>
            )
        });
        return hasKeywordsNationalInitiative ? (
            <div>
                <h3>{this.props.getResource('Facet_nationalinitiative', 'Samarbeid og lover')}:</h3>
                {keywordsNationalInitiativeList}
            </div>
        ) : '';
    }

    renderKeywordsInspire() {
        const hasKeywordsInspire = this.props.metadata.KeywordsInspire && this.props.metadata.KeywordsInspire.length;
        const keywordsInspireList = hasKeywordsInspire && this.props.metadata.KeywordsInspire.map((keywordInspire, index) => {
            return (
                <li key={index}>
                    {keywordInspire.KeywordValue}
                </li>
            )
        });
        return hasKeywordsInspire ? (
            <div>
                <h3>Inspire:</h3>
                {keywordsInspireList}
            </div>
        ) : '';
    }

    renderKeywordsConcept() {
        const hasKeywordsConcept = this.props.metadata.KeywordsConcept && this.props.metadata.KeywordsConcept.length;
        const keywordsConceptList = hasKeywordsConcept && this.props.metadata.KeywordsConcept.map((keywordConcept, index) => {
            return (
                <li key={index}>
                    <a href={keywordConcept.KeywordLink} target="_blank">{keywordConcept.KeywordValue}</a>
                </li>
            )
        });
        return hasKeywordsConcept ? (
            <div>
                <strong>{this.props.getResource('Concept', 'Begreper')}:</strong>
                {keywordsConceptList}
            </div>
        ) : '';
    }

    renderKeywordsInspirePriorityDataset() {
        const hasKeywordsInspirePriorityDataset = this.props.metadata.KeywordsInspirePriorityDataset && this.props.metadata.KeywordsInspirePriorityDataset.length;
        const keywordsInspirePriorityDatasetList = hasKeywordsInspirePriorityDataset && this.props.metadata.KeywordsInspirePriorityDataset.map((keywordInspirePriorityDataset, index) => {
            return (
                <li key={index}>
                    <a href={keywordInspirePriorityDataset.KeywordLink} target="_blank">{keywordInspirePriorityDataset.KeywordValue}</a>
                </li>
            )
        });
        return hasKeywordsInspirePriorityDataset ? (
            <div>
                <strong>{this.props.getResource('EuPriorityDataset', 'EU - prioriterte datasett')}:</strong>
                {keywordsInspirePriorityDatasetList}
            </div>
        ) : '';
    }

    renderKeywordsInspireCategory() {
        const hasKeywordsInspire = this.props.metadata.KeywordsInspire && this.props.metadata.KeywordsInspire.length;
        const keywordsInspireList = hasKeywordsInspire && this.props.metadata.KeywordsInspire.map((keywordInspire, index) => {
            return (
                <li key={index}>
                    {keywordInspire.KeywordValue}
                </li>
            )
        });
        return hasKeywordsInspire ? (
            <div>
                <strong>{this.props.getResource('Metadata_KeywordsInspire_Label', 'Inspire kategorier')}:</strong>
                {keywordsInspireList}
            </div>
        ) : '';
    }

    renderKeywordsOther() {
        const hasKeywordsOther = this.props.metadata.KeywordsOther && this.props.metadata.KeywordsOther.length;
        const keywordsOtherList = hasKeywordsOther && this.props.metadata.KeywordsOther.map((keywordOther, index) => {
            return (
                <li key={index}>
                    {keywordOther.KeywordValue}
                </li>
            )
        });
        return hasKeywordsOther ? (
            <div>
                <strong>{this.props.getResource('Metadata_KeywordsOther_Label', 'Ukategoriserte nøkkelord')}:</strong>
                {keywordsOtherList}
            </div>
        ) : '';
    }

    renderKeywordsAdministrativeUnits() {
        const hasKeywordsAdministrativeUnits = this.props.metadata.KeywordsAdministrativeUnits && this.props.metadata.KeywordsAdministrativeUnits.length;
        const keywordsAdministrativeUnitsList = hasKeywordsAdministrativeUnits && this.props.metadata.KeywordsAdministrativeUnits.map((keywordAdministrativeUnits, index) => {
            return keywordAdministrativeUnits.KeywordLink ? (
                <li key={index}>
                    <a href={keywordAdministrativeUnits.KeywordLink}>
                        {keywordAdministrativeUnits.KeywordValue}
                    </a>
                </li>
            ) : (
                    <li key={index}>
                        <span>
                            {keywordAdministrativeUnits.KeywordValue}
                        </span>
                    </li>
                )
        });
        return hasKeywordsAdministrativeUnits ? (
            <div>
                <h3>{this.props.getResource('KeywordsAdministrativeUnits', 'Administrative enheter')}:</h3>
                {keywordsAdministrativeUnitsList}
            </div>
        ) : '';
    }

    renderTopicCategory() {
        return this.props.metadata && this.props.metadata.TopicCategory ? (
            <div>
                <strong>{this.props.getResource('TopicCategory', 'Tematisk hovedkategori')}: </strong>{this.props.metadata.TopicCategory}
            </div>
        ) : ''
    }

    renderSpecificUsageSection() {
        if (this.props.metadata.SpecificUsage) {
            return (
                <div>
                    <h2>{this.props.getResource('SpecificUsage', 'Bruksområde')}</h2>
                    <div>{this.props.metadata.SpecificUsage}</div>
                </div>
            )
        }
    }

    renderDistributionsListSection() {
        const hasSelfDistributions = this.props.metadataDistributions && this.props.metadataDistributions.SelfDistribution && this.props.metadataDistributions.SelfDistribution.length;
        const showSelfDistributions = this.props.metadataDistributions && this.props.metadataDistributions.ShowSelfDistributions;

        const hasRelatedDataset = this.props.metadataDistributions && this.props.metadataDistributions.RelatedDataset && this.props.metadataDistributions.RelatedDataset.length;
        const showRelatedDataset = this.props.metadataDistributions && this.props.metadataDistributions.ShowRelatedDataset;

        const hasRelatedApplications = this.props.metadataDistributions && this.props.metadataDistributions.RelatedApplications && this.props.metadataDistributions.RelatedApplications.length;
        const showRelatedApplications = this.props.metadataDistributions && this.props.metadataDistributions.ShowRelatedApplications;

        const hasRelatedServices = this.props.metadataDistributions && this.props.metadataDistributions.RelatedServices && this.props.metadataDistributions.RelatedServices.length;
        const showRelatedServices = this.props.metadataDistributions && this.props.metadataDistributions.ShowRelatedServices;

        const hasRelatedServiceLayers = this.props.metadataDistributions && this.props.metadataDistributions.RelatedServiceLayer && this.props.metadataDistributions.RelatedServiceLayer.length;
        const showRelatedServiceLayers = this.props.metadataDistributions && this.props.metadataDistributions.ShowRelatedServiceLayer;

        const hasRelatedViewServices = this.props.metadataDistributions && this.props.metadataDistributions.RelatedViewServices && this.props.metadataDistributions.RelatedViewServices.length;
        const showRelatedViewServices = this.props.metadataDistributions && this.props.metadataDistributions.ShowRelatedViewServices;

        const hasRelatedDownloadServices = this.props.metadataDistributions && this.props.metadataDistributions.RelatedDownloadServices && this.props.metadataDistributions.RelatedDownloadServices.length;
        const showRelatedDownloadServices = this.props.metadataDistributions && this.props.metadataDistributions.ShowRelatedDownloadServices;

        const selfDistributionsList = hasSelfDistributions && showSelfDistributions ? (
            <div>
                <h3>{this.props.metadataDistributions.TitleSelf}</h3>
                <ErrorBoundary>
                    <DistributionsList distributions={this.props.metadataDistributions.SelfDistribution} />
                </ErrorBoundary>
            </div>
        ) : '';
        const relatedDatasetList = hasRelatedDataset && showRelatedDataset ? (
            <div>
                <h3>{this.props.getResource('Facet_type_dataset', 'Datasett')}</h3>
                <ErrorBoundary>
                    <DistributionsList distributions={this.props.metadataDistributions.RelatedDataset} />
                </ErrorBoundary>
            </div>
        ) : '';
        const relatedApplicationsList = hasRelatedApplications && showRelatedApplications ? (
            <div>
                <h3>{this.props.metadataDistributions.TitleRelatedApplications}</h3>
                <ErrorBoundary>
                    <DistributionsList distributions={this.props.metadataDistributions.RelatedApplications} />
                </ErrorBoundary>
            </div>
        ) : '';
        const relatedServicesList = hasRelatedServices && showRelatedServices ? (
            <div>
                <h3>{this.props.getResource('Services', 'Tjenester')}</h3>
                <ErrorBoundary>
                    <DistributionsList distributions={this.props.metadataDistributions.RelatedServices} />
                </ErrorBoundary>
            </div>
        ) : '';
        const relatedServiceLayersList = hasRelatedServiceLayers && showRelatedServiceLayers ? (
            <div>
                <h3>{this.props.getResource('Servicelayers', 'Tjenestelag')}</h3>
                <ErrorBoundary>
                    <DistributionsList distributions={this.props.metadataDistributions.RelatedServiceLayer} />
                </ErrorBoundary>
            </div>
        ) : '';
        const relatedViewServicesList = hasRelatedViewServices && showRelatedViewServices ? (
            <div>
                <h3>{this.props.getResource('DisplayServices', 'Visningstjenester')}</h3>
                <ErrorBoundary>
                    <DistributionsList distributions={this.props.metadataDistributions.RelatedViewServices} />
                </ErrorBoundary>
            </div>
        ) : '';
        const relatedDownloadServicesList = hasRelatedDownloadServices && showRelatedDownloadServices ? (
            <div>
                <h3>{this.props.getResource('DownloadServices', 'Nedlastingstjenester')}</h3>
                <ErrorBoundary>
                    <DistributionsList distributions={this.props.metadataDistributions.RelatedDownloadServices} />
                </ErrorBoundary>
            </div>
        ) : '';

        const showDistributions = (hasSelfDistributions && showSelfDistributions)
            || (hasRelatedDataset && showRelatedDataset)
            || (hasRelatedApplications && showRelatedApplications)
            || (hasRelatedServices && showRelatedServices)
            || (hasRelatedServiceLayers && showRelatedServiceLayers)
            || (hasRelatedServices && showRelatedServices)
            || (hasRelatedViewServices && showRelatedViewServices)
            || (hasRelatedDownloadServices && showRelatedDownloadServices);

        return showDistributions ? (
            <div>
                <h2>{this.props.getResource('Distributions', 'Distribusjoner')}</h2>

                {selfDistributionsList}
                {relatedDatasetList}
                {relatedApplicationsList}
                {relatedServiceLayersList}
                {relatedServicesList}
                {relatedViewServicesList}
                {relatedDownloadServicesList}
            </div>
        ) : '';
    }

    renderContactSection() {
        const hasChildren = this.renderContactMetadata() || this.renderContactOwner() || this.renderContactPublisher();
        return hasChildren ? (
            <div>
                <h2>{this.props.getResource('ContactInformation', 'Kontaktinforsmasjon')}</h2>
                <div className={style.flex}>
                    {this.renderContactMetadata()}
                    {this.renderContactOwner()}
                    {this.renderContactPublisher()}
                </div>
            </div>
        ) : '';
    }

    renderDistributionSection() {
        const hasChildren = this.renderSpatialRepresentation() || this.renderDistributionFormats() || this.renderDistributionDetails() || this.renderUnitsOfDistribution() || this.renderReferenceSystems();
        return hasChildren ? (
            <div>
                <h2>{this.props.getResource('Distribution', 'Distribusjon')}</h2>
                {this.renderSpatialRepresentation()}
                {this.renderDistributionFormats()}
                {this.renderDistributionDetails()}
                {this.renderDistributionUrl()}
                {this.renderUnitsOfDistribution()}
                {this.renderReferenceSystems()}
            </div>
        ) : '';
    }

    renderConstraintsSection() {
        const hasChildren = this.renderUseLimitations() || this.renderAccessConstraints() || this.renderUseConstraints() || this.renderOtherConstraints() || this.renderOtherConstraintsLinkText() || this.renderSecurityConstraints() || this.renderSecurityConstraintsNote();
        return hasChildren ? (
            <div>
                <h2>{this.props.getResource('Constraints', 'Restriksjoner')}</h2>
                {this.renderUseLimitations()}
                {this.renderAccessConstraints()}
                {this.renderUseConstraints()}
                {this.renderOtherConstraintsLinkText()}
                {this.renderOtherConstraints()}
                {this.renderSecurityConstraintsNote()}
                {this.renderSecurityConstraints()}
            </div>
        ) : '';
    }

    renderSupplementalDescriptionSection() {
        return this.props.metadata && this.props.metadata.SupplementalDescription && this.props.metadata.HelpUrl ? (
            <div>
                <h2>{this.props.getResource('Display', 'Vis')} {this.props.getResource('Help', 'Hjelp')}</h2>
                <p>{this.props.metadata.SupplementalDescription}</p>
                <a href={this.props.metadata.HelpUrl}>{this.props.getResource('Display', 'Vis')} {this.props.getResource('Help', 'Hjelp')}</a>
            </div>
        ) : ''
    }

    renderQualitySection() {
        const hasChildren = this.renderResolutionScale() || this.renderStatus() || this.renderProcessHistory() || this.renderOrderingInstructions();
        return hasChildren ? (
            <div>
                <h2>{this.props.getResource('Quality', 'Kvalitet')}</h2>
                {this.renderResolutionScale()}
                {this.renderStatus()}
                {this.renderProcessHistory()}
                {this.renderOrderingInstructions()}
            </div>
        ) : '';
    }

    renderGeneral() {
        const hasChildren = this.renderDatasetLanguage() || this.renderResourceReferenceCodespace() || this.renderResourceReferenceCode();
         return hasChildren ? ( 
            <div>
                {this.renderDatasetLanguage()}
                {this.renderResourceReferenceCodespace()}
                {this.renderResourceReferenceCode()}
            </div>
         ): '';
    }

    renderQualitySpecificationsSection() {
        const hasQualitySpecifications = this.props.metadata && this.props.metadata.QualitySpecifications && this.props.metadata.QualitySpecifications.length;
        const qualitySpecificationsList = hasQualitySpecifications && this.props.metadata.QualitySpecifications.map((qualitySpecification, index) => {
            return (
                <div key={index}>
                    <p><strong>Standard: </strong>{qualitySpecification.Title}</p>
                    {qualitySpecification.SpecificationLink ? <p><strong>Link :</strong> <a href={qualitySpecification.SpecificationLink} target="_blank">{qualitySpecification.SpecificationLink}</a>  </p> : ''}
                    <p><strong>{this.props.getResource('Date', 'Dato')}: </strong><Moment date={qualitySpecification.Date} format="DD.MM.YYYY" /> ({qualitySpecification.DateType})</p>
                    <p><strong>{this.props.getResource('QualitySpecificationExplanation', 'Forklaring av resultat')}: </strong>{qualitySpecification.Explanation}</p>
                    <p>{qualitySpecification.Result ? 'Godkjent' : 'Ikke godkjent'}</p>
                    <hr />
                </div>
            )
        });
        return hasQualitySpecifications ? (
            <div>
                <h2>{this.props.getResource('QualitySpecification', 'Konformitet')}</h2>
                {qualitySpecificationsList}
            </div>
        ) : '';
    }

    renderPurposeSection() {
        return this.props.metadata && this.props.metadata.Purpose ? (
            <div>
                <h2>{this.props.getResource('Purpose', 'Formål')}</h2>
                <div>{this.props.metadata.Purpose}</div>
            </div>
        ) : ''
    }

    renderTimeAndSpaceSection() {
        const hasChildren = this.renderDateUpdated()
            || this.renderMetadataDateUpdated()
            || this.renderDateCreated()
            || this.renderDatePublished()
            || this.renderDateValidityPeriod()
            || this.renderMaintenanceFrequency()
            || this.renderKeywordsPlace()
            || this.renderBoundingBox()
            || this.renderSpatialScope();
        return hasChildren ? (
            <div>
                <h2>{this.props.getResource('TimeAndSpace', 'Tid og rom')}</h2>
                {this.renderDateCreated()}
                {this.renderDateUpdated()}
                {this.renderMetadataDateUpdated()}
                {this.renderDatePublished()}
                {this.renderDateValidityPeriod()}
                {this.renderMaintenanceFrequency()}
                {this.renderKeywordsPlace()}
                {this.renderBoundingBox()}
                {this.renderSpatialScope()}
            </div>
        ) : '';
    }

    renderKeywordsSection() {
        const hasChildren = this.renderKeywordsTheme()
            || this.renderKeywordsNationalTheme()
            || this.renderKeywordsNationalInitiative()
            || this.renderKeywordsInspire()
            || this.renderKeywordsAdministrativeUnits()
            || this.renderTopicCategory()
            || this.renderKeywordsConcept()
            || this.renderKeywordsInspirePriorityDataset()
            || this.renderKeywordsInspireCategory()
            || this.renderKeywordsOther()
            ;
        return hasChildren ? (
            <div>
                <h2>{this.props.getResource('Facet_keyword', 'Nøkkelord')}</h2>
                {this.renderKeywordsTheme()}
                {this.renderKeywordsNationalTheme()}
                {this.renderKeywordsNationalInitiative()}
                {this.renderKeywordsAdministrativeUnits()}
                {this.renderTopicCategory()}
                {this.renderKeywordsConcept()}
                {this.renderKeywordsInspirePriorityDataset()}
                {this.renderKeywordsInspireCategory()}
                {this.renderKeywordsOther()}
            </div>
        ) : '';
    }
    renderThumbnail() {
        const hasThumbnail = this.props.metadata && this.props.metadata.Thumbnails && this.props.metadata.Thumbnails.length;
        const thumbnailList = hasThumbnail && this.props.metadata.Thumbnails.filter(thumbnail => {
            return thumbnail.Type === 'medium' || thumbnail.Type === "thumbnail" || thumbnail.Type === "miniatyrbilde"
        }).map((thumbnail, index) => {
            return (
                <div key={index}>
                    <img src={thumbnail.URL} alt={this.props.metadata.Title + ' illustrasjon'} title={this.props.metadata.Title + ' illustrasjon'} />
                </div>
            )
        })

        return hasThumbnail ? (
            thumbnailList
        ) : '';
    }

    renderMetaDescription(description) {
        if (description){
            const ellipsis = description.length > 155 ? '...' : '';
            return `${description.trim().slice(0, 155)}${ellipsis}`;
        }
        else {
            return '';
        }
    }

    getPageTitle(){
      if (this.props.metadata.Title){
        return this.props.metadata.Title;
      }else if (this.props.match.params.title){
        return convertUrlSlugToText(this.props.match.params.title);
      }else {
        return '';
      }
    }

    renderCanonicalTags(){
      let canonicalTagElements = [];
      if (this.props.match.params.uuid){
        canonicalTagElements.push(<link rel="canonical" key='paramsTitle' href={`${document.location.origin}/metadata/${this.props.match.params.uuid}`} />);
      }
      if (this.props.metadata && this.props.metadata.Title){
        canonicalTagElements.push(<link rel="canonical" key='metadataTitle' href={`${document.location.origin}/metadata/${convertTextToUrlSlug(this.props.metadata.Title)}/${this.props.match.params.uuid}`} />);
      }
      canonicalTagElements.push(<link rel="canonical" key='paramsTitle' href={`${document.location.origin}/metadata/uuid/${this.props.match.params.uuid}`} />);
      return canonicalTagElements;
    }

    render() {
        return !this.props.metadata || (this.props.metadata.Message && this.props.metadata.Message === "An error has occurred.") ? (
            <div className={style.searchResultContainer}>
                <span>Kunne ikke finne metadata på Uuid "{this.props.match.params.uuid}"</span>
            </div>
        ) : (
                <div>
                    <Helmet>
                        <title>{this.getPageTitle()} - Kartkatalogen</title>
                        {this.renderCanonicalTags()}
                        <meta name="description" content={this.props.metadata && this.props.metadata.Abstract ? this.renderMetaDescription(this.props.metadata.Abstract) : ''} />
                        <meta name="keywords" content="kartverket, geonorge, kartkatalog, kartkatalogen" />
                    </Helmet>
                    {this.getMetadataLinkedDataSnippet(this.props.metadata)}
                    <Breadcrumb content={this.props.metadata.Title} />
                    <div className={style.content}>

                        <h1>{this.props.metadata.Title}</h1>
                        <div className={style.openBtns} onClick={() => this.toggleBtns()}>Velg tjeneste <FontAwesomeIcon icon={this.state.showBtns ? 'angle-up' : 'angle-down'} /></div>
                        <div className={this.state.showBtns ? style.openBtnsContainer : style.openBtnsContainer + ' closed'}>
                            <div className={style.btns}>

                                <ErrorBoundary>
                                    <MapButton listButton={false} metadata={this.props.metadata} />
                                </ErrorBoundary>
                                <ErrorBoundary>
                                    <DownloadButton listButton={false} metadata={this.props.metadata} />
                                </ErrorBoundary>
                                <ErrorBoundary>
                                    <ShowCoverageButton metadata={this.props.metadata} />
                                </ErrorBoundary>
                                <ErrorBoundary>
                                    <HelpButton metadata={this.props.metadata} />
                                </ErrorBoundary>
                                <ErrorBoundary>
                                    <ContactOwnerButton metadata={this.props.metadata} />
                                </ErrorBoundary>
                                <ErrorBoundary>
                                    <ProductSheetButton metadata={this.props.metadata} />
                                </ErrorBoundary>
                                <ErrorBoundary>
                                    <ProductSpecificationButton metadata={this.props.metadata} />
                                </ErrorBoundary>
                                <ErrorBoundary>
                                    <LegendDescriptionButton metadata={this.props.metadata} />
                                </ErrorBoundary>
                                <ErrorBoundary>
                                    <ApplicationButton listButton={false} metadata={this.props.metadata} />
                                </ErrorBoundary>
                                <ErrorBoundary>
                                    <ProductPageButton metadata={this.props.metadata} />
                                </ErrorBoundary>
                                <ErrorBoundary>
                                    <DownloadXmlButton metadata={this.props.metadata} />
                                </ErrorBoundary>
                                <ErrorBoundary>
                                    <EditMetadataButton metadata={this.props.metadata} />
                                </ErrorBoundary>

                            </div>
                        </div>
                        <div className={style.flex}>
                            <p>{this.props.metadata.Abstract}</p>
                            {this.renderThumbnail()}
                        </div>

                        {this.renderSpecificUsageSection()}
                        {this.renderDistributionsListSection()}
                        <div className={style.flex2}>
                            {this.renderDistributionSection()}
                            {this.renderConstraintsSection()}
                        </div>

                        {this.renderContactSection()}

                        {this.renderSupplementalDescriptionSection()}

                        <div className={style.opendetails} onClick={() => this.toggleExpand()}>
                            <h2>{this.props.getResource('DetailedInformation', 'Detaljert informasjon')}
                                <FontAwesomeIcon title={this.state.expanded ? 'Trekk sammen' : `${this.props.getResource('Display', 'Vis')} ${this.props.getResource('DetailedInformation', 'Detaljert informasjon')}`} icon={this.state.expanded ? 'angle-up' : 'angle-down'} /></h2></div>
                        <div className={this.state.expanded ? style.open : style.closed}>
                            {this.renderGeneral()}
                            <div className={style.flex}>
                                {this.renderQualitySection()}
                                {this.renderTimeAndSpaceSection()}
                                {this.renderKeywordsSection()}
                            </div>
                            {this.renderQualitySpecificationsSection()}
                            {this.renderPurposeSection()}
                        </div>
                    </div>
                </div>
            )
    }
}

Metadata.propTypes = {
    metadata: PropTypes.object.isRequired,
    clearMetadata: PropTypes.func.isRequired,
    fetchMetadata: PropTypes.func.isRequired,
    clearMetadataDistributions: PropTypes.func.isRequired,
    fetchMetadataDistributions: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    metadata: state.metadata,
    metadataDistributions: state.metadataDistributions,
    selectedLanguage: state.selectedLanguage,
    resources: state.resources
});

const mapDispatchToProps = {
    clearMetadata,
    fetchMetadata,
    clearMetadataDistributions,
    fetchMetadataDistributions,
    getResource
};

export default connect(mapStateToProps, mapDispatchToProps)(Metadata);
