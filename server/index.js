
/*
    heroku-cra-node
*/

const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000;
const app = express();

// Priority serve any static files.
app.use(express.static(path.resolve(__dirname, '../react-ui/build')));

// Answer API requests.
app.get('/api', function (req, res) {
    console.log("Received an API request");
});

// All remaining requests return the React app, so it can handle routing.
app.get('*', function (request, response) {
    console.log(request);
    response.sendFile(path.resolve(__dirname, '../react-ui/build', 'index.html'));
});

/*
    SHA3-512 HASH
*/

const { SHA3 } = require('sha3');
const hash = new SHA3(512);

/*
    MONGODB
*/

const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const mongo_url = "HIDDEN";
let database = null;

MongoClient.connect(mongo_url, function (err, db) {
    if (err) {
        console.log(err);
    }
    else {
        console.log("Connected correctly to MongoDB server.");
        database = db;
    }
});


/*
    SOCKET.IO
*/

const server = app.listen(PORT);
const io = require('socket.io').listen(server);
io.on('connection', (socket) => {
    socket.on("client_action", (action) => {
        if (action) {
            process_action(action).then((process_action_result) => {
                if (process_action_result instanceof Error) {
                    console.log("Error returned from processing action...");
                    console.log(process_action_result);
                }
                else if (
                    process_action_result &&
                    typeof process_action_result === "object" &&
                    Object.hasOwnProperty.call(process_action_result, "emission_name") &&
                    Object.hasOwnProperty.call(process_action_result, "emission_data")
                ) {
                    socket.emit(process_action_result.emission_name, process_action_result.emission_data);
                }
                else {
                    console.log("Something went REALLY wrong during action processing!!");
                }
            },
                (rejection) => {
                    console.log("Process Action REJECTION");
                    console.log(rejection);
                });
        }
    });
});

/*
    MY API
*/

const reg_exp = require("./my_api/regular_expressions");
const acquire_date = require("./my_api/acquire_date");

/*
    EXPENDREC FUNCTIONS
*/

function process_action(action) {
    return new Promise((resolve, reject) => {
        if (
            typeof action === "object" &&
            Array.isArray(action) === false &&
            Object.keys(action).length === 2 &&
            Object.hasOwnProperty.call(action, "type") &&
            Object.hasOwnProperty.call(action, "specs") &&
            typeof action.type === "string" &&
            typeof action.specs === "object"
        ) {

            if (action.type === "create_new_account") {
                create_new_account(action.specs, resolve);
            }
            else if (action.type === "login_account") {
                login_account(action.specs, resolve);
            }
            else if (action.type === "autologin_account") {
                autologin_account(action.specs, resolve);
            }
            else if (action.type === "update_account") {
                update_account(action.specs, resolve);
            }
            else if (action.type === "delete_account") {
                delete_account(action.specs, resolve);
            }
            else if (action.type === "create_new_transaction") {
                create_new_transaction(action.specs, resolve);
            }
            else if (action.type === "view_transactions") {
                view_transactions(action.specs, resolve);
            }
            else if (action.type === "update_transaction") {
                update_transaction(action.specs, resolve);
            }
            else if (action.type === "delete_transaction") {
                delete_transaction(action.specs, resolve);
            }
            else if (action.type === "view_user_actions") {
                view_user_actions(action.specs, resolve);
            }
            else {
                reject(Error("Faulty action type in PROCESS ACTION"));
            }
        }
        else {
            reject(Error("Invalid PROCESS ACTION detected"))
        }
    });
}


