// Dependencies
import React from "react";
import { connect } from "react-redux";
import { CallbackComponent } from "redux-oidc";
import { withRouter } from 'react-router-dom';

// Utils
import userManager from "../../utils/userManager";

class CallbackPage extends React.Component {
    successCallback = () => {
        this.props.history.push('/');
    };

    render() {
        return (
            <CallbackComponent
                userManager={userManager}
                successCallback={this.successCallback}
                errorCallback={error => {
                    this.props.history.push("/");
                    console.error(error);
                }}
            >
                <div>Logger inn...</div>
            </CallbackComponent>
        );
    }
}

export default withRouter(connect(null)(CallbackPage));
