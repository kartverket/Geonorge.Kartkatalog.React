import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import style from './Buttons.scss';
import Modal from './Modal.js'

import { getResource } from '../../../actions/ResourceActions'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export class ShowCoverageButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            mounted: false
        };
    }

    showModal = () => {
        this.setState({ show: true });
    };

    hideModal = () => {
        this.setState({ show: false });
    };

    componentDidMount = () => {
        this.setState({ mounted: true });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.selectedLanguage !== this.props.selectedLanguage){
            this.render();
        }
    }

    renderModal() {
        return this.props.metadata.CoverageUrl && this.state.mounted
            ? (
                <Modal show={this.state.show} handleClose={this.hideModal}>
                    <iframe src={this.state.show ? this.props.metadata.CoverageUrl : ''} width="100%" height="800px" />
                </Modal>
            ) : '';
    }

    renderButton() {
        let buttonDescription = this.props.getResource('DisplayCoverageMap', 'Vis dekningskart');

        if (this.props.metadata.CoverageUrl) {
            let buttonClass = style.btn;
            return <span className={buttonClass} onClick={this.showModal}>
                <FontAwesomeIcon title={buttonDescription} icon={['far', 'globe']} key="icon" />{buttonDescription}
            </span>
        }
        else {
            let buttonClass = style.btn + ' disabled';
            return <span className={buttonClass}>
                <FontAwesomeIcon title={buttonDescription} icon={['far', 'globe']} key="icon" />{buttonDescription}
            </span>
        }

    }

    render() {
        return (
            <React.Fragment>
                {this.renderModal()}
                {this.renderButton()}
            </React.Fragment>
        );
    }

}

ShowCoverageButton.propTypes = {
    metadata: PropTypes.object.isRequired
};

const mapDispatchToProps = {
    getResource
};

const mapStateToProps = state => ({
    selectedLanguage: state.selectedLanguage
});

export default connect(mapStateToProps, mapDispatchToProps)(ShowCoverageButton);