function create_new_account(specs, callback) {
    //validate specs
    let props_arr = [
        {
            prop: "firstName",
            type: "string",
            reg_exp: reg_exp.letter_only_names,
            expected_reg_exp_result: false,
            min_accepted_num: null,
            max_accepted_num: null,
            props_arr: null
        },
        {
            prop: "lastName",
            type: "string",
            reg_exp: reg_exp.letter_only_names,
            expected_reg_exp_result: false,
            min_accepted_num: null,
            max_accepted_num: null,
            props_arr: null
        },
        {
            prop: "email",
            type: "string",
            reg_exp: reg_exp.email,
            expected_reg_exp_result: true,
            min_accepted_num: null,
            max_accepted_num: null,
            props_arr: null
        },
        {
            prop: "phone",
            type: "string",
            reg_exp: reg_exp.non_numbers,
            expected_reg_exp_result: false,
            min_accepted_num: null,
            max_accepted_num: null,
            props_arr: null
        },
        {
            prop: "pass",
            type: "string",
            reg_exp: reg_exp.non_word_characters,
            expected_reg_exp_result: false,
            min_accepted_num: null,
            max_accepted_num: null,
            props_arr: null
        },
        {
            prop: "time",
            type: "object",
            reg_exp: null,
            expected_reg_exp_result: null,
            min_accepted_num: null,
            max_accepted_num: null,
            props_arr: [
                {
                    prop: "year",
                    type: "number",
                    reg_exp: null,
                    expected_reg_exp_result: false,
                    min_accepted_num: 2019,
                    max_accepted_num: 2119,
                    props_arr: null
                },
                {
                    prop: "month",
                    type: "number",
                    reg_exp: null,
                    expected_reg_exp_result: false,
                    min_accepted_num: 0,
                    max_accepted_num: 11,
                    props_arr: null
                },
                {
                    prop: "day",
                    type: "number",
                    reg_exp: null,
                    expected_reg_exp_result: false,
                    min_accepted_num: 1,
                    max_accepted_num: 31,
                    props_arr: null
                },
                {
                    prop: "hour",
                    type: "number",
                    reg_exp: null,
                    expected_reg_exp_result: false,
                    min_accepted_num: 0,
                    max_accepted_num: 23,
                    props_arr: null
                },
                {
                    prop: "minute",
                    type: "number",
                    reg_exp: null,
                    expected_reg_exp_result: false,
                    min_accepted_num: 0,
                    max_accepted_num: 59,
                    props_arr: null
                },
                {
                    prop: "second",
                    type: "number",
                    reg_exp: null,
                    expected_reg_exp_result: false,
                    min_accepted_num: 0,
                    max_accepted_num: 59,
                    props_arr: null
                },
                {
                    prop: "millisecond",
                    type: "number",
                    reg_exp: null,
                    expected_reg_exp_result: false,
                    min_accepted_num: 0,
                    max_accepted_num: 999,
                    props_arr: null
                }
            ]
        }
    ];

    if (validate_specs(specs, props_arr)) {

        console.log("Valid spec: create new account");

        //check for existing account
        //create a new user account or reject new account

        let email_reg_exp = new RegExp(specs.email, "i");

        database.collection("transactions").find({
            email: email_reg_exp
        }).toArray((err, result) => {
            if (err) throw err;

            if (result.length > 0) {
                console.log("Attempted to create a duplicate account. Action terminated.");
                return callback({
                    emission_name: "create_new_account",
                    emission_data: {
                        success: false,
                        status: "Account creation failed because a duplicate was found.",
                        client: specs.email
                    }
                });
            }
            else {

                //using client password, create salt and hash
                let hash_stuff = myHashes.create_new(specs.pass);

                //create new account

                let new_user_account = {
                    firstName: specs.firstName,
                    lastName: specs.lastName,
                    email: specs.email,
                    phone: specs.phone,
                    created: acquire_date.import_date(specs.time),
                    transaction_records: [],
                    action_history: [],
                    premium: false,
                    session: null,
                    salt: hash_stuff.salt,
                    hash: hash_stuff.hash
                };

                //record new activity
                new_user_account.action_history.unshift(create_new_activity("Created new user account", specs.time));

                database.collection("transactions").insert(new_user_account).then(() => {

                    //complete account creation

                    console.log("Added new user");
                    return callback({
                        emission_name: "create_new_account",
                        emission_data: {
                            success: true,
                            status: "New account successfully created. You may now login.",
                            client: new_user_account.email
                        }
                    });
                },
                    (error) => {
                        if (error) {
                            console.log(error);
                        }

                        return callback({
                            emission_name: "create_new_account",
                            emission_data: {
                                success: false,
                                status: "Apologies. Something went wrong when attempting to create an account.",
                                client: new_user_account.email
                            }
                        });
                    });
            }
        });
    }
    else {
        console.log("Invalid spec: create_new_account");

        return callback({
            emission_name: "create_new_account",
            emission_data: {
                success: false,
                status: "Account creation failed due to invalid entry.",
                client: new_user_account.email
            }
        });
    }
}

