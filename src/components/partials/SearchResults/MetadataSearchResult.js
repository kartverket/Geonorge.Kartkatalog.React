import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import style from './MetadataSearchResult.scss';
import MapButton from '../Buttons/MapButton';
import DownloadButton from '../Buttons/DownloadButton';

class MetadataSearchResult extends Component {
  constructor(props) {
    super(props);
    this.state = {
      
    };
  }
  
  isApplication() {
    return this.props.searchResult.Type == "software"
  }
  restrictionsClassnames() {       
     if(this.props.searchResult.AccessConstraint === 'restricted') {
        return 'red'
     } if (this.props.searchResult.AccessConstraint === "otherRestrictions" && this.props.searchResult.OtherConstraintsAccess === 'norway digital restricted') {
       return 'yellow'
     } else {
      return "green" 
     }          
  }

  renderApplicationButton() {
    if (this.isApplication(this.props.searchResult.Type)) {
      if (this.props.searchResult.DistributionUrl) {
        let distributionUrl = this.props.searchResult.DistributionUrl
        let icon = <FontAwesomeIcon icon={['far', 'external-link-square']} key="icon" />
        let buttonClass = 'on';
        let textContent = React.createElement('span', { key: "textContent" }, 'Til nettside')

        let childElements = [icon, textContent];
        return React.createElement('a', { href: distributionUrl, className: buttonClass }, childElements);
      }
      else {
        let icon = <FontAwesomeIcon icon={['far', 'external-link-square']} key="icon" />
        let buttonClass = 'btn btn-sm disabled off'
        let textContent = React.createElement('span', { key: "textContent" }, 'ikke tilgjengelig')
        let childElements = [icon, textContent];
        return React.createElement('span', { className: buttonClass }, childElements);
      }
    }
  }

  render() {
    return (
      <div  className={style.listItem}>
        <div>
          <span className={style.listItemTitle}><a href={this.props.searchResult.ShowDetailsUrl}>{this.props.searchResult.Title}</a></span>          
          <span className={style.listItemInfo}> <FontAwesomeIcon key="lock" className={this.restrictionsClassnames()} title={this.props.searchResult.IsOpenData ? 'Åpne datasett' : 'Krever innlogging'} icon={this.props.searchResult.IsOpenData ? ['far', 'lock-open'] : ['far', 'lock']} /> {this.props.searchResult.TypeTranslated} fra <a href={this.props.searchResult.OrganizationUrl}>{this.props.searchResult.Organization}</a> </span>
        </div>        
        <div>
        <span className={style.listItemButton}>
            <MapButton searchResult={this.props.searchResult}></MapButton>
          </span>
          <span className={style.listItemButton}>
            <DownloadButton searchResult={this.props.searchResult}></DownloadButton>
          </span>
          <span className={style.listItemButton}>
            {this.renderApplicationButton()}
          </span>
        </div>        
      </div>
    )
  }
}

MetadataSearchResult.propTypes = {
  mapItems: PropTypes.array.isRequired,
  searchResult: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  mapItems: state.mapItems
});

const mapDispatchToProps = {
  
};

export default connect(mapStateToProps, mapDispatchToProps)(MetadataSearchResult);