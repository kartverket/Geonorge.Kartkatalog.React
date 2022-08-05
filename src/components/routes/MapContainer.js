// Dependencies
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MapContainer as Map } from "r_map";

// Components
import { ErrorBoundary } from "../ErrorBoundary";

// Actions
import { fetchMapItems } from "actions/MapItemActions";

const MapContainer = () => {
    const dispatch = useDispatch();

    // Redux store
    const mapItems = useSelector((state) => state.mapItems);

    useEffect(() => {
        dispatch(fetchMapItems());
    }, []);

    return (
        <div>
            <ErrorBoundary>
                <Map services={mapItems} />
            </ErrorBoundary>
        </div>
    );
};

export default MapContainer;