function login_account(specs, callback) {
    //validate specs
    let props_arr = [
        {
            prop: "email",
            type: "string",
            reg_exp: reg_exp.email,
            expected_reg_exp_result: true,
            min_accepted_num: null,
            max_accepted_num: null,
            props_arr: null
        },
        {
            prop: "pass",
            type: "string",
            reg_exp: reg_exp.non_word_characters,
            expected_reg_exp_result: false,
            min_accepted_num: null,
            max_accepted_num: null,
            props_arr: null
        },
        {
            prop: "time",
            type: "object",
            reg_exp: null,
            expected_reg_exp_result: null,
            min_accepted_num: null,
            max_accepted_num: null,
            props_arr: [
                {
                    prop: "year",
                    type: "number",
                    reg_exp: null,
                    expected_reg_exp_result: false,
                    min_accepted_num: 2019,
                    max_accepted_num: 2119,
                    props_arr: null
                },
                {
                    prop: "month",
                    type: "number",
                    reg_exp: null,
                    expected_reg_exp_result: false,
                    min_accepted_num: 0,
                    max_accepted_num: 11,
                    props_arr: null
                },
                {
                    prop: "day",
                    type: "number",
                    reg_exp: null,
                    expected_reg_exp_result: false,
                    min_accepted_num: 1,
                    max_accepted_num: 31,
                    props_arr: null
                },
                {
                    prop: "hour",
                    type: "number",
                    reg_exp: null,
                    expected_reg_exp_result: false,
                    min_accepted_num: 0,
                    max_accepted_num: 23,
                    props_arr: null
                },
                {
                    prop: "minute",
                    type: "number",
                    reg_exp: null,
                    expected_reg_exp_result: false,
                    min_accepted_num: 0,
                    max_accepted_num: 59,
                    props_arr: null
                },
                {
                    prop: "second",
                    type: "number",
                    reg_exp: null,
                    expected_reg_exp_result: false,
                    min_accepted_num: 0,
                    max_accepted_num: 59,
                    props_arr: null
                },
                {
                    prop: "millisecond",
                    type: "number",
                    reg_exp: null,
                    expected_reg_exp_result: false,
                    min_accepted_num: 0,
                    max_accepted_num: 999,
                    props_arr: null
                }
            ]
        }
    ];

    if (validate_specs(specs, props_arr)) {

        database.collection("transactions").find({
            email: specs.email
        }).toArray((err, result) => {
            if (err) throw err;

            if (result.length === 1) {

                //check for correct password upon login
                let correct_password = myHashes.verify(specs.pass, result[0].salt, result[0].hash);

                if (correct_password === true) {

                    console.log("Manual login valid", result[0].email);

                    let new_session = generateHexString(50);

                    let client_version = {
                        id: result[0]._id.toString(),
                        firstName: result[0].firstName,
                        lastName: result[0].lastName,
                        email: result[0].email,
                        phone: result[0].phone,
                        created: result[0].created,
                        transaction_records: get_a_page(1, result[0].transaction_records),
                        action_history: get_a_page(1, result[0].action_history),
                        premium: result[0].premium,
                        session: new_session
                    };

                    //replace session id
                    database.collection("transactions").find({
                        email: specs.email
                    }).forEach((doc) => {
                        //make change
                        doc.session = new_session;
                        //record new activity
                        doc.action_history.unshift(create_new_activity("User logged in manually", specs.time));
                        client_version.action_history.unshift(create_new_activity("User logged in manually", specs.time));
                        //save changes
                        database.collection("transactions").save(doc).then(() => {
                            return callback({
                                emission_name: "login_account",
                                emission_data: {
                                    success: true,
                                    status: "User login successful",
                                    client: client_version
                                }
                            });
                        });
                    });
                }
                else if (correct_password === false) {
                    return callback({
                        emission_name: "login_account",
                        emission_data: {
                            success: false,
                            status: "Wrong Password",
                            client: null
                        }
                    });
                }
            }
            else if (result.length > 1) {
                return callback({
                    emission_name: "login_account",
                    emission_data: {
                        success: false,
                        status: "Multiple accounts by those credentials",
                        client: null
                    }
                });
            }
            else if (result.length === 0) {
                return callback({
                    emission_name: "login_account",
                    emission_data: {
                        success: false,
                        status: "No account by those credentials",
                        client: null
                    }
                });
            }
        });
    }
    else {
        console.log("Invalid specs: login_account")
    }
}

