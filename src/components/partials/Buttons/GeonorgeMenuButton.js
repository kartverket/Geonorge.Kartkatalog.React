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
                <div className={styleBtn.GeonorgeMenuButton} onClick={() => this.toggleExpandMenu()}>
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
            const menuItems = this.props.geonorgeMenu.map((menuItem, menuItemIndex) => {
                return (
                    <ul key={menuItemIndex}>
                        <li>
                            <a href={menuItem.Url}>{menuItem.Name}</a>                        
                            </li>
                        {this.renderSubMenuItems(menuItem)}
                    </ul>
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
            const children = parent.SubMenuItem.map((item, itemIndex) => {
                return (
                    <li key={itemIndex}>
                        <a href={item.Url}>{item.Name}</a>
                    </li>
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
    geonorgeMenu: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
    geonorgeMenu: state.geonorgeMenu,
});

export default connect(mapStateToProps, null)(GeonorgeMenuButton);
