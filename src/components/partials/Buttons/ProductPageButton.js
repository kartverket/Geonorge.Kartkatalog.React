// Dependencies
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// Actions
import { getResource } from 'actions/ResourceActions'

// Stylesheets
import style from 'components/partials/Buttons/Buttons.module.scss';


export class ProductPageButton extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    formatProductPageUrl(url){
        let newUrl = window.decodeURIComponent(url);
        newUrl = newUrl.trim().replace(/\s/g, "");

        if(/^(:\/\/)/.test(newUrl)){
            return `https${newUrl}`;
        }
        if(!/^(f|ht)tps?:\/\//i.test(newUrl)){
            return `https://${newUrl}`;
        }
        return url;
    }

    render() {
        let buttonDescription = this.props.getResource('DisplayProductPage', 'Vis produktside');
        // TODO styling
        if (this.props.metadata.ProductPageUrl) {
            const url = this.formatProductPageUrl(this.props.metadata.ProductPageUrl);
            const icon = <FontAwesomeIcon title={buttonDescription} icon={['far', 'external-link-square']} key="icon" />;
            const buttonClass = style.btn;
            const textContent = React.createElement('span', { key: "textContent" }, buttonDescription);

            const childElements = [icon, textContent];
            return React.createElement('a', { href: url, className: buttonClass }, childElements);
        } else {
            const icon = <FontAwesomeIcon title={buttonDescription} icon={['far', 'external-link-square']} key="icon" />
            const buttonClass = `${style.btn}  ${style.disabled}`;
            const textContent = React.createElement('span', { key: "textContent" }, buttonDescription);
            const childElements = [icon, textContent];
            return React.createElement('span', { className: buttonClass }, childElements);
        }
    }

}

ProductPageButton.propTypes = {
    metadata: PropTypes.object.isRequired
};

const mapDispatchToProps = {
    getResource
};

const mapStateToProps = state => ({
    resources: state.resources
});

export default connect(mapStateToProps, mapDispatchToProps)(ProductPageButton);