function autologin_account(specs, callback) {
    //validate specs
    let props_arr = [
        {
            prop: "session",
            type: "string",
            reg_exp: reg_exp.non_word_characters,
            expected_reg_exp_result: false,
            min_accepted_num: null,
            max_accepted_num: null,
            props_arr: null
        },
        {
            prop: "time",
            type: "object",
            reg_exp: null,
            expected_reg_exp_result: null,
            min_accepted_num: null,
            max_accepted_num: null,
            props_arr: [
                {
                    prop: "year",
                    type: "number",
                    reg_exp: null,
                    expected_reg_exp_result: false,
                    min_accepted_num: 2019,
                    max_accepted_num: 2119,
                    props_arr: null
                },
                {
                    prop: "month",
                    type: "number",
                    reg_exp: null,
                    expected_reg_exp_result: false,
                    min_accepted_num: 0,
                    max_accepted_num: 11,
                    props_arr: null
                },
                {
                    prop: "day",
                    type: "number",
                    reg_exp: null,
                    expected_reg_exp_result: false,
                    min_accepted_num: 1,
                    max_accepted_num: 31,
                    props_arr: null
                },
                {
                    prop: "hour",
                    type: "number",
                    reg_exp: null,
                    expected_reg_exp_result: false,
                    min_accepted_num: 0,
                    max_accepted_num: 23,
                    props_arr: null
                },
                {
                    prop: "minute",
                    type: "number",
                    reg_exp: null,
                    expected_reg_exp_result: false,
                    min_accepted_num: 0,
                    max_accepted_num: 59,
                    props_arr: null
                },
                {
                    prop: "second",
                    type: "number",
                    reg_exp: null,
                    expected_reg_exp_result: false,
                    min_accepted_num: 0,
                    max_accepted_num: 59,
                    props_arr: null
                },
                {
                    prop: "millisecond",
                    type: "number",
                    reg_exp: null,
                    expected_reg_exp_result: false,
                    min_accepted_num: 0,
                    max_accepted_num: 999,
                    props_arr: null
                }
            ]
        }
    ];

    if (validate_specs(specs, props_arr)) {
        database.collection("transactions").find({
            session: specs.session
        }).toArray((err, result) => {

            if (err) {
                throw err;
            };

            if (result.length === 1) {
                console.log("Autologin valid", result[0].email);

                let new_session = generateHexString(50);

                let client_version = {
                    id: result[0]._id.toString(),
                    firstName: result[0].firstName,
                    lastName: result[0].lastName,
                    email: result[0].email,
                    phone: result[0].phone,
                    created: result[0].created,
                    transaction_records: get_a_page(1, result[0].transaction_records),
                    action_history: get_a_page(1, result[0].action_history),
                    premium: result[0].premium,
                    session: new_session
                };

                //replace session id
                database.collection("transactions").find({
                    session: specs.session
                }).forEach((doc) => {
                    //make change
                    doc.session = new_session;
                    //record new activity
                    doc.action_history.unshift(create_new_activity("User autologged in", specs.time));
                    client_version.action_history.unshift(create_new_activity("User autologged in", specs.time));
                    //save changes
                    database.collection("transactions").save(doc).then(() => {
                        return callback({
                            emission_name: "autologin_account",
                            emission_data: {
                                success: true,
                                status: "User autologin successful",
                                client: client_version
                            }
                        });
                    });
                });
            }
            else if (result.length > 1) {
                console.log("More than 1 user found to be using this session id..... !!!!!!");
                return callback({
                    emission_name: "autologin_account",
                    emission_data: {
                        success: false,
                        status: "More than 1 user found to be using this session id",
                        client: null
                    }
                });
            }
            else if (result.length === 0) {
                return callback({
                    emission_name: "autologin_account",
                    emission_data: {
                        success: false,
                        status: "Couldn't find record by that session id",
                        client: null
                    }
                });
            }
        });
    }
    else {
        console.log("Invalid specs: autologin_account");
        return callback({
            emission_name: "autologin_account",
            emission_data: {
                success: false,
                status: "Invalid autologin specs",
                client: null
            }
        });
    }
}

function update_account(specs, callback) {
    return callback({
        emission_name: "update_account",
        emission_data: {
            success: false,
            status: "User account update functionality unavailable yet",
            client: null
        }
    });
}

function delete_account(specs, callback) {

    let props_arr = [
        {
            prop: "session",
            type: "string",
            reg_exp: reg_exp.non_word_characters,
            expected_reg_exp_result: false,
            min_accepted_num: null,
            max_accepted_num: null,
            props_arr: null
        },
        {
            prop: "email",
            type: "string",
            reg_exp: reg_exp.email,
            expected_reg_exp_result: true,
            min_accepted_num: null,
            max_accepted_num: null,
            props_arr: null
        },
        {
            prop: "id",
            type: "string",
            reg_exp: reg_exp.non_word_characters,
            expected_reg_exp_result: false,
            min_accepted_num: null,
            max_accepted_num: null,
            props_arr: null
        }
    ];

    if (validate_specs(specs, props_arr)) {
        database.collection("transactions").remove({
            _id: ObjectId(specs.id),
            session: specs.session,
            email: specs.email
        }).then(() => {
            //promise success
            console.log("User account was deleted", specs.email);
            return callback({
                emission_name: "delete_account",
                emission_data: {
                    success: true,
                    status: "User account deleted",
                    client: null
                }
            });
        }, () => {
            //promise rejected
            console.log("User account was deletion promise rejected");
            return callback({
                emission_name: "delete_account",
                emission_data: {
                    success: false,
                    status: "User account deletion attempt failed",
                    client: null
                }
            });
        });
    }
    else {
        console.log("Invalid action at account deletion");
        return callback({
            emission_name: "delete_account",
            emission_data: {
                success: false,
                status: "User account deletion attempt failed",
                client: null
            }
        });
    }
}

