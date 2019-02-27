import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {removeItemSelectedForDownload, addItemSelectedForDownload} from '../../../actions/DownloadItemActions'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import style from './Buttons.scss'

export class DownloadButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isSelectedForDownload: this.selectedForDownloadIsAddedToLocalStorage(this.getDownloadButton())
        };
    }

    compareItemsToDownload(itemToCompare, itemToCompareWith) {
        return itemToCompare.Uuid === itemToCompareWith
    }

    selectedForDownloadIsAddedToLocalStorage(itemToCompare) {
        if (localStorage.orderItems && Array.isArray(JSON.parse(localStorage.orderItems))) {
            let isAddedToLocalStorage = false;
            JSON.parse(localStorage.orderItems).forEach((mapItemToCompareWith) => {
                if (this.compareItemsToDownload(itemToCompare, mapItemToCompareWith)) {
                    isAddedToLocalStorage = true;
                }
            });
            return isAddedToLocalStorage;
        } else {
            return false;
        }
    }

    getDownloadButton() {
        return {
            Uuid: this.props.metadata.Uuid,
            Url: "/metadata/" + this.props.metadata.Uuid,
            theme: this.props.metadata.Theme,
            organizationName: this.props.metadata.Organization,
            name: this.props.metadata.Title,
            distributionUrl: this.props.metadata.DistributionUrl
        }
    }

    getDownloadButtonFromMetadata() {
        return {
            Uuid: this.props.metadata.Uuid,
            Url: "/metadata/" + this.props.metadata.Uuid,
            theme: "",
            organizationName: this.props.metadata.ContactMetadata ? this.props.metadata.ContactMetadata.Organization: null,
            name: this.props.metadata.Title,
            distributionUrl: this.props.metadata.DistributionUrl
        }
    }

    addToDownloadList(item) {
        this.setState({
            isSelectedForDownload: true
        });
        this.props.addItemSelectedForDownload(item);
    }

    removeFromDownloadList(item) {
        this.setState({
            isSelectedForDownload: false
        });
        this.props.removeItemSelectedForDownload(item);
    }

    isGeonorgeDownload() {
        return this.props.metadata.DistributionProtocol === 'GEONORGE:DOWNLOAD'
    }

    showDownloadLink() {
        return this.props.metadata.DistributionUrl &&
            (this.props.metadata.DistributionProtocol === 'WWW:DOWNLOAD-1.0-http--download' ||
                this.props.metadata.DistributionProtocol === 'GEONORGE:FILEDOWNLOAD')
            && this.props.metadata.Type === 'dataset'
    }

    showMetadataDownloadLink() {
        return this.props.metadata.DistributionUrl &&
            (this.props.metadata.DistributionDetails.Protocol === 'WWW:DOWNLOAD-1.0-http--download' ||
                this.props.metadata.DistributionProtocol === 'GEONORGE:FILEDOWNLOAD')
    }

    renderListButton() {
        let button = this.getDownloadButton();
        if (this.isGeonorgeDownload(this.props.metadata.DistributionProtocol)) {
            let action = this.state.isSelectedForDownload
                ? () => this.removeFromDownloadList(button)
                : () => this.addToDownloadList(button);
            let icon = <FontAwesomeIcon title="Last ned"
                icon={this.state.isSelectedForDownload ? ['far', 'trash'] : ['fas', 'cloud-download']} key="icon"/>;
            let buttonClass = this.state.isSelectedForDownload ? 'off' : 'on';
            let textContent = React.createElement('span', {key: "textContent"}, this.state.isSelectedForDownload ? 'Fjern nedlasting' : 'Last ned');

            let childElements = [icon, textContent];
            return React.createElement('span', {onClick: action, className: buttonClass}, childElements);

        } else if (this.showDownloadLink()) {
            let distributionUrl = this.props.metadata.DistributionUrl;
            let icon = <FontAwesomeIcon title="Gå til nedlasting" icon={['far', 'external-link-square']} key="icon"/>;
            let buttonClass = 'on';
            let textContent = React.createElement('span', {key: "textContent"}, 'Til nedlasting');

            let childElements = [icon, textContent];
            return React.createElement('a', {href: distributionUrl, className: buttonClass}, childElements);
        } 
        else return null
    }

    renderButton() {
        let button = this.getDownloadButtonFromMetadata();
        if (this.props.metadata.CanShowDownloadService) {
            let action = this.state.isSelectedForDownload
                ? () => this.removeFromDownloadList(button)
                : () => this.addToDownloadList(button);
            let icon = <FontAwesomeIcon title="Last ned"
                icon={this.state.isSelectedForDownload ? ['far', 'trash'] : ['fas', 'cloud-download']} key="icon"/>;
                let buttonClass = style.btn;
            let textContent = React.createElement('span', {key: "textContent"}, this.state.isSelectedForDownload ? 'Fjern nedlasting' : 'Last ned');

            let childElements = [icon, textContent];
            return React.createElement('span', {onClick: action, className: buttonClass}, childElements);

        } else if (this.props.metadata.CanShowDownloadUrl) {
            let distributionUrl = this.props.metadata.DistributionUrl;
            let icon = <FontAwesomeIcon title="Gå til nedlasting" icon={['far', 'external-link-square']} key="icon"/>;
            let buttonClass = style.btn;
            let textContent = React.createElement('span', {key: "textContent"}, 'Til nedlasting');

            let childElements = [icon, textContent];
            return React.createElement('a', {href: distributionUrl, className: buttonClass}, childElements);
        } 
        else {
            let icon = <FontAwesomeIcon title="Last ned" icon={['fas', 'cloud-download']} key="icon"/>;
            let buttonClass = style.btn + ' disabled';
            let textContent = React.createElement('span', { key: "textContent" }, 'Last ned');

            let childElements = [icon, textContent];
            return React.createElement('span', { className: buttonClass }, childElements);
        }
    }

    render() {
        if (this.props.listButton) {
            return this.renderListButton()
        }
        else{
            return this.renderButton()
        }
    }
}

DownloadButton.propTypes = {
    metadata: PropTypes.object.isRequired,
    listButton: PropTypes.bool,
    removeItemSelectedForDownload: PropTypes.func.isRequired,
    addItemSelectedForDownload: PropTypes.func.isRequired
};

DownloadButton.defaultProps = {
    listButton: true,
};

const mapDispatchToProps = {
    removeItemSelectedForDownload,
    addItemSelectedForDownload
};

export default connect(null, mapDispatchToProps)(DownloadButton);