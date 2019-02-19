import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {clearMetadata, fetchMetadata} from '../../actions/MetadataActions'
import {clearMetadataDistributions, fetchMetadataDistributions} from '../../actions/MetadataDistributionActions'

import DistributionsList from "./Metadata/DistributionsList";

import style from "./Metadata.scss";
import { ErrorBoundary } from '../ErrorBoundary'

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

    renderDistributions() {
        const hasSelfDistributions = this.props.metadataDistributions && this.props.metadataDistributions.SelfDistribution && this.props.metadataDistributions.SelfDistribution.length;
        const showSelfDistributions = this.props.metadataDistributions && this.props.metadataDistributions.ShowSelfDistribution;

        const hasRelatedViewServices = this.props.metadataDistributions && this.props.metadataDistributions.RelatedViewServices && this.props.metadataDistributions.RelatedViewServices.length;
        const showRelatedViewServices = this.props.metadataDistributions && this.props.metadataDistributions.ShowRelatedViewServices;

        const hasRelatedDownloadServices = this.props.metadataDistributions && this.props.metadataDistributions.RelatedDownloadServices && this.props.metadataDistributions.RelatedDownloadServices.length;
        const showRelatedDownloadServices = this.props.metadataDistributions && this.props.metadataDistributions.ShowRelatedDownloadServices;

        const selfDistributionsList = hasSelfDistributions && showSelfDistributions ? (
            <div>
                <h3>{this.props.metadataDistributions.TitleSelf}</h3>
                <ErrorBoundary><DistributionsList distributions={this.props.metadataDistributions.SelfDistribution}/></ErrorBoundary>
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
                <ErrorBoundary><DistributionsList distributions={this.props.metadataDistributions.RelatedDownloadServices}/></ErrorBoundary>
            </div>
        ) : '';

        const showDistributions = (hasSelfDistributions && showSelfDistributions)
            || (hasRelatedViewServices && showRelatedViewServices)
            || (hasRelatedDownloadServices && showRelatedDownloadServices);

        return showDistributions ? (
            <div>
                <h2>Distribusjoner</h2>
                {selfDistributionsList}
                {relatedViewServicesList}
                {relatedDownloadServicesList}
            </div>
        ) : '';
    }


    render() {
        if (this.props.metadata.Message === "An error has occurred.") {
            return <div className={style.searchResultContainer}>
                <span>Kunne ikke finne metadata på Uuid "{this.props.match.params.uuid}"</span></div>
        } else {
            return (
                <div>
                    <h1>{this.props.metadata.Title}</h1>
                    <div>{this.props.metadata.Abstract}</div>

                    <div>{this.renderSpecificUsage()}</div>

                    {this.renderDistributions()}

                    <h2>Kontaktinforsmasjon</h2>
                    {this.renderContactMetadata()}
                    {this.renderContactOwner()}
                    {this.renderContactPublisher()}
                </div>
            )
        }
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
