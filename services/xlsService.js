
const multer = require('multer')
var upload = multer({
    storage: multer.diskStorage({ //multers disk storage settings
        destination: function (req, file, cb) {
            console.log(" calling file ", file);

            cb(null, '/home/admin1/gitclone/fundoo/editorMinesh/FundooNotesBackEnd/public/images/xlUploads')
        },
        filename: function (req, file, cb) {
            var datetimestamp = Date.now();
            cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1])
        }
    })
    ,  fileFilter : function(req, file, callback) { //file filter
        if (['xls', 'xlsx'].indexOf(file.originalname.split('.')[file.originalname.split('.').length-1]) === -1) {
            return callback(new Error('Wrong extension type'));
        }
        callback(null, true);
    }
})

class Xcel {

    uploading(req, res) {
        var exceltojson;
        upload(req, res, function (err) {
            if (err) {
                res.json({ error_code: 1, err_desc: err,mesg:'file extension wrong' });
                return;
            }
            /** Multer gives us file info in req.file object */
            if (!req.file) {
                res.json({ error_code: 1, err_desc: "No file passed" });
                return;
            }
            /** Check the extension of the incoming file and
             *  use the appropriate module
             */
            if (req.file.originalname.split('.')[req.file.originalname.split('.').length - 1] === 'xlsx') {
                exceltojson = xlsxtojson;
            } else {
                exceltojson = xlstojson;
            }
            try {
                exceltojson({
                    input: req.file.path,
                    output: null, //since we don't need output.json
                    lowerCaseHeaders: true
                }, function (err, result) {
                    if (err) {
                        return res.json({ error_code: 1, err_desc: err, data: null });
                    }
                    res.json({ error_code: 0, err_desc: null, data: result });
                });
            } catch (e) {
                res.json({ error_code: 1, err_desc: "Corupted excel file" });
            }
        })

    }
}




// app.get('/',function(req,res){
// res.sendFile(__dirname + "/index.html");
// });
// app.listen('3000', function(){
// console.log('running on 3000...');
// });





module.exports = upload;
// module.exports = { upload, Xcel } 