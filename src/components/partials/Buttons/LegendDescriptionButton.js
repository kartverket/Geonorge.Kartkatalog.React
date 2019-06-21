import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { getResource } from '../../../actions/ResourceActions'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import style from './Buttons.scss';

export class LegendDescriptionButton extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.selectedLanguage !== this.props.selectedLanguage){
            this.render();
        }
    }

    render() {
        let buttonDescription = this.props.getResource('DisplayCartography', 'Vis tegneregler');
        // TODO styling
        if (this.props.metadata.LegendDescriptionUrl) {
            let url = this.props.metadata.LegendDescriptionUrl
            let icon = <FontAwesomeIcon title={buttonDescription} icon={['far', 'image']} key="icon" />;
            let buttonClass = style.btn;
            let textContent = React.createElement('span', { key: "textContent" }, buttonDescription);

            let childElements = [icon, textContent];
            return React.createElement('a', { href: url, className: buttonClass }, childElements);
        } else {
            let icon = <FontAwesomeIcon title={buttonDescription} icon={['far', 'image']} key="icon" />
            let buttonClass = style.btn + ' disabled';
            let textContent = React.createElement('span', { key: "textContent" }, buttonDescription);
            let childElements = [icon, textContent];
            return React.createElement('span', { className: buttonClass }, childElements);
        }
    }
    
}

LegendDescriptionButton.propTypes = {
    metadata: PropTypes.object.isRequired
};

const mapDispatchToProps = {
    getResource
};

const mapStateToProps = state => ({
    selectedLanguage: state.selectedLanguage
});

export default connect(mapStateToProps, mapDispatchToProps)(LegendDescriptionButton);
