// Dependencies
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MapContainer as Map } from "r_map";

// Components
import { ErrorBoundary } from "../ErrorBoundary";

// Actions
import { fetchMapItems } from "actions/MapItemActions";

const MapContainer = () => {
    const dispatch = useDispatch();

    const [isLoaded, setIsLoaded] = useState(false);

    // Redux store
    const mapItems = useSelector((state) => state.mapItems);

    useEffect(() => {
        dispatch(fetchMapItems());
        setIsLoaded(true);
    }, []);

    return isLoaded ? (
        <div>
            <ErrorBoundary>
                <Map services={mapItems} />
            </ErrorBoundary>
        </div>
    ) : null;
};

export default MapContainer;
