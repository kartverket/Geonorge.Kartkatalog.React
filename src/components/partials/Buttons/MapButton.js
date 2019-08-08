// Dependencies
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// Actions
import { removeMapItem, addMapItem } from '../../../actions/MapItemActions'
import { getResource } from '../../../actions/ResourceActions'

// Stylesheets
import style from './Buttons.scss'


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

    getMapItem(service = null) {
        return {
            Uuid: service ? service.Uuid : this.props.metadata.Uuid,
            Title: service ? service.Title : this.props.metadata.Title,
            DistributionProtocol: service ? service.DistributionProtocol : this.props.metadata.DistributionProtocol,
            GetCapabilitiesUrl: service ? service.GetCapabilitiesUrl : this.props.metadata.GetCapabilitiesUrl,
            addLayers: []
        }
    }

    getServiceMapItem() {
        return {
            Uuid: this.props.metadata.Uuid,
            Title: this.props.metadata.Title,
            DistributionProtocol: this.props.metadata.ServiceDistributionProtocolForDataset,
            GetCapabilitiesUrl: this.props.metadata.MapLink,
            addLayers: []
        }
    }

    getMapItemFromMetadata() {
        return {
            Uuid: this.props.metadata.Uuid,
            Title: this.props.metadata.Title,
            DistributionProtocol: this.props.metadata.DistributionDetails.Protocol,
            GetCapabilitiesUrl: this.props.metadata.MapLink,
            addLayers: []
        }
    }

    addToMap(mapItem) {
        this.props.addMapItem(mapItem);
    }

    toggleExpand() {
        this.setState(prevState => ({
            expanded: !prevState.expanded && !prevState.expandedDownload
        }))
    }

    removeFromMap(mapItem) {
        this.props.removeMapItem(mapItem);
    }

    setServiceStatus() {
        console.log(this.props.metadata);
        let serviceUuid = undefined;
        if(this.props.metadata.ServiceUuid !== undefined) 
            serviceUuid = this.props.metadata.ServiceUuid;
        else if(this.props.metadata.DatasetServicesWithShowMapLink !== undefined && this.props.metadata.DatasetServicesWithShowMapLink.length > 0)
            serviceUuid = this.props.metadata.DatasetServicesWithShowMapLink[0].Uuid;

        console.log("ServiceUuid: " + serviceUuid);

        if (serviceUuid !== undefined) {
            fetch('https://status.geonorge.no/monitorApi/serviceDetail?uuid='+ serviceUuid)
            .then(response => response.json())
            .then(data => this.parseServiceStatus(data));
        }
    }

    parseServiceStatus(result)
    {
        try {
            console.log(result);
            var vurderingIsDefined = result.connect !== undefined && result.connect.vurdering !== undefined;
            var numLayersIsDefined = result.numLayers !== undefined && result.numLayers.svar !== undefined;
            var statusOK = vurderingIsDefined && result.connect.vurdering !== "no";
            var numLayers = parseInt(numLayersIsDefined ? result.numLayers.svar : 0);
            console.log("numLayers: " + numLayers);
            if (!statusOK) {
                console.log("Status: service unavailable");
                this.setState(
                    (prevState,props)=>{
                        return {serviceStatusCode: 'unavailable', serviceStatusLabel: 'Tjenesten er utilgjengelig for øyeblikket' };
                     }
                 );
                /*this.button.className += " disabled";
                this.button.icon.className = "custom-icon custom-icon-kartmarkoer-unavailable";
                this.button.url = null;
                this.button.title = "Tjenesten er utilgjengelig for øyeblikket";
                this.button.attributes = [{ key: "disabled", value: "disabled" }];
                $(".show-in-map-btn-" + this.resultItem.Uuid).addClass("disabled");
                $(".show-in-map-btn-" + this.resultItem.Uuid).attr("disabled", "disabled");
                $(".show-in-map-btn-" + this.resultItem.Uuid).attr("href", "");
                $(".show-in-map-btn-" + this.resultItem.Uuid).attr("title", "@Html.Raw(UI.ServiceNotavailable)");
                $(".show-in-map-btn-" + this.resultItem.Uuid).attr("data-original-title", "@Html.Raw(UI.ServiceNotavailable)");
                $(".show-in-map-btn-" + this.resultItem.Uuid + " > span").attr("class", "custom-icon custom-icon-kartmarkoer-unavailable");*/
            }
            else if (numLayers > 30) {
                //this.button.icon.className = "custom-icon custom-icon-kartmarkoer-warning";
                //$(".show-in-map-btn-" + this.resultItem.Uuid + " > span").attr("class", "custom-icon custom-icon-kartmarkoer-warning");
                if (this.isRestrictedService()) {
                    console.log("Status: service is slow and special access required");
                    this.setState(
                        (prevState,props)=>{
                            return {serviceStatusCode: 'serviceSlowAndSpecialAccess', serviceStatusLabel: 'Tjenesten kan være treg å vise og krever spesiell tilgang for å kunne vises - kontakt dataeier' };
                         }
                     );
                    //this.button.title = "@Html.Raw(UI.ServiceSlowAndSpecialAccess)";
                    //$(".show-in-map-btn-" + this.resultItem.Uuid).attr("title", "@Html.Raw(UI.ServiceSlowAndSpecialAccess)");
                    //$(".show-in-map-btn-" + this.resultItem.Uuid).attr("data-original-title", "@Html.Raw(UI.ServiceSlowAndSpecialAccess)");*/
                } else {
                    console.log("Status: service is slow");
                    this.setState(
                        (prevState,props)=>{
                            return {serviceStatusCode: 'serviceSlow', serviceStatusLabel: 'Tjenesten kan være treg å vise' };
                         }
                     );
                    //this.button.title = "Tjenesten kan være treg å vise";
                    //$(".show-in-map-btn-" + this.resultItem.Uuid).attr("title", "@Html.Raw(UI.ServiceSlow)");
                    //$(".show-in-map-btn-" + this.resultItem.Uuid).attr("data-original-title", "@Html.Raw(UI.ServiceSlow)");
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
        console.log(this.state.serviceStatusCode + ", " + this.state.serviceStatusLabel) 
        if (this.props.metadata.ShowMapLink || this.props.metadata.CanShowMapUrl) {
            let mapItem = this.props.metadata.Type === "dataset" || this.props.metadata.Type === "Datasett" ? this.getMapItem(this.props.metadata.DatasetServicesWithShowMapLink[0]) : this.getMapItem();
            let isAdded = this.state.isAdded;
            let buttonDescription = isAdded ? this.props.getResource('removeFromMap', 'Fjern fra kart') : this.props.getResource('addToMap', 'Legg til i kart');
            buttonDescription = buttonDescription + " " + this.state.serviceStatusCode + " " + this.state.serviceStatusLabel //todo fix UI
            let action = isAdded
                ? () => this.removeFromMap([mapItem])
                : () => this.addToMap([mapItem]);
            let icon = <FontAwesomeIcon title={buttonDescription} icon={isAdded ? ['far', 'map-marker-minus'] : ['far', 'map-marker-plus']}
                key="icon" />;
            let buttonClass = isAdded ? 'off' : 'on';
            let textContent = React.createElement('span', { key: "textContent" }, buttonDescription);
            let childElements = [icon, textContent];
            return React.createElement('span', { onClick: action, className: buttonClass }, childElements);
        }
        return null;
    }

    renderButton() {
        console.log(this.state.serviceStatusCode + ", " + this.state.serviceStatusLabel) 
        let isAdded = this.state.isAdded;
        let buttonDescription = isAdded ? this.props.getResource('removeFromMap', 'Fjern fra kart') : this.props.getResource('addToMap', 'Legg til i kart');
        buttonDescription = buttonDescription + " " + this.state.serviceStatusCode + " " + this.state.serviceStatusLabel //todo fix UI
        const buttonClass = this.state.isAdded ? [style.btn + ' remove'] : [style.btn + ' download'];
        const buttonIcon = isAdded ? ['far', 'map-marker-minus'] : ['far', 'map-marker-plus'];
        if (this.props.metadata.CanShowServiceMapUrl || this.props.metadata.CanShowMapUrl) {
            let mapItem;
            if (this.props.metadata.CanShowServiceMapUrl) {
                mapItem = this.getServiceMapItem()
            }
            else if (this.props.metadata.CanShowMapUrl) {
                mapItem = this.getMapItemFromMetadata()
            }
            
            let action = isAdded
                ? () => this.removeFromMap([mapItem])
                : () => this.addToMap([mapItem]);           
            let icon = <FontAwesomeIcon title={buttonDescription} icon={buttonIcon}
                key="icon" />;
            let textContent = React.createElement('span', { key: "textContent" }, buttonDescription);

            let childElements = [icon, textContent];
            return React.createElement('span', { onClick: action, className: buttonClass }, childElements);
        } else {
            let icon = <FontAwesomeIcon title={buttonDescription} icon={buttonIcon} key="icon" />;
            let buttonClass = style.btn + ' disabled';
            let textContent = React.createElement('span', { key: "textContent" }, 'Legg til i kart');

            let childElements = [icon, textContent];
            return React.createElement('span', { className: buttonClass }, childElements);
        }
    }

    componentDidMount() {
        this.setServiceStatus();
        let mapItemUuid = this.props.metadata.Type === "dataset" || this.props.metadata.Type === "Datasett" ? this.getMapItem(this.props.metadata.DatasetServicesWithShowMapLink[0]).Uuid : this.getMapItem().Uuid;
        const isAdded = this.props.mapItems.filter(mapItem => {
            return mapItemUuid === mapItem.Uuid;
        }).length > 0;
        if (isAdded) {
            this.setState({
                isAdded: isAdded
            });
        }
    }

    componentDidUpdate(prevProps, prevState) {
        let serviceStatusCode = this.state.serviceStatusCode;
        console.log(serviceStatusCode + ":" + prevState.serviceStatusCode);
        if(serviceStatusCode =='')
            this.setServiceStatus();

        const wasAdded = prevState.isAdded;
        let mapItemUuid = this.props.metadata.Type === "dataset" || this.props.metadata.Type === "Datasett" ? this.getMapItem(this.props.metadata.DatasetServicesWithShowMapLink[0]).Uuid : this.getMapItem().Uuid;
        const isAdded = this.props.mapItems.filter(mapItem => {
            return mapItemUuid === mapItem.Uuid;
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
