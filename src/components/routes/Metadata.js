import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {clearMetadata, fetchMetadata} from '../../actions/MetadataActions'
import {clearMetadataDistributions, fetchMetadataDistributions} from '../../actions/MetadataDistributionActions'

import DistributionsList from "./Metadata/DistributionsList";

import style from "./Metadata.scss";
import {ErrorBoundary} from '../ErrorBoundary'
import ProductsheetButton from '../partials/Buttons/ProductsheetButton';
import { ProductspesificationButton } from '../partials/Buttons/ProductspesificationButton';
import { LegendDescriptionButton } from '../partials/Buttons/LegendDescriptionButton';
import { ContactOwnerButton } from '../partials/Buttons/ContactOwnerButton';
import { ProductPageButton } from '../partials/Buttons/ProductPageButton';

class Metadata extends Component {
    fetchApiData() {
        this.props.clearMetadata();
        this.props.fetchMetadata(this.props.match.params.uuid);
        this.props.clearMetadataDistributions();
        this.props.fetchMetadataDistributions(this.props.match.params.uuid);
    }

    componentWillMount() {
        this.fetchApiData();
    }

    componentDidUpdate(prevProps) {
        if (this.props.location.pathname !== prevProps.location.pathname) {
            this.fetchApiData();
        }
    }

