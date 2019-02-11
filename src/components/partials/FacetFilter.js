import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames/bind';

import FacetFilterItem from './FacetFilter/FacetFilterItem';


import style from './FacetFilter.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class FacetFilter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            expanded: false
        }
    }



    getFacetFilterItems() {
        return this.props.availableFacets ? Object.keys(this.props.availableFacets) : [];
    }
    toggleFacets() {
        this.setState({
            expanded : !this.state.expanded
        })
    }

    renderFacets() {
        const togglefacetClassnames = classNames({
            [style.facetFilter] : true,
            open : this.state.expanded
        })

        
        let availableFacets = this.getFacetFilterItems();
        let facets = availableFacets.map((facetField, i) => {
            return <FacetFilterItem facetFilterItem={this.props.availableFacets[facetField]} key={facetField} />;
        });
        return React.createElement('ul', { className: togglefacetClassnames }, facets);
    }

    render() {
        return (
            <div>
                <div className={style.togglefacet} onClick={() => this.toggleFacets()}><FontAwesomeIcon icon={this.state.expanded ? ['fas','times'] : ['fas','bars']} /></div>
                {this.renderFacets()}
            </div>
        )
    }
}

// Validering av props... 
FacetFilter.propTypes = {
    searchResults: PropTypes.object
}

// Metode som binder state til lokale props
const mapStateToProps = state => ({
    searchResults: state.searchResults,
    availableFacets: state.availableFacets
});

export default connect(mapStateToProps)(FacetFilter);