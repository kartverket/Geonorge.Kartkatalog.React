// Dependencies
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// Utils
import userManager from '../../../utils/userManager';

// Actions
import { fetchSelectedLanguage, updateSelectedLanguage } from '../../../actions/SelectedLanguageActions';
import { updateSelectedFacetsFromUrl } from '../../../actions/FacetFilterActions';

import { getResource } from '../../../actions/ResourceActions'


// Stylesheets
import styleBtn from './Buttons.scss';
import style from '../MainNavigation.scss';


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export class GeonorgeMenuButton extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.handleLogoutClick = this.handleLogoutClick.bind(this);
    }

    componentDidMount() {        
        document.addEventListener('mousedown', this.handleClick, false);        
    }
    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClick, false);        
    }
    toggleExpandMenu() {
        this.setState(prevState => ({
            expandedMenu: !prevState.expandedMenu
        }))
    }

    handleLoginClick(event) {
        event.preventDefault();
        userManager.signinRedirect();
    }

    handleLogoutClick(event) {
        event.preventDefault();
        userManager.signoutRedirect({ 'id_token_hint': this.props.user.id_token });
        userManager.removeUser();
    }

    handleLanguageLinkClick(event) {
        const updateValue = this.props.selectedLanguage === 'en' ? 'no' : 'en'
        this.props.updateSelectedLanguage(updateValue);
    }
    handleClick = (e) => {
        if (!this.menuNode || !this.menuNode.contains(e.target)) {
         //   return this.setState({ expandedMenu: false }); // TODO Triggers also inside ref
        }
    }

    renderMenuButton() {
        return (
            <div>
                <div ref={menuNode => this.menuNode = menuNode} className={styleBtn.GeonorgeMenuButton} onClick={() => this.toggleExpandMenu()}>
                    <span className={style.iconButton}>
                        <FontAwesomeIcon title="Vis meny" icon={this.state.expandedMenu ? ['fas', 'times'] : ['fas', 'bars']} />
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
                    <div className={styleBtn.secondaryContent}>
                        {this.renderSecondaryMenuContent()}
                    </div>
                </nav>
            )
        }
        return null
    }

    renderLoginLink() {
        return <li onClick={this.handleLoginClick}>{this.props.getResource('SignIn', 'Logg inn')}</li>
    }

    renderLogoutLink() {
        return <li onClick={this.handleLogoutClick}>{this.props.getResource('SignOut', 'Logg ut')}</li>
    }

    renderLanguageLink() {
        let textContent = this.props.selectedLanguage === 'en' ? this.props.getResource('Norwegian', 'Norsk') : this.props.getResource('English', 'Engelsk');
        return <li onClick={() => this.handleLanguageLinkClick()}>{textContent}</li>;
    }

    renderSecondaryMenuContent() {
        if (this.props.loginUrl || this.props.multilingual) {
            const accountLink = this.props.user ? this.renderLogoutLink() : this.renderLoginLink();
            const languageLink = this.props.multilingual ? this.renderLanguageLink() : null;
            return (
                <ul>
                    {accountLink}
                    {languageLink}
                </ul>
            )
        }
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
    geonorgeMenu: PropTypes.array.isRequired,
    loginUrl: PropTypes.string,
    multilingual: PropTypes.bool
};

const mapStateToProps = state => ({
    geonorgeMenu: state.geonorgeMenu,
    selectedLanguage: state.selectedLanguage,
    user: state.oidc.user,
    resources: state.resources
});

const mapDispatchToProps = {
    fetchSelectedLanguage,
    updateSelectedLanguage,
    updateSelectedFacetsFromUrl,
    getResource
};

export default connect(mapStateToProps, mapDispatchToProps)(GeonorgeMenuButton);
