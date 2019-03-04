import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import classNames from 'classnames/bind';

import {updateSelectedFacetsFromUrl} from '../../../actions/FacetFilterActions'
import {getQueryStringFromFacets} from '../../../helpers/FacetFilterHelper'
import {fetchMetadataSearchResults} from '../../../actions/SearchResultActions'
import {ErrorBoundary} from '../../ErrorBoundary'

import style from './Facet.scss';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {Link} from "react-router-dom";

class Facet extends Component {
    constructor(props) {
        super(props);
        this.state = {
            checked: false,
            link: ''
        };
    }

    getParentFacets(facet, parents = []) {
        const hasParent = facet.parent && Object.keys(facet.parent).length;
        if (hasParent) {
            parents.push(facet.parent);
            if (this.getParentFacets(facet.parent)) {
                this.getParentFacets(facet.parent, parents);
            }
        } else {
            return false;
        }
        return parents.reverse();
    }

    getClosestParentSelectedFacetsArray(parents, facets, index = 0) {
        facets = facets ? facets : this.props.selectedFacets[this.props.facetField].facets;
        if (facets && parents && parents.length) {
            if (index < parents.length - 1) {
                this.getClosestParentSelectedFacetsArray(parents, facets[parents[index].facet.Name].facets, index + 1);
            }
            const hasSelectedFacets = facets[parents[index].facet.Name] && facets[parents[index].facet.Name].facets;
            if (hasSelectedFacets) {
                return facets[parents[index].facet.Name].facets;
            } else {
                return null;
            }
        } else {
            return facets
        }
    }

    isChecked = () => {
        const hasSelectedFacets = this.props.selectedFacets
            && this.props.selectedFacets[this.props.facetField]
            && this.props.selectedFacets[this.props.facetField].facets;
        if (hasSelectedFacets) {
            let isChecked = false;
            const parents = this.getParentFacets(this.props.facet);
            const closestSelectedFacetsArray = this.getClosestParentSelectedFacetsArray(parents);
            if (closestSelectedFacetsArray && Object.keys(closestSelectedFacetsArray).length) {
                Object.keys(closestSelectedFacetsArray).forEach((selectedFacetName) => {
                    if (selectedFacetName === this.props.facet.Name) {
                        isChecked = true;
                    }
                })
            }
            if (isChecked) {
                this.setState({
                    checked: true,
                    link: this.getRemoveFacetQueryString()
                });
            } else {
                this.setState({
                    checked: false,
                    link: this.getAddFacetQueryString()
                });
            }
        }
    };

    componentDidMount() {
        this.isChecked();
    }

    renderSelectedFacetsList(facets) {
        if (facets && Object.keys(facets).length) {
            return Object.keys(facets).map(facetName => {
                const facet = facets[facetName];
                return (
                    <ErrorBoundary key={facetName}>
                        <Facet {...this.props} facet={{...facet, parent: this.props}} key={facetName}/>
                    </ErrorBoundary>
                )
            });
        }
    }

