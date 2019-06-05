import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { fetchSelectedLanguage, updateSelectedLanguage } from '../../../actions/SelectedLanguageActions';

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
                    <div className={styleBtn.secondaryContent}>
                        {this.renderSecondaryMenuContent()}
                    </div>
                </nav>
            )
        }
        return null
    }

    renderLogInLink() {
        return <li>Logg inn</li>
    }

    renderLanguageLink() {
        let languageLink = {
            text: this.props.selectedLanguage === 'en' ? 'Norsk' : 'English',
            updateValue: this.props.selectedLanguage === 'en' ? 'no' : 'en'
        }
        return <li onClick={() => this.props.updateSelectedLanguage(languageLink.updateValue)}>{languageLink.text}</li>;
    }

    renderSecondaryMenuContent() {
        if (this.props.loginUrl || this.props.multilingual) {
            const loginLink = this.props.loginUrl ? this.renderLogInLink() : null;
            const languageLink = this.props.multilingual ? this.renderLanguageLink() : null;
            return (
                <ul>
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
    selectedLanguage: state.selectedLanguage
});

const mapDispatchToProps = {
    fetchSelectedLanguage,
    updateSelectedLanguage
};

export default connect(mapStateToProps, mapDispatchToProps)(GeonorgeMenuButton);
