import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import style from './Buttons.scss';

export class ProductspesificationButton extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {

        // TODO styling
        if (this.props.metadata.ProductSpecificationUrl) {
            let url = this.props.metadata.ProductSpecificationUrl
            let icon = <FontAwesomeIcon title="Vis produktspesifikasjon" icon={['far', 'external-link-square']} key="icon" />;
            let buttonClass = style.btn;
            let textContent = React.createElement('span', { key: "textContent" }, 'Vis produktspesifikasjon');

            let childElements = [icon, textContent];
            return React.createElement('a', { href: url, className: buttonClass }, childElements);
        } else {
            let icon = <FontAwesomeIcon title="Vis produktspesifikasjon" icon={['far', 'external-link-square']} key="icon" />
            let buttonClass = style.btn + ' disabled';
            let textContent = React.createElement('span', { key: "textContent" }, 'Vis produktspesifikasjon');
            let childElements = [icon, textContent];
            return React.createElement('span', { className: buttonClass }, childElements);
        }
    }
    
}

ProductspesificationButton.propTypes = {
    metadata: PropTypes.object.isRequired
};

export default connect(null, null)(ProductspesificationButton);
