import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import style from './Buttons.scss';

export class ProductSheetButton extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {

        // TODO styling
        if (this.props.metadata.ProductSheetUrl) {
            let url = this.props.metadata.ProductSheetUrl
            let icon = <FontAwesomeIcon title="Vis produktark" icon={['far', 'info-circle']} key="icon" />;
            let buttonClass = style.btn;
            let textContent = React.createElement('span', { key: "textContent" }, 'Vis produktark');

            let childElements = [icon, textContent];
            return React.createElement('a', { href: url, className: buttonClass }, childElements);
        } else {
            let icon = <FontAwesomeIcon title="Vis produktark" icon={['far', 'info-circle']} key="icon" />
            let buttonClass = style.btn + ' disabled';
            let textContent = React.createElement('span', { key: "textContent" }, 'Vis produktark');
            let childElements = [icon, textContent];
            return React.createElement('span', { className: buttonClass }, childElements);
        }
    }
    
}

ProductSheetButton.propTypes = {
    metadata: PropTypes.object.isRequired
};

export default connect(null, null)(ProductSheetButton);
