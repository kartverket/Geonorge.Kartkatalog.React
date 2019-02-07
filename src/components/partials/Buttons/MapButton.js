import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { removeMapItem, addMapItem } from '../../../actions/MapItemActions'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class MapButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isAdded: this.mapItemIsAddedToLocalStorage(this.getMapItem()),
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
    getMapItem() {
        return {
            Uuid: this.props.searchResult.Uuid,
            Title: this.props.searchResult.Title,
            DistributionProtocol: this.props.searchResult.DistributionProtocol,
            GetCapabilitiesUrl: this.props.searchResult.GetCapabilitiesUrl,
            addLayers: []
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
    render() {
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
            let content = '';
            let buttonClass = 'btn btn-sm disabled';
            return React.createElement('span', { className: buttonClass }, content);
        }
    }
}

MapButton.propTypes = {
    mapItems: PropTypes.array.isRequired,
    searchResult: PropTypes.object.isRequired
  }
  
  const mapStateToProps = state => ({
    mapItems: state.mapItems
  });
  
  const mapDispatchToProps = {
    removeMapItem,
    addMapItem,
  };

export default connect(mapStateToProps, mapDispatchToProps)(MapButton);