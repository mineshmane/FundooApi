const userService = require('../services/userService');
const service = new userService.Service;

class Registarion {
    constructor() {
    }

    async registerUser(req, res) {
        req.check('firstName').isAlpha()
            .withMessage('firstName Must be only alphabetical chars')
            .isLength({ min: 3 })
            .withMessage('Min 3 alphabet required in FirstName');

        req.check('lastName').isAlpha()
            .withMessage('lastName Must be only alphabetical chars')
            .isLength({ min: 3 })
            .withMessage('Min 3 alphabet required in LastName');

        req.check('email').isEmail()
            .withMessage('Email is not valid')

        req.check('password')
            .isLength({ min: 3 })
            .withMessage('Min 3 alphabet required')
            .isLength({ max: 10 })
            .withMessage('Max 10 alphabet allowed in password')
        let error = req.validationErrors();
        if (error) {

            return res.status(500).send(error);

        } else {

            await service.registerUserService(req.body)
            .then((registerdData) => {

                res.status(200).send(registerdData);

            }).catch((error) => {

                res.status(500).send(error);

            });

        }
    }



    async loginUser(req, res) {
        console.log(" in login controller ", req.body);
        await service.loginService(req.body).then((loginData) => {
            res.status(200).send(loginData);
        }).catch((error) => {
            res.status(500).send(error)
        });
        // console.log(loginData);
        // res.send(loginData)
    }

    async forgetPassword(req, res) {
        console.log(" forget controller ", req.body);

        await service.forgetPasswordService(req.body).then((forgotData) => {
            res.status(200).send(forgotData);
        }).catch((error) => {
            res.status(500).send(error);
        });

    }
    async resetPassword(req, res) {

        //     req.check('password')
        //         .isLength({ min: 3 })
        //         .withMessage('Min 3 alphabet required')
        //         .isLength({ max: 10 })
        //         .withMessage('Max 10 alphabet allowed in password')
        //   let  error = req.validationErrors();
        //     if (error) {
        //         return res.status(500).send(error);
        //     } else {

        //     }
        await service.resetPasswordService(req.body).then((resetedData) => {
            res.status(200).send(resetedData);
        }).catch((error) => {
            res.status(500).send(error);
        })


    }

}
module.exports = new Registarion();