function create_new_transaction(specs, callback) {

    console.log("Create_New_Transaction received");
    console.log(specs);

    //validate specs
    let props_arr = [
        {
            prop: "session",
            type: "string",
            reg_exp: reg_exp.non_word_characters,
            expected_reg_exp_result: false,
            min_accepted_num: null,
            max_accepted_num: null,
            props_arr: null
        },
        {
            prop: "type",
            type: "string",
            reg_exp: reg_exp.dangerous_symbols,
            expected_reg_exp_result: false,
            min_accepted_num: null,
            max_accepted_num: null,
            props_arr: null
        },
        {
            prop: "amount",
            type: "number",
            reg_exp: null,
            expected_reg_exp_result: null,
            min_accepted_num: 0.01,
            max_accepted_num: Infinity,
            props_arr: null
        },
        {
            prop: "description",
            type: "string",
            reg_exp: reg_exp.dangerous_symbols,
            expected_reg_exp_result: false,
            min_accepted_num: null,
            max_accepted_num: null,
            props_arr: null
        },
        {
            prop: "time",
            type: "object",
            reg_exp: null,
            expected_reg_exp_result: null,
            min_accepted_num: null,
            max_accepted_num: null,
            props_arr: [
                {
                    prop: "year",
                    type: "number",
                    reg_exp: null,
                    expected_reg_exp_result: false,
                    min_accepted_num: 2019,
                    max_accepted_num: 2119,
                    props_arr: null
                },
                {
                    prop: "month",
                    type: "number",
                    reg_exp: null,
                    expected_reg_exp_result: false,
                    min_accepted_num: 0,
                    max_accepted_num: 11,
                    props_arr: null
                },
                {
                    prop: "day",
                    type: "number",
                    reg_exp: null,
                    expected_reg_exp_result: false,
                    min_accepted_num: 1,
                    max_accepted_num: 31,
                    props_arr: null
                },
                {
                    prop: "hour",
                    type: "number",
                    reg_exp: null,
                    expected_reg_exp_result: false,
                    min_accepted_num: 0,
                    max_accepted_num: 23,
                    props_arr: null
                },
                {
                    prop: "minute",
                    type: "number",
                    reg_exp: null,
                    expected_reg_exp_result: false,
                    min_accepted_num: 0,
                    max_accepted_num: 59,
                    props_arr: null
                },
                {
                    prop: "second",
                    type: "number",
                    reg_exp: null,
                    expected_reg_exp_result: false,
                    min_accepted_num: 0,
                    max_accepted_num: 59,
                    props_arr: null
                },
                {
                    prop: "millisecond",
                    type: "number",
                    reg_exp: null,
                    expected_reg_exp_result: false,
                    min_accepted_num: 0,
                    max_accepted_num: 999,
                    props_arr: null
                }
            ]
        }
    ];

    if (validate_specs(specs, props_arr)) {

        //add new transaction

        let new_transaction = {
            id: generateHexString(50),
            type: specs.type,
            amount: specs.amount,
            description: specs.description,
            time: acquire_date.import_date(specs.time)
        };

        console.log("Creating new transaction record");
        console.log(new_transaction);

        //create new transaction record
        //and record new activity
        database.collection("transactions").find({
            session: specs.session
        }).forEach((doc) => {
            //create new transaction
            doc.transaction_records.unshift(new_transaction);
            //record new activity
            doc.action_history.unshift(create_new_activity("Added new transaction", specs.time));

            database.collection("transactions").save(doc).then(() => {
                console.log("Saved new transaction record", doc.email);
                return callback({
                    emission_name: "create_new_transaction",
                    emission_data: {
                        success: true,
                        status: "Added new transaction",
                        client: new_transaction
                    }
                });
            });
        });
    }
    else {
        console.log("Invalid specs: create_new_transaction");
        return callback({
            emission_name: "create_new_transaction",
            emission_data: {
                success: false,
                status: "Failed to add new transaction",
                client: null
            }
        });
    }
}

