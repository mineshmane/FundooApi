const mongoose = require('mongoose');
const byCrypt = require('bcrypt');
var jwt = require('jsonwebtoken');


const config = require('../../config/config');
const TableSchema = new mongoose.Schema({
    'firstName': {
        type: String,
        required: [true, 'FirstName is required']
    },
    'lastName': {
        type: String,
        required: [true, 'lastName is required']
    },
    'email': {
        type: String,
        required: true,
        unique: true
    },
    'mobile': {
        type: String,
        required: [true, 'Password Required']
    },
    'address': {
        type: String,

    },
    'zip': {
        type: String
    }

}, {
    'timestamps': true
});
let userInfo = mongoose.model('userInfo', TableSchema);

class UserInfo {
    constructor() {

    }
    addXlData(req) {
        console.log(" req ****** ", req);
        let count = 0;

        return new Promise((resolve, reject) => {
            // req.save().then((data) => {
            //     resolve(data)
            // }).catch((err) => {
            //     reject(err)
            // })
            console.log("%$%$%$%$54", req.length);

            // for (let i in req) {
            //     console.log(req[i]);
            //     console.log("price per kg:" + req[i].firstname + "kg");
            //     console.log("Total quantity:" + req[i].address);
            //     console.log('Total price for ' + req[i].lastname );
            //     console.log("Total quantity:" + req[i].mobile);
            //     console.log("Total quantity:" + req[i].zip);


            //     console.log("");
            //   }

            for (let i in req) {
                count++
                let newUser = new userInfo({
                    firstName: req[i].firstname,
                    lastName: req[i].lastname,
                    email: req[i].email,
                    mobile: req[i].mobile,
                    address: req[i].address,
                    zip: req[i].zip
                })
                // }
                console.log(" nrew user created ", newUser);

                newUser.save().then((data) => {
                    console.log(" err not found ", data);
                    console.log(" err not found ", count);

                    resolve({ result: ' data added succesfully ', counter: count });
                }).catch((err) => {
                    console.log(" err in model ", err);

                    reject(err)
                })
            }

            // let newUser = new userInfo({
            //     firstName: req[0].firstname,
            //     lastName: req[0].lastname,
            //     email: req[0].email,
            //     mobile: req[0].mobile,
            //     address: req[0].address,
            //     zip: req[0].zip
            // })


            //        newUser.save().then((data) => {
            //     console.log(" err not found ", data);

            //     resolve(data);
            // }).catch((err) => {
            //     console.log(" err in model ", err);

            //     reject(err)
            // })
            // console.log(" nrew user created ", newUser);

        })
    }


    getUserDataToFile() {
        return new Promise((resolve, reject) => {
            userInfo.find().then((data) => {
                resolve(data);
            }).catch((err) => {
                reject(err)
            })
        })

    }

}
module.exports = { UserInfo }
