// Dependencies
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// Actions
import { getResource } from '../../../actions/ResourceActions'

// Reducers
import { pushToDataLayer } from '../../../reducers/TagManagerReducer';


// Components
import Modal from './Modal.js'

// Stylesheets
import style from './Buttons.scss';

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

    handleButtonClick = () => {
      this.showModal();
      const tagData = {
        name: this.props.metadata.Title,
        uuid: this.props.metadata.Uuid
      }
      this.props.pushToDataLayer({
				event: 'showMore',
				category: 'metadataDetails',
				activity: 'showCoverageMap',
				metadata: tagData
			});
    }

    componentDidMount = () => {
        this.setState({ mounted: true });
    }

    renderModal() {
        return this.props.metadata.CoverageUrl && this.state.mounted
            ? (
                <Modal show={this.state.show} handleClose={this.hideModal}>
                    <iframe src={this.state.show ? this.props.metadata.CoverageUrl : ''} title="Coverage map" width="100%" height="800px" />
                </Modal>
            ) : '';
    }

    renderButton() {
        let buttonDescription = this.props.getResource('DisplayCoverageMap', 'Vis dekningskart');

        if (this.props.metadata.CoverageUrl) {
            let buttonClass = style.btn;
            return <span className={buttonClass} onClick={this.handleButtonClick}>
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
    getResource,
    pushToDataLayer
};

const mapStateToProps = state => ({
    resources: state.resources
});

export default connect(mapStateToProps, mapDispatchToProps)(ShowCoverageButton);
