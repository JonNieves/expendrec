import React, { Component } from 'react';
import DefaultLanding from './ContentBody_contents/default_landing.js';
import CreateAccount from './ContentBody_contents/create_account.js';
import LoginAccount from './ContentBody_contents/login_account.js';
import ActionHistory from './ContentBody_contents/view_actions.js';
import Transactions from './ContentBody_contents/view_transactions.js';
import CreateTransaction from './ContentBody_contents/create_transaction.js';
import AccountPreferences from './ContentBody_contents/account_preferences.js';
import LogoutAccount from './ContentBody_contents/logout_account.js';

class ContentBody extends Component {

    constructor(props){
        super(props);
        this.state = {};
    }

    chooseContentBody(){
        if (this.props.content_body === "default_landing"){
            return (
                <DefaultLanding topBarFunctions = {this.props.topBarFunctions} />
            );
        }
        else if (this.props.content_body === "create_account"){
            return (
                <CreateAccount socket = {this.props.socket} />
            );
        }
        else if (this.props.content_body === "login_account"){
            return (
                <LoginAccount socket = {this.props.socket} />
            );
        }        
        else if (this.props.content_body === "action_history"){
            return (
                <ActionHistory action_history = {this.props.client.action_history}/>
            );
        }
        else if (this.props.content_body === "view_transactions"){
            return (
                <Transactions socket = {this.props.socket} client = {this.props.client}/>
            );
        }
        else if (this.props.content_body === "account_preferences"){
            return (
                <AccountPreferences client = {this.props.client} updateAlert = {this.props.updateAlert} socket = {this.props.socket} />
            );
        }
        else if (this.props.content_body === "logout_account"){
            return (
                <LogoutAccount />
            );
        }
        else if (this.props.content_body === "loading"){
            return (
                <div className="loader"></div>
            );
        }
        else {
            return (
                <h3>Something went wrong :(</h3>
            );
        }
    }

    render() {
        if (this.props.client.firstName && this.props.client.lastName){
            return (
                <div className="container">
                    {this.chooseContentBody()}
                    <CreateTransaction session = {this.props.client.session} socket = {this.props.socket} />
                </div>
            );
        }
        else {
            return (
                <div className="container">
                    {this.chooseContentBody()}
                </div>
            );
        }
    }
}

export default ContentBody;