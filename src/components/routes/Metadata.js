import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {fetchMetadata} from '../../actions/MetadataActions'

class Metadata extends Component {
    componentWillMount() {
        this.props.fetchMetadata(this.props.match.params.uuid);
    }

    render() {
        return (
            <div>
                <h1>{ this.props.metadata.Title }</h1>
                <div>{ this.props.metadata.Abstract }</div>
                <h2>Bruksområde</h2>
                <div>{ this.props.metadata.SpecificUsage }</div>
            </div>
        )
    }
}

Metadata.propTypes = {};

const mapStateToProps = state => ({
    metadata: state.metadata
});

const mapDispatchToProps = {
    fetchMetadata,
};

export default connect(mapStateToProps, mapDispatchToProps)(Metadata);
