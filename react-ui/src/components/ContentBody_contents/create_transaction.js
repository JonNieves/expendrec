import React, { Component } from 'react';

class CreateTransaction extends Component {

    constructor(props){
        super(props);
        this.state = {
            showing: "button",
            showing_options: [
                "button",
                "form"
            ],
            type: "expense",
            amount: 0,
            description: ""
        };

        this.handleAmount = this.handleAmount.bind(this);
        this.handleDescription = this.handleDescription.bind(this);
        this.onTypeChange = this.onTypeChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount(){
        document.title = "Create Transaction";
    }

    handleAmount(event) {
        this.setState({ amount: event.target.value });
    }

    handleDescription(event) {
        this.setState({ description: event.target.value });
    }

    onTypeChange(event){
        this.setState({ type: event.target.value });
    }

    handleSubmit(event){
        event.preventDefault();

        let myForm = document.forms["new_transaction_form"];
        let err = "";

        if (myForm["amount_input"].value === ""){
            err += "-> No amount entered\n";
        }

        if (myForm["description_input"].value === ""){
            err += "-> No description entered\n";
        }

        if (err.length > 0){
            err = "Form Error:\n\n" + err;
            alert(err);
        }
        else {

            let num = Number(this.state.amount);

            if (isNaN(num) === false){
                let now = new Date();
                let specs = {
                    type: this.state.type,
                    amount: num,
                    description: this.state.description,
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
    
                this.attempt_create_transaction(specs);

                this.hide();
            }
            else {
                err = "Form Error:\n\n-> Amount entered must be a number";
                alert(err);
            }
        }
    }

    attempt_create_transaction(new_specs){
        console.log("sending new transaction to server");
        let client_action = {
            type: "create_new_transaction",
            specs: {
                session: this.props.session,
                type: new_specs.type,
                amount: new_specs.amount,
                description: new_specs.description,
                time: new_specs.time
            }
        };
        console.log(client_action);
        this.props.socket.emit("client_action", client_action);
    }

    show(){
        this.setState({ showing: "form" });
    }

    hide(){
        let myForm = document.forms["new_transaction_form"];

        myForm.reset();

        this.setState({ showing: "button" });
    }

    render() {
        if (this.state.showing === "button"){
            return (
                <button className="btn btn-primary show_create_transaction_button" onClick={() => this.show()}>New</button>
            );
        }
        else if (this.state.showing === "form"){
            return (
                <div className="container create_transaction_form">
                    <h3>Create New Transaction</h3>
                    <form onSubmit={this.handleSubmit} name="new_transaction_form">
                        <div className="form-group">
                            <h5>Type:</h5>
                            <select value={this.state.type} onChange={this.onTypeChange}>
                                <option selected value="expense">Expense</option>
                                <option value="income">Income</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <h5>Amount:</h5>
                            <input className="form-control" type="number" value={this.state.amount} onChange={this.handleAmount} name="amount_input" />
                        </div>
                        <div className="form-group">
                            <h5>Description</h5>
                            <input className="form-control" type="text" value={this.state.description} onChange={this.handleDescription} name="description_input" />
                        </div>
                        <input className="btn btn-primary" type="submit" value="Create" />
                        <input className="btn btn-default" type="button" value="Cancel" onClick={() => this.hide()} />
                    </form>
                </div>
            );
        }
    }
}

export default CreateTransaction;