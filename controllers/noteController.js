const notesService = require('../services/noteService');
const multerService = require('../services/xlsService')
const methods = require('../services/xlsService')
var xlstojson = require("xls-to-json-lc");
var xlsxtojson = require('xlsx-to-json-lc');
// const method = new methods.Xcel;
// let multi = methods.upload;
const service = new notesService.NoteService;
class NoteController {


    async createNote(req, res) {
        console.log(" constroller ", req.body);

        await service.craeteNoteService(req.body).then((result) => {
            // console.log("log in dta", result);
            res.send(result);
        }).catch((error) => {
            console.log("error ", error);
            res.send(error);

        })

    }

    async getAllNotes(req, res) {
        // console.log("data in get notes ===>>>", req.body.data.id);

        await service.getAllNotes(req.body.data).then((data) => {
            res.status(200).send(data)
        }).catch((err) => {
            res.status(500).send(err)
        })

    }

    async updateNotesController(req, res) {
        try {
            let response = {
                message: '',
                error: '',
                success: '',
                data: ''
            }
            await service.updateNoteService(req.body)
                .then((result) => {
                    res.status(200).send(result);
                }).catch((err) => {
                    response.success = false,
                        response.message = 'plase provide note id ',
                        response.status = 500,
                        response.data = null,
                        response.error = err
                    res.status(500).send(response)
                })
        } catch (error) {
            res.send(error)

        }


    }
    async deleteForeverNote(req, res) {

        await service.deleteNote(req.body).then((data) => {
            res.status(200).send(data);
        }).catch((err) => {
            res.status(500).send(err);
        })
    }

    async   addLabeltoNote(req, res) {
        console.log(" req ", req.body);
        let obj = {
            "noteId": req.body.noteId,
            "labelId": req.body.labelId
        }
        console.log(" label Obehct in controller ", obj);


        await service.addlabelToNote(req.body).then((data) => {
            res.send(data);
        }).catch((err) => {
            res.send(err)
        })
    }

    async removeNoteLabel(req, res) {
        console.log(" req in controller ", req.body);

        await service.removeNoteLabelService(req.body).then((data) => {
            res.send(data)
        }).catch((err) => {
            res.send(err)
        })
    }

    async addCollaborator(req, res) {
        console.log(" req in controller ", req.body);

        await service.addCollaboratorService(req.body).then((data) => {
            // console.log(" res in controller", data);

            res.send(data)
        }).catch((err) => {
            console.log(" res in errr", err);

            res.send(err)
        })
    }

    async removeCollaborator(req, res) {
        // console.log(" req in controller ", req.body);
        let collbObject = {

            noteId: req.body.noteId,
            email: req.body.email
        }

        await service.removeCollaboratorservice(collbObject).then((data) => {
            console.log(" response ", data);

            res.send(data);
        }).catch((err) => {
            console.log(" log err ");

            res.send(err)
        })

    }

    async getAllCollaborator(req, res) {
        await service.getAllCollabrorator(req).then((data) => {
            res.send(data);
        }).catch((err) => {
            res.send(err)
        })
    }

    async getArchivedNotes(req, res) {
        // console.log(" req ", req.body);

        await service.getArchivedNoteService(req.body).then((data) => {
            res.send(data)
        }).catch((err) => {
            res.send(err)
        })
    }
    async getReminderdNotes(req, res) {
        console.log(" req ", req.body);

        await service.getReminderNoteService(req.body).then((data) => {

            console.log(data);
            res.send(data)
        }).catch((err) => {
            res.send(err)
        })
    }
    async getTrashNotes(req, res) {
        console.log(" req ", req.body);

        await service.getTrashNoteService(req.body).then((data) => {

            console.log(data);
            res.send(data)
        }).catch((err) => {
            res.send(err)
        })
    }

    async removeReminder(req, res) {
        await service.removeReminder(req.body).then((data) => {
            res.send(data)
        }).catch((err) => {
            res.send(err)
        })
    }

    async searchNote(req) {
        service.searchNoteService(req.body)
    }


    async xlController(req, res) {
        let response = {
            message: '',
            error: '',
            success: '',
            data: ''
        }
        // const uploadImage = multi.single('file')

        // console.log(" uploadImage******* ", uploadImage);
        const uploadImage = multerService.single('file')
        // let data = await method.uploading(uploadImage);
        // console.log(" data &*&**&*&*&&&&*&*", uploadImage);

        var exceltojson;
        uploadImage(req, res, (err, result) => {
            console.log("in check  ");

            if (err) {
                res.json({ error_code: 1, err_desc: err, mesg: 'file extension wrong' });
                return;
            }
            /** Multer gives us file info in req.file object */
            if (!req.file) {
                res.json({ error_code: 1, err_desc: "No file passed" });
                return;
            }
            /** Check the extension of the incoming file and
             *  use the appropriate module
             */
            console.log("**********************", req.file);

            console.log(" jst printing ", req.file.originalname.split('.').length - 1);
            console.log(" just printing now ", req.file.originalname.split('.'));


            if (req.file.originalname.split('.')[req.file.originalname.split('.').length - 1] === 'xlsx') {
                exceltojson = xlsxtojson;
            } else {
                exceltojson = xlstojson;
            }
            try {
                exceltojson({
                    input: req.file.path,
                    output: null, //since we don't need output.json
                    lowerCaseHeaders: true
                }, (err, result) => {
                    if (err) {
                        return res.json({ error_code: 1, err_desc: err, data: null });
                    }
                    // console.log(" data ", result);
                    service.xlsService(result).then((data) => {
                        response.success = true,
                            response.message = 'data stored successfully  ',
                            response.status = 200,
                            response.data = data,
                            response.error = null
                        return res.status(200).send(response)
                        res.send(data);
                    }).catch((err) => {
                        // res.send(err)
                        response.success = false,
                            response.message = 'plase provide note id ',
                            response.status = 500,
                            response.data = null,
                            response.error = err
                        return res.status(500).send(response)
                    })

                    // res.json({ error_code: 0, err_desc: null, data: result });

                });
            } catch (e) {
                res.json({ error_code: 1, err_desc: "Corupted excel file" });
            }
        })








        // uploadImage(req, res, (error, result) => {
        //     if (error) {
        //         console.log(" err in controller uploadimng ", error);

        //         return error
        //     } else {
        //         const imageUrl = req.file
        //         // console.log(" req in result file ", result);

        //         console.log(" insdide  im g uril ", imageUrl)

        //         service.xlsService( file, (err, result) => {
        //             if (err) {
        //                 responce.sucess = false,
        //                     responce.error = err,
        //                     res.status(400).send(responce)
        //             } else {
        //                 responce.sucess = true,
        //                     responce.result = result,
        //                     console.log("aderfsrgrsgrsd", result)
        //                 res.status(200).send(responce)
        //             }

        //         })
        //     }
        // })

    }


}
module.exports = new NoteController();
