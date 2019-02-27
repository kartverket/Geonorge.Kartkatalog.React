import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import style from './MetadataSearchResult.scss';
import { ErrorBoundary } from '../../ErrorBoundary'
import MapButton from '../Buttons/MapButton';
import DownloadButton from '../Buttons/DownloadButton';
import ApplicationButton from '../Buttons/ApplicationButton';
import {Link} from "react-router-dom";

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
          <span className={style.listItemTitle}>
          <ErrorBoundary><Link to={`/metadata/${this.props.searchResult.Uuid}`}>{this.props.searchResult.Title}</Link></ErrorBoundary>
          </span>
          <span className={style.listItemInfo}> <FontAwesomeIcon key="lock" className={this.restrictionsClassnames()} title={this.props.searchResult.IsOpenData ? 'Åpne datasett' : 'Krever innlogging'} icon={this.props.searchResult.IsOpenData ? ['fas', 'lock-open'] : ['fas', 'lock']} /> {this.props.searchResult.TypeTranslated} fra <a href={this.props.searchResult.OrganizationUrl}>{this.props.searchResult.Organization}</a> </span>
        </div>        
        <div className={style.btnContainer}>        
          <span className={style.listItemButton}>
          <ErrorBoundary><DownloadButton metadata={this.props.searchResult}></DownloadButton></ErrorBoundary>
          </span>
          <span className={style.listItemButton}>
          <ErrorBoundary><MapButton metadata={this.props.searchResult}></MapButton></ErrorBoundary>
          </span>
          <span className={style.listItemButton}>
          <ErrorBoundary><ApplicationButton metadata={this.props.searchResult}></ApplicationButton></ErrorBoundary>
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