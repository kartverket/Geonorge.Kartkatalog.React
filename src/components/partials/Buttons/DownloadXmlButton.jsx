// Dependencies
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { Button } from "@digdir/designsystemet-react";

// Actions
import { getResource } from "@/actions/ResourceActions";
// Reducers
import { pushToDataLayer } from "@/reducers/TagManagerReducer";

// Stylesheets
import style from "@/components/partials/Buttons/Buttons2.module.scss";
import { DownloadIcon} from "@navikt/aksel-icons";

const DownloadXmlButton = (props) => {
    const dispatch = useDispatch();

    const handleButtonClick = () => {
        const tagData = {
            name: props.metadata.Title,
            uuid: props.metadata.Uuid
        };
        dispatch(
            pushToDataLayer({
                event: "download",
                category: "metadataDetails",
                activity: "downloadXML",
                metadata: tagData
            })
        );
    };

    const buttonDescription = `${dispatch(getResource("Download", "Last ned"))} metadata XML`;
    const url = props.metadata.MetadataXmlUrl;
    const buttonClass = `${style.detailButton} ${style.secondaryButton}`;

    if (url?.length) {
        
        return (

            <Button asChild variant="primary" className={buttonClass}>
                <a href={url} onClick={handleButtonClick}>
                    <DownloadIcon aria-hidden="true" fontSize="1.5rem" />
                    <span className={style.buttonText}>{buttonDescription}</span>
                </a>
            </Button>
        );
    } else {
        return null
    }
};

DownloadXmlButton.propTypes = {
    metadata: PropTypes.object.isRequired
};

export default DownloadXmlButton;
