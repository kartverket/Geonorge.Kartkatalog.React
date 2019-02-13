import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import style from './MetadataSearchResult.scss';
import MapButton from '../Buttons/MapButton';
import DownloadButton from '../Buttons/DownloadButton';
import ApplicationButton from '../Buttons/ApplicationButton';

class MetadataSearchResult extends Component {
  constructor(props) {
    super(props);
    this.state = {
      
    };
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

   render() {
    return (
      <div  className={style.listItem}>
        <div>
          <span className={style.listItemTitle}><a href={this.props.searchResult.ShowDetailsUrl}>{this.props.searchResult.Title}</a></span>          
          <span className={style.listItemInfo}> <FontAwesomeIcon key="lock" className={this.restrictionsClassnames()} title={this.props.searchResult.IsOpenData ? 'Åpne datasett' : 'Krever innlogging'} icon={this.props.searchResult.IsOpenData ? ['fas', 'lock-open'] : ['fas', 'lock']} /> {this.props.searchResult.TypeTranslated} fra <a href={this.props.searchResult.OrganizationUrl}>{this.props.searchResult.Organization}</a> </span>
        </div>        
        <div className={style.btnContainer}>
        <span className={style.listItemButton}>
            <MapButton searchResult={this.props.searchResult}></MapButton>
          </span>
          <span className={style.listItemButton}>
            <DownloadButton searchResult={this.props.searchResult}></DownloadButton>
          </span>
          <span className={style.listItemButton}>
            <ApplicationButton searchResult={this.props.searchResult}></ApplicationButton>
          </span>
        </div>        
      </div>
    )
  }
}

MetadataSearchResult.propTypes = {
  searchResult: PropTypes.object.isRequired
}

export default connect(null, null)(MetadataSearchResult);