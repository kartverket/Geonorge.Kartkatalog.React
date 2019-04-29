import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import style from './Buttons.scss'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export class DownloadXmlButton extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        // TODO styling
        let url = this.props.metadata.MetadataXmlUrl;
        let icon = <FontAwesomeIcon title="Last ned metadata XML" icon={['far', 'file-code']} key="icon" />;
        let textContent = React.createElement('span', { key: "textContent" }, 'Last ned metadata XML');
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

export default connect(null, null)(DownloadXmlButton);