function view_transactions(specs, callback) {
    //validate specs
    let props_arr = [
        {
            prop: "session",
            type: "string",
            reg_exp: reg_exp.non_word_characters,
            expected_reg_exp_result: false,
            min_accepted_num: null,
            max_accepted_num: null,
            props_arr: null
        },
        {
            prop: "page_number",
            type: "number",
            reg_exp: null,
            expected_reg_exp_result: null,
            min_accepted_num: 1,
            max_accepted_num: 999,
            props_arr: null
        }
    ];

    if (validate_specs(specs, props_arr)) {
        database.collection("transactions").find({
            session: specs.session
        }).forEach((doc) => {
            let requested_data = get_a_page(specs.page_number, doc.transaction_records);

            return callback({
                emission_name: "view_transactions",
                emission_data: {
                    success: true,
                    status: "Successfully retrieved page " + specs.page_number + " of data",
                    client: requested_data
                }
            });
        });
    }
}

function update_transaction(specs, callback) {
    //validate specs
    let props_arr = [
        {
            prop: "session",
            type: "string",
            reg_exp: reg_exp.non_word_characters,
            expected_reg_exp_result: false,
            min_accepted_num: null,
            max_accepted_num: null,
            props_arr: null
        },
        {
            prop: "outdated_transaction_id",
            type: "string",
            reg_exp: reg_exp.non_word_characters,
            expected_reg_exp_result: false,
            min_accepted_num: null,
            max_accepted_num: null,
            props_arr: null
        },
        {
            prop: "time",
            type: "object",
            reg_exp: null,
            expected_reg_exp_result: null,
            min_accepted_num: null,
            max_accepted_num: null,
            props_arr: [
                {
                    prop: "year",
                    type: "number",
                    reg_exp: null,
                    expected_reg_exp_result: false,
                    min_accepted_num: 2019,
                    max_accepted_num: 2119,
                    props_arr: null
                },
                {
                    prop: "month",
                    type: "number",
                    reg_exp: null,
                    expected_reg_exp_result: false,
                    min_accepted_num: 0,
                    max_accepted_num: 11,
                    props_arr: null
                },
                {
                    prop: "day",
                    type: "number",
                    reg_exp: null,
                    expected_reg_exp_result: false,
                    min_accepted_num: 1,
                    max_accepted_num: 31,
                    props_arr: null
                },
                {
                    prop: "hour",
                    type: "number",
                    reg_exp: null,
                    expected_reg_exp_result: false,
                    min_accepted_num: 0,
                    max_accepted_num: 23,
                    props_arr: null
                },
                {
                    prop: "minute",
                    type: "number",
                    reg_exp: null,
                    expected_reg_exp_result: false,
                    min_accepted_num: 0,
                    max_accepted_num: 59,
                    props_arr: null
                },
                {
                    prop: "second",
                    type: "number",
                    reg_exp: null,
                    expected_reg_exp_result: false,
                    min_accepted_num: 0,
                    max_accepted_num: 59,
                    props_arr: null
                },
                {
                    prop: "millisecond",
                    type: "number",
                    reg_exp: null,
                    expected_reg_exp_result: false,
                    min_accepted_num: 0,
                    max_accepted_num: 999,
                    props_arr: null
                }
            ]
        },
        {
            prop: "updated_transaction",
            type: "object",
            reg_exp: null,
            expected_reg_exp_result: null,
            min_accepted_num: null,
            max_accepted_num: null,
            props_arr: [
                {
                    prop: "amount",
                    type: "number",
                    reg_exp: null,
                    expected_reg_exp_result: null,
                    min_accepted_num: 0.01,
                    max_accepted_num: Infinity,
                    props_arr: null
                },
                {
                    prop: "description",
                    type: "string",
                    reg_exp: reg_exp.dangerous_symbols,
                    expected_reg_exp_result: false,
                    min_accepted_num: null,
                    max_accepted_num: null,
                    props_arr: null
                },
                {
                    prop: "type",
                    type: "string",
                    reg_exp: reg_exp.dangerous_symbols,
                    expected_reg_exp_result: false,
                    min_accepted_num: null,
                    max_accepted_num: null,
                    props_arr: null
                }
            ]
        }
    ];

    if (validate_specs(specs, props_arr)) {

        //make a change to a single transaction object in the transaction array
        let found = false;

        database.collection("transactions").find({
            session: specs.session
        }).forEach((doc) => {
            let index = 0;

            while (found === false && index < doc.transaction_records.length) {
                if (doc.transaction_records[index].id === specs.outdated_transaction_id) {
                    //update transaction
                    doc.transaction_records[index].amount = specs.updated_transaction.amount;
                    doc.transaction_records[index].description = specs.updated_transaction.description;
                    doc.transaction_records[index].type = specs.updated_transaction.type;
                    found = true;

                    //record new activity
                    doc.action_history.unshift(create_new_activity("Modified existing transaction", specs.time));

                    //save changes
                    database.collection("transactions").save(doc).then(() => {
                        return callback({
                            emission_name: "update_transaction",
                            emission_data: {
                                success: true,
                                status: "Updated transaction",
                                client: {
                                    id: specs.outdated_transaction_id,
                                    type: specs.updated_transaction.type,
                                    amount: specs.updated_transaction.amount,
                                    description: specs.updated_transaction.description,
                                    time: doc.transaction_records[index].time
                                }
                            }
                        });
                    });
                }
                index++;
            }

            if (found === false) {
                return callback({
                    emission_name: "update_transaction",
                    emission_data: {
                        success: false,
                        status: "Failed to update transaction",
                        client: null
                    }
                });
            }
        });
    }
}

