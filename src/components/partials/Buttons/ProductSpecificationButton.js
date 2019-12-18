// Dependencies
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

// Actions
import {getResource} from '../../../actions/ResourceActions'

// Reducers
import {pushToDataLayer} from '../../../reducers/TagManagerReducer';

// Stylesheets
import style from './Buttons.scss';

export class ProductSpecificationButton extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleButtonClick = () => {
    const tagData = {
      name: this.props.metadata.Title,
      uuid: this.props.metadata.Uuid
    }
    this.props.pushToDataLayer({
      event: 'showMore',
      category: 'metadataDetails',
      activity: 'showProductSpecification',
      metadata: tagData
    });
  }

  render() {
    let buttonDescription = this.props.getResource('DisplayProductSpecification', 'Vis produktspesifikasjon');
    // TODO styling
    if (this.props.metadata.ProductSpecificationUrl) {
      let url = this.props.metadata.ProductSpecificationUrl
      let icon = <FontAwesomeIcon title={buttonDescription} icon={['far', 'file-spreadsheet']} key="icon"/>;
      let buttonClass = style.btn;
      let textContent = React.createElement('span', {
        key: "textContent"
      }, buttonDescription);

      let childElements = [icon, textContent];
      return (<a href={url} onClick={this.handleButtonClick} className={buttonClass}>
        {childElements}
      </a>);
    } else {
      let icon = <FontAwesomeIcon title={buttonDescription} icon={['far', 'file-spreadsheet']} key="icon"/>
      let buttonClass = style.btn + ' disabled';
      let textContent = React.createElement('span', {
        key: "textContent"
      }, buttonDescription);
      let childElements = [icon, textContent];
      return (<span className={buttonClass}>
        {childElements}
      </span>);
    }
  }

}

ProductSpecificationButton.propTypes = {
  metadata: PropTypes.object.isRequired
};

const mapDispatchToProps = {
  getResource,
  pushToDataLayer
};

const mapStateToProps = state => ({resources: state.resources});

export default connect(mapStateToProps, mapDispatchToProps)(ProductSpecificationButton);
