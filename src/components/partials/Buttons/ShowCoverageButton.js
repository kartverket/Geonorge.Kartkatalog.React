import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import style from './Buttons.scss';
import {Modal} from './Modal.js'


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export class ShowCoverageButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false
        };
    }

    showModal = () => {
        this.setState({ show: true });
      };
    
    hideModal = () => {
    this.setState({ show: false });
    };

    renderModal() {
        return <Modal show={this.state.show} handleClose={this.hideModal}>
                <iframe src={this.props.metadata.CoverageUrl} width="100%" height="800px"></iframe>
            </Modal>
    }

    renderButton() {
        if(this.props.metadata.CoverageUrl){
            let buttonClass = style.btn;
            return <span className={buttonClass} onClick={this.showModal}>
                <FontAwesomeIcon title="Vis dekningskart" icon={['far', 'external-link-square']} key="icon" />Vis dekningskart
            </span>
        }
        else{
            let buttonClass = style.btn + ' disabled';
            return <span className={buttonClass}>
                <FontAwesomeIcon title="Vis dekningskart" icon={['far', 'external-link-square']} key="icon" />Vis dekningskart
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

export default connect(null, null)(ShowCoverageButton);