function delete_transaction(specs, callback) {
    //validate specs
    let props_arr = [
        {
            prop: "session",
            type: "string",
            reg_exp: reg_exp.non_word_characters,
            expected_reg_exp_result: false,
            min_accepted_num: null,
            max_accepted_num: null,
            props_arr: null
        },
        {
            prop: "transaction_id",
            type: "string",
            reg_exp: reg_exp.non_word_characters,
            expected_reg_exp_result: false,
            min_accepted_num: null,
            max_accepted_num: null,
            props_arr: null
        },
        {
            prop: "time",
            type: "object",
            reg_exp: null,
            expected_reg_exp_result: null,
            min_accepted_num: null,
            max_accepted_num: null,
            props_arr: [
                {
                    prop: "year",
                    type: "number",
                    reg_exp: null,
                    expected_reg_exp_result: false,
                    min_accepted_num: 2019,
                    max_accepted_num: 2119,
                    props_arr: null
                },
                {
                    prop: "month",
                    type: "number",
                    reg_exp: null,
                    expected_reg_exp_result: false,
                    min_accepted_num: 0,
                    max_accepted_num: 11,
                    props_arr: null
                },
                {
                    prop: "day",
                    type: "number",
                    reg_exp: null,
                    expected_reg_exp_result: false,
                    min_accepted_num: 1,
                    max_accepted_num: 31,
                    props_arr: null
                },
                {
                    prop: "hour",
                    type: "number",
                    reg_exp: null,
                    expected_reg_exp_result: false,
                    min_accepted_num: 0,
                    max_accepted_num: 23,
                    props_arr: null
                },
                {
                    prop: "minute",
                    type: "number",
                    reg_exp: null,
                    expected_reg_exp_result: false,
                    min_accepted_num: 0,
                    max_accepted_num: 59,
                    props_arr: null
                },
                {
                    prop: "second",
                    type: "number",
                    reg_exp: null,
                    expected_reg_exp_result: false,
                    min_accepted_num: 0,
                    max_accepted_num: 59,
                    props_arr: null
                },
                {
                    prop: "millisecond",
                    type: "number",
                    reg_exp: null,
                    expected_reg_exp_result: false,
                    min_accepted_num: 0,
                    max_accepted_num: 999,
                    props_arr: null
                }
            ]
        }
    ];

    if (validate_specs(specs, props_arr)) {

        //delete a single transaction object in the transaction array

        console.log("Deleting a transaction");

        database.collection("transactions").find({
            session: specs.session
        }).forEach((doc) => {
            let found = false;
            let index = 0;

            while (found === false && index < doc.transaction_records.length) {
                if (doc.transaction_records[index].id === specs.transaction_id) {
                    doc.transaction_records.splice(index, 1);
                    found = true;

                    //record new activity
                    doc.action_history.unshift(create_new_activity("Deleted transaction", specs.time));

                    //save changes
                    database.collection("transactions").save(doc).then(() => {
                        return callback({
                            emission_name: "delete_transaction",
                            emission_data: {
                                success: true,
                                status: "Deleted transaction",
                                client: {
                                    transaction_id: specs.transaction_id
                                }
                            }
                        });
                    });
                }
                index++;
            }

            if (found === false) {
                return callback({
                    emission_name: "delete_transaction",
                    emission_data: {
                        success: false,
                        status: "Failed to delete transaction",
                        client: null
                    }
                });
            }
        });
    }
}

