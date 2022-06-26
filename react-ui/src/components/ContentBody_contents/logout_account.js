import React, { Component } from 'react';

class LogoutAccount extends Component {

    constructor(props){
        super(props);
        this.state = {};
    }

    componentDidMount(){
        document.title = "Logged out";
    }

    render() {
        return (
            <div>
                <h3>You have logged out</h3>
            </div>
        );
    }
}

export default LogoutAccount;