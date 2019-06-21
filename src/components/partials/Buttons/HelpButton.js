import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import style from './Buttons.scss';

import { getResource } from '../../../helpers/ResourceHelpers'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export class HelpButton extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        let buttonDescription = getResource(this.props.resources, 'Help', 'Hjelp');
        // TODO styling
        if (this.props.metadata.HelpUrl) {
            let url = this.props.metadata.HelpUrl
            let icon = <FontAwesomeIcon title={buttonDescription} icon={['far', 'question-circle']} key="icon" />;
            let buttonClass = style.btn;
            let textContent = React.createElement('span', { key: "textContent" }, buttonDescription);

            let childElements = [icon, textContent];
            return React.createElement('a', { href: url, className: buttonClass }, childElements);
        } else {
            let icon = <FontAwesomeIcon title={buttonDescription} icon={['far', 'question-circle']} key="icon" />
            let buttonClass = style.btn + ' disabled'
            let textContent = React.createElement('span', { key: "textContent" }, buttonDescription);
            let childElements = [icon, textContent];
            return React.createElement('span', { className: buttonClass }, childElements);
        }
    }

}

HelpButton.propTypes = {
    metadata: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    resources: state.resources
});

export default connect(mapStateToProps, null)(HelpButton);
