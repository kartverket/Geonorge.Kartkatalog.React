import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { removeMapItem, addMapItem } from '../../../actions/MapItemActions'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import style from './Buttons.scss'

export class MapButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedMapItems: localStorage.mapItems && Array.isArray(JSON.parse(localStorage.mapItems)) ? JSON.parse(localStorage.mapItems) : [],
            expanded: false
        };
    }

    compareMapItems(mapItemToCompare, mapItemToCompareWith) {
        return mapItemToCompare.GetCapabilitiesUrl === mapItemToCompareWith.GetCapabilitiesUrl && mapItemToCompare.Title === mapItemToCompareWith.Title;
    }
    mapItemIsAddedToLocalStorage(mapItemToCompare) {
        let isAddedToLocalStorage = false
        this.state.selectedMapItems.forEach((mapItemToCompareWith) => {
            if (this.compareMapItems(mapItemToCompare, mapItemToCompareWith)) {
                isAddedToLocalStorage = true;
            }
        });
        return isAddedToLocalStorage;
    }
    datasetServicesIsAddedToLocalStorage() {
        let isAddedToLocalStorage = false
        this.state.selectedMapItems.forEach((mapItemToCompareWith) => {
            this.props.searchResult.DatasetServicesWithShowMapLink.forEach(item => {
                if (this.compareMapItems(item, mapItemToCompareWith)) {
                    isAddedToLocalStorage = true;
                }
            })
        });
        return isAddedToLocalStorage;
    }

    getMapItem(service = null) {
        return {
            Uuid: service ? service.Uuid : this.props.searchResult.Uuid,
            Title: service ? service.Title : this.props.searchResult.Title,
            DistributionProtocol: service ? service.DistributionProtocol : this.props.searchResult.DistributionProtocol,
            GetCapabilitiesUrl: service ? service.GetCapabilitiesUrl : this.props.searchResult.GetCapabilitiesUrl,
            addLayers: []
        }
    }
    getMapItems() {
        let mapItems = this.props.searchResult.DatasetServicesWithShowMapLink.map((item, i) => {
            return this.getMapItem(item);
        });
        return mapItems;
    }
    addToMap(mapItem) {
        this.props.addMapItem(mapItem);
        this.setState({
            isAdded: true,
            selectedMapItems: localStorage.mapItems && Array.isArray(JSON.parse(localStorage.mapItems)) ? JSON.parse(localStorage.mapItems) : []
        });

    }
    toggleExpand() {
        this.setState(prevState => ({
            expanded: !prevState.expanded && !prevState.expandedDownload
        }))
    }
    removeFromMap(mapItem) {
        this.props.removeMapItem(mapItem);
        this.setState({
            isAdded: false,
            selectedMapItems: localStorage.mapItems && Array.isArray(JSON.parse(localStorage.mapItems)) ? JSON.parse(localStorage.mapItems) : []
        });
    }

    renderButton(mapItem) {
        let isAdded = this.mapItemIsAddedToLocalStorage(mapItem);
        let action = isAdded
            ? () => this.removeFromMap([mapItem])
            : () => this.addToMap([mapItem]);        
        let icon = <FontAwesomeIcon icon={isAdded ? ['far', 'map-marker-minus'] : ['far', 'map-marker-plus']} key="icon" />
        let buttonClass = isAdded ? 'off' : 'on';
        let textContent = React.createElement('span', { key: "textContent" }, isAdded ? 'Fjern fra kart' : 'Legg til i kart')

        let childElements = [icon, textContent];
        return React.createElement('span', { onClick: action, className: buttonClass }, childElements);
    }

    renderButtonSelectAll() {
        let mapItems = this.getMapItems();
        let isAdded = this.datasetServicesIsAddedToLocalStorage();
        let action = isAdded
            ? () => this.removeFromMap(mapItems)
            : () => this.addToMap(mapItems);
        let icon = <FontAwesomeIcon icon={isAdded ? ['far', 'map-marker-minus'] : ['far', 'map-marker-plus']} key="icon" />
        let buttonClass = isAdded ? 'off' : 'on';
        let textContent = React.createElement('span', { key: "textContent" }, this.isAdded ? 'Fjern fra kart' : 'Legg til i kart')

        let childElements = [icon, textContent];
        return React.createElement('span', { onClick: action, className: buttonClass }, childElements);
    }

    renderButtonExpand() {
        return <FontAwesomeIcon onClick={() => this.toggleExpand()} className={style.expandmapbutton} icon={this.state.expanded ? 'angle-up' : 'angle-down'} />
    }

    renderButtonList() {
        let mapItems = this.props.searchResult.DatasetServicesWithShowMapLink.map((item, i) => {
            let mapItem = this.getMapItem(item);
            return (
                <span key={i} className="">
                    <a>{mapItem.Title}</a>
                    {this.renderButton(mapItem)}
                </span>
            )
        });
        return React.createElement('span', {}, mapItems);
    }

    render() {
        if (this.props.searchResult.ShowMapLink) {
            if (this.props.searchResult.Type === "dataset") {
                return (
                    <span>
                        {this.renderButtonExpand()}
                        <span className={this.state.expanded ? 'sublist open' : 'sublist'}>
                            {this.renderButtonSelectAll()}
                            {this.renderButtonList()}
                        </span>
                    </span>
                )
            }
            else {
                let mapItem = this.getMapItem()
                return this.renderButton(mapItem);
            }
        }
        return null;
    }
}

MapButton.propTypes = {
    searchResult: PropTypes.object.isRequired
}

const mapDispatchToProps = {
    removeMapItem,
    addMapItem,
};

export default connect(null, mapDispatchToProps)(MapButton);