// Dependencies
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// Actions
import { getResource } from 'actions/ResourceActions'

// Stylesheets
import style from 'components/partials/Buttons/Buttons.module.scss'


export class EditMetadataButton extends Component {
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
        event: 'edit',
        category: 'metadataDetails',
        activity: 'editMetadata',
        metadata: tagData
      });
    }

    render() {
        let buttonDescription = `${this.props.getResource('Edit', 'Rediger')} metadata`;
        // TODO styling
        let url = this.props.metadata.MetadataEditUrl;
        let icon = <FontAwesomeIcon title={buttonDescription} icon={['far', 'edit']} key="icon" />;
        let textContent = React.createElement('span', { key: "textContent" }, buttonDescription);
        let childElements = [icon, textContent];

        if (url) {
            let buttonClass = style.btn;
            return (<a href={url} onClick={this.handleButtonClick} className={buttonClass}>{childElements}</a>);
        } else {
            let buttonClass = `${style.btn}  ${style.disabled}`;
            return (<span className={buttonClass}>{childElements}</span>);
        }
    }

}

EditMetadataButton.propTypes = {
    metadata: PropTypes.object.isRequired
};

const mapDispatchToProps = {
    getResource
};

const mapStateToProps = state => ({
    resources: state.resources
});

export default connect(mapStateToProps, mapDispatchToProps)(EditMetadataButton);
