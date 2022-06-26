import React, { Component } from 'react';

class DefaultLanding extends Component {

    constructor(props){
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div>
                <h3>Welcome</h3>
                <h4>Improve your life! Easily create records of your expenditures! Make an impact on your life by tracking your spending!</h4>
                <button className="btn btn-default" onClick = {() => this.props.topBarFunctions("create_account")}>Create Account</button>
            </div>
        );
    }
}

export default DefaultLanding;