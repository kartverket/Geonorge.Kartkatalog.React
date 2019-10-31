// Dependencies
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// Utils
import userManager from '../../../utils/userManager';

// Actions
import { removeItemSelectedForDownload, addItemSelectedForDownload } from '../../../actions/DownloadItemActions'
import { getResource } from '../../../actions/ResourceActions'

// Stylesheets
import style from './Buttons.scss'

export class DownloadButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isAdded: false
        };
    }

    handleLoginClick(event) {
        event.preventDefault();
        userManager.signinRedirect();
    }

    addToDownloadItemToLocalStorageForAutoAdd(downloadItem) {
        localStorage.setItem('autoAddDownloadItemOnLoad', JSON.stringify(downloadItem));
    }

    getDownloadButton() {
        return {
            uuid: this.props.metadata.Uuid,
            url: "/metadata/" + this.props.metadata.Uuid,
            theme: this.props.metadata.Theme,
            organizationName: this.props.metadata.Organization,
            name: this.props.metadata.Title,
            distributionUrl: this.props.metadata.DistributionUrl
        }
    }

    getDownloadButtonFromMetadata() {
        return {
            uuid: this.props.metadata.Uuid,
            url: "/metadata/" + this.props.metadata.Uuid,
            theme: "",
            organizationName: this.props.metadata.ContactMetadata ? this.props.metadata.ContactMetadata.Organization : null,
            name: this.props.metadata.Title,
            distributionUrl: this.props.metadata.DistributionUrl
        }
    }

    addToDownloadList(event, item) {
        if (this.props.metadata.AccessIsOpendata){
            this.props.addItemSelectedForDownload(item);
        } else if (this.props.metadata.AccessIsRestricted){
            if (!this.props.oidc || !this.props.oidc.user){
                this.addToDownloadItemToLocalStorageForAutoAdd(item);
                this.handleLoginClick(event);
            }else {
                let capabilitiesUrl = this.props.metadata.GetCapabilitiesUrl + this.props.metadata.Uuid;
                fetch(capabilitiesUrl, {
                    method: 'GET',
                    headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                    },
                })
                .then((res) => res.json())
                .then((capabilities) => {
                  const roles = this.props.baatInfo && this.props.baatInfo.baat_services ? this.props.baatInfo.baat_services : null;
                  const requiredRole = capabilities.accessConstraintRequiredRole;

                  const addDatasetIsAllowed = requiredRole && roles && roles.length
                    ? roles.find(role => {return role == requiredRole}) !== undefined
                    : true;

                  if(addDatasetIsAllowed){
                      this.props.addItemSelectedForDownload(item);
                  }else {
                      alert('Du har ikke tilgang til å legge datasett i til nedlasting');
                  }
                });
            }
        }
    }

    removeFromDownloadList(item) {
        this.props.removeItemSelectedForDownload(item);
    }

    isGeonorgeDownload() {
        return this.props.metadata.DistributionProtocol === 'GEONORGE:DOWNLOAD' || this.props.metadata.Protocol === 'Geonorge nedlastning';
    }

    showDownloadLink() {
        return this.props.metadata.DistributionUrl &&
            (this.props.metadata.DistributionProtocol === 'WWW:DOWNLOAD-1.0-http--download' ||
                this.props.metadata.DistributionProtocol === 'GEONORGE:FILEDOWNLOAD')
            && this.props.metadata.Type === 'dataset'
    }

    renderListButton() {
        let button = this.getDownloadButton();

        if (this.isGeonorgeDownload()) {
            let buttonDescription = this.state.isAdded ? this.props.getResource('RemoveFromBasket', 'Fjern nedlasting') : this.props.getResource('Download', 'Last ned');

            let action = this.state.isAdded
                ? () => this.removeFromDownloadList(button)
                : (event) => this.addToDownloadList(event, button);
            let icon = <FontAwesomeIcon title={buttonDescription}
                icon={this.state.isAdded ? ['far', 'trash'] : ['fas', 'cloud-download']} key="icon" />;
            let buttonClass = this.state.isAdded ? 'off' : 'on';
            let textContent = React.createElement('span', { key: "textContent" }, buttonDescription);

            let childElements = [icon, textContent];
            return React.createElement('span', { onClick: action, className: buttonClass }, childElements);

        } else if (this.showDownloadLink()) {
            let buttonDescription = this.props.getResource('ToBasket', 'Til nedlasting');
            let distributionUrl = this.props.metadata.DistributionUrl;
            let icon = <FontAwesomeIcon title={buttonDescription} icon={['far', 'external-link-square']} key="icon" />;
            let buttonClass = 'on';
            let textContent = React.createElement('span', { key: "textContent" }, buttonDescription);

            let childElements = [icon, textContent];
            return React.createElement('a', { href: distributionUrl, className: buttonClass }, childElements);
        }
        else return null
    }

    renderButton() {
        let button = this.getDownloadButtonFromMetadata();
        if (this.props.metadata.CanShowDownloadService) {

            let buttonDescription = this.state.isAdded ? this.props.getResource('RemoveFromBasket', 'Fjern nedlasting') : this.props.getResource('Download', 'Last ned');
            let action = this.state.isAdded
                ? () => this.removeFromDownloadList(button)
                : (event) => this.addToDownloadList(event, button);
            let icon = <FontAwesomeIcon title={buttonDescription}
                icon={this.state.isAdded ? ['far', 'trash'] : ['fas', 'cloud-download']} key="icon" />;
            let buttonClass = this.state.isAdded ?  [style.btn + ' remove'] : [style.btn + ' download'];
            let textContent = React.createElement('span', { key: "textContent" }, buttonDescription);

            let childElements = [icon, textContent];
            return React.createElement('span', { onClick: action, className: buttonClass }, childElements);

        } else if (this.props.metadata.CanShowDownloadUrl) {
            let buttonDescription = this.props.getResource('ToBasket', 'Til nedlasting');
            let distributionUrl = this.props.metadata.DistributionUrl;
            let icon = <FontAwesomeIcon title={buttonDescription} icon={['far', 'external-link-square']} key="icon" />;
            let buttonClass = style.btn;

            let textContent = React.createElement('span', { key: "textContent" }, buttonDescription);
            let childElements = [icon, textContent];
            return React.createElement('a', { href: distributionUrl, className: buttonClass }, childElements);
        }
        else {
            let buttonDescription = this.props.getResource('Download', 'Last ned');
            let icon = <FontAwesomeIcon title={buttonDescription} icon={['fas', 'cloud-download']} key="icon" />;
            let buttonClass = style.btn + ' disabled';
            let textContent = React.createElement('span', { key: "textContent" }, buttonDescription);

            let childElements = [icon, textContent];
            return React.createElement('span', { className: buttonClass }, childElements);
        }
    }

    componentDidMount() {
        const isAdded = this.props.itemsToDownload.filter(downloadItem => {
            return this.props.metadata.Uuid === downloadItem;
        }).length > 0;
        if (isAdded) {
            this.setState({
                isAdded: isAdded
            });
        }
    }

    componentDidUpdate(prevProps, prevState) {
        const wasAdded = prevState.isAdded;
        const isAdded = this.props.itemsToDownload.filter(downloadItem => {
            return this.props.metadata.Uuid === downloadItem;
        }).length > 0;
        if (wasAdded !== isAdded) {
            this.setState({
                isAdded: isAdded
            });
        }
    }

    render() {
        if (this.props.listButton) {
            return this.renderListButton()
        }
        else {
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

const mapStateToProps = state => ({
    itemsToDownload: state.itemsToDownload,
    resources: state.resources,
    oidc: state.oidc,
    baatInfo: state.baatInfo
});

const mapDispatchToProps = {
    removeItemSelectedForDownload,
    addItemSelectedForDownload,
    getResource
};

export default connect(mapStateToProps, mapDispatchToProps)(DownloadButton);
