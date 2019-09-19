// Dependencies
import React from "react";
import { connect } from "react-redux";
import { SignoutCallbackComponent } from "redux-oidc";
import { withRouter } from 'react-router-dom';

// Utils
import userManager from "../../utils/userManager";

class SignoutCallbackPage extends React.Component {
    successCallback = () => {
        this.props.history.push('/');
    };

    render() {
        return (
            <SignoutCallbackComponent
                userManager={userManager}
                successCallback={this.successCallback}
                errorCallback={error => {
                    if (this.props && this.props.history){
                        this.props.history.push("/");
                    }
                    console.error(error);
                }}
            >
                <div>Logger ut...</div>
            </SignoutCallbackComponent>
        );
    }
}

export default withRouter(connect(null)(SignoutCallbackPage));
