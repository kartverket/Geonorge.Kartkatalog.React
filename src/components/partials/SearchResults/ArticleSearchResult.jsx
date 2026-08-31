// Dependencies
import React from "react";
import PropTypes from "prop-types";
import { FileTextIcon, NewspaperIcon } from "@navikt/aksel-icons";
import moment from "moment";

// Stylesheets
import style from "@/components/partials/SearchResults/ArticleSearchResult.module.scss";

const ArticleSearchResult = (props) => {
    const renderArticleTypeIcon = () => {
        if (props.searchResult.Type === "NewsPage") {
            return <NewspaperIcon aria-hidden="true" className={style.icon} />;
        }
        return <FileTextIcon aria-hidden="true" className={style.icon} />;
    };
    return (
        <div className={style.listItem}>
            <span className={style.listItemTitle}>
                <a href={props.searchResult.ShowDetailsUrl}>{props.searchResult.Title}</a>
                <span title={props.searchResult.Type}>
                    {renderArticleTypeIcon()}
                </span>
            </span>
            <span className={style.listItemInfo}>{props.searchResult.Intro}</span>
            <span className={style.listItemDate}>
                {moment(props.searchResult.Date).format("DD.MM.YYYY")}
            </span>
        </div>
    );
};

ArticleSearchResult.propTypes = {
    searchResult: PropTypes.object.isRequired
};

export default ArticleSearchResult;
