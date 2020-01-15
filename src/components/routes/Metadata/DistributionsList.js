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
        const distributions = this.props.distributions.map((distribution, i) => {
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
