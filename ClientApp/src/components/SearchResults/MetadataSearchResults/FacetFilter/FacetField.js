import React, { Component } from 'react';
import { Facet } from './Facet';
import style from './FacetField.scss';

export class FacetField extends Component {
    displayName = FacetField.name

    constructor(props) {
        super(props);
        this.state = {
            expanded: false
        };
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
                <p className={style.filterName}>
                    <span className={style.expandArrow}></span> {this.props.facetField}
                </p>
                {this.renderList()}
            </li>
        );
    }
}
