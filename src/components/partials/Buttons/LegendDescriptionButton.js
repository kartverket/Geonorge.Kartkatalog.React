import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import style from './Buttons.scss';

export class LegendDescriptionButton extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {

        // TODO styling
        if (this.props.metadata.LegendDescriptionUrl) {
            let url = this.props.metadata.LegendDescriptionUrl
            let icon = <FontAwesomeIcon title="Vis tegneregler" icon={['far', 'image']} key="icon" />;
            let buttonClass = style.btn;
            let textContent = React.createElement('span', { key: "textContent" }, 'Vis tegneregler');

            let childElements = [icon, textContent];
            return React.createElement('a', { href: url, className: buttonClass }, childElements);
        } else {
            let icon = <FontAwesomeIcon title="Vis tegneregler" icon={['far', 'image']} key="icon" />
            let buttonClass = style.btn + ' disabled';
            let textContent = React.createElement('span', { key: "textContent" }, 'Vis tegneregler');
            let childElements = [icon, textContent];
            return React.createElement('span', { className: buttonClass }, childElements);
        }
    }
    
}

LegendDescriptionButton.propTypes = {
    metadata: PropTypes.object.isRequired
};

export default connect(null, null)(LegendDescriptionButton);
