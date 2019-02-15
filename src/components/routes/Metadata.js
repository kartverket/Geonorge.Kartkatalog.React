import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {fetchMetadata} from '../../actions/MetadataActions'
import {fetchMetadataDistributions} from '../../actions/MetadataDistributionActions'
import MetadataSearchResult from "../partials/SearchResults/MetadataSearchResult";
import style from "./Metadata.scss";

class Metadata extends Component {
    componentWillMount() {
        this.props.fetchMetadata(this.props.match.params.uuid);
        this.props.fetchMetadataDistributions(this.props.match.params.uuid);
    }

    renderSelfDistributions() {
        if (this.props.metadataDistributions && this.props.metadataDistributions.SelfDistribution && this.props.metadataDistributions.SelfDistribution.length) {
            const selfDistributions = this.props.metadataDistributions.SelfDistribution.map((selfDistribution, i) => {
                return <MetadataSearchResult searchResult={selfDistribution} key={i}/>;
            });
            return (
                <div>
                    <h3>{this.props.metadataDistributions.TitleSelf}</h3>
                    <div className={style.maplist}>{selfDistributions}</div>
                </div>
            )
        } else {
            return "";
        }
    }

    renderRelatedViewServices() {
        if (this.props.metadataDistributions && this.props.metadataDistributions.RelatedViewServices && this.props.metadataDistributions.RelatedViewServices.length) {
            const relatedViewServices = this.props.metadataDistributions.RelatedViewServices.map((relatedViewService, i) => {
                return <MetadataSearchResult searchResult={relatedViewService} key={i}/>;
            });
            return (
                <div>
                    <h3>Visningstjenester</h3>
                    <div className={style.maplist}>{relatedViewServices}</div>
                </div>
            )
        } else {
            return "";
        }
    }

    renderRelatedDownloadServices() {
        if (this.props.metadataDistributions && this.props.metadataDistributions.RelatedDownloadServices && this.props.metadataDistributions.RelatedDownloadServices.length) {
            const relatedDownloadServices = this.props.metadataDistributions.RelatedDownloadServices.map((relatedDownloadService, i) => {
                return <MetadataSearchResult searchResult={relatedDownloadService} key={i}/>;
            });
            return (
                <div>
                    <h3>Nedlastingstjenester</h3>
                    <div className={style.maplist}>{relatedDownloadServices}</div>
                </div>
            );
        } else {
            return "";
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


    render() {
        return (
            <div>
                <h1>{this.props.metadata.Title}</h1>
                <div>{this.props.metadata.Abstract}</div>

                <h2>Bruksområde</h2>
                <div>{this.props.metadata.SpecificUsage}</div>

                <h2>Distribusjoner</h2>
                {this.renderSelfDistributions()}
                {this.renderRelatedViewServices()}
                {this.renderRelatedDownloadServices()}

                <h2>Kontaktinforsmasjon</h2>
                {this.renderContactMetadata()}
                {this.renderContactOwner()}
                {this.renderContactPublisher()}
            </div>
        )
    }
}

Metadata.propTypes = {
    metadata: PropTypes.object.isRequired,
    fetchMetadata: PropTypes.func.isRequired,
    fetchMetadataDistributions: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    metadata: state.metadata,
    metadataDistributions: state.metadataDistributions
});

const mapDispatchToProps = {
    fetchMetadata,
    fetchMetadataDistributions,
};

export default connect(mapStateToProps, mapDispatchToProps)(Metadata);
