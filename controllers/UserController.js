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
            let data = await service.registerUserService(req.body);
            console.log("in controller ", data);
            res.send(data)
            console.log("waitong");
        }
    }



    async loginUser(req, res) {
        console.log(" in login controller ", req.body);
        let loginData = await service.loginService(req.body);
        console.log(loginData);
        res.send(loginData)
    }

    async forgetPassword(req, res) {
        console.log(" forget controller ", req.body);

        let forgetData = await service.forgetPasswordService(req.body);
        res.send(forgetData);
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
        let reseted = await service.resetPasswordService(req.body)
        res.send(reseted)

    }

}
module.exports = new Registarion();