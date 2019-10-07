const mongoose = require('mongoose');
const model = require('./labelSchema');
const byCrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const ObjectId = mongoose.Types.ObjectId;


const config = require('../../config/config');
const notesSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "User Id required"]
    },
    title: {
        type: String,
        // required: [true, 'Title is required']
    },
    description: String,
    isPined: Boolean,
    isArchived: Boolean,
    isDeleted: Boolean,
    reminder: [
        String]
    ,
    images: Array,
    color: String,
    label: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'label'

    }],
    collaberators: [{
        type: mongoose.Schema.Types.ObjectId,

        ref: 'User'
    }]
}, {
    'timestamps': true
});





let Notes = mongoose.model('Notes', notesSchema);
const labelS = mongoose.model('label');
class NoteModel {

    async createNoteModel(req) {
        console.log(" requ ", req.data);

        let response = {
            message: '',
            success: '',
            data: ''
        }
        let newNote = new Notes({
            title: req.title,
            description: req.description ? req.description : "",
            isPined: req.isPined ? req.isPined : false,
            isArchived: req.isArchived ? req.isArchived : false,
            isDeleted: req.isDeleted ? req.isDeleted : false,
            reminder: req.reminder ? req.reminder : "",
            color: req.color ? req.color : "",
            label: req.labels ? req.labels : [],
            userId: req.data.id

        });
        return new Promise((resolve, reject) => {
            newNote.save()
                .then((result) => {
                    console.log(" result ", result);
                    response.success = true
                    response.message = 'note created succssfullyy'
                    response.data = result
                    resolve(response);

                }).catch((error) => {
                    console.log(" eeorr in saving ", error);

                    response.success = false,
                        response.message = 'note creation  failed',
                        response.data = null,
                        response.status = 500,
                        response.error = error
                    reject(response);
                })

        });

    }

