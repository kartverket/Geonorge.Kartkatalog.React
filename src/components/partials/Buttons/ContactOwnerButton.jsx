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

const ContactOwnerButton = (props) => {
    const dispatch = useDispatch();

    const handleButtonClick = () => {
        const tagData = {
            name: props.metadata.Title,
            uuid: props.metadata.Uuid
        };
        dispatch(
            pushToDataLayer({
                event: "contact",
                category: "metadataDetails",
                activity: "contactDataOwner",
                metadata: tagData
            })
        );
    };

    const buttonDescription = dispatch(getResource("ContactDataOwner", "Kontakt dataeier"));
    const email = props.metadata.ContactMetadata?.Email;

    if (!email?.trim()) return null;

    return (
        <Button asChild variant="primary" className={style.detailButton}>
            <a
                href={`mailto:${email}`}
                onClick={handleButtonClick}
                target="_blank"
                rel="noopener noreferrer"
            >
                <span className={style.buttonText}>{buttonDescription}</span>
            </a>
        </Button>
    );
};

ContactOwnerButton.propTypes = {
    metadata: PropTypes.object.isRequired
};

export default ContactOwnerButton;