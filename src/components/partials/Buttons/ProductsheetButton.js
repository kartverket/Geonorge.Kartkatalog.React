import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { getResource } from '../../../helpers/ResourceHelpers'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import style from './Buttons.scss';

export class ProductSheetButton extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        let buttonDescription = getResource(this.props.resources, 'DisplayProductSheet', 'Vis produktark');
        // TODO styling
        if (this.props.metadata.ProductSheetUrl) {
            let url = this.props.metadata.ProductSheetUrl
            let icon = <FontAwesomeIcon title={buttonDescription} icon={['far', 'info-circle']} key="icon" />;
            let buttonClass = style.btn;
            let textContent = React.createElement('span', { key: "textContent" }, buttonDescription);

            let childElements = [icon, textContent];
            return React.createElement('a', { href: url, className: buttonClass }, childElements);
        } else {
            let icon = <FontAwesomeIcon title={buttonDescription} icon={['far', 'info-circle']} key="icon" />
            let buttonClass = style.btn + ' disabled';
            let textContent = React.createElement('span', { key: "textContent" }, buttonDescription);
            let childElements = [icon, textContent];
            return React.createElement('span', { className: buttonClass }, childElements);
        }
    }
    
}

ProductSheetButton.propTypes = {
    metadata: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    resources: state.resources
});

export default connect(mapStateToProps, null)(ProductSheetButton);
