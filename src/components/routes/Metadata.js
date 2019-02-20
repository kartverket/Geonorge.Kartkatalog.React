import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {clearMetadata, fetchMetadata} from '../../actions/MetadataActions'
import {clearMetadataDistributions, fetchMetadataDistributions} from '../../actions/MetadataDistributionActions'

import DistributionsList from "./Metadata/DistributionsList";

import style from "./Metadata.scss";
import {ErrorBoundary} from '../ErrorBoundary'

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

    renderSpecificUsage() {
        if (this.props.metadata.SpecificUsage) {
            return (
                <div>
                    <h2>Bruksområde</h2>
                    <div>{this.props.metadata.SpecificUsage}</div>
                </div>
            )
        }
    }

    renderDistributions() {
        const hasSelfDistributions = this.props.metadataDistributions && this.props.metadataDistributions.SelfDistribution && this.props.metadataDistributions.SelfDistribution.length;
        const showSelfDistributions = this.props.metadataDistributions && this.props.metadataDistributions.ShowSelfDistribution;

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
                <ErrorBoundary><DistributionsList
                    distributions={this.props.metadataDistributions.SelfDistribution}/></ErrorBoundary>
            </div>
        ) : '';
        const relatedDatasetList = hasRelatedDataset && showRelatedDataset ? (
            <div>
                <h3>Datasett</h3>
                <DistributionsList distributions={this.props.metadataDistributions.RelatedDataset}/>
            </div>
        ) : '';
        const relatedApplicationsList = hasRelatedApplications && showRelatedApplications ? (
            <div>
                <h3>{this.props.clearMetadataDistributions.TitleRelatedApplications}</h3>
                <DistributionsList distributions={this.props.metadataDistributions.RelatedApplications}/>
            </div>
        ) : '';
        const relatedServicesList = hasRelatedServices && showRelatedServices ? (
            <div>
                <h3>Tjenester</h3>
                <DistributionsList distributions={this.props.metadataDistributions.RelatedServices}/>
            </div>
        ) : '';
        const relatedServiceLayersList = hasRelatedServiceLayers && showRelatedServiceLayers ? (
            <div>
                <h3>Tjenestelag</h3>
                <DistributionsList distributions={this.props.metadataDistributions.RelatedServiceLayer}/>
            </div>
        ) : '';
        const relatedViewServicesList = hasRelatedViewServices && showRelatedViewServices ? (
            <div>
                <h3>Visningstjenester</h3>
                <ErrorBoundary><DistributionsList distributions={this.props.metadataDistributions.RelatedViewServices}/></ErrorBoundary>
            </div>
        ) : '';
        const relatedDownloadServicesList = hasRelatedDownloadServices && showRelatedDownloadServices ? (
            <div>
                <h3>Nedlastingstjenester</h3>
                <ErrorBoundary><DistributionsList
                    distributions={this.props.metadataDistributions.RelatedDownloadServices}/></ErrorBoundary>
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
                <h3>Format</h3>
                {distributionFormatsList}
            </div>
        ) : '';
    }

    renderSpatialRepresentation() {
        return this.props.metadata && this.props.metadata.SpatialRepresentation ? (
            <div>
                <strong>Representasjonsform: </strong>{this.props.metadata.SpatialRepresentation}
                <div>
                </div>
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

                <div>{this.renderSpecificUsage()}</div>

                {this.renderDistributions()}

                <h2>Kontaktinforsmasjon</h2>
                {this.renderContactMetadata()}
                {this.renderContactOwner()}
                {this.renderContactPublisher()}

                <h2>Distribusjon</h2>
                {this.renderSpatialRepresentation()}
                {this.renderDistributionFormats()}

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
