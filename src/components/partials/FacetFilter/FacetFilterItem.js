import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Facet from './Facet';
import style from './FacetFilterItem.scss';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

class FacetFilterItem extends Component {

    constructor(props) {
        super(props);
        this.state = {
            expanded: this.defaultExpanded()
        };
    }

    defaultExpanded() {
        return this.props.facetFilterItem.Name === 'type';

    }

    toggleExpand() {
        this.setState(prevState => ({
            expanded: !prevState.expanded
        }))
    }

    renderList() {
        if (this.props.facetFilterItem && this.props.facetFilterItem.FacetResults) {
            let facetElements = this.props.facetFilterItem.FacetResults.map((facet, i) => {
                return <Facet facet={facet} facetField={this.props.facetFilterItem.FacetField} key={i}/>;
            });
            return React.createElement('ul', {
                className: style.facets,
                onClick: () => this.toggleExpand()
            }, facetElements);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.selectedFacets[this.props.facetFilterItem.FacetField] && Object.keys(nextProps.selectedFacets[this.props.facetFilterItem.FacetField]).length) {
            this.setState({
                expanded: true
            });
        }
    }

    render() {
        return (
            <li className={this.state.expanded ? style.filterItem + " " + style.expanded : style.filterItem}
                onClick={() => this.toggleExpand()}>
                <FontAwesomeIcon icon={this.state.expanded ? "angle-up" : "angle-down"} className={style.expandArrow}/>
                <p className={style.filterName}>
                    <span className={style.expandArrow}></span> {this.props.facetFilterItem.NameTranslated}
                </p>
                {this.renderList()}
            </li>
        );
    }
}


FacetFilterItem.propTypes = {
    facetFilterItem: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    selectedFacets: state.selectedFacets
});

export default connect(mapStateToProps, null)(FacetFilterItem);
