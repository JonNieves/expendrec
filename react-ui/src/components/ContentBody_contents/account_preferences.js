import React, { Component } from 'react';

class AccountPreferences extends Component {

    constructor(props){
        super(props);
        this.state = {
            auto_login_text: null,
            auto_login_pref_button_text: null,
            alert: {
                message: null,
                type: null,
                type_List: [
                    "success",
                    "info",
                    "warning",
                    "danger"
                ]
            }
        };

        this.updateAutologinPref = this.updateAutologinPref.bind(this);
    }

    componentDidMount(){
        this.updateTexts();
        document.title = "Preferences";
    }

    updateTexts(){

        console.log("updating preference texts");

        if (typeof (Storage) !== "undefined") {
            if (localStorage.getItem("autologin_preference") === "true"){
                this.setState({
                    auto_login_text: "Currently, autologin is ON for this device",
                    auto_login_pref_button_text: "DISABLE Autologin"
                });
            }
            else if (localStorage.getItem("autologin_preference") === "false"){
                this.setState({
                    auto_login_text: "Currently, autologin is OFF for this device",
                    auto_login_pref_button_text: "ENABLE Autologin"
                });
            }
        }
    }

    updateAutologinPref(event) {
        event.preventDefault();

        if (typeof (Storage) !== "undefined") {
            if (localStorage.getItem("autologin_preference") === "true"){
                localStorage.setItem("autologin_preference", "false");
                localStorage.removeItem("session");
                this.props.updateAlert("Autologin turned OFF", "info");
            }
            else if (localStorage.getItem("autologin_preference") === "false" && this.props.client.session){
                localStorage.setItem("autologin_preference", "true");
                localStorage.setItem("session", this.props.client.session);
                this.props.updateAlert("Autologin turned ON", "info");
            }
        }

        this.updateTexts();
    }

    initiateNuke(){
        document.getElementsByClassName("nuke_account_form")[0].classList.remove("do_not_show");
        document.getElementsByClassName("nuke_initiator")[0].classList.add("do_not_show");
        document.getElementsByClassName("nuke_account_form")[0].scrollIntoView(false);
    }

    cancelNuke(){
        document.getElementsByClassName("nuke_account_form")[0].classList.add("do_not_show");
        document.getElementsByClassName("nuke_initiator")[0].classList.remove("do_not_show");
    }

    nukeUserAccount(){
        console.log("sending account deletion order to server");
        let client_action = {
            type: "delete_account",
            specs: {
                session: this.props.client.session,
                email: this.props.client.email,
                id: this.props.client.id
            }
        };
        console.log(client_action);
        this.props.socket.emit("client_action", client_action);
    }

    render() {
        return (
            <div>
                <h3>Account Preferences</h3>
                <ul className="user_preferences">
                    <li className="do_not_show">
                        <h4>Autologin</h4>
                        <p>Autologin is a device-specific convenience feature that lets you sign in automatically. This feature is useful if you intend to sign in a lot from just one device. Autologin only supports one device at a time. Turning on autologin now means you will have to login manually again on other devices.</p>
                        <p>Manually logging off turns off autologin. You can just close the page to leave while keeping autologin on.</p>
                        <p>While convenient, this feature is limited and may be totally redundant if you are using a password manager (recommended), like <a href="https://passwords.google.com/" target="_blank" rel="noopener noreferrer">Google Password Manager</a> or something similar.</p>
                        <form onSubmit={this.updateAutologinPref} name="autologin_preference_form">
                            <p><strong>{this.state.auto_login_text}</strong> <input type="submit" value={this.state.auto_login_pref_button_text} /></p>
                        </form>
                    </li>
                    <li>
                        <h4>Language</h4>
                        <p className="italic">At the moment, only English is supported.</p>
                    </li>
                    <li>
                        <h4>Delete Account</h4>
                        <p>You are in control. If you want to <span className="italic">permanently</span> delete your ExpendRec account, you can.</p>
                        <p className="italic">Note: There are no refunds for deleting your account with leftover premium features.</p>
                        <p>Steps:</p>
                        <ol>
                            <li>Press the button below; "Begin to DELETE my account"</li>
                            <li>In the form that appears, Press "YES - I want to delete my account"</li>
                        </ol>
                        <br />
                        <p><input className="nuke_initiator" type="button" value="Begin to DELETE my account" onClick = {() => this.initiateNuke()} /></p>
                        <div className="do_not_show nuke_account_form jumbotron">
                            <p className="text-danger"><strong><span className="underline">THERE IS NO GOING BACK.</span> Are you sure you want to delete your account?</strong></p>
                            <p><button className="btn btn-default" onClick = {() => this.cancelNuke()}><strong>NO</strong> - DO NOT delete my account</button></p>
                            <br />
                            <p><button className="btn btn-danger" onClick = {() => this.nukeUserAccount()}><strong>YES</strong> - Delete my account</button></p>
                        </div>
                    </li>
                </ul>
            </div>
        );
    }
}

export default AccountPreferences;