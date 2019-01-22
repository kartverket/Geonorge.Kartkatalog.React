import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Facet } from './Facet';
import style from './FacetField.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export class FacetField extends Component {
    displayName = FacetField.name

    constructor(props) {
        super(props);
        this.state = {
            expanded: false
        };
    }


    static propTypes = {
        facetField: PropTypes.string.isRequired, 
        NameTranslated: PropTypes.string.isRequired,
        facets: PropTypes.arrayOf(
            PropTypes.shape({
                Count: PropTypes.number.isRequired,
                Name: PropTypes.string.isRequired,
                NameTranslated: PropTypes.string.isRequired
            })
        ),
        getRootStateValue: PropTypes.func.isRequired,
        updateRootState: PropTypes.func.isRequired,
        showResults: PropTypes.func.isRequired
    }

    toggleExpand() {
        this.setState(prevState => ({
            expanded: !prevState.expanded
        }))
    }

    renderList() {
        if (this.props.facets) {
            let facetElements = this.props.facets.map((facet, i) => {
                return <Facet
                    getRootStateValue={this.props.getRootStateValue.bind(this)}
                    updateRootState={this.props.updateRootState.bind(this)}
                    facet={facet}
                    facetField={this.props.facetField} key={i}
                    showResults={this.props.showResults.bind(this)} />;
            });
            return React.createElement('ul', { className: style.facets, onClick: () => this.toggleExpand() }, facetElements);
        }
    }

    render() {
        return (
            <li className={this.state.expanded ? style.filterItem + " " + style.expanded : style.filterItem} onClick={() => this.toggleExpand()}>
            <FontAwesomeIcon icon={this.state.expanded ? "angle-up" : "angle-down"} className={style.expandArrow} />
                <p className={style.filterName}>
                    <span className={style.expandArrow}></span> {this.props.NameTranslated}
                </p>
                {this.renderList()}
            </li>
        );
    }
}
