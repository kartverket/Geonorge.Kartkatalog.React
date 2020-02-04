// Dependencies
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// Utils
import userManager from 'utils/userManager';

// Actions
import { removeItemSelectedForDownload, addItemSelectedForDownload } from 'actions/DownloadItemActions'
import { getApiData } from 'actions/ApiActions'
import { getResource } from 'actions/ResourceActions'

// Assets
import loadingAnimation from 'images/gif/loading.gif';

// Stylesheets
import style from 'components/partials/Buttons/Buttons.module.scss'

export class DownloadButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isAdded: false,
            loading: false,
            error: false
        };
    }

    handleLoginClick(event) {
        event.preventDefault();
        userManager.signinRedirect();
    }

    getDownloadButton() {
        return {
            uuid: this.props.metadata.Uuid,
            url: "/metadata/" + this.props.metadata.Uuid,
            theme: this.props.metadata.Theme,
            organizationName: this.props.metadata.Organization,
            name: this.props.metadata.Title,
            distributionUrl: this.props.metadata.DistributionUrl,
            getCapabilitiesUrl: this.props.metadata.GetCapabilitiesUrl,
            accessIsRestricted: this.props.metadata.AccessIsRestricted,
            accessIsOpendata: this.props.metadata.AccessIsOpendata
        }
    }

    getDownloadButtonFromMetadata() {
        return {
            uuid: this.props.metadata.Uuid,
            url: "/metadata/" + this.props.metadata.Uuid,
            theme: "",
            organizationName: this.props.metadata.ContactMetadata ? this.props.metadata.ContactMetadata.Organization : null,
            name: this.props.metadata.Title,
            distributionUrl: this.props.metadata.DistributionUrl,
            getCapabilitiesUrl: this.props.metadata.DistributionUrl,
            accessIsRestricted: this.props.metadata.AccessIsRestricted,
            accessIsOpendata: this.props.metadata.AccessIsOpendata
        }
    }

    addToDownloadList(event, item) {
      const isNotAuthenticated = !this.props.oidc || !this.props.oidc.user;
      this.setState({
        loading: true
      });
      this.props.getApiData(`${item.getCapabilitiesUrl}${item.uuid}`).then((capabilities) => {
        let apiRequests = {};
        item.capabilities = capabilities;
        item.capabilities._links.forEach((link, i) => {
          if (link.rel == "http://rel.geonorge.no/download/order") {
            item.orderDistributionUrl = link.href;
          }
          if (link.rel == "http://rel.geonorge.no/download/can-download") {
            item.canDownloadUrl = link.href;
          }
          if (link.rel == "http://rel.geonorge.no/download/area") {
            apiRequests.areas = this.props.getApiData(link.href).then(areas => {
              return areas;
            });
          }
          if (link.rel == "http://rel.geonorge.no/download/projection") {
            apiRequests.projections = this.props.getApiData(link.href).then(projections => {
              return projections
            });
          }
          if (link.rel == "http://rel.geonorge.no/download/format") {
            apiRequests.formats = this.props.getApiData(link.href).then(formats => {
              return formats;
            });
          }
        });

        Promise.all([apiRequests.areas, apiRequests.projections, apiRequests.formats]).then(([areas, projections, formats]) => {
          item = {
            ...item,
            areas, projections, formats
          };
          if (this.props.metadata.AccessIsRestricted && isNotAuthenticated){
            localStorage.setItem('autoAddDownloadItemOnLoad', JSON.stringify(item));
            this.handleLoginClick(event);
          }else {
            this.props.addItemSelectedForDownload(item);
          }
          this.setState({
            loading: false
          });
       })

      }).catch(error => {
        console.error(error.message);
        if (error){
          this.setState({
            error: true
          });
        }
      });;

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

    handleExternalDownloadButtonClick = () => {
      const tagData = {
        name: this.props.metadata.Title,
        uuid: this.props.metadata.Uuid
      }
      this.props.pushToDataLayer({
        event: 'download',
        category: 'metadataDetails',
        activity: 'visitExternalDownloadPage',
        metadata: tagData
      });
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
            let buttonClass = `${style.listButton} ${this.state.isAdded ? style.off : style.on}`;
            let textContent = React.createElement('span', { key: "textContent" }, buttonDescription);

            let childElements = [icon, textContent];
            return React.createElement('span', { onClick: action, className: buttonClass }, childElements);

        } else if (this.showDownloadLink()) {
            let buttonDescription = this.props.getResource('ToBasket', 'Til nedlasting');
            let distributionUrl = this.props.metadata.DistributionUrl;
            let icon = <FontAwesomeIcon title={buttonDescription} icon={['far', 'external-link-square']} key="icon" />;
            let buttonClass = `${style.listButton} ${style.on}`;
            let textContent = React.createElement('span', { key: "textContent" }, buttonDescription);

            let childElements = [icon, textContent];
            return (<a href={distributionUrl} onClick={this.handleExternalDownloadButtonClick} target="_blank" rel="noopener noreferrer" className={buttonClass}>{childElements}</a>);
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
            let buttonClass = this.state.isAdded ?  `${style.btn}  ${style.remove}` : `${style.btn}  ${style.download}`;
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
            let buttonClass = `${style.btn}  ${style.disabled}`;
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
        if (this.state.error){
          return (<span className={`${style.loading} ${this.props.listButton ? style.listButton : style.btn}`}>
            <span className={style.errorMessage}>{this.props.getResource('CanNotBeAddedToBasket', 'Kan ikke legges til nedlasting')}</span>
          </span>);
        }
        if (this.state.loading){
          return (<span className={`${style.loading} ${this.props.listButton ? style.listButton : style.btn}`}>
            <img src={loadingAnimation} />
          </span>);
        }
        else if (this.props.listButton) {
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
    getApiData,
    getResource
};

export default connect(mapStateToProps, mapDispatchToProps)(DownloadButton);
