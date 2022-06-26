import React, { Component } from 'react';
import UpdateTransaction from './update_transaction.js';

class Transactions extends Component {

    constructor(props){
        super(props);
        this.state = {
            aspect_order: [ "type", "amount", "description", "time" ],
            updating_transaction: false,
            record_to_update: null
        };

        this.cancelUpdate = this.cancelUpdate.bind(this);
        this.deleteTransaction = this.deleteTransaction.bind(this);
    }

    componentDidMount(){
        document.title = "Transactions";
    }

    initiateUpdate(transaction_record){
        this.setState({
            updating_transaction: true,
            record_to_update: transaction_record
        });
    }

    cancelUpdate(){
        this.setState({
            updating_transaction: false,
            record_to_update: null
        });
    }

    deleteTransaction(transaction_id){
        let now = new Date();
        let client_action = {
            type: "delete_transaction",
            specs: {
                session: localStorage.getItem("session"),
                transaction_id: transaction_id,
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
        this.props.socket.emit("client_action", client_action);
        this.cancelUpdate();
    }

    renderAllTransactions() {

        let transactions = [];

        for (let rec of this.props.client.transaction_records){

            let className = "transaction_record " + rec.type;
            
            transactions[transactions.length] = (
                <div className={className} onClick = {() => this.initiateUpdate(rec)} key={"transaction" + transactions.length}>
                    <p className="transaction_amount">$ {rec.amount}</p>
                    <p className="transaction_description">{rec.description}</p>
                    <p className="transaction_date">{rec.time.string}</p>
                </div>
            );
        }

        return transactions;
    }

    renderUpdater(){
        if (this.state.updating_transaction === true){
            return (
                <UpdateTransaction 
                    socket={this.props.socket}
                    session={this.props.client.session}
                    transaction_record={this.state.record_to_update}
                    cancelUpdate={this.cancelUpdate}
                    deleteTransaction={this.deleteTransaction}
                />
            );
        }
        else {
            return (null);
        }   
    }

    render() {
        return (
            <div className="bottom-margin">
                <h3>Transactions</h3>
                {this.renderAllTransactions()}
                <p className="end-of-table">End of Table</p>
                {this.renderUpdater()}
            </div>
        );
    }
}

export default Transactions;