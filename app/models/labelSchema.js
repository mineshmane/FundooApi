const mongoose = require('mongoose');
const labelSchema = mongoose.Schema({
    labelName: {
        type: String,
        required: true,
        unique: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }

})
let label = mongoose.model('label', labelSchema);


class LableSchema {

    careateLabelSchema(req) {
        var response = {
            success: false,
            message: "",
            data: "",
            err: ""
        }
        let newLabel = new label({
            labelName: req.labelName,
            userId: req.data.id
        })
        return new Promise((resolve, reject) => {
            newLabel.save().then((data) => {
                console.log(" data saved successfully ", data);
                response.success = true;
                response.message = "Label Added successfully";
                response.data = data
                resolve(response)

            }).catch((error) => {
                console.log(error);
                response.message = "label already exist";
                response.err = error;
                reject(response)

            })
        })


    }



    findAndupdateLabel(req) {
        var response = {
            success: false,
            message: "",
            data: "",
            err: ""
        }
        return new Promise((resolve, reject) => {
            console.log(" req ", req);

            label.findByIdAndUpdate({ _id: req.labelId }, { $set: { labelName: req.labelName } }).then((data) => {
                console.log("data after update ", data);
                response.success = true;
                response.message = "Label updated successfully";
                response.data = data
                resolve(response)

            }).catch((err) => {
                console.log(err);

                response.message = "label already exist";
                response.err = err;
                console.log(response);
                reject(response)

            })
        })


    }

    getAllLabels(req) {
        var response = {
            success: false,
            message: "",
            data: "",
            err: ""
        }
        return new Promise((resolve, reject) => {
            label.find({ userId: req.data.id }).then((data) => {
                console.log(" data in find all labels of useer", data);
                response.success = true;
                response.message = "getting all cards successfully"
                response.data = data
                resolve(response)
            }).catch((err) => {
                console.log(err);
                response.success = false
                response.message = "Note Does Not exist error";
                response.err = err
                reject(response)
            })
        })

    }

    deleteLabel(req) {
        console.log(req.labelId);

        var response = {
            success: false,
            message: "",
            data: "",
            err: ""
        }
        return new Promise((resolve, reject) => {
            label.findByIdAndRemove({ _id: req.labelId }).then((data) => {


                if (data == null) {
                    console.log("data after delete  ", data);
                    response.success = true;
                    response.message = "Label not  successfully";
                    response.data = data
                    resolve(response)
                } else {
                    console.log("data after delete  ", data);
                    response.success = true;
                    response.message = "Label deleted successfully";
                    response.data = data
                    resolve(response)
                }


            }).catch((err) => {
                console.log(err);

                response.message = "label not exist";
                response.err = err;
                console.log(response);
                reject(response)

            })
        })
    }
}
module.exports = { LableSchema }