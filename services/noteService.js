const model = require('../app/models/NoteSchema');
const userModel = require('../app/models/userModel');
const mongoose = require('mongoose')
const collab = require('../app/models/collaboratorSchema')
const xlsdata = require('../app/models/xcelDataModel')
const userSchema = new userModel.UserModel;
const collabSchema = new collab.CollaboratorModel;
const noteModel = new model.NoteModel
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

            let data = await noteModel.updateNote(req, card);
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

    addlabelToNote(req) {
        return noteModel.addLabelToNote(req)
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


    removeReminder(req) {
        return noteModel.ArrayUpdate(req)
    }


    searchNoteService(req) {
        return noteModel.searchNote(req)
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

}
module.exports = { NoteService };
