import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import style from './Buttons.scss'

import { getResource } from '../../../actions/ResourceActions'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export class ContactOwnerButton extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    handleButtonClick = () => {
      const tagData = {
        name: this.props.metadata.Title,
        uuid: this.props.metadata.Uuid
      }
      this.props.pushToDataLayer({
        event: 'showMore',
        category: 'metadataDetails',
        activity: 'contactDataOwner',
        metadata: tagData
      });
    }

    render() {
        let buttonDescription = this.props.getResource('ContactDataOwner', 'Kontakt dataeier');
        if (this.props.metadata.ContactMetadata) {
            let email = this.props.metadata.ContactMetadata.Email
            let icon = <FontAwesomeIcon title={buttonDescription} icon={['far', 'envelope']} key="icon" />;
            let buttonClass = style.btn;
            let textContent = React.createElement('span', { key: "textContent" }, buttonDescription);
            let childElements = [icon, textContent];
            return (<a href={`mailto:${email}`} onClick={this.handleButtonClick} target="_blank" rel="noopener noreferrer" className={buttonClass}>{childElements}</a>);
        } else {
            let icon = <FontAwesomeIcon title={buttonDescription} icon={['far', 'envelope']} key="icon" />
            let buttonClass = style.btn + ' disabled';
            let textContent = React.createElement('span', { key: "textContent" }, buttonDescription);
            let childElements = [icon, textContent];
            return (<span className={buttonClass}>{childElements}</span>);
        }
    }

}

ContactOwnerButton.propTypes = {
    metadata: PropTypes.object.isRequired
};

const mapDispatchToProps = {
    getResource
};

const mapStateToProps = state => ({
    resources: state.resources
});

export default connect(mapStateToProps, mapDispatchToProps)(ContactOwnerButton);
