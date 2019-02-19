import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {removeItemSelectedForDownload, addItemSelectedForDownload} from '../../../actions/DownloadItemActions'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

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
            Uuid: this.props.searchResult.Uuid,
            Url: this.props.searchResult.ShowDetailsUrl,
            theme: this.props.searchResult.Theme,
            organizationName: this.props.searchResult.Organization,
            name: this.props.searchResult.Title,
            distributionUrl: this.props.searchResult.DistributionUrl
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
        return this.props.searchResult.DistributionProtocol === 'GEONORGE:DOWNLOAD'
    }

    showDownloadLink() {
        return this.props.searchResult.DistributionUrl &&
            (this.props.searchResult.DistributionProtocol === 'WWW:DOWNLOAD-1.0-http--download' ||
                this.props.searchResult.DistributionProtocol === 'GEONORGE:FILEDOWNLOAD')
            && this.props.searchResult.Type === 'dataset'
    }

    render() {
        let button = this.getDownloadButton();
        if (this.isGeonorgeDownload(this.props.searchResult.DistributionProtocol)) {
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
            let distributionUrl = this.props.searchResult.DistributionUrl;
            let icon = <FontAwesomeIcon title="Gå til nedlasting" icon={['far', 'external-link-square']} key="icon"/>;
            let buttonClass = 'on';
            let textContent = React.createElement('span', {key: "textContent"}, 'Til nedlasting');

            let childElements = [icon, textContent];
            return React.createElement('a', {href: distributionUrl, className: buttonClass}, childElements);
        } else return null
    }
}

DownloadButton.propTypes = {
    searchResult: PropTypes.object.isRequired
};

const mapDispatchToProps = {
    removeItemSelectedForDownload,
    addItemSelectedForDownload
};

export default connect(null, mapDispatchToProps)(DownloadButton);