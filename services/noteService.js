const model = require('../app/models/NoteSchema');
const noteModel = new model.NoteModel
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

        let allnotes = await noteModel.getAllNotes(req);
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
        return noteModel.deleteNote(req);
    }

    addlabelToNote(req){
       return noteModel.addLabelToNote(req)
    }
    
}
module.exports = { NoteService };
