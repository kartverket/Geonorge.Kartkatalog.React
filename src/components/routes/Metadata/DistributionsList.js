// Dependencies
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

// Components
import MetadataSearchResult from "components/partials/SearchResults/MetadataSearchResult";

// Stylesheets
import style from "components/routes/Metadata/DistributionsList.module.scss";


class DistributionsList extends Component {
    render() {
        let typeName = "";
        let serie = this.props.distributions[0].Serie;
          if(serie !== undefined){
          typeName = serie.TypeName;
        }
        let distributions;
        if(typeName == "series_historic")
        distributions = this.props.distributions.sort((a, b) => (a.Title < b.Title) ? 1 : -1);
        else
        distributions = this.props.distributions.sort((a, b) => (a.Title > b.Title) ? 1 : -1);
        distributions = distributions.map((distribution, i) => {
            return <MetadataSearchResult searchResult={distribution} visibleFields={['Type', 'DownloadButton', 'MapButton', 'ApplicationButton', 'DistributionFormats']} key={i}/>;
        });
        return (
            <div className={style.distributionsList}>{distributions}</div>
        );
    }
}

DistributionsList.propTypes = {
    distributions: PropTypes.array.isRequired
};

const mapStateToProps = null;

const mapDispatchToProps = null;

export default connect(mapStateToProps, mapDispatchToProps)(DistributionsList);
