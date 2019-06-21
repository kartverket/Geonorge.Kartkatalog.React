import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { getResource } from '../../../actions/ResourceActions'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import style from './Buttons.scss';

export class ProductSpecificationButton extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        let buttonDescription = this.props.getResource('DisplayProductSpecification', 'Vis produktspesifikasjon');
        // TODO styling
        if (this.props.metadata.ProductSpecificationUrl) {
            let url = this.props.metadata.ProductSpecificationUrl
            let icon = <FontAwesomeIcon title={buttonDescription} icon={['far', 'file-spreadsheet']} key="icon" />;
            let buttonClass = style.btn;
            let textContent = React.createElement('span', { key: "textContent" }, buttonDescription);

            let childElements = [icon, textContent];
            return React.createElement('a', { href: url, className: buttonClass }, childElements);
        } else {
            let icon = <FontAwesomeIcon title={buttonDescription} icon={['far', 'file-spreadsheet']} key="icon" />
            let buttonClass = style.btn + ' disabled';
            let textContent = React.createElement('span', { key: "textContent" }, buttonDescription);
            let childElements = [icon, textContent];
            return React.createElement('span', { className: buttonClass }, childElements);
        }
    }
    
}

ProductSpecificationButton.propTypes = {
    metadata: PropTypes.object.isRequired
};

const mapDispatchToProps = {
    getResource
};

export default connect(null, mapDispatchToProps)(ProductSpecificationButton);
