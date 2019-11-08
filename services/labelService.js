const schema = require('../app/models/labelSchema')
const labelModel = new schema.LableSchema;
class LabelService {


    createLabelService(req) {
        // console.log(" req in create label service ", req);

        let data = labelModel.careateLabelSchema(req);
        return data;

    }

    updateLabel(req) {
        let response = labelModel.findAndupdateLabel(req);
        return response;
    }

    getAllLabelService(req) {
        let response = labelModel.getAllLabels(req);
        return response;
    }
    deleteLabel(req) {
        let response = labelModel.deleteLabel(req);
        return response;
    }
}
module.exports = { LabelService }