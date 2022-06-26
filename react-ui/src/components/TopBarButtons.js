import React, { Component } from 'react';

class TopBarButtons extends Component {

    constructor(props){
        super(props);
        this.state = {};
    }

    renderCreateAccountButton(){
        if (this.props.email === null && this.props.firstName === null && this.props.lastName === null){
            if (this.props.content_body === "create_account"){
                return (<li><button className="topBarButtons btn active_nav_button" onClick = {() => this.props.topBarFunctions("create_account")}>Create Account</button></li>);
            }
            else {
                return (<li><button className="topBarButtons btn" onClick = {() => this.props.topBarFunctions("create_account")}>Create Account</button></li>);
            }
        }
        else {
            return(null);
        }
    }

    renderLoginButton(){
        if (this.props.email === null && this.props.firstName === null && this.props.lastName === null){
            if (this.props.content_body === "login_account"){
                return (<li><button className="topBarButtons btn active_nav_button" onClick = {() => this.props.topBarFunctions("login_account")}>Login</button></li>);
            }
            else {
                return (<li><button className="topBarButtons btn" onClick = {() => this.props.topBarFunctions("login_account")}>Login</button></li>);
            }
        }
        else {
            return(null);
        }
    }

    renderViewTransactionsButton(){
        if (this.props.email !== null && this.props.firstName !== null && this.props.lastName !== null){
            if (this.props.content_body === "view_transactions"){
                return (<li><button className="topBarButtons btn active_nav_button" onClick = {() => this.props.topBarFunctions("view_transactions")}>Transactions</button></li>);
            }
            else {
                return (<li><button className="topBarButtons btn" onClick = {() => this.props.topBarFunctions("view_transactions")}>Transactions</button></li>);
            }
        }
        else {
            return (null);
        }
    }

    renderActionHistoryButton(){
        if (this.props.email !== null && this.props.firstName !== null && this.props.lastName !== null){
            if (this.props.content_body === "action_history"){
                return (<li><button className="topBarButtons btn active_nav_button" onClick = {() => this.props.topBarFunctions("action_history")}>Action History</button></li>);
            }
            else {
                return (<li><button className="topBarButtons btn" onClick = {() => this.props.topBarFunctions("action_history")}>Action History</button></li>);
            }
        }
        else {
            return (null);
        }
    }

    renderAccountPreferencesButton(){
        if (this.props.email !== null && this.props.firstName !== null && this.props.lastName !== null){
            if (this.props.content_body === "account_preferences"){
                return (<li><button className="topBarButtons btn active_nav_button" onClick = {() => this.props.topBarFunctions("account_preferences")}>Preferences</button></li>);
            }
            else {
                return (<li><button className="topBarButtons btn" onClick = {() => this.props.topBarFunctions("account_preferences")}>Preferences</button></li>);
            }
        }
        else {
            return (null);
        }
    }

    renderLogoutButton(){
        if (this.props.email !== null && this.props.firstName !== null && this.props.lastName !== null){
            if (this.props.content_body === "logout_account"){
                return (<li><button className="topBarButtons btn active_nav_button" onClick = {() => this.props.topBarFunctions("logout_account")}>Logout</button></li>);
            }
            else {
                return (<li><button className="topBarButtons btn" onClick = {() => this.props.topBarFunctions("logout_account")}>Logout</button></li>);
            }
        }
        else {
            return (null);
        }
    }

    renderNavMenu(){
        return(
            <ul className="navMenu">
                {this.renderCreateAccountButton()}
                {this.renderLoginButton()}
                {this.renderViewTransactionsButton()}
                {this.renderActionHistoryButton()}
                {this.renderAccountPreferencesButton()}
                {this.renderLogoutButton()}
            </ul>
        );
    }

    toggleNavMenu(){
        let topBarButtons = document.getElementsByClassName("navMenu")[0];
        if (topBarButtons.style.display === "block"){
            topBarButtons.style.display = "none";
        }
        else {
            topBarButtons.style.display = "block";
        }
    }

    renderHeader(){
        let title = "{ExpendRec}";

        if (this.props.content_body === "default_landing"){
            return(
                <button className="topBarButtons btn active_nav_button homeButton" onClick = {() => this.props.topBarFunctions("default_landing")}>{title}</button>
            );
        }
        else {
            return(
                <button className="topBarButtons btn homeButton" onClick = {() => this.props.topBarFunctions("default_landing")}>{title}</button>
            );
        }
    }

    render(){
        return (
            <nav className="navbar-inverse">
                <div className="container-fluid nav_container">
                    <button className="topBarButtons toggle" onClick={() => this.toggleNavMenu()}>&#9776;</button>
                    {this.renderHeader()}
                    {this.renderNavMenu()}
                </div>
            </nav>
        );
    }
}

export default TopBarButtons;