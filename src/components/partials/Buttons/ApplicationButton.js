import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import style from './Buttons.scss'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export class ApplicationButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    isApplication() {
        return this.props.metadata.Type === "software" || this.props.metadata.Type === "Applikasjon"
    }

    render() {

        if (this.props.listButton) {
            if (this.isApplication(this.props.metadata.Type)) {
                if (this.props.metadata.DistributionUrl || this.props.metadata.DownloadUrl) {
                    let distributionUrl = this.props.metadata.DistributionUrl ? this.props.metadata.DistributionUrl : this.props.metadata.DownloadUrl
                    let icon = <FontAwesomeIcon title="Gå til ekstern nettside" icon={['far', 'external-link-square']} key="icon" />;
                    let buttonClass = 'ext';
                    let textContent = React.createElement('span', { key: "textContent" }, 'Til nettside');

                    let childElements = [icon, textContent];
                    return React.createElement('a', { href: distributionUrl, className: buttonClass }, childElements);
                } else {
                    let icon = <FontAwesomeIcon title="Gå til ekstern nettside" icon={['far', 'external-link-square']} key="icon" />
                    let buttonClass = 'btn btn-sm disabled off'
                    let textContent = React.createElement('span', { key: "textContent" }, 'Til nettside');
                    let childElements = [icon, textContent];
                    return React.createElement('span', { className: buttonClass }, childElements);
                }
            }
            return null
        }
        else {
            if (this.props.metadata.CanShowWebsiteUrl && this.props.metadata.DistributionUrl) {
                let url = this.props.metadata.DistributionUrl
                let icon = <FontAwesomeIcon title="Nettside" icon={['far', 'external-link-square']} key="icon" />;
                let buttonClass = style.btn;
                let textContent = React.createElement('span', { key: "textContent" }, 'Nettside');
    
                let childElements = [icon, textContent];
                return React.createElement('a', { href: url, className: buttonClass }, childElements);
            } else {
                let icon = <FontAwesomeIcon title="Nettside" icon={['far', 'external-link-square']} key="icon" />
                let buttonClass = style.btn + ' disabled';
                let textContent = React.createElement('span', { key: "textContent" }, 'Nettside');
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

export default connect(null, null)(ApplicationButton);
