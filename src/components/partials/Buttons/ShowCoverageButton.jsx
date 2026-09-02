// Dependencies
import React, { useState } from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { Button } from "@digdir/designsystemet-react";

// Actions
import { getResource } from "@/actions/ResourceActions";

// Reducers
import { pushToDataLayer } from "@/reducers/TagManagerReducer";

// Components
import CoverageMapModal from "@/components/partials/CoverageMap/CoverageMapModal";

// Stylesheets
import style from "@/components/partials/Buttons/Buttons.module.scss";
import { ExternalLinkIcon } from '@navikt/aksel-icons';

const DUMMY_LAYER_GROUPS = [
    {

        // https://wms.geonorge.no/skwms1/wms.geonorge_dekningskart?datasett=nve_flomsoner
        // https://wms.geonorge.no/skwms1/wms.gp_dek_oversikt?datasett=nve_flomsoner
        name: "Eksempel-datasett",
        wms: [
            {
                url: "https://kart.nve.no/enterprise/services/Flomsoner2/MapServer/WMSServer",
                name: "meep",
                // layers: [
                //     {
                //         name: "topo4_WMS",
                //         title: "Topografisk norgeskart",
                //         children: [
                //             { name: "Arealdekke", title: "Arealdekke" },
                //             { name: "Veger", title: "Veger" },
                //         ],
                //     },
                // ],
            },
        ],
        dekningskartRutenett: "nve_flomsoner",
        dekningskartKommuner: "nve_flomsoner",
        fullstendighetsdekning: "https://testnedlasting.geonorge.no/geonorge/Basisdata/DOKFullstendighetsdekningskart/Kartkatalogen/dekning_flomsoner.geojson",
        // "https://nedlasting.geonorge.no/api/dekningsoversikt/dted.geojson",
    },
];

const ShowCoverageButton = (props) => {
    const dispatch = useDispatch();
    const [isMapOpen, setIsMapOpen] = useState(false);

    const handleButtonClick = () => {
        if (props.metadata.CoverageUrl) {
            setIsMapOpen(true);

            dispatch(
                pushToDataLayer({
                    event: "showMore",
                    category: "metadataDetails",
                    activity: "showCoverageMap",
                    metadata: {
                        name: props.metadata.Title,
                        uuid: props.metadata.Uuid,
                    },
                })
            );
        }
    };

    const renderButton = () => {
        const buttonDescription = dispatch(getResource("DisplayCoverageMap", "Vis dekningskart"));
        const buttonClass = `${style.detailButton} ${style.secondaryButton}`;

        if (!props.metadata.CoverageUrl?.trim()) return null;

        return (
            <Button variant="secondary" className={buttonClass} onClick={handleButtonClick}>
                <ExternalLinkIcon aria-hidden="true" />
                <span className={style.buttonText}>{buttonDescription}</span>
            </Button>
        );
    };

    return (
        <>
            {renderButton()}
            <CoverageMapModal
                open={isMapOpen}
                onClose={() => setIsMapOpen(false)}
                layerGroups={DUMMY_LAYER_GROUPS}
            />
        </>
    );
};

ShowCoverageButton.propTypes = {
    metadata: PropTypes.object.isRequired
};

export default ShowCoverageButton;