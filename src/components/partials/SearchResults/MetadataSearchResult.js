// Dependencies
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from "react-router-dom";

// Actions
import { getResource } from '../../../actions/ResourceActions';

// Helpers
import { convertTextToUrlSlug } from '../../../helpers/UrlHelpers';

// Components
import { ErrorBoundary } from '../../ErrorBoundary'
import MapButton from '../Buttons/MapButton';
import DownloadButton from '../Buttons/DownloadButton';
import ApplicationButton from '../Buttons/ApplicationButton';

// Stylesheets
import style from './MetadataSearchResult.scss';


class MetadataSearchResult extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  restrictionsClassnames() {
    if (this.props.searchResult.AccessConstraint === 'restricted' || this.props.searchResult.AccessIsProtected) {
      return 'red'
    } if ((this.props.searchResult.AccessConstraint === "otherRestrictions" && this.props.searchResult.OtherConstraintsAccess === 'norway digital restricted') || this.props.searchResult.AccessIsRestricted) {
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
            Type: {this.props.searchResult.Protocol}
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
      return <span key={i}>{distributionFormat.Name} </span>;
    }) : null;
    return this.props.searchResult.DistributionFormats && this.props.visibleFields.includes('DistributionFormats')
      ? (
        <div className={style.formatsContainer}>
          <ErrorBoundary>
            {this.props.getResource('Formats', 'Formater')}: {dirstibutionFormatsElement}
          </ErrorBoundary>
        </div>
      ) : '';
  }

  renderListItemInfo() {
    const openDataSymbolClass = this.restrictionsClassnames();
    const openDataSymbolTitle = this.props.searchResult.IsOpenData || this.props.searchResult.AccessIsOpendata ? 'Åpne datasett' : 'Krever innlogging';
    const openDataSymbolIcon = this.props.searchResult.IsOpenData || this.props.searchResult.AccessIsOpendata ? ['fas', 'lock-open'] : ['fas', 'lock'];

    const listItemType = this.props.searchResult.TypeTranslated ? this.props.searchResult.TypeTranslated : this.props.searchResult.Type;
    const listItemOrganization = this.props.searchResult.Organization;

    const linkTitle = this.props.getResource('DisplayEverythingByVariable', 'Vis alt fra {0}', [listItemOrganization]);
    const linkElement = (
      <Link title={linkTitle} to={"/?organization=" + listItemOrganization}>
        {listItemOrganization}
      </Link>
    );

    return (
      <span className={style.listItemInfo}>
        <FontAwesomeIcon key="lock" className={openDataSymbolClass} title={openDataSymbolTitle} icon={openDataSymbolIcon} />
        {this.props.getResource('VariableBy', '{0} fra', [listItemType])} {linkElement}
      </span>
    )
  }

  render() {
    return (
      <div className={style.listItem}>
        <div>
          <span className={style.listItemTitle}>
            <ErrorBoundary><Link title={this.props.searchResult.Title} to={`/metadata/${convertTextToUrlSlug(this.props.searchResult.Title)}/${this.props.searchResult.Uuid}`}>{this.props.searchResult.Title}</Link></ErrorBoundary>
          </span>
          {this.renderListItemInfo()}
          <div className={style.flex}>{this.renderType()} {this.renderDistributionFormats()}</div>
        </div>

        {this.renderButtons()}

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

const mapStateToProps = state => ({
  resources: state.resources
});

const mapDispatchToProps = {
  getResource
};

export default connect(mapStateToProps, mapDispatchToProps)(MetadataSearchResult);
