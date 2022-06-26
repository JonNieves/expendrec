import React, { Component } from 'react';

class ActionHistory extends Component {

    constructor(props){
        super(props);
        this.state = {};
    }

    componentDidMount(){
        document.title = "Account History";
    }

    renderActionHistory() {

        let action_history = [];

        for (let rec of this.props.action_history){
            action_history[action_history.length] = (
                <tr>
                    <td>{rec.description}</td>
                    <td>{rec.time.string}</td>
                </tr>
            );
        }

        return action_history;
    }

    render() {
        return (
            <div className="bottom-margin">
                <h3>Account Action History</h3>
                <div className="max-height-400">
                    <div className="table-responsive">
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th>Description</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.renderActionHistory()}
                                <tr>
                                    <td className="end-of-table" colspan="2">End of Table</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}

export default ActionHistory;