import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import style from './MetadataSearchResult.scss';
import { ErrorBoundary } from '../../ErrorBoundary'
import MapButton from '../Buttons/MapButton';
import DownloadButton from '../Buttons/DownloadButton';
import ApplicationButton from '../Buttons/ApplicationButton';
import { Link } from "react-router-dom";

class MetadataSearchResult extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  restrictionsClassnames() {
    if (this.props.searchResult.AccessConstraint === 'restricted') {
      return 'red'
    } if (this.props.searchResult.AccessConstraint === "otherRestrictions" && this.props.searchResult.OtherConstraintsAccess === 'norway digital restricted') {
      return 'yellow'
    } else {
      return "green"
    }
  }

  renderType() {
    return this.props.searchResult.Type && this.props.visibleFields.includes('Type')
      ? (
        <div className={style.typeContainer}>
          <span>
            {this.props.searchResult.Type}
          </span>
        </div>
      ) : '';
  }

  renderButtons() {
    var buttonsElement = [];
    if (this.props.visibleFields.includes('DownloadButton')) {
      buttonsElement.push(
        <span key="DownloadButton">
          <ErrorBoundary>
            <DownloadButton metadata={this.props.searchResult}></DownloadButton>
          </ErrorBoundary>
        </span>
      );
    }
    if (this.props.visibleFields.includes('MapButton')) {
      buttonsElement.push(
        <span key="MapButton">
          <ErrorBoundary>
            <MapButton metadata={this.props.searchResult}></MapButton>
          </ErrorBoundary>
        </span>
      );
    }
    if (this.props.visibleFields.includes('ApplicationButton')) {
      buttonsElement.push(
        <span key="ApplicationButton">
          <ErrorBoundary>
            <ApplicationButton metadata={this.props.searchResult}></ApplicationButton>
          </ErrorBoundary>
        </span>
      );
    }
    return buttonsElement.length
      ? (
        <div className={style.btnContainer}>
          {buttonsElement}
        </div>
      ) : '';
  }

  renderDistributionFormats() {
    const dirstibutionFormatsElement = this.props.searchResult.DistributionFormats ? this.props.searchResult.DistributionFormats.map((distributionFormat, i) => {
      return <span key={i}>{distributionFormat.Name} {distributionFormat.Version}</span>;
    }) : null;
    return this.props.searchResult.DistributionFormats && this.props.visibleFields.includes('DistributionFormats')
      ? (
        <div className={style.formatsContainer}>
          <ErrorBoundary>
            {dirstibutionFormatsElement}
          </ErrorBoundary>
        </div>
      ) : '';
  }

  render() {
    return (
      <div className={style.listItem}>
        <div>
          <span className={style.listItemTitle}>
            <ErrorBoundary><Link to={`/metadata/${this.props.searchResult.Uuid}`}>{this.props.searchResult.Title}</Link></ErrorBoundary>
          </span>
          <span className={style.listItemInfo}>
            <FontAwesomeIcon key="lock" className={this.restrictionsClassnames()} title={this.props.searchResult.IsOpenData ? 'Åpne datasett' : 'Krever innlogging'} icon={this.props.searchResult.IsOpenData ? ['fas', 'lock-open'] : ['fas', 'lock']} />
            {this.props.searchResult.TypeTranslated} fra <Link title={"Vis alt fra " + this.props.searchResult.Organization} to={"/?organization=" + this.props.searchResult.Organization}>{this.props.searchResult.Organization}</Link> </span>
        </div>
        {this.renderType()}
        {this.renderButtons()}
        {this.renderDistributionFormats()}
      </div>
    )
  }
}

MetadataSearchResult.propTypes = {
  searchResult: PropTypes.object.isRequired,
  visibleFields: PropTypes.array
}

MetadataSearchResult.defaultProps = {
  visibleFields: []
};

export default connect(null, null)(MetadataSearchResult);