const mongoose = require('mongoose');
const byCrypt = require('bcrypt');
var jwt = require('jsonwebtoken');


const config = require('../../config/config');
const userSchema = new mongoose.Schema({
    'firstName': {
        type: String,
        required: [true, 'FirstName is required']
    },
    'lastName': {
        type: String,
        required: [true, 'LastName is required']
    },
    'email': {
        type: String,
        required: [true, 'Email Required']
    },
    'password': {
        type: String,
        required: [true, 'Password Required']
    }
}, {
    'timestamps': true
});
var User = mongoose.model('User', userSchema);



function hashGenerate(password) {
    return new Promise((resolve, reject) => {
        byCrypt.hash(password, 10).then((password) => {
            console.log(password);

            resolve({ 'data': password })
        })
            .catch((error) => {
                reject({ 'errr': error })
            })
    })

}

class UserModel {
    constructor() {

    }



    async findUser(req) {
        return new Promise((resolve, reject) => {

            User.find({ 'email': req.email }).then((userFounddata) => {

                if (userFounddata.length > 0) {
                    resolve({ 'message': 'useralready exist', 'data': userFounddata })
                } else {
                    resolve({ 'message': 'user not found please register first', 'data': userFounddata })
                }
            })
                .catch((err) => {
                    reject({ success: false, 'error': err })
                })
        })
    };


    async  RegisterUser(req) {
        let response = {
            "success": true,
            "message": "",
            "data": ""
        }
        return new Promise((resolve, reject) => {
            req.save().then((data) => {
                response.success = data,
                    response.message = 'registeration succesfull',
                    response.data = req,
                    response.status = 200

                resolve({ response })
            }).catch((error) => {
                response.success = data,
                    response.message = 'registeration failed',
                    response.data = req,
                    response.status = 500,
                    response.error = error
                reject({ response })
            })
        });


    }

    async LoginUser(loginData) {
        let response = {
            "success": true,
            "message": "",
            "data": ""
        }

        let data = await this.findUser(loginData);

        if (data.data.length > 0) {

            return new Promise((resolve, reject) => {
                byCrypt.compare(loginData.password, data.data[0].password)
                    .then((result) => {
                        if (result == true) {
                            var token = jwt.sign({ email: data.data[0].email, id: data.data[0].id }, config.secretKey);
                            let obj = {
                                firstName: data.data[0].firstName,
                                lastName: data.data[0].lastName,
                                userId: data.data[0]._id,
                                token: token
                            }
                            response.success = true,
                                response.message = 'login successfull',
                                response.status = '200',
                                response.data = obj
                            resolve({ response })
                        } else {
                            response.success = false,
                                response.message = 'login failed Password missMatch',
                                response.status = '500',
                                response.data = null
                            resolve({ response })
                        }
                    })
                    .catch((error) => {
                        reject({ 'success': false, 'message': 'loginFailed password wrong', error: error, status: '400' })
                    });
            });

        } else {
            return data;
        }
    }

    async resetPasswordModel(req) {

        console.log(" model req", req.newpassword);
        let hashedPassword = await hashGenerate(req.newpassword)
        console.log("hashed password ", hashedPassword.data);

        return new Promise((resolve, reject) => {
            User.updateOne({ _id: req.data.id }, { password: hashedPassword.data }).then((data) => {
                console.log(" data after hashed ",data);
                resolve({success:true})

            })
        })

    }



}
module.exports = { UserModel, User };
