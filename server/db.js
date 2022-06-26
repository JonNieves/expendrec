console.log("my db script starting");

/*
    MY API
*/

const acquire_date = require("./MY_API/acquire_date");

/*
    SHA3-512 HASH
*/

const { SHA3 } = require('sha3');
const hash = new SHA3(512);

/*
    MONGODB
*/

const MongoClient = require('mongodb').MongoClient;
const mongo_URLs = {
    old: "HIDDEN",
    new: "HIDDEN"
};

/*
    RANDOM STUFF I WANNA DO
*/
MongoClient.connect(mongo_URLs.new, function(err, db) {
	if (err){
		console.log(err);
	}
	else {
        console.log("Connected correctly to MongoDB server.");
        //function here
        change_my_password(db);
	}
});

/*
    FUNCTIONS
*/

function change_my_password(db){
    let new_password = "newpassword";

    db.collection("transactions").find({
        email: "jon.m.nieves@gmail.com"
    }).forEach((doc) => {

        //make changes
        hash.reset();

        let salted_password = new_password + doc.salt;
        console.log("salted_password:", salted_password);
        hash.update(salted_password);
        let new_salted_password_hash = hash.digest('hex');
        console.log("Old hash:", doc.hash)
        console.log("New hash:", new_salted_password_hash);

        doc.hash = new_salted_password_hash;

        console.log("doc.hash =", doc.hash);

        //save changes
        db.collection("transactions").save(doc).then(() => {
            console.log("Changes saved");
            process.exit();
        });
    });
}

function delete_stupid_plaintext_passwords(db){
    db.collection("transactions").find({}).forEach((doc) => {
        //make changes
        delete doc.pass;

        //save changes
        db.collection("transactions").save(doc).then(() => {
            console.log("Changes saved");
        });
    })
}

function verify_correct_password_with_salt(db){
    let attempted_password = "password";

    db.collection("transactions").find({
        email: "jon.m.nieves@gmail.com"
    }).forEach((doc) => {
        hash.reset();

        let salted_password = attempted_password + doc.salt;
        console.log("salted_password:", salted_password);
        hash.update(salted_password);
        let attempted_salted_password_hash = hash.digest('hex');
        console.log("Attempt:", attempted_salted_password_hash);
        console.log("Correct:", doc.hash);

        if (attempted_salted_password_hash === doc.hash){
            console.log("Successful");
        }
        else {
            console.log("Unsuccessful");
        }

        process.exit();
    });
}

function use_SHA3_to_salt_passwords(db){
    db.collection("transactions").find({}).forEach((doc) => {
        hash.reset();
        //make change
        let salt = generateHexString(24);
        let salted_password = doc.pass + salt;
        console.log("salted_password:", salted_password);
        hash.update(salted_password);
        let digested_hashed_salted_password = hash.digest('hex');
        console.log(digested_hashed_salted_password);
        console.log("typeof:", typeof digested_hashed_salted_password);

        doc.hash = digested_hashed_salted_password;
        doc.salt = salt;

        //save changes
        db.collection("transactions").save(doc).then(() => {
            console.log("Changes saved");
        });
    });
}

function add_type_prop_to_all_transaction_records(db){
    db.collection("transactions").find({}).forEach((doc) => {
        //make change
        doc.transaction_records.forEach((rec) => {
            rec.type = "expense";
        });
        //save changes
        db.collection("transactions").save(doc).then(() => {
            console.log("Changes saved");
            //kill on first record saved
            process.exit();
        });
    });
}

function reverse_an_array(db){
    db.collection("transactions").find({}).forEach((doc) => {
        //make change
        doc.transaction_records.reverse();
        //save changes
        db.collection("transactions").save(doc).then(() => {
            console.log("Array reversed");
        });
    });
}

function change_prop_name_of_objects_in_array(db){
    db.collection("transactions").find({}).forEach((doc) => {
        //make change
        doc.transaction_records.forEach((rec) => {
            let temp_time = rec.time;
            temp_time.hours = temp_time.Hours;
            delete temp_time.Hours;
            rec.time = temp_time;
        });
        //save changes
        db.collection("transactions").save(doc).then(() => {
            console.log("Changes saved");
        });
    });
}

function delete_action_history(db){
    db.collection("transactions").find({
        email: "jon.m.nieves@gmail.com"
    }).forEach((doc) => {
        //make change
        doc.action_history = [];
        //save changes
        db.collection("transactions").save(doc).then(() => {
            console.log("Changes saved");
            process.exit();
        });
    });
}

function add_getTime_prop_to_my_date_objects(db){
    db.collection("transactions").find({}).forEach((doc) => {
        //make change
        doc.transaction_records.forEach((rec) => {
            rec.when.time_since_1970 = rec.when.original_date_object.getTime();
            console.log("change made...");
        });
        //save changes
        db.collection("transactions").save(doc).then(() => {
            console.log("Changes saved");
        });
    });
}

function add_default_date_prop_to_my_date_objects(db){
    db.collection("transactions").find({}).forEach((doc) => {
        //make change
        doc.transaction_records.forEach((rec) => {
            let default_date_object = new Date(rec.when.Year, rec.when.Month, rec.when.Day, rec.when.Hours, rec.when.Minutes, 0, 0);
            rec.when.original_date_object = default_date_object;
            console.log("change made...");
        });
        //save changes
        db.collection("transactions").save(doc).then(() => {
            console.log("Changes saved");
        });
    });
}

function view_objects_in_array(db){
    db.collection("transactions").find({}).forEach((doc) => {
        //make change
        doc.transaction_records.forEach((rec) => {
            console.log(rec);            
        });
        //save changes
        db.collection("transactions").save(doc).then(() => {
            console.log("Changes saved");
        });
    });
}

//1/6/2019 2:18PM - OMG CHANGES TO WHOLE ARRAYS OF OBJECTS WOO
function changes_to_objects_in_array(db){
    db.collection("transactions").find({}).forEach((doc) => {
        //make change
        doc.transaction_records.forEach((rec) => {

            if (rec._id){
                delete rec._id;
            }

            let temp_amount = rec.Amount;
            delete rec.Amount;
            rec.amount = temp_amount;

            let temp_description = rec.Description;
            delete rec.Description;
            rec.description = temp_description;

            let temp_when = rec.When;
            delete rec.When;
            rec.when = temp_when;

            rec.id = generateHexString(26);
        });
        //save changes
        db.collection("transactions").save(doc).then(() => {
            console.log("Changes saved");
        });
    });
}


//1/6/2018 6:26pm
function added_creation_dates_and_premium_prop_and_renamed_a_field(db){
    db.collection("transactions").updateMany(
        {},
        {
            $set: {
                created: acquire_date.get(),
                action_history: [],
                premium: false
            }
        } 
    ).then(() => {
        console.log("Done updating created dates");

        db.collection("transactions").updateMany(
            {}, 
            {
                $rename: { 
                    'records': 'transaction_records' 
                }
            }
        ).then(() => {
            console.log("Done renaming fields");
            process.exit();
        });
        
    });
}

//straight from stackoverflow
function generateHexString(length) {
    var ret = "";
    while (ret.length < length) {
        ret += Math.random().toString(16).substring(2);
    }
    return ret.substring(0,length);
}