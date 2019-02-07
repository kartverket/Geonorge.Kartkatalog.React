import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { removeItemSelectedForDownload, addItemSelectedForDownload } from '../../../actions/DownloadItemActions'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import style from './MetadataSearchResult.scss';
import MapButton from '../Buttons/MapButton';

class MetadataSearchResult extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSelectedForDownload: this.selectedForDownloadIsAddedToLocalStorage(this.getDownloadButton())
    };
  }
  
  compareItemsToDownload(itemToCompare, itemToCompareWith)
  {
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
  isApplication() {
    return this.props.searchResult.Type == "software"
  }
  restrictionsClassnames() {       
     if(this.props.searchResult.AccessConstraint === 'restricted') {
        return 'red'
     } if (this.props.searchResult.AccessConstraint === "otherRestrictions" && this.props.searchResult.OtherConstraintsAccess === 'norway digital restricted') {
       return 'yellow'
     } else {
      return "green" 
     }          
  }

  renderDownloadButton() {
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

  renderApplicationButton() {
    if (this.isApplication(this.props.searchResult.Type)) {
      if (this.props.searchResult.DistributionUrl) {
        let distributionUrl = this.props.searchResult.DistributionUrl
        let icon = <FontAwesomeIcon icon={['far', 'external-link-square']} key="icon" />
        let buttonClass = 'on';
        let textContent = React.createElement('span', { key: "textContent" }, 'Til nettside')

        let childElements = [icon, textContent];
        return React.createElement('a', { href: distributionUrl, className: buttonClass }, childElements);
      }
      else {
        let icon = <FontAwesomeIcon icon={['far', 'external-link-square']} key="icon" />
        let buttonClass = 'btn btn-sm disabled off'
        let textContent = React.createElement('span', { key: "textContent" }, 'ikke tilgjengelig')
        let childElements = [icon, textContent];
        return React.createElement('span', { className: buttonClass }, childElements);
      }
    }
  }

  render() {
    return (
      <div  className={style.listItem}>
        <div>
          <span className={style.listItemTitle}><a href={this.props.searchResult.ShowDetailsUrl}>{this.props.searchResult.Title}</a></span>          
          <span className={style.listItemInfo}> <FontAwesomeIcon key="lock" className={this.restrictionsClassnames()} title={this.props.searchResult.IsOpenData ? 'Åpne datasett' : 'Krever innlogging'} icon={this.props.searchResult.IsOpenData ? ['far', 'lock-open'] : ['far', 'lock']} /> {this.props.searchResult.TypeTranslated} fra <a href={this.props.searchResult.OrganizationUrl}>{this.props.searchResult.Organization}</a> </span>
        </div>        
        <div>
        <span className={style.listItemButton}>
            <MapButton searchResult={this.props.searchResult}></MapButton>
          </span>
          <span className={style.listItemButton}>
            {this.renderDownloadButton()}
          </span>
          <span className={style.listItemButton}>
            {this.renderApplicationButton()}
          </span>
        </div>        
      </div>
    )
  }
}

MetadataSearchResult.propTypes = {
  mapItems: PropTypes.array.isRequired,
  searchResult: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  mapItems: state.mapItems
});

const mapDispatchToProps = {
  removeItemSelectedForDownload,
  addItemSelectedForDownload
};

export default connect(mapStateToProps, mapDispatchToProps)(MetadataSearchResult);