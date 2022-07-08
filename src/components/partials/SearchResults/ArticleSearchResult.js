// Dependencies
import React from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Moment from "react-moment";

// Stylesheets
import style from "components/partials/SearchResults/ArticleSearchResult.module.scss";

const ArticleSearchResult = (props) => {
    const getArticleTypeIcon = () => {
        const iconClasses = {
            StandardPage: ["fal", "file-alt"],
            NewsPage: ["fal", "newspaper"]
        };
        return iconClasses[props.searchResult.Type];
    };
    return (
        <div className={style.listItem}>
            <span className={style.listItemTitle}>
                <a href={props.searchResult.ShowDetailsUrl}>{props.searchResult.Title}</a>
                <span title={props.searchResult.Type}>
                    <FontAwesomeIcon className={style.icon} icon={getArticleTypeIcon()} />
                </span>
            </span>
            <span className={style.listItemInfo}>{props.searchResult.Intro}</span>
            <span className={style.listItemDate}>
                <Moment format="DD.MM.YYYY">{props.searchResult.Date}</Moment>
            </span>
        </div>
    );
};

ArticleSearchResult.propTypes = {
    searchResult: PropTypes.object.isRequired
};

export default ArticleSearchResult;
