import React, { Component } from 'react';

class LoginAccount extends Component {

    constructor(props){
        super(props);
        this.state = {
            email: "",
            pass: "",
            content: "form",
            content_options: [
                "form",
                "loader"
            ]
        };

        this.handleEmail = this.handleEmail.bind(this);
        this.handlePass = this.handlePass.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount(){
        document.title = "Login Account";
    }

    handleEmail(event) {
        this.setState({ 
            email: event.target.value 
        });
    }

    handlePass(event) {
        this.setState({ 
            pass: event.target.value 
        });
    }

    handleSubmit(event) {
        event.preventDefault();

        let myForm = document.forms["login_account_form"];
        let err = "";

        if (myForm["email_input"].value === "") {
            err += "-> No email entered\n";
        }
        if (myForm["pass_input"].value === "") {
            err += "-> No password entered\n";
        }

        if (err.length > 0) {
            err = "Form Error:\n\n" + err;
            alert(err);
        }
        else if (err.length === 0) {
            let now = new Date();
            let specs = {
                email: this.state.email,
                pass: this.state.pass,
                time: {
                    year: now.getFullYear(),
                    month: now.getMonth(),
                    day: now.getDate(),
                    hour: now.getHours(),
                    minute: now.getMinutes(),
                    second: now.getSeconds(),
                    millisecond: now.getMilliseconds()
                }
            };

            console.log("Attempting manual login");
            console.log(specs.time);

            this.setState({
                email: "",
                pass: "",
                content: "loader"
            });

            myForm.reset();
    
            this.attempt_login(specs);
        }
    }

    attempt_login = (specs) => {
        let client_action = {
            type: "login_account",
            specs: specs
        };
        this.props.socket.emit("client_action", client_action);
    }

    render() {

        if (this.state.content === "form"){
            return (
                <div>
                    <h3>Log into Your Account</h3>
                    <form onSubmit={this.handleSubmit}  name="login_account_form">
                        <div className="form-group">
                            <h5>Email</h5>
                            <input className="form-control" type="text" name="email_input" value={this.state.email} onChange={this.handleEmail} />
                        </div>
                        <div className="form-group">
                            <h5>Password</h5>
                            <input className="form-control" type="password" name="pass_input" value={this.state.pass} onChange={this.handlePass} />
                        </div>
                        <button type="submit" className="btn btn-default">Log In</button>
                    </form>
                </div>
            );
        }
        else if (this.state.content === "loader"){
            return (
                <div className="loader"></div>
            );
        }
        
    }
}

export default LoginAccount;