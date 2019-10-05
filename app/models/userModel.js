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
    },
    'isverfied': {
        type: Boolean,
        default: false
    },
    'imageUrl': {
        type: String
    }

}, {
    'timestamps': true
});
let User = mongoose.model('User', userSchema);



class UserModel {
    constructor() {

    }
    hashGenerate(password) {
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

    async findUser(req) {
        let user = [];
        let response = {
            message: '',
            data: '',
            success: ''
        }
        let collab = {
            firstName: '',
            lastName: '',
            email: '',
            id: ''
        }
        return new Promise((resolve, reject) => {

            User.find({ 'email': req.email }).then((data) => {

                if (data.length > 0) {

                    console.log(" response after fouund ", data[0]._id);
                    collab.firstName = data[0].firstName,
                        collab.lastName = data[0].lastName,
                        collab.email = data[0].email,
                        collab._id = data[0]._id
                    console.log(" collab rator in find ", collab);

                    response.success = true,
                        response.data = data,
                        response.message = 'user is already exist'

                    resolve(response)
                } else {
                    resolve({ 'message': 'user not found please register first', 'data': data })
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
                console.log(" data in register ", data);

                response.success = true,
                    response.message = 'registeration succesfull',
                    response.data = data,
                    response.status = 200

                resolve({ response })
            }).catch((error) => {
                response.success = data,
                    response.message = 'registeration failed',
                    response.data = '',
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
                            console.log(" data in login success ", data.data[0].imageUrl);

                            var token = jwt.sign({ email: data.data[0].email, id: data.data[0].id }, config.secretKey);
                            let obj = {
                                firstName: data.data[0].firstName,
                                lastName: data.data[0].lastName,
                                userId: data.data[0]._id,
                                email: data.data[0].email,
                                imageUrl: data.data[0].imageUrl,
                                token: token
                            }
                            console.log(" obj print ", obj);

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
        let hashedPassword = await this.hashGenerate(req.newpassword)
        console.log("hashed password ", hashedPassword.data);

        return new Promise((resolve, reject) => {
            User.updateOne({ _id: req.data.id }, { password: hashedPassword.data }).then((data) => {
                console.log(" data after hashed ", data);
                resolve({ success: true })

            }).catch((error) => {
                reject(error)
            })
        })

    }

    getAllUsers(req) {
        console.log(" request ", req.id);
        var response = {
            success: false,
            message: '',
            data: '',
            err: ''
        }
        return new Promise((resolve, reject) => {
            User.find({ userId: req.id })
                // .populate('label') // only return the Persons name
                // .exec()
                .then((AllNotes) => {
                    response.success = true;
                    response.message = "getting all cards successfully"
                    response.data = AllNotes
                    resolve(response)
                }).catch((err) => {
                    response.success = false
                    response.message = "Note Does Not exist error";
                    response.err = err
                    reject(response)
                })

        })

    }

    uploadFile(id, imageUrl, callback) {
        console.log('ultimate save')
        try {
            // const uploadImage = upload.single("image")
            // uploadImage(req,res)
            console.log(" id and img url ", id, imageUrl.path);

            User.findOneAndUpdate({ _id: id }, {
                $set: {
                    imageUrl: imageUrl.path
                }
            }, {
                upsert: true
            },
                // {note : 0 , password : 0},
                function (err, result) {
                    if (err) {
                        return callback(err)
                    } else {
                        return callback(null, result)
                    }
                })
        } catch (err) {
            console.log('Error in reseting Password catch block', err)
            return callback.send(err)
        }
    }

}
module.exports = { UserModel, User };
