import React, { Component } from 'react';
import io from "socket.io-client";
import './App.css';
import TopBarButtons from './components/TopBarButtons.js';
import ContentBody from './components/ContentBody.js';
import Alert from './components/Alert.js';

class App extends Component {
    constructor() {
        super();
        this.state = {
            content_body: "default_landing",
            content_body_options: [
                "default_landing",
                "create_account",
                "login_account",
                "action_history",
                "view_transactions",
                "account_preferences",
                "logout_account",
                "loading"
            ],
            alert_timeout: null,
            alert: {
                message: null,
                type: null,
                type_List: [
                    "success",
                    "info",
                    "warning",
                    "danger"
                ]
            },
            client: {
                id: null,
                firstName: null,
                lastName: null,
                email: null,
                phone: null,
                created: null,
                transaction_records: null,
                action_history: null,
                premium: null,
                session: null
            },
            emission_data: null
        };

        this.updateAlert = this.updateAlert.bind(this);

        this.socket = this.checkLocal();

        this.socket.on("disconnect", () => {
            console.log("Socket.io Disconnected");
        });

        this.socket.on("create_new_account", (emission_data) => {
            console.log(emission_data);

            if (emission_data.success === true){
                localStorage.removeItem("session");
                localStorage.setItem("autologin_preference", "false");
                this.setState({
                    client: {
                        id: null,
                        firstName: null,
                        lastName: null,
                        email: null,
                        phone: null,
                        created: null,
                        transaction_records: null,
                        action_history: null,
                        premium: null,
                        session: null
                    },
                    content_body: "login_account"
                });
                this.updateAlert(emission_data.status, "success");
            }
            else if (emission_data.success === false){
                this.setState({
                    content_body: "default_landing"
                });
                this.updateAlert(emission_data.status, "danger");
            }
        });

        this.socket.on("login_account", (emission_data) => {
            console.log(emission_data);

            if (emission_data.success === true){
                localStorage.setItem("autologin_preference", "true");
                localStorage.setItem("session", emission_data.client.session);
                this.setState({
                    client: emission_data.client,
                    content_body: "view_transactions"
                });
                this.updateAlert("Welcome " + emission_data.client.firstName + " " + emission_data.client.lastName, "success");
            }
            else if (emission_data.success === false){
                this.setState({
                    content_body: "default_landing"
                });
                this.updateAlert("Login failed", "danger");
            }
        });

        this.socket.on("autologin_account", (emission_data) => {
            console.log(emission_data);

            if (emission_data.success === true){
                localStorage.setItem("autologin_preference", "true");
                localStorage.setItem("session", emission_data.client.session);
                this.setState({
                    client: emission_data.client,
                    content_body: "view_transactions"
                });
                this.updateAlert("Welcome " + emission_data.client.firstName + " " + emission_data.client.lastName, "success")
            }
            else if (emission_data.success === false){
                console.log("Autologin failed");
                this.setState({
                    content_body: "login_account"
                });
            }
        });

        this.socket.on("update_account", (emission_data) => {
            console.log(emission_data);

            if (emission_data.success === true){
                this.updateAlert(emission_data.status, "success");
            }
            else if (emission_data.success === false){
                this.updateAlert(emission_data.status, "danger");
            }
        });

        this.socket.on("delete_account", (emission_data) => {
            console.log(emission_data);

            if (emission_data.success === true){
                this.updateAlert(emission_data.status, "success");
                this.setState({
                    content_body: "default_landing",
                    client: {
                        id: null,
                        firstName: null,
                        lastName: null,
                        email: null,
                        phone: null,
                        created: null,
                        transaction_records: null,
                        action_history: null,
                        premium: null,
                        session: null,
                        meta_data: null
                    }
                });
            }
            else if (emission_data.success === false){
                this.updateAlert(emission_data.status, "danger");
            }
        });

        this.socket.on("create_new_transaction", (emission_data) => {
            console.log(emission_data);

            if (emission_data.success === true){
                this.updateAlert(emission_data.status, "success");
                //add newly created transaction to client memory
                this.addSuccessfullyCreatedTransaction(emission_data.client);
            }
            else if (emission_data.success === false){
                this.updateAlert(emission_data.status, "danger");
            }
        });

        this.socket.on("view_transactions", (emission_data) => {
            console.log(emission_data);

            if (emission_data.success === true){
                //do stuff
            }
        });

        this.socket.on("update_transaction", (emission_data) => {
            console.log(emission_data);

            if (emission_data.success === true){
                this.updateAlert(emission_data.status, "success");
                //add newly updated transaction to client memory
                this.spliceSuccessfullyUpdatedTransaction(emission_data.client);
            }
            else if (emission_data.success === false){
                this.updateAlert(emission_data.status, "danger");
            }
        });

        this.socket.on("delete_transaction", (emission_data) => {
            console.log(emission_data);

            if (emission_data.success === true){
                this.updateAlert(emission_data.status, "success");
                //remove the now-deleted transaction from client memory
                this.removeDeletedTransaction(emission_data.client.transaction_id);
            }
            else if (emission_data.success === false){
                this.updateAlert(emission_data.status, "danger");
            }
        });

        /*
            ATTEMPT AUTOLOGIN
        */

        if (typeof (Storage) !== "undefined") {
            if (localStorage.getItem("autologin_preference") === null){
                localStorage.setItem("autologin_preference", "false");
                localStorage.removeItem("session");
            }
            else if (localStorage.getItem("autologin_preference") === "true"){
                if (localStorage.getItem("session") !== null){

                    console.log("Attempting autologin");

                    let now = new Date();
                    let client_action = {
                        type: "autologin_account",
                        specs: {
                            session: localStorage.getItem("session"),
                            time: {
                                year: now.getFullYear(),
                                month: now.getMonth(),
                                day: now.getDate(),
                                hour: now.getHours(),
                                minute: now.getMinutes(),
                                second: now.getSeconds(),
                                millisecond: now.getMilliseconds()
                            }
                        }
                    };

                    console.log(client_action.specs.time);

                    //function used in contructor so no setState
                    this.state.content_body = "loading";

                    this.socket.emit("client_action", client_action);
                }
            }
            else if (localStorage.getItem("autologin_preference") === "false"){
                localStorage.removeItem("session");
            }
        }
    }

