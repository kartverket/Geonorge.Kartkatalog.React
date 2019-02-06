import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchMapItems, removeMapItem, addMapItem } from '../../../actions/MapItemActions'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import style from './MetadataSearchResult.scss';

class MetadataSearchResult extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAdded: this.mapItemIsAddedToLocalStorage(this.getMapItem()),
      isSelectedForDownload: this.selectedForDownloadIsAddedToLocalStorage(this.getDownloadButton())
    };
  }

  compareMapItems(mapItemToCompare, mapItemToCompareWith) {
    return mapItemToCompare.GetCapabilitiesUrl === mapItemToCompareWith.GetCapabilitiesUrl && mapItemToCompare.Title === mapItemToCompareWith.Title;
  }
  mapItemIsAddedToLocalStorage(mapItemToCompare) {
    if (localStorage.mapItems && Array.isArray(JSON.parse(localStorage.mapItems))) {
      let isAddedToLocalStorage = false;
      JSON.parse(localStorage.mapItems).forEach((mapItemToCompareWith) => {
        if (this.compareMapItems(mapItemToCompare, mapItemToCompareWith)) {
          isAddedToLocalStorage = true;
        }
      });
      return isAddedToLocalStorage;
    } else {
      return false;
    }
  }
  selectedForDownloadIsAddedToLocalStorage(mapItemToCompare) {
    if (localStorage.mapItems && Array.isArray(JSON.parse(localStorage.mapItems))) {
      let isAddedToLocalStorage = false;
      JSON.parse(localStorage.mapItems).forEach((mapItemToCompareWith) => {
        if (this.compareMapItems(mapItemToCompare, mapItemToCompareWith)) {
          isAddedToLocalStorage = true;
        }
      });
      return isAddedToLocalStorage;
    } else {
      return false;
    }
  }

  getMapItem() {
    return {
      Uuid: this.props.searchResult.Uuid,
      Title: this.props.searchResult.Title,
      DistributionProtocol: this.props.searchResult.DistributionProtocol,
      GetCapabilitiesUrl: this.props.searchResult.GetCapabilitiesUrl,
      addLayers: []
    }
  }
  getDownloadButton(){
    return {

    }
  }

  addToMap(mapItem) {
    this.setState({
      isAdded: true
    });
    this.props.addMapItem(mapItem);
  }
  removeFromMap(mapItem) {
    this.setState({
      isAdded: false
    });
    this.props.removeMapItem(mapItem);
  }

  renderMapButton() {
    let mapItem = this.getMapItem();
    if (this.props.searchResult.ShowMapLink) {
      let action = this.state.isAdded
        ? () => this.removeFromMap(mapItem)
        : () => this.addToMap(mapItem);
      let icon = <FontAwesomeIcon icon={this.state.isAdded ? ['far', 'map-marker-minus'] : ['far', 'map-marker-plus']} key="icon" />
      let buttonClass = this.state.isAdded ? 'off' : 'on';
      let textContent = React.createElement('span', { key: "textContent" }, this.state.isAdded ? 'Fjern fra kart' : 'Legg til i kart')

      let childElements = [icon, textContent];
      return React.createElement('span', { onClick: action, className: buttonClass }, childElements);

    } else {
      let content = 'Utilgjengelig';
      let buttonClass = 'btn btn-sm disabled';
      return React.createElement('span', { className: buttonClass }, content);
    }
  }

  renderDownloadButton() {
    let button = this.getDownloadButton();
    console.log(this.props.searchResult.DistributionProtocol)
    if (this.props.searchResult.DistributionProtocol == 'GEONORGE:DOWNLOAD') {
      
      let action = this.state.isSelectedForDownload
        ? () => this.removeFromMap(button)
        : () => this.addToMap(button);
      let icon = <FontAwesomeIcon icon={this.state.isSelectedForDownload ? ['fas', 'arrow-circle-down'] : ['fas', 'arrow-down']} key="icon" />
      let buttonClass = this.state.isSelectedForDownload ? 'off' : 'on';
      let textContent = React.createElement('span', { key: "textContent" }, this.state.isSelectedForDownload ? 'Fjern fra nedlasting' : 'Last ned')

      let childElements = [icon, textContent];
      return React.createElement('span', { onClick: action, className: buttonClass }, childElements);

    } else {
      let content = 'Utilgjengelig';
      let buttonClass = 'btn btn-sm disabled';
      return React.createElement('span', { className: buttonClass }, content);
    }
  }

  render() {
    return (
      <div style={{ display: "flex" }} className={style.listItem}>
        <div style={{ flex: "5" }}>
          <span className={style.listItemTitle}><a href={this.props.searchResult.ShowDetailsUrl}>{this.props.searchResult.Title}</a></span>
          <span className={style.listItemInfo}>{this.props.searchResult.TypeTranslated} fra <a href={this.props.searchResult.OrganizationUrl}>{this.props.searchResult.Organization}</a></span>
        </div>
        <div>
          <span className={style.listItemButton}>
            {this.renderMapButton()}
          </span>
        </div>
        <div>
          <span className={style.listItemButton}>
            {this.renderDownloadButton()}
          </span>
        </div>
      </div>
    )
  }
}

MetadataSearchResult.propTypes = {
  fetchMapItems: PropTypes.func.isRequired,
  mapItems: PropTypes.array.isRequired,
  searchResult: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  mapItems: state.mapItems
});

const mapDispatchToProps = {
  fetchMapItems,
  removeMapItem,
  addMapItem
};

export default connect(mapStateToProps, mapDispatchToProps)(MetadataSearchResult);