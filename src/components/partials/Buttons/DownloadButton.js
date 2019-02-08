import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { removeItemSelectedForDownload, addItemSelectedForDownload } from '../../../actions/DownloadItemActions'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class DownloadButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isSelectedForDownload: this.selectedForDownloadIsAddedToLocalStorage(this.getDownloadButton())
        };
    }

    compareItemsToDownload(itemToCompare, itemToCompareWith) {
        return itemToCompare.Uuid === itemToCompareWith.Uuid && itemToCompare.Title === itemToCompareWith.Title
    }

    selectedForDownloadIsAddedToLocalStorage(itemToCompare) {
        if (localStorage.itemsToDownload && Array.isArray(JSON.parse(localStorage.itemsToDownload))) {
            let isAddedToLocalStorage = false;
            JSON.parse(localStorage.itemsToDownload).forEach((mapItemToCompareWith) => {
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
            Title: this.props.searchResult.Title,
            DistributionProtocol: this.props.searchResult.DistributionProtocol,
            IsOpenData: this.props.searchResult.IsOpenData,
            DistributionUrl: this.props.searchResult.DistributionUrl
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
            let icon = <FontAwesomeIcon icon={this.state.isSelectedForDownload ? ['far', 'trash'] : ['fas', 'cloud-download']} key="icon" />
            let buttonClass = this.state.isSelectedForDownload ? 'off' : 'on';
            let textContent = React.createElement('span', { key: "textContent" }, this.state.isSelectedForDownload ? 'Fjern nedlasting' : 'Last ned')

            let childElements = [icon, textContent];
            return React.createElement('span', { onClick: action, className: buttonClass }, childElements);

        }
        else if (this.showDownloadLink()) {
            let distributionUrl = this.props.searchResult.DistributionUrl
            let icon = <FontAwesomeIcon icon={['far', 'download']} key="icon" />
            let buttonClass = this.state.isSelectedForDownload ? 'off' : 'on';
            let textContent = React.createElement('span', { key: "textContent" }, 'Til nedlasting')

            let childElements = [icon, textContent];
            return React.createElement('a', { href: distributionUrl, className: buttonClass }, childElements);
        }
        else {
            let content = '';
            let buttonClass = 'btn btn-sm disabled';
            return React.createElement('span', { className: buttonClass }, content);
        }
    }
}

DownloadButton.propTypes = {
    searchResult: PropTypes.object.isRequired
}

const mapStateToProps = state => ({

});

const mapDispatchToProps = {
    removeItemSelectedForDownload,
    addItemSelectedForDownload
};

export default connect(mapStateToProps, mapDispatchToProps)(DownloadButton);