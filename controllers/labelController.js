const service = require('../services/labelService')
const labelService = new service.LabelService;
class Labels {
    async createLabel(req, res) {

        await labelService.createLabelService(req.body).then((data) => {
            res.status(200).send(data)
        }).catch((err) => {
            res.status(500).send(err)
        })
    }

    async updateLabel(req, res) {
        await labelService.updateLabel(req.body).then((data) => {
            res.status(200).send(data)
        }).catch((err) => {
            res.status(500).send(err)
        })
    }

    async getAllLabels(req, res) {
        // console.log(" req ", req.body);

        await labelService.getAllLabelService(req.body).then((data) => {
            res.status(200).send(data)
        }).catch((err) => {
            res.status(500).send(err)
        })
    }


    async deleteLabel(req, res) {
        // console.log(" request in label controller ", req.body);

        await labelService.deleteLabel(req.body).then((data) => {

            res.status(200).send(data)
        }).catch((err) => {
            res.status(500).send(err)
        })
    }

}
module.exports = new Labels();