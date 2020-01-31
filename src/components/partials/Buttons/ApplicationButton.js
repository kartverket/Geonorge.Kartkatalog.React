// Dependencies
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// Actions
import { getResource } from 'actions/ResourceActions'

// Stylesheets
import style from 'components/partials/Buttons/Buttons.module.scss'


export class ApplicationButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    handleButtonClick = () => {
      const tagData = {
        name: this.props.metadata.Title,
        uuid: this.props.metadata.Uuid
      }
      this.props.pushToDataLayer({
        event: 'showMore',
        category: 'metadataDetails',
        activity: 'showWebsite',
        metadata: tagData
      });
    }

    isApplication() {
        return this.props.metadata.Type === "software" || this.props.metadata.Type === "Applikasjon"
    }

    render() {
        let buttonDescription = this.props.getResource('WebPage', 'Nettside');
        if (this.props.listButton) {
            if (this.isApplication(this.props.metadata.Type)) {
                if (this.props.metadata.DistributionUrl || this.props.metadata.DownloadUrl) {
                    let distributionUrl = this.props.metadata.DistributionUrl ? this.props.metadata.DistributionUrl : this.props.metadata.DownloadUrl
                    let icon = <FontAwesomeIcon title={buttonDescription} icon={['far', 'external-link-square']} key="icon" />;
                    let buttonClass = `${style.listButton} ${style.ext}`;
                    let textContent = React.createElement('span', { key: "textContent" }, buttonDescription);
                    let childElements = [icon, textContent];
                    return (<a href={distributionUrl} onClick={this.handleButtonClick} target="_blank" rel="noopener noreferrer" className={buttonClass}>{childElements}</a>);
                } else {
                    let icon = <FontAwesomeIcon title={buttonDescription} icon={['far', 'external-link-square']} key="icon" />
                    let buttonClass = `btn btn-sm ${style.listButton} ${style.disabled} ${style.off}`;
                    let textContent = React.createElement('span', { key: "textContent" }, buttonDescription);
                    let childElements = [icon, textContent];
                    return (<span className={buttonClass}>{childElements}</span>);
                }
            }
            return null
        }
        else {
            if (this.props.metadata.CanShowWebsiteUrl && this.props.metadata.DistributionUrl) {
                let url = this.props.metadata.DistributionUrl
                let icon = <FontAwesomeIcon title={buttonDescription} icon={['far', 'external-link-square']} key="icon" />;
                let buttonClass = style.btn;
                let textContent = React.createElement('span', { key: "textContent" }, buttonDescription);

                let childElements = [icon, textContent];
                return React.createElement('a', { href: url, className: buttonClass }, childElements);
            } else {
                let icon = <FontAwesomeIcon title={buttonDescription} icon={['far', 'external-link-square']} key="icon" />
                let buttonClass = `${style.btn}  ${style.disabled}`;
                let textContent = React.createElement('span', { key: "textContent" }, buttonDescription);
                let childElements = [icon, textContent];
                return React.createElement('span', { className: buttonClass }, childElements);
            }
        }
    }
}

ApplicationButton.propTypes = {
    metadata: PropTypes.object.isRequired,
    listButton: PropTypes.bool
};

ApplicationButton.defaultProps = {
	listButton: true,
}

const mapDispatchToProps = {
    getResource
};

const mapStateToProps = state => ({
    resources: state.resources
});

export default connect(mapStateToProps, mapDispatchToProps)(ApplicationButton);
