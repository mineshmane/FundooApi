const mongoose = require('mongoose');

const collabSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    noteId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Notes'
    },
    collabId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
})

var Collaborators = mongoose.model('Collaborators', collabSchema)
class CollaboratorModel {



    addCollaboratorToNote(req) {
        console.log(" req ", req.data.id);

        let newcollaberator = new Collaborators({
            noteId: req.noteId,
            userId: req.data.id,
            collabId: req.collabId

        })
        return new Promise((resolve, reject) => {
            newcollaberator.save().then((data) => {
                resolve(data)
            }).catch((err) => {
                reject(err)
            })
        })

    }

    getAllCollaborator() {
        return new Promise((resolve, reject) => {
            Collaborators.find().then((data) => {
                resolve(data)
            }).catch((err) => {
                reject(err)
            })
        })

    }



    // addCollaboratorToNote(req) {
    //     return new Promise(async (resolve, reject) => {
    //         // console.log(" labels data ", req);
    //         // let labels = await labelS.findOne({ _id: req.labelId })
    //         // console.log(" label object", labels);
    //         // console.log(" collaborator in shema  ", collaberator.data);

    //         Notes.findOneAndUpdate({ _id: req.noteId }, { $push: { collaberators: req.userId } }).then((data) => {
    //             console.log(" dta", data);

    //             resolve(data);
    //         }).catch((err) => {
    //             reject(err);
    //         })
    //     })
    // }

}
module.exports = { CollaboratorModel }