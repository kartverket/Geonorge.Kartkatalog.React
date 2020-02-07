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
        this.addToDownloadListAction = this.addToDownloadListAction.bind(this);
        this.removeFromDownloadListAction = this.removeFromDownloadListAction.bind(this);
    }


    handleLoginClick() {
        userManager.signinRedirect();
    }

    getDownloadItem(metadata) {
        return {
            uuid: metadata.Uuid,
            url: "/metadata/" + metadata.Uuid,
            theme: metadata.Theme ? metadata.Theme : '',
            organizationName: metadata.Organization ? metadata.Organization : metadata.ContactMetadata && metadata.ContactMetadata.Organization ? metadata.ContactMetadata.Organization : null,
            name: metadata.Title,
            distributionUrl: metadata.DistributionUrl,
            getCapabilitiesUrl: metadata.GetCapabilitiesUrl ? metadata.GetCapabilitiesUrl : metadata.DistributionUrl ? metadata.DistributionUrl : null,
            accessIsRestricted: metadata.AccessIsRestricted,
            accessIsOpendata: metadata.AccessIsOpendata
        }
    }

    addToDownloadList(item) {
      const isNotAuthenticated = !this.props.oidc || !this.props.oidc.user;
      let requestAction = this.props.getApiData(`${item.getCapabilitiesUrl}${item.uuid}`).then((capabilities) => {
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

        return Promise.all([apiRequests.areas, apiRequests.projections, apiRequests.formats]).then(([areas, projections, formats]) => {
          item = {
            ...item,
            areas, projections, formats
          };
          if (item.accessIsRestricted && isNotAuthenticated){
            localStorage.setItem('autoAddDownloadItemOnLoad', JSON.stringify(item));
            this.handleLoginClick();
          }else {
            this.props.addItemSelectedForDownload(item);
          }
       })

      }).catch(error => {
        console.error(error.message);
        return Promise.reject(error);
      });
      return Promise.resolve(requestAction);


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

    isSeries() {
        return this.props.metadata.Type === 'series';
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

    addToDownloadListAction() {
      const metadata = this.props.metadata;
      this.setState({
        loading: true
      });
      if (metadata.TypeName === 'series_historic'){
        if (metadata.SerieDatasets){
          let asyncActions = metadata.SerieDatasets.map(serieDataset => {
            const item = this.getDownloadItem(serieDataset);
            return this.addToDownloadList(item);
          });
          Promise.allSettled(asyncActions).then((values) => {
            this.setState({
              loading: false
            });
          }).catch(error => {
            this.setState({
              error: true
            });
          });
        }
      }else if (metadata.Serie &&  metadata.Serie.TypeName === 'series_thematic') {
        const item = this.getDownloadItem(metadata.Serie);
        Promise.resolve(this.addToDownloadList(item)).then(() => {
          this.setState({
            loading: false
          })
        }).catch(error => {
          this.setState({
            error: true
          })
        });
      }
      else {
        const item = this.getDownloadItem(metadata);
        Promise.resolve(this.addToDownloadList(item)).then(() => {
          this.setState({
            loading: false
          });
        }).catch(error => {
          this.setState({
            error: true
          })
        });
      }
    }

    removeFromDownloadListAction() {
      const metadata = this.props.metadata;
      if (metadata.TypeName === 'series_historic'){
        metadata.SerieDatasets.forEach(serieDataset => {
          const item = this.getDownloadItem(serieDataset);
          this.removeFromDownloadList(item);
        });
      } else if (metadata.Serie &&  metadata.Serie.TypeName === 'series_thematic') {
        const item = this.getDownloadItem(metadata.Serie);
        this.removeFromDownloadList(item);
      }
      else {
        const item = this.getDownloadItem(metadata);
        this.removeFromDownloadList(item);
      }
    }

    renderListButton() {
        if (this.isGeonorgeDownload()) {
          const buttonDescription = this.state.isAdded
            ? this.props.getResource('RemoveFromBasket', 'Fjern nedlasting')
            : this.isSeries()
            ? this.props.getResource('DownloadSeries', 'Last ned serie')
            : this.props.getResource('Download', 'Last ned');
          const buttonClass = `${style.listButton} ${this.state.isAdded ? style.off : style.on}`;

          return (<span onClick={() => this.state.isAdded ? this.removeFromDownloadListAction() : this.addToDownloadListAction()} className={buttonClass}>
            <FontAwesomeIcon title={buttonDescription} icon={this.state.isAdded ? ['far', 'trash'] : ['fas', 'cloud-download']} key="icon" />
            <span>{buttonDescription}</span>
          </span>);

        } else if (this.showDownloadLink()) {
            const buttonDescription = this.props.getResource('ToBasket', 'Til nedlasting');
            const distributionUrl = this.props.metadata.DistributionUrl;
            const buttonClass = `${style.listButton} ${style.on}`;

            return (<a href={distributionUrl} onClick={this.handleExternalDownloadButtonClick} target="_blank" rel="noopener noreferrer" className={buttonClass}>
              <FontAwesomeIcon title={buttonDescription} icon={['far', 'external-link-square']} key="icon" />
              <span>{buttonDescription}</span>
            </a>);
        }
        else return null
    }

    renderButton() {
        if (this.props.metadata.CanShowDownloadService) {
          const buttonDescription = this.state.isAdded
            ? this.props.getResource('RemoveFromBasket', 'Fjern nedlasting')
            : this.isSeries()
            ? this.props.getResource('DownloadSeries', 'Last ned serie')
            : this.props.getResource('Download', 'Last ned');
          const buttonClass = this.state.isAdded ?  `${style.btn}  ${style.remove}` : `${style.btn}  ${style.download}`;

          return (<span onClick={() => this.state.isAdded ? this.removeFromDownloadListAction() : this.addToDownloadListAction()} className={buttonClass}>
            <FontAwesomeIcon title={buttonDescription} icon={this.state.isAdded ? ['far', 'trash'] : ['fas', 'cloud-download']} key="icon" />
            <span>{buttonDescription}</span>
          </span>);

        } else if (this.props.metadata.CanShowDownloadUrl) {
            const buttonDescription = this.props.getResource('ToBasket', 'Til nedlasting');
            const distributionUrl = this.props.metadata.DistributionUrl;
            const buttonClass = style.btn;

            return (<a href={distributionUrl} className={buttonClass}>
              <FontAwesomeIcon title={buttonDescription} icon={['far', 'external-link-square']} key="icon" />
              <span>{buttonDescription}</span>
            </a>)
        }
        else {
            const buttonDescription =  this.isSeries() ? this.props.getResource('DownloadSeries', 'Last ned serie') : this.props.getResource('Download', 'Last ned');
            const buttonClass = `${style.btn}  ${style.disabled}`;

            return (<span className={buttonClass}>
              <FontAwesomeIcon title={buttonDescription} icon={['fas', 'cloud-download']} key="icon" />
              <span>{buttonDescription}</span>
            </span>)
        }
    }

    metadataIsAdded(metadata) {
      if (metadata.TypeName === 'series_historic'){
        return metadata.SerieDatasets.find(serieDataset => {
          return this.props.itemsToDownload.filter(downloadItem => {
              return serieDataset.Uuid === downloadItem;
          }).length > 0;
        });
      }else if (metadata.Serie &&  metadata.Serie.TypeName === 'series_thematic'){
        return this.props.itemsToDownload.filter(downloadItem => {
            return metadata.Serie.Uuid === downloadItem;
        }).length > 0;
      } else {
        return this.props.itemsToDownload.filter(downloadItem => {
            return metadata.Uuid === downloadItem;
        }).length > 0;
      }


    }

    componentDidMount() {
        const isAdded = this.metadataIsAdded(this.props.metadata);
        if (isAdded) {
            this.setState({
                isAdded: isAdded
            });
        }
    }

    componentDidUpdate(prevProps, prevState) {
        const wasAdded = prevState.isAdded;
        const isAdded = this.metadataIsAdded(this.props.metadata);

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