    renderList(facets) {
        if (facets) {
            let ulClassNames = classNames({
                [style.filterItems]: true,
                [style.hidden]: !this.state.checked
            });
            let filterItemElements = facets.map((facet, i) => {
                return (
                    <ErrorBoundary key={i}>
                        <Facet {...this.props} facet={{...facet, parent: this.props}} key={i}/>
                    </ErrorBoundary>
                );
            });
            return React.createElement('ul', {className: ulClassNames}, filterItemElements);
        } else {
            return "";
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const hasSelectedFacets = this.props.selectedFacets
            && this.props.selectedFacets[this.props.facetField]
            && this.props.selectedFacets[this.props.facetField].facets;
        const hasPrevPropsSelectedFacets = prevProps.selectedFacets
            && prevProps.selectedFacets[this.props.facetField]
            && prevProps.selectedFacets[this.props.facetField].facets;
        if (hasSelectedFacets || hasPrevPropsSelectedFacets) {
            const parents = this.getParentFacets(this.props.facet);
            if (hasSelectedFacets !== hasPrevPropsSelectedFacets) {
                this.isChecked();
            } else if (parents && parents.length) {
                const oldClosestSelectedFacetsArray = hasPrevPropsSelectedFacets ? this.getClosestParentSelectedFacetsArray(parents, prevProps.selectedFacets[prevProps.facetField].facets) : null;
                const newClosestSelectedFacetsArray = hasSelectedFacets ? this.getClosestParentSelectedFacetsArray(parents) : null;
                if (oldClosestSelectedFacetsArray && newClosestSelectedFacetsArray && Object.keys(oldClosestSelectedFacetsArray).length !== Object.keys(newClosestSelectedFacetsArray).length) {
                    this.isChecked();
                }
            } else {
                let oldFacet = hasPrevPropsSelectedFacets && prevProps.selectedFacets[this.props.facetField].facets[this.props.facet.Name];
                let newFacet = hasSelectedFacets && this.props.selectedFacets[this.props.facetField].facets[this.props.facet.Name];
                if (oldFacet !== newFacet) {
                    this.isChecked();
                }
            }
        }
    }

    getAddFacetQueryString() {
        return getQueryStringFromFacets(this.props.selectedFacets, {
            facetToAdd: {
                facetField: this.props.facetField,
                facet: this.props.facet
            }
        });
    }

    getRemoveFacetQueryString() {
        return getQueryStringFromFacets(this.props.selectedFacets, {
            facetToRemove: {
                facetField: this.props.facetField,
                facet: this.props.facet
            }
        });
    }

    renderFacet() {
        let liClassNames = classNames({
            [style.facet]: true,
            [style.empty]: this.props.facet.Count === 0,
        });

        return (
            <li className={liClassNames}>
                <Link
                    to={{search: this.state.checked ? this.getRemoveFacetQueryString() : this.getAddFacetQueryString()}}>
                    <FontAwesomeIcon className="svg-checkbox"
                                     icon={this.state.checked ? ['far', 'check-square'] : ['far', 'square']}/>
                    <label htmlFor={this.props.facet.Name}>
                        <span>{this.props.facet.NameTranslated} </span>({this.props.facet.Count})
                    </label>
                </Link>
                {this.renderList(this.props.facet.FacetResults)}
            </li>
        );
    }

    renderRemovableFacet() {
        let liClassNames = classNames({
            [style.facet]: true,
            [style.empty]: this.props.facet.Count === 0,
        });
        return (
            <span className={liClassNames}>
                <Link
                    to={{search: this.getRemoveFacetQueryString()}}>
                       <label
                           htmlFor={this.props.facet.Name}>
                           <span> {this.props.facet.NameTranslated} </span>
                           <FontAwesomeIcon
                               title={this.state.checked ? 'Velg' : 'Fjern'} className="svg-checkbox"
                               icon={this.state.checked ? ['fas', 'times'] : ['far', 'square']}/>
                       </label>
                    {this.renderSelectedFacetsList(this.props.facet.facets)}
                </Link>
            </span>
        );
    }

    render() {
        return this.props.removable ? (
                <span className={style.badge}>
                    {this.renderRemovableFacet()}
                </span>
            )
            : (
                <div>{this.renderFacet()}</div>
            );
    }
}

Facet.propTypes = {
    facetField: PropTypes.string.isRequired,
    facet: PropTypes.shape({
        Count: PropTypes.number.isRequired,
        Name: PropTypes.string.isRequired,
        NameTranslated: PropTypes.string.isRequired
    }),
    selectedFacets: PropTypes.object.isRequired,
    removable: PropTypes.bool
};

Facet.defaultProps = {
    removable: false
};

// Store State mappes til lokale states
const mapStateToProps = state => ({
    selectedFacets: state.selectedFacets
});


const mapDispatchToProps = {
    fetchMetadataSearchResults,
    updateSelectedFacetsFromUrl
};


// "Blir tilgjengelig som en prop"... Store state, Actions, Klassen du er i...
export default connect(mapStateToProps, mapDispatchToProps)(Facet);
