import React, { Component } from 'react';

class UpdateTransaction extends Component {

    constructor(props){
        super(props);

        this.state = {
            session: this.props.session,
            type : this.props.transaction_record.type,
            amount : this.props.transaction_record.amount,
            description : this.props.transaction_record.description,
            id : this.props.transaction_record.id
        };

        this.handleAmount = this.handleAmount.bind(this);
        this.handleDescription = this.handleDescription.bind(this);
        this.onTypeChange = this.onTypeChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount(){
        document.title = "Update Transaction";
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

        let myForm = document.forms["update_transaction_form"];
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
                    session: this.props.session,
                    outdated_transaction_id: this.state.id,
                    updated_transaction: {
                        type: this.state.type,
                        amount: num,
                        description: this.state.description
                    },
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
    
                this.attempt_update_transaction(specs);

                this.props.cancelUpdate();
            }
            else {
                err = "Form Error:\n\n-> Amount entered must be a number";
                alert(err);
            }
        }
    }

    attempt_update_transaction(new_specs){
        console.log("sending updated transaction to server");
        let client_action = {
            type: "update_transaction",
            specs: new_specs
        };
        this.props.socket.emit("client_action", client_action);
    }

    renderTypes(){
        if (this.props.transaction_record.type === "expense"){
            return (
                <select value={this.state.type} onChange={this.onTypeChange}>
                    <option selected value="Expense">Expense</option>
                    <option value="Income">Income</option>
                </select>
            );
        }
        else if (this.props.transaction_record.type === "income"){
            return (
                <select value={this.state.type} onChange={this.onTypeChange}>
                    <option value="Expense">Expense</option>
                    <option selected value="Income">Income</option>
                </select>
            );
        }
    }

    render() {
        return (
            <div className="container update_transaction_form">
                <h3>Update Transaction</h3>
                <form onSubmit={this.handleSubmit} name="update_transaction_form">
                    <div className="form-group">
                        <h5>Type:</h5>
                        {this.renderTypes()}
                    </div>
                    <div className="form-group">
                        <h5>Amount:</h5>
                        <input className="form-control" type="number" value={this.state.amount} onChange={this.handleAmount} name="amount_input" />
                    </div>
                    <div className="form-group">
                        <h5>Description</h5>
                        <input className="form-control" type="text" value={this.state.description} onChange={this.handleDescription} name="description_input" />
                    </div>
                    <input className="btn btn-primary" type="submit" value="Update" />
                    <input className="btn btn-default" type="button" value="Cancel" onClick={() => this.props.cancelUpdate()} />
                    <input className="btn btn-danger" type="button" value="Delete" onClick={() => this.props.deleteTransaction(this.props.transaction_record.id)} />
                </form>
            </div>
        );
    }
}

export default UpdateTransaction;