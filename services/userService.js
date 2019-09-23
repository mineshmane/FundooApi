const userModel = require('../app/models/userModel');
const byCrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const mailer=require('../middleware/nodeMailer')
const config = require('../config/config')
const UserModel = new userModel.UserModel;
const newModel = userModel.User;

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


class Service {

   
    async registerUserService(userObject) {

        let foundUser = await UserModel.findUser(userObject);


        let len = foundUser.data.length
        if (len == 0) {
            console.log(" inside data");

            let hashedPassword = await hashGenerate(userObject.password)
            let newUser = new newModel({
                firstName: userObject.firstName,
                lastName: userObject.lastName,
                email: userObject.email,
                password: hashedPassword.data
            });
            console.log(" new user ", newUser);

            let saved = await UserModel.RegisterUser(newUser)
            console.log(" saved user succesfully ", saved);
            return saved

        } else {
            console.log(" condtion not satisfied", foundUser);
            return foundUser;

        }
    }


    async loginService(loginData) {
        try {
            let response = {
                "success": true,
                "message": "",
                "data": ""
            }
            let data = await UserModel.findUser(loginData);
            if (data.data.length > 0) {
                return new Promise((resolve, reject) => {
                    byCrypt.compare(loginData.password, data.data[0].password)
                        .then((result) => {
                            if (result == true) {
                                let token = jwt.sign({ email: data.data[0].email, id: data.data[0].id }, config.secretKey);
                                let obj = {
                                    firstName: data.data[0].firstName,
                                    lastName: data.data[0].lastName,
                                    userId: data.data[0]._id,
                                    token: token
                                }
                                response.success = result,
                                    response.message = 'login successfull',
                                    response.status = '200',
                                    response.data = obj
                                resolve({ response })
                            } else {
                                response.success = result,
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


        } catch (error) {
            console.log(error);
            return error;
        }
        // let foundUser = await UserModel.findUser(userObject);
        // let loged = await UserModel.LoginUser(userObject);
        // console.log(" data  ", loged);
        // return loged
    }

    async forgetPasswordService(forgetdata) {
        let found = await UserModel.findUser(forgetdata);
        console.log(found.data.length);
        if (found.data.length > 0) {
            var token = jwt.sign({ email: found.data[0].email, id: found.data[0]._id }, config.secretKey, { expiresIn: '8h' });
            console.log(" token aivalable", token);
            // const url = `http://localhost:3000/#/reset/${token}`;
    
            // //call sendMail function
            // mailer.mail(found.data[0].email, url);
            var url = "http://localhost:3000/reset" + token;
            mailer.sendMail(found.data[0].email, url);

        } else {
            console.log("user not found");
            return found

        }

    }

    async resetPasswordService(req){
        console.log("rerererer req",req.newpassword);
        
        // let hashedPassword = await hashGenerate(req.newpassword)
        console.log(" hashed password");
        
       let result= await UserModel.resetPasswordModel(req);
       return result;

    }

}
module.exports = { Service };