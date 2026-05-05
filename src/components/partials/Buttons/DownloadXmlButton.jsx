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

    if (url?.length) {
        const buttonClass = style.btn;
        return (

            <Button asChild variant="primary" className={style.detailButton}>
                <a href={url} onClick={handleButtonClick}>
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