function view_user_actions(specs, callback) {
    //validate specs
    let props_arr = [
        {
            prop: "session",
            type: "string",
            reg_exp: reg_exp.non_word_characters,
            expected_reg_exp_result: false,
            min_accepted_num: null,
            max_accepted_num: null,
            props_arr: null
        },
        {
            prop: "page_number",
            type: "number",
            reg_exp: null,
            expected_reg_exp_result: null,
            min_accepted_num: 1,
            max_accepted_num: 999,
            props_arr: null
        }
    ];

    if (validate_specs(specs, props_arr)) {
        database.collection("transactions").find({
            session: specs.session
        }).forEach((doc) => {
            let requested_data = get_a_page(specs.page_number, doc.action_history);

            return callback({
                emission_name: "view_user_actions",
                emission_data: {
                    success: true,
                    status: "Successfully retrieved page " + specs.page_number + " of actions",
                    client: requested_data
                }
            });
        });
    }
    else {
        return callback({
            emission_name: "view_user_actions",
            emission_data: {
                success: false,
                status: "Failed to retrieved page " + specs.page_number + " of actions",
                client: null
            }
        });
    }
}

//lord please do not hack me
function validate_specs(specs, props_arr) {

    console.log("Validating object");

    let verdict = false;

    //check for correct amount of properties
    if (Object.keys(specs).length === props_arr.length) {

        verdict = true;

        //check for correct properties
        for (let i of props_arr) {
            if (Object.hasOwnProperty.call(specs, i.prop) && typeof specs[i.prop] === i.type) {

                //check for valid values
                if (specs[i.prop] === null || specs[i.prop] === undefined) {
                    verdict = false;
                    break;
                }
                else if (typeof specs[i.prop] === "string") {
                    if ((i.expected_reg_exp_result === false && i.reg_exp.test(specs[i.prop]) === false) ||
                        (i.expected_reg_exp_result === true && i.reg_exp.test(specs[i.prop]) === true)) {
                        verdict = true;
                    }
                }
                else if (typeof specs[i.prop] === "number") {
                    if (i.min_accepted_num <= specs[i.prop] && i.max_accepted_num >= specs[i.prop]) {
                        verdict = true;
                    }
                    else {
                        verdict = false;
                        break;
                    }
                }
                else if (typeof specs[i.prop] === "boolean") {
                    verdict = true;
                }
                else if (typeof specs[i.prop] === "object") {
                    console.log("Validating inner object...");
                    verdict = validate_specs(specs[i.prop], i.props_arr);

                    if (verdict === false) {
                        break;
                    }
                }
            }
            else {
                verdict = false;
                break;
            }
        }
    }
    else {
        console.log("Property lengths don't match in validation");
    }

    if (verdict === true) {
        console.log("Validated");
    }

    return verdict;
}

//take an array (probably transaction_records), get the next (up to) 100 records available
function get_a_page(page, arr) {
    if (Array.isArray(arr)) {

        let first_waypoint = (page - 1) * 100;
        let second_waypoint = page * 100;
        let page_of_data = [];

        for (let i = first_waypoint; i < second_waypoint; i++) {
            if (arr[i]) {
                page_of_data.push(arr[i]);
            }
            else {
                break;
            }
        }

        return page_of_data;
    }
    else {
        console.log("Couldn't get a page because arr is not array");
        return null;
    }
}

//create new user activity record
function create_new_activity(descript, time) {
    let new_activity = {
        id: generateHexString(50),
        description: descript,
        time: acquire_date.import_date(time)
    };

    return new_activity;
}

//straight from stackoverflow
function generateHexString(length) {
    var ret = "";
    while (ret.length < length) {
        ret += Math.random().toString(16).substring(2);
    }
    return ret.substring(0, length);
}

//my hash functions
const myHashes = {
    create_new: function (pass) {
        hash.reset();
        let salt = generateHexString(50);
        let salted = pass + salt;
        hash.update(salted);
        let digested = hash.digest("hex");

        let result = {
            salt: salt,
            hash: digested
        };

        return result;
    },
    verify: function (attempted_pass, salt, correct_hash) {
        hash.reset();
        let salted = attempted_pass + salt;
        hash.update(salted);
        let attempted_digested = hash.digest("hex");

        if (attempted_digested === correct_hash) {
            return true;
        }
        else {
            return false;
        }
    }
}