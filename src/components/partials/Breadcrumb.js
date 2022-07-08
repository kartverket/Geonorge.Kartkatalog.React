// Dependencies
import React from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Actions
import { getResource } from "actions/ResourceActions";

// Stylesheets
import style from "components/partials/Breadcrumb.module.scss";

const Breadcrumb = (props) => {
    const dispatch = useDispatch();

    const renderBreadcrumb = () => {
        return (
            <div className={style.breadCrumb}>
                <ul vocab="https://schema.org/" typeof="BreadcrumbList">
                    <li property="itemListElement" typeof="ListItem">
                        <a property="item" typeof="WebPage" href={"https://www.geonorge.no/"}>
                            <span property="name">Geonorge</span>
                        </a>
                        <meta property="position" content="1" />
                        <FontAwesomeIcon title="Til Geonorge" icon={"angle-right"} />
                    </li>
                    {renderCurrentBreadcrumb()}
                </ul>
            </div>
        );
    };

    const renderCurrentBreadcrumb = () => {
        if (props.content) {
            return (
                <React.Fragment>
                    <li property="itemListElement" typeof="ListItem">
                        <Link to={"/"} property="item" typeof="WebPage">
                            <span property="name">{dispatch(getResource("AppPageTitle", "Kartkatalogen"))}</span>
                        </Link>
                        <meta property="position" content="2" />
                        <FontAwesomeIcon title="Tilbake til katalogen" icon={"angle-right"} />
                    </li>
                    <li property="itemListElement" typeof="ListItem">
                        <span property="name">{props.content}</span>
                        <meta property="position" content="3" />
                    </li>
                </React.Fragment>
            );
        }
        return <li> {dispatch(getResource("AppPageTitle", "Kartkatalogen"))} </li>;
    };

    return renderBreadcrumb();
};

Breadcrumb.propTypes = {
    content: PropTypes.string
};

export default Breadcrumb;
