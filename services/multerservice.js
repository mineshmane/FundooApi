
const multer = require('multer')

var upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            console.log(" in the destination ", file);

            cb(null, '/home/admin1/gitclone/fundoo/editorMinesh/FundooNotesBackEnd/public/images/uploads')
        },
        filename: (req, file, cb) => {
            console.log(" in the destination ", file);
            cb(null, file.fieldname + '-' + Date.now().toString() + ".png")
        }
    })
})

module.exports = upload 