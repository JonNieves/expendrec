import React, { Component } from 'react';

class CreateAccount extends Component {

    constructor(props){
        super(props);
        this.state = {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            pass: ""
        };

        this.handleFirstName = this.handleFirstName.bind(this);
        this.handleLastName = this.handleLastName.bind(this);
        this.handleEmail = this.handleEmail.bind(this);
        this.handlePhone = this.handlePhone.bind(this);
        this.handlePass = this.handlePass.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount(){
        document.title = "Create Account";
    }

    handleFirstName(event) {
        this.setState({ firstName: event.target.value });
    }

    handleLastName(event) {
        this.setState({ lastName: event.target.value });
    }

    handleEmail(event) {
        this.setState({ email: event.target.value });
    }

    handlePhone(event) {
        this.setState({ phone: event.target.value });
    }

    handlePass(event) {
        this.setState({ pass: event.target.value });
    }

    handleSubmit(event) {
        event.preventDefault();

        let myForm = document.forms["new_account_form"];
        let err = "";

        if (myForm["email_input"].value === "") {
            err += "-> No email entered\n";
        }

        if (myForm["pass_input"].value === "") {
            err += "-> No password entered\n";
        }

        if (myForm["firstName_input"].value === "") {
            err += "-> No first name entered\n";
        }

        if (myForm["lastName_input"].value === "") {
            err += "-> No last name entered\n";
        }

        if (myForm["phone_input"].value === "") {
            err += "-> No phone number entered";
        }

        if (err.length > 0) {
            err = "Form Error:\n\n" + err;
            alert(err);
        }
        else {
            let now = new Date();
            let specs = {
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                email: this.state.email,
                phone: this.state.phone,
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

            myForm.reset();
    
            this.attempt_create_account(specs);
        }       
    }

    attempt_create_account(specs){
        let client_action = {
            type: "create_new_account",
            specs: {
                firstName: specs.firstName,
                lastName: specs.lastName,
                email: specs.email,
                phone: specs.phone,
                pass: specs.pass,
                time: specs.time
            }
        };
        this.props.socket.emit("client_action", client_action);
    }

    render() {
        return (
            <div>
                <h3>Create Your Account</h3>
                <form onSubmit={this.handleSubmit} name="new_account_form">
                    <div className="form-group">
                        <h5>Email:</h5>
                        <input className="form-control" type="text" value={this.state.email} onChange={this.handleEmail} name="email_input" />
                    </div>
                    <div className="form-group">
                        <h5>Password:</h5>
                        <input className="form-control" type="password" value={this.state.pass} onChange={this.handlePass} name="pass_input" />
                        <p>Suggestion: If using Google Chrome, right-click the text field and use "Suggest Password" for a powerful safe password.</p>
                    </div>
                    <div className="form-group">
                        <h5>First Name:</h5>
                        <input className="form-control" type="text" value={this.state.firstName} onChange={this.handleFirstName} name="firstName_input" />
                    </div>
                    <div className="form-group">
                        <h5>Last Name:</h5>
                        <input className="form-control" type="text" value={this.state.lastName} onChange={this.handleLastName} name="lastName_input" />
                    </div>
                    <div className="form-group">
                        <h5>Phone #:</h5>
                        <input className="form-control" type="text" value={this.state.phone} onChange={this.handlePhone} name="phone_input" />
                        <p>Only use numbers. No dashes, parantheses, or spaces. Ex. 1234567890</p>
                    </div>
                    <input className="btn btn-default" type="submit" value="Create Account" />
                </form>
            </div>
        );
    }
}

export default CreateAccount;