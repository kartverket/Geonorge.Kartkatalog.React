// Dependencies
import React from "react";
import PropTypes from "prop-types";

// Components
import MetadataSearchResult from "components/partials/SearchResults/MetadataSearchResult";

// Stylesheets
import style from "components/routes/Metadata/DistributionsList.module.scss";

const DistributionsList = (props) => {
    if (!props.distributions?.length) {
        return <div>Ingen distribusjoner funnet</div>;
    } else {
        const serie = props.distributions[0]?.Serie;
        const typeName = serie?.TypeName || "";
        let distributions = props.distributions;
        if (typeName === "series_historic" || typeName === "series_collection") {
            distributions = props.distributions.sort((a, b) => (a.Title < b.Title ? 1 : -1));
        } else if (typeName !== "series_time") {
            distributions = props.distributions.sort((a, b) => {
                const compareTitle = a.Title.localeCompare(b.Title);
                const compareProtocol = b.Protocol.localeCompare(a.Protocol);

                return compareTitle || compareProtocol;
            });
        }
        distributions = distributions.map((distribution, i) => {
            return (
                <MetadataSearchResult
                    searchResult={distribution}
                    visibleFields={["Type", "DownloadButton", "MapButton", "ApplicationButton", "DistributionFormats"]}
                    key={i}
                />
            );
        });
        return <div className={style.distributionsList}>{distributions}</div>;
    }
};

DistributionsList.propTypes = {
    distributions: PropTypes.array.isRequired
};

export default DistributionsList;
