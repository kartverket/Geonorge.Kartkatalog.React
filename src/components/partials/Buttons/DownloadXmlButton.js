import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import style from './Buttons.scss'

import { getResource } from '../../../actions/ResourceActions'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export class DownloadXmlButton extends Component {
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
        event: 'download',
        category: 'metadataDetails',
        activity: 'downloadXML',
        metadata: tagData
      });
    }


    render() {
        let buttonDescription = `${this.props.getResource('Download', 'Last ned')} metadata XML`;
        // TODO styling
        let url = this.props.metadata.MetadataXmlUrl;
        let icon = <FontAwesomeIcon title={buttonDescription} icon={['far', 'file-code']} key="icon" />;
        let textContent = React.createElement('span', { key: "textContent" }, buttonDescription);
        let childElements = [icon, textContent];

        if (url) {
            let buttonClass = style.btn;
            return (<a href={url} onClick={this.handleButtonClick} className={buttonClass}>{childElements}</a>);
        } else {
            let buttonClass = style.btn + ' disabled';
            return (<span className={buttonClass}>{childElements}</span>);
        }
    }

}

DownloadXmlButton.propTypes = {
    metadata: PropTypes.object.isRequired
};

const mapDispatchToProps = {
    getResource
};

const mapStateToProps = state => ({
    resources: state.resources
});

export default connect(mapStateToProps, mapDispatchToProps)(DownloadXmlButton);
