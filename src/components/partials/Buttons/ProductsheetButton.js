// Dependencies
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// Actions
import { getResource } from 'actions/ResourceActions'

// Reducers
import { pushToDataLayer } from 'reducers/TagManagerReducer';

// Stylesheets
import style from 'components/partials/Buttons/Buttons.module.scss';


export class ProductSheetButton extends Component {
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
				activity: 'showProductSheet',
				metadata: tagData
			});
    }

    render() {
        let buttonDescription = this.props.getResource('DisplayProductSheet', 'Vis produktark');
        // TODO styling
        if (this.props.metadata.ProductSheetUrl) {
            let url = this.props.metadata.ProductSheetUrl
            let icon = <FontAwesomeIcon title={buttonDescription} icon={['far', 'info-circle']} key="icon" />;
            let buttonClass = style.btn;
            let textContent = React.createElement('span', { key: "textContent" }, buttonDescription);

            let childElements = [icon, textContent];
            return (<a href={url} onClick={this.handleButtonClick} className={buttonClass}>
              {childElements}
              </a>);
        } else {
            let icon = <FontAwesomeIcon title={buttonDescription} icon={['far', 'info-circle']} key="icon" />
            let buttonClass = `${style.btn}  ${style.disabled}`;
            let textContent = React.createElement('span', { key: "textContent" }, buttonDescription);
            let childElements = [icon, textContent];
            return (<span className={buttonClass}>{childElements}</span>);
        }
    }

}

ProductSheetButton.propTypes = {
    metadata: PropTypes.object.isRequired
};

const mapDispatchToProps = {
    getResource,
    pushToDataLayer
};

const mapStateToProps = state => ({
    resources: state.resources
});

export default connect(mapStateToProps, mapDispatchToProps)(ProductSheetButton);
