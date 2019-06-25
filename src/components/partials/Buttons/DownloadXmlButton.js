import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import style from './Buttons.scss'

import { getResource } from '../../../actions/ResourceActions'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export class DownloadXmlButton extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }


    render() {
        let buttonDescription = `${this.props.getResource('Download', 'Last ned')} metadata XML`;
        // TODO styling
        let url = this.props.metadata.MetadataXmlUrl;
        let icon = <FontAwesomeIcon title={buttonDescription} icon={['far', 'file-code']} key="icon" />;
        let textContent = React.createElement('span', { key: "textContent" }, buttonDescription);
        let childElements = [icon, textContent];

        if (url) {
            let buttonClass = style.btn;
            return React.createElement('a', { href: url, className: buttonClass }, childElements);
        } else {
            let buttonClass = style.btn + ' disabled';
            return React.createElement('span', { className: buttonClass }, childElements);
        }
    }

}

DownloadXmlButton.propTypes = {
    metadata: PropTypes.object.isRequired
};

const mapDispatchToProps = {
    getResource
};

const mapStateToProps = state => ({
    resources: state.resources
});

export default connect(mapStateToProps, mapDispatchToProps)(DownloadXmlButton);
