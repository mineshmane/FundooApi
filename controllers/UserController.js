const userService = require('../services/userService');
const service = new userService.Service;
const multerservice = require('../services/multerservice')
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

        req.check('password')
            .isLength({ min: 3 })
            .withMessage('Min 3 alphabet required')
            .isLength({ max: 10 })
            .withMessage('Max 10 alphabet allowed in password')
        let error = req.validationErrors();
        if (error) {
            return res.status(500).send(error);
        } else {
            await service.resetPasswordService(req.body).then((resetedData) => {
                res.status(200).send(resetedData);
            }).catch((error) => {
                res.status(500).send(error);
            })
        }



    }

    async getAllUsers(req, res) {
        await service.getAllUsers(req.body).then((data) => {
            res.send(data);
        }).catch((err) => {
            res.send(err)
        })
    }


    uploadFile(req, res) {
        try {
            console.log(" req in controller in ", req.body.data.id);
            let uid = req.body.data.id
            const uploadImage = multerservice.single('file')
            //  console.log("uploadImage", uploadImage);
            uploadImage(req, res, (error, result) => {
                if (error) {
                    console.log(" err in controller uploadimng ", error);

                    return error
                } else {
                    const imageUrl = req.file
                    // console.log(" req in result file ", result);

                    console.log(" insdide  im g uril ", imageUrl)

                    service.uploadFile(uid, imageUrl, (err, result) => {
                        if (err) {
                            responce.sucess = false,
                                responce.error = err,
                                res.status(400).send(responce)
                        } else {
                            responce.sucess = true,
                                responce.result = result,
                                console.log("aderfsrgrsgrsd",result)
                                res.status(200).send(responce)
                        }

                    })
                }
            })

            var responce = {}
            // const singleUpload = upload.single('image')
            // service.uploadFile(req.file, (err, result) => {
            //     if (err) {
            //         responce.sucess = false,
            //             responce.error = err,
            //             res.status(400).send(responce)
            //     } else {
            //         responce.sucess = true,
            //             responce.result = result,
            //             res.status(200).send(responce)
            //     }
            // })
        } catch (error) {
            console.log('file upload Controller Catch ')
            res.status(400).send({
                success: false,
                message: 'file upload Controller catch'
            })
        }
    }

}
module.exports = new Registarion();