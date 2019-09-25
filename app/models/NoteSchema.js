const mongoose = require('mongoose');
const model = require('./labelSchema');
const byCrypt = require('bcrypt');
var jwt = require('jsonwebtoken');


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
    isPin: Boolean,
    isArchived: Boolean,
    isDeleted: Boolean,
    reminder: String,
    color: String,
    label: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'label'
    }],
    collaberators: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'collaberator'
    }]
}, {
    'timestamps': true
});

let Notes = mongoose.model('Notes', notesSchema);
const labelS = mongoose.model('label');
class NoteModel {

    async createNoteModel(req) {

        let response = {
            message: '',
            success: '',
            data: ''
        }
        let newNote = new Notes({
            title: req.title,
            description: req.description ? req.description : "",
            isPin: req.isPin ? req.isPin : false,
            isArchived: req.isArchived ? req.isArchived : false,
            isDeleted: req.isDeleted ? req.isDeleted : false,
            reminder: req.reminder ? req.reminder : "",
            color: req.color ? req.color : "",
            label: req.labels ? req.labels : [],
            userId: req.userId

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
            Notes.find({ userId: req.id })
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

    findNote(req) {
        return new Promise((resolve, reject) => {
            Notes.findById({ _id: req.id }).then((data) => {
                resolve(data)
            }).catch((err) => {
                reject(err)
            })
        })
    }
    updateNote(req, data) {
        return new Promise((resolve, reject) => {
            var response = {
                success: false,
                message: '',
                data: ''
            }
            var noteModel = {
                title: req.title ? req.title : data.title,
                description: req.description ? req.description : data.description,
                isPin: req.isPin ? req.isPin : data.isPin,
                isArchived: req.isArchived ? req.isArchived : data.isArchived,
                isDeleted: req.isDeleted ? req.isDeleted : data.isDeleted,
                reminder: req.reminder ? req.reminder : data.reminder,
                color: req.color ? req.color : data.color,
                userId: req.data.id
            }
            Notes.updateOne({ _id: req.id }, noteModel).then((data) => {
                response.success = true;
                response.message = "Note Updated Successfully";
                response.data = data;
                response.status = 200
                resolve(response)
            }).catch((err) => {
                response.success = false;
                response.message = err;
                reject(response)
            })
            // Notes.findByIdAndUpdate(req.id, { $set: noteModel }).then((update) => {
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
            Notes.findByIdAndRemove({ _id: req.noteId }).then((data) => {
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

            Notes.findOneAndUpdate({ _id: req.noteId }, { $push: { label: req.labelId } }).then((data) => {
                resolve(data);
            }).catch((err) => {
                reject(err);
            })
        })


        //     , (err, data) => {
        //     if (err) {
        //         console.log('error is ', err);
        //         callback(err, null);
        //     } else if (data != null) {
        //         console.log('data is ', data);
        //         callback(null, data)
        //     } else {
        //         response.message = "Label does Not Exist"
        //         callback(response)
        //     }
        // })
    }

    /**
 * @description  : It will save label in note.
 * @param   {* request from frontend} noteId
 * @param   {* request from frontend} labelParam
 * @param   {* response to backend} callback
 */
    savelabelToNote(noteId, labelParam, callback) {
        try {
            console.log(noteId, labelParam)

            // if(labelParam !== null){
            //     callback("Write something on label");
            // }
            // else{
            var labelledNote = labelParam
            note.findOneAndUpdate({ _id: noteId }, { $push: { label: labelledNote } }, (err, result) => {
                if (err) {
                    callback(err)
                } else {
                    console.log('in model success')
                    const res = result.label
                    res.push(labelledNote)
                    return callback(null, res)
                }
            })
            // }
        } catch (error) {
            console.log(' Catch the save label to note Model Block')
            callback.status(400).send({
                success: false,
                message: 'Catch the save label to note Model Block'
            })
        }
    }

    addCollaboratorToNote() {

    }
    isArchived() {

    }

}

module.exports = { NoteModel };
