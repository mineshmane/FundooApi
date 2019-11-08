const model = require('../app/models/NoteSchema');
const userModel = require('../app/models/userModel');
const mongoose = require('mongoose')
const labelServices = require('../services/labelService')
const collab = require('../app/models/collaboratorSchema')
const xlsdata = require('../app/models/xcelDataModel')
const userSchema = new userModel.UserModel;
const collabSchema = new collab.CollaboratorModel;
const noteModel = new model.NoteModel
const labelService = new labelServices.LabelService;
const userInfoSchema = new xlsdata.UserInfo;
class NoteService {

    async craeteNoteService(req) {
        // let data = {
        //     isError: "",
        //     data1: ""
        // }
        // console.log(" request in nservice ", req);
        let data = await noteModel.createNoteModel(req)
        //     .then((res) => {
        //         console.log(" call back in service ====>>>>", res);
        //         data.isError = false,
        //             data.data1 = res
        //         console.log("===============>", data);
        //   return data
        //     })
        //     .catch((err) => {
        //         console.log(" err", err);

        //         return {
        //             isError: true,
        //             data: '',
        //             error: err
        //         }
        //     })
        // console.log(" inservice =========>",data);

        return data;

    }
    async  getAllNotes(req) {
        // console.log(" get all notes in service ",req);

        let param2 = { $or: [{ userId: req.id }, { collaberators: mongoose.Types.ObjectId(req.id) }] }

        let allnotes = await noteModel.getNotes(param2);
        return allnotes;

    }

    async updateNoteService(req) {
        console.log(" servic notes service ", req);

        // let data = await noteModel.updateNote(req)
        // console.log(" data",data);

        // return data;
        let response = {
            message: '',
            success: '',
            data: ''
        }
        let card = await noteModel.findNote(req);
        if (card) {
            console.log(" data after find ", card);
            console.log(" req in service update ", req);
            // var noteModel = {
            //     title: req.title ? req.title : data.title,
            //     description: req.description ? req.description : data.description,
            //     isPined: req.isPined ? req.isPined :  false,
            //     isArchived: req.isArchived ? req.isArchived : false,
            //     isDeleted: req.isDeleted ? req.isDeleted : false,
            //     reminder: req.reminder ? req.reminder : data.reminder,
            //     color: req.color ? req.color : data.color,
            //     userId: req.data.id
            // }

            let data = await noteModel.updateNote(req, card);
            console.log(" after update service notes ^&&^&^&^&^&",data);
            
            return data
        } else {
            response.success = false,
                response.message = 'plase provide note id ',
                response.status = 500,
                response.data = card
            return { response }
        }


    }


    deleteNote(req) {
        console.log(" req in service ", req);
        let param = req.noteId
        return noteModel.deleteNote(param);
    }

    async addlabelToNote(req) {
        let labelRequest;
        // console.log(" req in ", req);

        if (req.labelId == undefined) {
            // console.log(" undefined label id^&&&**&*&*&*&*&*&*&* ");

            let labelData = await labelService.createLabelService(req);
            // console.log(" labelData in controller ", labelData.data._id, req.noteId);

            let obj = {
                "noteId": req.noteId,
                "labelId": labelData.data._id
            }
            labelRequest = obj
        } else {
            labelRequest = req
        }
        return noteModel.addLabelToNote(labelRequest)
    }

    removeNoteLabelService(req) {
        console.log(" req in remove lebel ", req);

        return noteModel.removeNoteLabel(req)
    }
    async addCollaboratorService(req) {
        let collaborator = await userSchema.findUser(req);
        console.log(" collaborator found ", collaborator.data);

        if (collaborator.data) {
            console.log(" hghghgh ", collaborator);

            return noteModel.addCollaboratorToNote(req, collaborator.data)
        } else {
            return collaborator
        }

        // return noteModel.addCollaboratorToNote(req)

    }

    async removeCollaboratorservice(req) {

        let collaborator = await userSchema.findUser(req);
        console.log(" collaborator in found ", collaborator);

        if (collaborator.data) {
            return noteModel.removeNoteCollaborator(req, collaborator.data);
        } else {
            return collaborator
        }

    }

    getAllCollabrorator(req) {
        return collabSchema.getAllCollaborator(req);
    }
    getArchivedNoteService(req) {
        console.log(" req.data ", req.data.id);
        let param = { userId: req.data.id, isArchived: true }
        console.log(" param ", param);

        return noteModel.getNotes(param)
    }
    getReminderNoteService(req) {
        console.log(" req.data ", req.data.id);
        let param = { userId: req.data.id, reminder: { $nin: [null, ""] } }

        console.log(" param s in reminder service ", param);

        return noteModel.getNotes(param)
    }
    getTrashNoteService(req) {
        console.log(" req.data ", req.data.id);
        let param = { userId: req.data.id, isDeleted: true }

        console.log(" param s in reminder service ", param);

        return noteModel.getNotes(param)
    }


    removeReminder(req) {
        return noteModel.ArrayUpdate(req)
    }


    searchNoteService(req) {
        console.log(" *******&*&&*", req);

        let userId = req.data.id
        let search = req.searchValue
        return noteModel.searchNote(search, userId)
    }

    xlsService(req) {
        console.log(" re in service ", req);

        return new Promise((resolve, reject) => {
            userInfoSchema.addXlData(req).then((data) => {
                console.log(" err not found ");

                resolve(data)
            }).catch((err) => {
                console.log(" err found ", err);

                reject(err)
            })
        })


    }


    getXcelDataService(req) {
        return userInfoSchema.getUserDataToFile(req)
    }

}
module.exports = { NoteService };
