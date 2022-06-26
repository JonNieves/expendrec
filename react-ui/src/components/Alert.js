import React, { Component } from 'react';

class Alert extends Component {

    constructor(props){
        super(props);
        this.state = {
            message: this.props.alert.message,
            type: this.props.alert.type,
            type_List: [
                "success",
                "info",
                "warning",
                "danger"
            ]
        };
    }

    generate_alert(){
        if (this.props.alert.type === "success"){
            return (
                <div className="alert alert-success alert-dismissible">
                    <h5>Success</h5>
                    <h4>{this.props.alert.message}</h4>
                </div>
            );
        }
        else if (this.props.alert.type === "info"){
            return (
                <div className="alert alert-info alert-dismissible">
                    <h5>Info</h5>
                    <h4>{this.props.alert.message}</h4>
                </div>
            );
        }
        else if (this.props.alert.type === "warning"){
            return (
                <div className="alert alert-warning alert-dismissible">
                    <h5>Warning</h5>
                    <h4>{this.props.alert.message}</h4>
                </div>
            );
        }
        else if (this.props.alert.type === "danger"){
            return (
                <div className="alert alert-danger alert-dismissible">
                    <h5>Error</h5>
                    <h4>{this.props.alert.message}</h4>
                </div>
            );
        }
    }

    render() {
        if (this.props.alert.message !== null){
            return this.generate_alert();
        }
        else {
            return (null);
        }
    }
}

export default Alert;