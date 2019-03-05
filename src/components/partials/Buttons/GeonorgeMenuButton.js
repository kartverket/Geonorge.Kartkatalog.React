import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styleBtn from './Buttons.scss';
import style from '../MainNavigation.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export class GeonorgeMenuButton extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    toggleExpandMenu() {
        this.setState(prevState => ({
            expandedMenu: !prevState.expandedMenu
        }))
    }


    renderMenuButton() {
        return (
            <div>
                <div onClick={() => this.toggleExpandMenu()}>
                    <span className={style.iconButton}>
                        <FontAwesomeIcon title="Vis nedlastede elementer" icon={this.state.expandedMenu ? ['fas', 'times'] : ['fas', 'bars']} />
                    </span>
                </div>
                {this.renderMenuContent()}
            </div>
        )
    }

    renderMenuContent() {
        if (this.props.geonorgeMenu) {
            const menuItems = this.props.geonorgeMenu.map(menuItem => {
                return (
                    <li>
                        <p>
                            <a href={menuItem.Url}>{menuItem.Name}</a>
                        </p>
                        {this.renderSubMenuItems(menuItem)}
                    </li>
                )
            });
            return (
            <nav className={this.state.expandedMenu ? style.menu + " " + style.open : style.menu}>
                <div className={styleBtn.menuContent}>{menuItems}</div>
            </nav>
            )
        }
        return null
    }

    renderSubMenuItems(parent) {
        if (parent.HasChildren && parent.SubMenuItem) {
            const children = parent.SubMenuItem.map(item => {
                return (
                    <ul>
                        <a href={item.Url}>{item.Name}</a>
                    </ul>
                )
            });
            return (
                children
            )
        }
        return null;
    }

    render() {
        return this.renderMenuButton()
    }

}

GeonorgeMenuButton.propTypes = {
    geonorgeMenu: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    geonorgeMenu: state.geonorgeMenu,
});

export default connect(mapStateToProps, null)(GeonorgeMenuButton);
