// Dependencies
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Actions
import { removeMapItem, addMapItem } from "actions/MapItemActions";
import { getResource } from "actions/ResourceActions";
import { getApiData } from "actions/ApiActions";
import { getServiceStatusApiUrl } from "actions/ApiUrlActions";

// Stylesheets
import style from "components/partials/Buttons/Buttons.module.scss";

const MapButton = (props) => {
    const dispatch = useDispatch();

    // Redux store
    const mapItems = useSelector((state) => state.mapItems);
    const availableWFSServiceStatuses = useSelector((state) => state.availableWFSServiceStatuses);
    const availableWMSServiceStatuses = useSelector((state) => state.availableWMSServiceStatuses);

    // State
    const [isAdded, setIsAdded] = useState(false);
    const [serviceStatusIsFetched, setServiceStatusIsFetched] = useState(false);
    const [serviceStatusCode, setServiceStatusCode] = useState("");
    const [serviceStatusLabel, setServiceStatusLabel] = useState("");

    const getDatasetService = () => {
        let datasetService = null;
        if (props.metadata.DatasetServicesWithShowMapLink?.length) {
            datasetService = props.metadata.DatasetServicesWithShowMapLink?.find((service) => {
                return service.DistributionProtocol === "OGC:WMS" || service.DistributionProtocol === "WMS-tjeneste" || service.DistributionProtocol === "Tjenestelag";
            });
        } else if (props.metadata.ServiceDistributionProtocolForDataset === "OGC:WMS") {
            datasetService = {
                Uuid: props.metadata.ServiceUuid || props.metadata.Uuid,
                Title: props.metadata.Title,
                DistributionProtocol: props.metadata.ServiceDistributionProtocolForDataset,
                GetCapabilitiesUrl: props.metadata.ServiceDistributionUrlForDataset || props.metadata.MapLink,
                addLayers: []
            };
        }
        return datasetService
            ? {
                  Uuid: datasetService.Uuid,
                  Title: datasetService.Title,
                  DistributionProtocol: getProtocol(datasetService),
                  GetCapabilitiesUrl: datasetService.GetCapabilitiesUrl,
                  addLayers: []
              }
            : null;
    };

    const getService = () => {

        let protocol = props.metadata.ServiceDistributionProtocolForDataset ||
        props.metadata.Protocol ||
        props.metadata.DistributionProtocol;

        let getCapabilitiesUri = props.metadata.ServiceDistributionUrlForDataset ||
        props.metadata.GetCapabilitiesUrl ||
        props.metadata.MapLink;

        if(protocol == "Tjenestelag")
            if(getCapabilitiesUri?.toLowerCase().endsWith("service=wms"))
                protocol = "OGC:WMS";
             else if(getCapabilitiesUri?.toLowerCase().endsWith("service=wfs"))
                protocol = "OGC:WFS"

        return {
            Uuid: props.metadata.Uuid,
            Title: props.metadata.Title,
            DistributionProtocol: protocol,
            GetCapabilitiesUrl: getCapabilitiesUri,
            addLayers: []
        };
    };

    const getProtocol = (service) => {
        let distributionProtocol =  service.DistributionProtocol
                      ? service.DistributionProtocol
                      : service.Protocol;
        if(distributionProtocol == "Tjenestelag")
        {
            if(service?.GetCapabilitiesUrl?.toLowerCase().includes("service=wms"))
                return "OGC:WMS";
            else if(service?.GetCapabilitiesUrl?.toLowerCase().includes("service=wfs"))
            return "OGC:WFS";
        }
        return distributionProtocol;
    };

    const getMapItem = () => {
        const isDataset =
            props.metadata.Type === "dataset" ||
            props.metadata.Type === "Datasett" ||
            props.metadata.HierarchyLevel === "dataset" ||
            props.metadata.Type === "series" ||
            props.metadata.Type === "Datasettserie" ||
            props.metadata.HierarchyLevel === "series";

        const isWmsService =
            props.metadata.DistributionProtocol === "OGC:WMS" ||
            props.metadata.DistributionProtocol === "WMS-tjeneste" ||
            props.metadata.Protocol === "WMS-tjeneste" ||
            props.metadata.Protocol === "Tjenestelag";

        if (isWmsService) {
            return getService();
        } else if (isDataset) {
            return getDatasetService();
        } else {
            return null;
        }
    };

    const addToMap = (mapItem) => {
        if (mapItem?.length) {
            dispatch(addMapItem(mapItem));
        }
    };

    const removeFromMap = (mapItem) => {
        if (mapItem?.length) {
            dispatch(removeMapItem(mapItem));
        }
    };

    const statusForServiceIsAvailable = (serviceUuid) => {
        let hasAvailableStatus = false;
        hasAvailableStatus = availableWFSServiceStatuses.some((availableServiceStatus) => {
            return availableServiceStatus.uuid === serviceUuid;
        });
        if (hasAvailableStatus) {
            return true;
        }

        hasAvailableStatus = availableWMSServiceStatuses.some((availableServiceStatus) => {
            return availableServiceStatus.uuid === serviceUuid;
        });
        return hasAvailableStatus;
    };

    const setServiceStatus = () => {
        let serviceUuid = null;
        if (props.metadata.ServiceUuid) {
            serviceUuid = props.metadata.ServiceUuid;
        } else if (props.metadata.DatasetServicesWithShowMapLink?.length > 0) {
            serviceUuid = props.metadata.DatasetServicesWithShowMapLink[0].Uuid;
        }
        //comment out since service status api is unstabile
        //if (serviceUuid && statusForServiceIsAvailable(serviceUuid)) {
        //    const statusApiUrl = `${dispatch(getServiceStatusApiUrl())}/serviceDetail?uuid=${serviceUuid}`;
        //    setServiceStatusIsFetched(true);
        //    dispatch(getApiData(statusApiUrl)).then((apiData) => {
        //        parseServiceStatus(apiData);
        //    });
        //}
    };

    const parseServiceStatus = (result) => {
        const vurderingIsDefined = result?.connect?.vurdering;
        const numLayersIsDefined = result?.numLayers?.svar;
        const statusOK = vurderingIsDefined && result.connect.vurdering !== "no";
        const numLayers = parseInt(numLayersIsDefined ? result.numLayers.svar : 0);
        if (!statusOK) {
            setServiceStatusCode("service-unavailable-disabled");
            setServiceStatusLabel("Tjenesten er utilgjengelig for øyeblikket");
        } else if (numLayers > 30) {
            if (isRestrictedService()) {
                setServiceStatusCode("service-slow-and-special-access");
                setServiceStatusLabel(
                    "Tjenesten kan være treg å vise og krever spesiell tilgang for å kunne vises - kontakt dataeier"
                );
            } else {
                setServiceStatusCode("service-slow");
                setServiceStatusLabel("Tjenesten kan være treg å vise");
            }
        } else {
            setServiceStatusCode("");
            setServiceStatusLabel("");
            setServiceStatusIsFetched(true);
        }
    };

    const isRestrictedService = () => {
        return !!props.metadata.AccessIsRestricted || !!props.metadata.AccessIsProtected;
    };

    const renderListButton = () => {
        if (props.metadata.ShowMapLink || props.metadata.CanShowMapUrl) {
            const mapItem = getMapItem();
            const buttonDescription = isAdded
                ? dispatch(getResource("RemoveFromMap", "Fjern fra kart"))
                : dispatch(getResource("AddToMap", "Legg til i kart"));
            let buttonTitle = buttonDescription;
            if (serviceStatusCode?.length) {
                buttonTitle = `${buttonTitle}. ${serviceStatusLabel}`;
            }
            const action = isAdded ? () => removeFromMap([mapItem]) : () => addToMap([mapItem]);
            const icon = (
                <FontAwesomeIcon
                    title={buttonTitle}
                    icon={isAdded ? ["far", "map-marker-minus"] : ["far", "map-marker-plus"]}
                    key="icon"
                />
            );
            const buttonClass = isAdded
                ? `${style.listButton} ${style.off}`
                : `${style.listButton} ${style.on} ${style[serviceStatusCode]}`;
            const textContent = React.createElement(
                "span",
                {
                    key: "textContent"
                },
                buttonDescription
            );
            let childElements = [icon, textContent];
            return React.createElement(
                "button",
                {
                    onClick: action,
                    className: buttonClass
                },
                childElements
            );
        }
        return null;
    };

    const renderButton = () => {
        const buttonDescription = isAdded
            ? dispatch(getResource("RemoveFromMap", "Fjern fra kart"))
            : dispatch(getResource("AddToMap", "Legg til i kart"));
        let buttonTitle = buttonDescription;
        if (serviceStatusCode !== "" && serviceStatusLabel !== "") {
            buttonTitle = `${buttonTitle}. ${serviceStatusLabel}`;
        }

        const buttonIcon = isAdded ? ["far", "map-marker-minus"] : ["far", "map-marker-plus"];
        const icon = <FontAwesomeIcon title={buttonTitle} icon={buttonIcon} key="icon" />;
        const textContent = React.createElement(
            "span",
            {
                key: "textContent"
            },
            buttonDescription
        );
        const childElements = [icon, textContent];

        if (props.metadata.CanShowServiceMapUrl || props.metadata.CanShowMapUrl) {
            const buttonClass = isAdded
                ? `${style.btn}  ${style.remove}`
                : `${style.btn}  ${style.download} ${style[serviceStatusCode]}`;
            const mapItem = getMapItem();
            const action = isAdded ? () => removeFromMap([mapItem]) : () => addToMap([mapItem]);
            return React.createElement(
                "button",
                {
                    onClick: action,
                    className: buttonClass
                },
                childElements
            );
        } else {
            const buttonClass = `${style.btn}  ${style.disabled}`;
            return React.createElement(
                "button",
                {
                    className: buttonClass
                },
                childElements
            );
        }
    };

    useEffect(() => {
        const mapItemUuid = getMapItem()?.Uuid || null;
        const isAdded = mapItemUuid
            ? mapItems.filter((mapItem) => {
                  return mapItem && mapItem.Uuid && mapItemUuid === mapItem.Uuid;
              }).length > 0
            : false;
        if (isAdded) {
            setIsAdded(isAdded);
        }
        setServiceStatus();
    }, []);

    useEffect(() => {
        if (!serviceStatusIsFetched) {
            setServiceStatus();
        }
        const mapItemUuid = getMapItem()?.Uuid || null;
        const isAdded = mapItemUuid
            ? mapItems.filter((mapItem) => {
                  return mapItem && mapItem.Uuid && mapItemUuid === mapItem.Uuid;
              }).length > 0
            : false;
        setIsAdded(isAdded);
    }, [serviceStatusIsFetched, mapItems]);

    return props.listButton ? renderListButton() : renderButton();
};

MapButton.propTypes = {
    metadata: PropTypes.object.isRequired,
    listButton: PropTypes.bool
};

MapButton.defaultProps = {
    listButton: true
};

export default MapButton;
