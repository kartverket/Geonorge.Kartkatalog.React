import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import style from './Buttons.scss'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export class ContactOwnerButton extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {

        // TODO styling
        if (this.props.metadata.ContactMetadata) {
            let email = this.props.metadata.ContactMetadata.Email
            let icon = <FontAwesomeIcon title="Kontakt dataeier" icon={['far', 'envelope']} key="icon" />;
            let buttonClass = style.btn;
            let textContent = React.createElement('span', { key: "textContent" }, 'Kontakt dataeier');

            let childElements = [icon, textContent];
            return React.createElement('a', { href: "mailto:" + email, className: buttonClass }, childElements);
        } else {
            let icon = <FontAwesomeIcon title="Kontakt dataeier" icon={['far', 'envelope']} key="icon" />
            let buttonClass = style.btn + ' disabled';
            let textContent = React.createElement('span', { key: "textContent" }, 'Kontakt dataeier');
            let childElements = [icon, textContent];
            return React.createElement('span', { className: buttonClass }, childElements);
        }
    }

}

ContactOwnerButton.propTypes = {
    metadata: PropTypes.object.isRequired
};

export default connect(null, null)(ContactOwnerButton);
