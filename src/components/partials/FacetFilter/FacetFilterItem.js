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

    getFacetResultsLength(facetFilterItem = this.props.facetFilterItem, facetResultsLength = 0){
      facetFilterItem.FacetResults.forEach(facetResultItem => {
        if (facetResultItem.FacetResults && facetResultItem.FacetResults.length){
          facetResultsLength = this.getFacetResultsLength(facetResultItem, facetResultsLength);
        }
        facetResultsLength += 1
      })
      return facetResultsLength;
    }


    renderList() {
        if (this.props.facetFilterItem && this.props.facetFilterItem.FacetResults) {
            let facetElements = this.props.facetFilterItem.FacetResults.map((facet, i) => {
                return <Facet facet={facet} facetField={this.props.facetFilterItem.FacetField} key={i}/>;
            });
            const listElementHeight = 28.5;
            const facetResultsLength = this.getFacetResultsLength();
            const listHeight = facetResultsLength * listElementHeight;
            return React.createElement('ul', {
                className: style.facets,
                onClick: () => this.toggleExpand(),
                style: {
                  maxHeight: `${listHeight}px`
                }
            }, facetElements);
        }
    }

    componentDidUpdate(prevProps) {
      const hasSelectedFacets = this.props.selectedFacets[this.props.facetFilterItem.FacetField] && Object.keys(this.props.selectedFacets[this.props.facetFilterItem.FacetField]).length;
      if (!this.state.expanded && hasSelectedFacets){
        if (this.props.selectedFacets[this.props.facetFilterItem.FacetField] && Object.keys(this.props.selectedFacets[this.props.facetFilterItem.FacetField]).length) {
            this.setState({
                expanded: true
            });
        }
      }
    }

    render() {
        return (
            <li className={this.state.expanded ? style.filterItem : style.filterItem + " " + style.closed }
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