    checkLocal(){

        let url = window.location.href;
        let isLocalhost = /localhost/ig;

        console.log("url", url);

        if (isLocalhost.test(url) === true){
            return io.connect('http://localhost:5000');
        }
        else if (isLocalhost.test(url) === false){
            return io.connect();
        }
    }

    addSuccessfullyCreatedTransaction(new_transaction){
        console.log("adding new transaction to client memory");
        console.log(new_transaction);
        let client_copy = {...this.state.client};
        client_copy.transaction_records.unshift(new_transaction);
        this.setState({
            client: client_copy
        });
        console.log(this.state.client.transaction_records);
    }

    spliceSuccessfullyUpdatedTransaction(updated_transaction){
        console.log("splicing updated transaction to client memory");
        console.log(updated_transaction);
        let client_copy = {...this.state.client};
        for (let i = 0; i < client_copy.transaction_records.length; i++){
            if (client_copy.transaction_records[i].id === updated_transaction.id){
                client_copy.transaction_records.splice(i, 1, updated_transaction);
                break;
            }
        }
        this.setState({
            client: client_copy
        });
        console.log(this.state.client.transaction_records);
    }

    removeDeletedTransaction(deleted_transaction_id){
        let found = false;
        let index = 0;

        while (found === false && index < this.state.client.transaction_records.length){
            if (this.state.client.transaction_records[index].id === deleted_transaction_id){
                this.state.client.transaction_records.splice(index, 1);
                found = true;
            }
            index++;
        }
    }

    topBarFunctions = (button_clicked) => {
        if (button_clicked === "create_account"){
            this.setState({
                content_body: "create_account"
            });
        }
        else if (button_clicked === "login_account"){
            this.setState({
                content_body: "login_account"
            });
        }
        else if (button_clicked === "action_history"){
            this.setState({
                content_body: "action_history"
            });
        }
        else if (button_clicked === "view_transactions"){
            this.setState({
                content_body: "view_transactions"
            });
        }
        else if (button_clicked === "account_preferences"){
            this.setState({
                content_body: "account_preferences"
            });
        }
        else if (button_clicked === "logout_account"){
            //let wants_to_logout = window.confirm("You sure you want to log out?\n\nNote: Manually logging off turns off autologin. If you want to leave without turning off autologin, simply close the page.");
            let wants_to_logout = window.confirm("You sure you want to log out?");
            if (wants_to_logout === true){
                this.setState({
                    content_body: "logout_account",
                    client: {
                        firstName: null,
                        lastName: null,
                        email: null,
                        phone: null,
                        created: null,
                        transaction_records: null,
                        action_history: null,
                        premium: null,
                        session: null,
                        meta_data: null
                    }
                });
                this.updateAlert("You have logged out", "info");
                localStorage.removeItem("session");
                localStorage.setItem("autologin_preference", "false");
            }
        }
        else if (button_clicked === "default_landing"){
            this.setState({
                content_body: "default_landing"
            });
        }

        //hide menu
        document.getElementsByClassName("topBarButtonsList")[0].style.display = "none";
    }

    resetAlert() {
        console.log("resetting alert");
        this.setState({
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
        });
        document.title = "New Expendrec";
    }

    updateAlert(message, type) {
        console.log("attempting alert", message, type);
        //cancel previous timeout
        if (this.state.alert_timeout !== null){
            clearTimeout(this.state.alert_timeout);
            this.setState({
                alert_timeout: null
            });
        }
        //create alert
        let new_alert = {...this.state.alert};
        new_alert.message = message;
        new_alert.type = type;
        //execute alert
        this.setState({
            alert: new_alert,
            alert_timeout: setTimeout( () => {this.resetAlert();}, 2500)
        });
        document.title = message;
    }

    render() {
        return (
            <div className="App">
                <TopBarButtons content_body = {this.state.content_body} email = {this.state.client.email} firstName = {this.state.client.firstName} lastName = {this.state.client.lastName} topBarFunctions = {this.topBarFunctions} />
                <ContentBody content_body = {this.state.content_body} socket = {this.socket} client = {this.state.client} topBarFunctions = {this.topBarFunctions} updateAlert = {this.updateAlert} />
                <Alert alert = {this.state.alert} />
            </div>
        );
    }
}

export default App;
