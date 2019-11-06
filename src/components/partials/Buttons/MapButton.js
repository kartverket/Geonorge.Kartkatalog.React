// Dependencies
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// Actions
import { removeMapItem, addMapItem } from '../../../actions/MapItemActions';
import { getResource } from '../../../actions/ResourceActions';

// Stylesheets
import style from './Buttons.scss';


export class MapButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
            expanded: false,
            isAdded: false,
            serviceStatusCode: "",
            serviceStatusLabel: ""
        };
    }

    getDatasetService() {
        let datasetService = null;
        if (this.props.metadata.DatasetServicesWithShowMapLink && this.props.metadata.DatasetServicesWithShowMapLink.length){
            datasetService = this.props.metadata.DatasetServicesWithShowMapLink && this.props.metadata.DatasetServicesWithShowMapLink.find(service => {
                return service.DistributionProtocol === "OGC:WMS" || service.DistributionProtocol === "WMS-tjeneste";
            });
        }
        else if (this.props.metadata.ServiceDistributionProtocolForDataset === "OGC:WMS") {
            datasetService = {
                Uuid: this.props.metadata.ServiceUuid,
                Title: this.props.metadata.Title,
                DistributionProtocol: this.props.metadata.ServiceDistributionProtocolForDataset,
                GetCapabilitiesUrl: this.props.metadata.MapLink,
                addLayers: []
            }
        }
        return datasetService
            ? {
                Uuid: datasetService.Uuid,
                Title: datasetService.Title,
                DistributionProtocol: datasetService.DistributionProtocol ? datasetService.DistributionProtocol : datasetService.Protocol,
                GetCapabilitiesUrl: datasetService.GetCapabilitiesUrl,
                addLayers: []
            } : null;
    }

    getService() {
        return {
            Uuid: this.props.metadata.Uuid,
            Title: this.props.metadata.Title,
            DistributionProtocol: this.props.metadata.ServiceDistributionProtocolForDataset || this.props.metadata.Protocol || this.props.metadata.DistributionProtocol,
            GetCapabilitiesUrl: this.props.metadata.ServiceDistributionUrlForDataset || this.props.metadata.GetCapabilitiesUrl || this.props.metadata.MapLink,
            addLayers: []
        }
    }

    getMapItem() {
        const isDataset = this.props.metadata.Type === "dataset" || this.props.metadata.Type === "Datasett" || this.props.metadata.HierarchyLevel === "dataset";
        const isWmsService = this.props.metadata.DistributionProtocol === "OGC:WMS" || this.props.metadata.DistributionProtocol === "WMS-tjeneste" || this.props.metadata.Protocol === "WMS-tjeneste";
        if (isWmsService) {
            return this.getService();
        } else if (isDataset) {
            return this.getDatasetService();
        } else {
            return null
        }
    }

    addToMap(mapItem) {
        if (mapItem && mapItem.length) {
            this.props.addMapItem(mapItem);
        }
    }

    toggleExpand() {
        this.setState(prevState => ({
            expanded: !prevState.expanded && !prevState.expandedDownload
        }))
    }

    removeFromMap(mapItem) {
        if (mapItem && mapItem.length) {
            this.props.removeMapItem(mapItem);
        }
    }

    setServiceStatus() {
        let serviceUuid = undefined;
        if (this.props.metadata.ServiceUuid !== undefined)
            serviceUuid = this.props.metadata.ServiceUuid;
        else if (this.props.metadata.DatasetServicesWithShowMapLink !== undefined && this.props.metadata.DatasetServicesWithShowMapLink.length > 0)
            serviceUuid = this.props.metadata.DatasetServicesWithShowMapLink[0].Uuid;

        if (serviceUuid !== undefined) {
            fetch('https://status.geonorge.no/monitorApi/serviceDetail?uuid=' + serviceUuid)
                .then(response => response.json())
                .then(data => this.parseServiceStatus(data));
        }
    }

    parseServiceStatus(result) {
        try {
            var vurderingIsDefined = result.connect !== undefined && result.connect.vurdering !== undefined;
            var numLayersIsDefined = result.numLayers !== undefined && result.numLayers.svar !== undefined;
            var statusOK = vurderingIsDefined && result.connect.vurdering !== "no";
            var numLayers = parseInt(numLayersIsDefined ? result.numLayers.svar : 0);
            if (!statusOK) {
                this.setState(
                    (prevState, props) => {
                        return { serviceStatusCode: 'service-unavailable-disabled', serviceStatusLabel: 'Tjenesten er utilgjengelig for øyeblikket' };
                    }
                );
            }
            else if (numLayers > 30) {
                if (this.isRestrictedService()) {
                    this.setState(
                        (prevState, props) => {
                            return { serviceStatusCode: 'service-slow-and-special-access', serviceStatusLabel: 'Tjenesten kan være treg å vise og krever spesiell tilgang for å kunne vises - kontakt dataeier' };
                        }
                    );
                } else {
                    this.setState(
                        (prevState, props) => {
                            return { serviceStatusCode: 'service-slow', serviceStatusLabel: 'Tjenesten kan være treg å vise' };
                        }
                    );
                }

            }
        }
        catch (err) {
            console.log(err);
        }
    }

    isRestrictedService() {
        if (this.props.metadata.AccessIsRestricted || this.props.metadata.AccessIsProtected)
            return true;
        else
            return false;
    }

    renderListButton() {
        if (this.props.metadata.ShowMapLink || this.props.metadata.CanShowMapUrl) {
            let mapItem = this.getMapItem();
            let isAdded = this.state.isAdded;
            let buttonDescription = isAdded ? this.props.getResource('RemoveFromMap', 'Fjern fra kart') : this.props.getResource('AddToMap', 'Legg til i kart');
            let buttonTitle = buttonDescription;
            if (this.state.serviceStatusCode !== '')
                if (this.state.serviceStatusLabel !== '')
                    buttonTitle = buttonTitle + ". " + this.state.serviceStatusLabel;
            let action = isAdded
                ? () => this.removeFromMap([mapItem])
                : () => this.addToMap([mapItem]);
            let icon = <FontAwesomeIcon title={buttonTitle} icon={isAdded ? ['far', 'map-marker-minus'] : ['far', 'map-marker-plus']}
                key="icon" />;
            let buttonClass = isAdded ? 'off' : `on ${this.state.serviceStatusCode}`;
            let textContent = React.createElement('span', { key: "textContent" }, buttonDescription);
            let childElements = [icon, textContent];
            return React.createElement('span', { onClick: action, className: buttonClass }, childElements);
        }
        return null;
    }

    renderButton() {
        let isAdded = this.state.isAdded;
        let buttonDescription = isAdded ? this.props.getResource('RemoveFromMap', 'Fjern fra kart') : this.props.getResource('AddToMap', 'Legg til i kart');
        let buttonTitle = buttonDescription;
        if (this.state.serviceStatusCode !== '')
            if (this.state.serviceStatusLabel !== '')
                buttonTitle = buttonTitle + ". " + this.state.serviceStatusLabel;
        const buttonClass = this.state.isAdded ? [style.btn + ' remove'] : [style.btn + ' download'] + this.state.serviceStatusCode;
        const buttonIcon = isAdded ? ['far', 'map-marker-minus'] : ['far', 'map-marker-plus'];
        if (this.props.metadata.CanShowServiceMapUrl || this.props.metadata.CanShowMapUrl) {
            const mapItem = this.getMapItem()
            let action = isAdded
                ? () => this.removeFromMap([mapItem])
                : () => this.addToMap([mapItem]);
            let icon = <FontAwesomeIcon title={buttonTitle} icon={buttonIcon}
                key="icon" />;
            let textContent = React.createElement('span', { key: "textContent" }, buttonDescription);

            let childElements = [icon, textContent];
            return React.createElement('span', { onClick: action, className: buttonClass }, childElements);
        } else {
            let icon = <FontAwesomeIcon title={buttonTitle} icon={buttonIcon} key="icon" />;
            let buttonClass = style.btn + ' disabled';
            let textContent = React.createElement('span', { key: "textContent" }, buttonDescription);

            let childElements = [icon, textContent];
            return React.createElement('span', { className: buttonClass }, childElements);
        }
    }

    componentDidMount() {
        this.setServiceStatus();
        const mapItemUuid = this.getMapItem() && this.getMapItem().Uuid ? this.getMapItem().Uuid : null;
        const isAdded = mapItemUuid
            ? this.props.mapItems.filter(mapItem => {
                return mapItem && mapItem.Uuid && mapItemUuid === mapItem.Uuid;
            }).length > 0
            : false;
        if (isAdded) {
            this.setState({
                isAdded: isAdded
            });
        }
    }

    componentDidUpdate(prevProps, prevState) {
        const serviceStatusCode = this.state.serviceStatusCode;
        if (serviceStatusCode === '')
            this.setServiceStatus();

        const wasAdded = prevState.isAdded;
        const mapItemUuid = this.getMapItem() && this.getMapItem().Uuid ? this.getMapItem().Uuid : null;
        const isAdded = mapItemUuid
            ? this.props.mapItems.filter(mapItem => {
                return mapItem && mapItem.Uuid && mapItemUuid === mapItem.Uuid;
            }).length > 0
            : false;
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

MapButton.propTypes = {
    metadata: PropTypes.object.isRequired,
    listButton: PropTypes.bool,
    removeMapItem: PropTypes.func.isRequired,
    addMapItem: PropTypes.func.isRequired
};


MapButton.defaultProps = {
    listButton: true,
};

const mapStateToProps = state => ({
    mapItems: state.mapItems,
    resources: state.resources
});

const mapDispatchToProps = {
    removeMapItem,
    addMapItem,
    getResource
};

export default connect(mapStateToProps, mapDispatchToProps)(MapButton);
