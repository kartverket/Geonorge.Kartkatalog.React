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

  renderButtons() {
    var buttons = [];
    if (this.props.visibleFields.includes('DownloadButton')) {
      buttons.push( 
        <span key="DownloadButton">
          <ErrorBoundary>
            <DownloadButton metadata={this.props.searchResult}></DownloadButton>
          </ErrorBoundary>
        </span>
      );
    }
    if (this.props.visibleFields.includes('MapButton')) {
      buttons.push( 
        <span key="MapButton">
          <ErrorBoundary>
            <MapButton metadata={this.props.searchResult}></MapButton>
          </ErrorBoundary>
        </span>
      );
    }
    if (this.props.visibleFields.includes('ApplicationButton')) {
      buttons.push(
        <span key="ApplicationButton">
          <ErrorBoundary>
            <ApplicationButton metadata={this.props.searchResult}></ApplicationButton>
          </ErrorBoundary>
        </span>
      );
    }
    return buttons;
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
        <div className={style.btnContainer}>
          {this.renderButtons()}
        </div>
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