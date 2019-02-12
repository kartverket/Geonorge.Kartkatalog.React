import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export class ApplicationButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    isApplication() {
        return this.props.searchResult.Type === "software"
    }

    render() {
        if (this.isApplication(this.props.searchResult.Type)) {
            if (this.props.searchResult.DistributionUrl) {
                let distributionUrl = this.props.searchResult.DistributionUrl
                let icon = <FontAwesomeIcon icon={['far', 'external-link-square']} key="icon" />
                let buttonClass = 'on';
                let textContent = React.createElement('span', { key: "textContent" }, 'Til nettside')

                let childElements = [icon, textContent];
                return React.createElement('a', { href: distributionUrl, className: buttonClass }, childElements);
            }
            else {
                let icon = <FontAwesomeIcon icon={['far', 'external-link-square']} key="icon" />
                let buttonClass = 'btn btn-sm disabled off'
                let textContent = React.createElement('span', { key: "textContent" }, 'ikke tilgjengelig')
                let childElements = [icon, textContent];
                return React.createElement('span', { className: buttonClass }, childElements);
            }
        }
            return null
    }
}

ApplicationButton.propTypes = {
    searchResult: PropTypes.object.isRequired
}

export default connect(null, null)(ApplicationButton);