    getAllNotes(req) {
        console.log(" request ", req.id);
        var response = {
            success: false,
            message: '',
            data: '',
            err: ''
        }
        return new Promise((resolve, reject) => {
            console.log(" req in schema", req);
            var id = mongoose.Types.ObjectId(req.id);

            Notes.find({ $or: [{ userId: req.id }, { collaberators: mongoose.Types.ObjectId(req.id) }] })
                .populate('collaberators')
                .populate('label') // only return the Persons name , { collaberators: { $elemMatch: { userId: req.id } } }
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

    findNote(req) {
        console.log(" req in find notes", req);

        return new Promise((resolve, reject) => {
            Notes.findById({ _id: req.noteId }).then((data) => {
                resolve(data)
            }).catch((err) => {
                reject(err)
            })
        })
    }
    updateNote(req, data) {
        console.log(" req in model ", req);

        return new Promise((resolve, reject) => {
            var response = {
                success: false,
                message: '',
                data: ''
            }
            var noteModel = {
                title: req.title ? req.title : data.title,
                description: req.description ? req.description : data.description,
                isPined: req.isPined ? req.isPined : data.isPined,
                isArchived: req.isArchived ? req.isArchived : data.isArchived,
                isDeleted: req.isDeleted ? req.isDeleted : data.isDeleted,
                reminder: req.reminder ? req.reminder : data.reminder,
                color: req.color ? req.color : data.color,
                userId: req.data.id
            }
            Notes.updateOne({ _id: req.noteId }, noteModel).then((result) => {
                response.success = true;
                response.message = "Note Updated Successfully";
                response.data = result;
                response.status = 200
                resolve(response)
            }).catch((err) => {
                response.success = false;
                response.message = err;
                reject(response)
            })
            // Notes.findByIdAndUpdate(req.noteId, { $set: noteModel }).then((update) => {
            //     response.success = true;
            //     response.message = "Note Updated Successfully";
            //     response.data = data;
            //     response.status = 200
            //     resolve(response)
            // }).catch((err) => {
            //     response.success = false;
            //     response.message = err;
            //     reject(response)
            // })        
        })
    }

    deleteNote(req) {
        let response = {
            message: '',
            success: '',
            data: '',
            err: ''
        }
        return new Promise((resolve, reject) => {
            Notes.findByIdAndRemove({ _id: req }).then((data) => {
                if (data == null) {
                    response.message = 'note doesnot exist',
                        response.success = 'false',
                        response.data = data,
                        response.err = ''
                    resolve(response)
                } else {
                    response.message = 'note deleted successfully',
                        response.success = 'false',
                        response.data = data,
                        response.err = ''
                    resolve(response)
                }
            }).catch((err) => {
                response.message = 'note id not provided',
                    response.success = 'false',
                    response.data = data,
                    response.err = err
                reject(response)
            })
        })

    }

    addLabelToNote(req) {
        return new Promise(async (resolve, reject) => {
            // console.log(" labels data ", req);
            // let labels = await labelS.findOne({ _id: req.labelId })
            // console.log(" label object", labels);

            Notes.findOneAndUpdate({ _id: req.noteId }, { $addToSet: { label: req.labelId } }, { new: true }).then((data) => {
                resolve(data);
            }).catch((err) => {
                reject(err);
            })
        })



    }
    removeNoteLabel(req) {
        return new Promise(async (resolve, reject) => {
            console.log(" labels data in model  ", req);
            // let labels = await labelS.findOne({ _id: req.labelId })
            // console.log(" label object", labels);

            Notes.findOneAndUpdate({ _id: req.noteId }, { $pull: { label: req.labelId } }, { new: true }).then((data) => {
                resolve(data);
            }).catch((err) => {
                reject(err);
            })
        })
    }


    addCollaboratorToNote(req, collaberator) {
        return new Promise(async (resolve, reject) => {
            // console.log(" labels data ", req);
            // let labels = await labelS.findOne({ _id: req.labelId })
            // console.log(" label object", labels);
            console.log(" collaborator in shema  ", collaberator);

            Notes.findOneAndUpdate({ _id: req.noteId }, { $addToSet: { collaberators: collaberator } }, { new: true }).then((data) => {
                console.log(" dta", data);

                resolve(data);
            }).catch((err) => {
                reject(err);
            })
        })
    }

    removeNoteCollaborator(req, collaberator) {
        console.log(" collbo in remove ", collaberator);

        return new Promise((resolve, reject) => {
            Notes.findOneAndUpdate({ _id: req.noteId }, { $pull: { collaberators: collaberator._id } }, { new: true }).then((data) => {
                console.log(" remove succfull ", data);

                resolve(data);
            }).catch((err) => {
                reject(err);
            })
        })

    }

    ArrayUpdate(req) {
        console.log(" reminder in schema ", req);

        return new Promise((resolve, reject) => {
            Notes.findOneAndUpdate({ _id: req.noteId }, { $pull: { reminder: req.reminder } }, { new: true }).then((data) => {
                console.log(" remove succfull ", data);

                resolve(data);
            }).catch((err) => {
                reject(err);
            })
        })
    }

    getNotes(param) {
        console.log(" param in schema ", param);
        // console.log(" request ", req.id);
        var response = {
            success: false,
            message: '',
            data: '',
            err: ''
        }
        return new Promise((resolve, reject) => {
            // console.log(" in model ", param.data.id);

            Notes.find(param)
                .populate('collaberators')
                .populate('label')
                .then((data) => {
                    // console.log(" successfull ", data);
                    response.success = true;
                    response.message = "getting all cards successfully"
                    response.data = data
                    resolve(response)
                }).catch((err) => {
                    // console.log(" err in ", err);
                    response.success = false
                    response.message = "Note Does Not exist error";
                    response.err = err
                    reject(response)
                })

        })
    }

    searchNote(param) {
        let value = "'.*'" + param + "'.*','i'"
        console.log(" value ****", value);


    }


}

module.exports = { NoteModel };