    renderContactMetadata() {
        if (this.props.metadata && this.props.metadata.ContactMetadata) {
            return (
                <div>
                    <h3>Metadatakontakt</h3>
                    <div>
                        <a href={this.props.metadata.ContactMetadata.Email}>{this.props.metadata.ContactMetadata.Name}</a>
                    </div>
                    <div>
                        <a href={this.props.metadata.ContactMetadata.Email}>{this.props.metadata.ContactMetadata.Email}</a> - {this.props.metadata.ContactMetadata.Organization}
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
                    <h3>Faglig kontakt</h3>
                    <div>
                        <a href={this.props.metadata.ContactOwner.Email}>{this.props.metadata.ContactOwner.Name}</a>
                    </div>
                    <div>
                        <a href={this.props.metadata.ContactOwner.Email}>{this.props.metadata.ContactOwner.Email}</a> - {this.props.metadata.ContactOwner.Organization}
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
                    <h3>Teknisk kontakt</h3>
                    <div>
                        <a href={this.props.metadata.ContactPublisher.Email}>{this.props.metadata.ContactPublisher.Email}</a> - {this.props.metadata.ContactPublisher.Organization}
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
                <strong>Representasjonsform: </strong>{this.props.metadata.SpatialRepresentation}
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
                <strong>Distribusjonstype: </strong>{this.props.metadata.DistributionDetails.ProtocolName}
            </div>
        ) : '';
    }

    renderUnitsOfDistribution() {
        return this.props.metadata.UnitsOfDistribution ? (
            <div>
                <strong>Geografisk distribusjonsinndeling: </strong>{this.props.metadata.UnitsOfDistribution}
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
                <h3>Romlig referansesystem:</h3>
                {referenceSystemList}
            </div>
        ) : '';
    }

    renderUseLimitations() {
        const hasUseLimitations = this.props.metadata && this.props.metadata.Constraints && this.props.metadata.Constraints.UseLimitations;
        return hasUseLimitations ? (
            <div>
                <strong>Bruksbegrensninger: </strong>{this.props.metadata.Constraints.UseLimitations}
            </div>
        ) : '';
    }

    renderAccessConstraints() {
        const hasAccessConstraints = this.props.metadata && this.props.metadata.Constraints && this.props.metadata.Constraints.AccessConstraints;
        return hasAccessConstraints ? (
            <div>
                <strong>Tilgangsrestriksjoner: </strong>{this.props.metadata.Constraints.AccessConstraints}
            </div>
        ) : '';
    }

    renderUseConstraints() {
        const hasUseConstraints = this.props.metadata && this.props.metadata.Constraints && this.props.metadata.Constraints.UseConstraints;
        return hasUseConstraints ? (
            <div>
                <strong>Brukerrestriksjoner: </strong>{this.props.metadata.Constraints.UseConstraints}
            </div>
        ) : '';
    }

    renderOtherConstraintsLinkText() {
        const hasOtherConstraintsLinkText = this.props.metadata && this.props.metadata.Constraints && this.props.metadata.Constraints.OtherConstraintsLinkText;
        return hasOtherConstraintsLinkText ? (
            <div>
                <strong>Lisens: </strong>{this.props.metadata.Constraints.OtherConstraintsLinkText}
            </div>
        ) : '';
    }

    renderSecurityConstraints() {
        const hasSecurityConstraints = this.props.metadata && this.props.metadata.Constraints && this.props.metadata.Constraints.SecurityConstraints;
        return hasSecurityConstraints ? (
            <div>
                <strong>Sikkerhetsnivå: </strong>{this.props.metadata.Constraints.SecurityConstraints}
            </div>
        ) : '';
    }

    renderResolutionScale() {
        return this.props.metadata && this.props.metadata.ResolutionScale ? (
            <div>
                <strong>Målestokkstall: </strong>{this.props.metadata.ResolutionScale}
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
                <strong>Prosesshistorie: </strong>{this.props.metadata.ProcessHistory}
            </div>
        ) : ''
    }

    renderDateUpdated() {
        return this.props.metadata && this.props.metadata.DateUpdated ? (
            <div>
                <strong>Oppdatert (Ressurs): </strong>{this.props.metadata.DateUpdated}
            </div>
        ) : ''
    }

    renderMetadataDateUpdated() {
        return this.props.metadata && this.props.metadata.MetadataDateUpdated ? (
            <div>
                <strong>Oppdatert (Metadata): </strong>{this.props.metadata.MetadataDateUpdated}
            </div>
        ) : ''
    }

    renderDatePublished() {
        return this.props.metadata && this.props.metadata.DatePublished ? (
            <div>
                <strong>Publisert: </strong>{this.props.metadata.DatePublished}
            </div>
        ) : ''
    }

    renderDateValidityPeriod() {
        const validFrom = this.props.metadata && this.props.metadata.DatePublished ? this.props.metadata.DateMetadataValidFrom : '';
        const validTo = this.props.metadata && this.props.metadata.DatePublished ? this.props.metadata.DateMetadataValidTo : '';
        return validFrom || validTo ? (
            <div>
                <strong>Gyldighetsperiode: </strong>{validFrom} - {validTo}
            </div>
        ) : ''
    }

    renderMaintenanceFrequency() {
        return this.props.metadata && this.props.metadata.MaintenanceFrequency ? (
            <div>
                <strong>Oppdateringshyppighet: </strong>{this.props.metadata.MaintenanceFrequency}
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
                <h3>Geografisk område:</h3>
                {keywordsPlaceList}
            </div>
        ) : '';
    }

    renderBoundingBox() {
        return this.props.metadata.BoundingBox ? (
            <div>
                <h3>Geografisk utstrekning:</h3>
                <ul>
                    <li>Nord: {this.props.metadata.BoundingBox.NorthBoundLatitude}</li>
                    <li>Sør: {this.props.metadata.BoundingBox.SouthBoundLatitude}</li>
                    <li>Øst: {this.props.metadata.BoundingBox.EastBoundLongitude}</li>
                    <li>Vest: {this.props.metadata.BoundingBox.WestBoundLongitude}</li>
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
                <h3>Tema:</h3>
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
                <h3>Nasjonale tema:</h3>
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
                <h3>Samarbeid og lover:</h3>
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
                <h3>Administrative enheter:</h3>
                {keywordsAdministrativeUnitsList}
            </div>
        ) : '';
    }

    renderTopicCategory() {
        return this.props.metadata && this.props.metadata.TopicCategory ? (
            <div>
                <strong>Tematisk hovedkategori: </strong>{this.props.metadata.TopicCategory}
            </div>
        ) : ''
    }

    renderSpecificUsageSection() {
        if (this.props.metadata.SpecificUsage) {
            return (
                <div>
                    <h2>Bruksområde</h2>
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
                    <DistributionsList distributions={this.props.metadataDistributions.SelfDistribution}/>
                </ErrorBoundary>
            </div>
        ) : '';
        const relatedDatasetList = hasRelatedDataset && showRelatedDataset ? (
            <div>
                <h3>Datasett</h3>
                <ErrorBoundary>
                    <DistributionsList distributions={this.props.metadataDistributions.RelatedDataset}/>
                </ErrorBoundary>
            </div>
        ) : '';
        const relatedApplicationsList = hasRelatedApplications && showRelatedApplications ? (
            <div>
                <h3>{this.props.clearMetadataDistributions.TitleRelatedApplications}</h3>
                <ErrorBoundary>
                    <DistributionsList distributions={this.props.metadataDistributions.RelatedApplications}/>
                </ErrorBoundary>
            </div>
        ) : '';
        const relatedServicesList = hasRelatedServices && showRelatedServices ? (
            <div>
                <h3>Tjenester</h3>
                <ErrorBoundary>
                    <DistributionsList distributions={this.props.metadataDistributions.RelatedServices}/>
                </ErrorBoundary>
            </div>
        ) : '';
        const relatedServiceLayersList = hasRelatedServiceLayers && showRelatedServiceLayers ? (
            <div>
                <h3>Tjenestelag</h3>
                <ErrorBoundary>
                    <DistributionsList distributions={this.props.metadataDistributions.RelatedServiceLayer}/>
                </ErrorBoundary>
            </div>
        ) : '';
        const relatedViewServicesList = hasRelatedViewServices && showRelatedViewServices ? (
            <div>
                <h3>Visningstjenester</h3>
                <ErrorBoundary>
                    <DistributionsList distributions={this.props.metadataDistributions.RelatedViewServices}/>
                </ErrorBoundary>
            </div>
        ) : '';
        const relatedDownloadServicesList = hasRelatedDownloadServices && showRelatedDownloadServices ? (
            <div>
                <h3>Nedlastingstjenester</h3>
                <ErrorBoundary>
                    <DistributionsList distributions={this.props.metadataDistributions.RelatedDownloadServices}/>
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
                <h2>Distribusjoner</h2>
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
                <h2>Kontaktinforsmasjon</h2>
                {this.renderContactMetadata()}
                {this.renderContactOwner()}
                {this.renderContactPublisher()}
            </div>
        ) : '';
    }

    renderDistributionSection() {
        const hasChildren = this.renderSpatialRepresentation() || this.renderDistributionFormats() || this.renderDistributionDetails() || this.renderUnitsOfDistribution() || this.renderReferenceSystems();
        return hasChildren ? (
            <div>
                <h2>Distribusjon</h2>
                {this.renderSpatialRepresentation()}
                {this.renderDistributionFormats()}
                {this.renderDistributionDetails()}
                {this.renderUnitsOfDistribution()}
                {this.renderReferenceSystems()}
            </div>
        ) : '';
    }

    renderConstraintsSection() {
        const hasChildren = this.renderUseLimitations() || this.renderAccessConstraints() || this.renderUseConstraints() || this.renderOtherConstraintsLinkText() || this.renderSecurityConstraints();
        return hasChildren ? (
            <div>
                <h2>Restriksjoner</h2>
                {this.renderUseLimitations()}
                {this.renderAccessConstraints()}
                {this.renderUseConstraints()}
                {this.renderOtherConstraintsLinkText()}
                {this.renderSecurityConstraints()}
            </div>
        ) : '';
    }

    renderSupplementalDescriptionSection() {
        return this.props.metadata && this.props.metadata.SupplementalDescription && this.props.metadata.HelpUrl ? (
            <div>
                <h2>Hjelp</h2>
                <p>{this.props.metadata.SupplementalDescription}</p>
                <a href={this.props.metadata.HelpUrl}>Vis hjelp</a>
            </div>
        ) : ''
    }

    renderQualitySection() {
        const hasChildren = this.renderResolutionScale() || this.renderStatus() || this.renderProcessHistory();
        return hasChildren ? (
            <div>
                <h2>Kvalitet</h2>
                {this.renderResolutionScale()}
                {this.renderStatus()}
                {this.renderProcessHistory()}
            </div>
        ) : '';
    }

    renderQualitySpecificationsSection() {
        const hasQualitySpecifications = this.props.metadata && this.props.metadata.QualitySpecifications && this.props.metadata.QualitySpecifications.length;
        const qualitySpecificationsList = hasQualitySpecifications && this.props.metadata.QualitySpecifications.map((qualitySpecification, index) => {
            return (
                <div key={index}>
                    <p><strong>Standard: </strong>{qualitySpecification.Title}</p>
                    <p><strong>Dato: </strong>{qualitySpecification.Date} ({qualitySpecification.DateType})</p>
                    <p><strong>Forklaring av resultat: </strong>{qualitySpecification.Explanation}</p>
                    <p>{qualitySpecification.Result ? 'Godkjent' : 'Ikke godkjent'}</p>
                    <hr/>
                </div>
            )
        });
        return hasQualitySpecifications ? (
            <div>
                <h2>Konformitet</h2>
                {qualitySpecificationsList}
            </div>
        ) : '';
    }

    renderPurposeSection() {
        return this.props.metadata && this.props.metadata.Purpose ? (
            <div>
                <h2>Formål</h2>
                {this.props.metadata.Purpose}
            </div>
        ) : ''
    }

    renderTimeAndSpaceSection() {
        const hasChildren = this.renderDateUpdated()
            || this.renderMetadataDateUpdated()
            || this.renderDatePublished()
            || this.renderDateValidityPeriod()
            || this.renderMaintenanceFrequency()
            || this.renderKeywordsPlace()
            || this.renderBoundingBox();
        return hasChildren ? (
            <div>
                <h2>Tid og rom</h2>
                {this.renderDateUpdated()}
                {this.renderMetadataDateUpdated()}
                {this.renderDatePublished()}
                {this.renderDateValidityPeriod()}
                {this.renderKeywordsPlace()}
                {this.renderBoundingBox()}
            </div>
        ) : '';
    }

    renderKeywordsSection() {
        const hasChildren = this.renderKeywordsTheme()
            || this.renderKeywordsNationalTheme()
            || this.renderKeywordsNationalInitiative()
            || this.renderKeywordsInspire()
            || this.renderKeywordsAdministrativeUnits()
            || this.renderTopicCategory();
        return hasChildren ? (
            <div>
                <h2>Nøkkelord</h2>
                {this.renderKeywordsTheme()}
                {this.renderKeywordsNationalTheme()}
                {this.renderKeywordsNationalInitiative()}
                {this.renderKeywordsAdministrativeUnits()}
                {this.renderTopicCategory()}
            </div>
        ) : '';
    }

    render() {
        return this.props.metadata.Message === "An error has occurred." ? (
            <div className={style.searchResultContainer}>
                <span>Kunne ikke finne metadata på Uuid "{this.props.match.params.uuid}"</span>
            </div>
        ) : (
            <div className={style.content}>
                <h1>{this.props.metadata.Title}</h1>
                <div>{this.props.metadata.Abstract}</div>
                <div className={style.btns}>
                    <ErrorBoundary>
                        <ProductsheetButton metadata={this.props.metadata}/>
                    </ErrorBoundary>
                    <ErrorBoundary>
                        <ProductspesificationButton metadata={this.props.metadata}/>
                    </ErrorBoundary>
                    <ErrorBoundary>
                        <LegendDescriptionButton metadata={this.props.metadata}/>
                    </ErrorBoundary>
                    <ErrorBoundary>
                        <ContactOwnerButton metadata={this.props.metadata}/>
                    </ErrorBoundary>
                    <ErrorBoundary>
                        <ProductPageButton metadata={this.props.metadata}/>
                    </ErrorBoundary>
                </div>
                {this.renderSpecificUsageSection()}
                {this.renderDistributionsListSection()}
                {this.renderContactSection()}
                {this.renderDistributionSection()}
                {this.renderConstraintsSection()}
                {this.renderSupplementalDescriptionSection()}

                <span>Detaljert informasjon</span>
                <div>
                    {this.renderQualitySection()}
                    {this.renderQualitySpecificationsSection()}
                    {this.renderPurposeSection()}
                    {this.renderTimeAndSpaceSection()}
                    {this.renderKeywordsSection()}
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
    metadataDistributions: state.metadataDistributions
});

const mapDispatchToProps = {
    clearMetadata,
    fetchMetadata,
    clearMetadataDistributions,
    fetchMetadataDistributions
};

export default connect(mapStateToProps, mapDispatchToProps)(Metadata);
