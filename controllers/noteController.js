const notesService = require('../services/noteService');

const service = new notesService.NoteService;
class NoteController {


    async createNote(req, res) {
        console.log(" constroller ", req.body);

        await service.craeteNoteService(req.body).then((result) => {
            console.log("log in dta", result);
            res.send(result);
        }).catch((error) => {
            console.log("error ", error);
            res.send(error);

        })


        //  if(data){
        //     console.log(data);
        //     res.send(data);
        //  }else{
        //     // return res.status(500).send(err);
        //  }




    }

    async getAllNotes(req, res) {
        console.log("data in get notes ===>>>", req.body.data.id);

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
        await service.addlabelToNote(req.body).then((data) => {
            res.send(data);
        }).catch((err) => {
            res.send(err)
        })
    }
  


}
module.exports = new NoteController();
