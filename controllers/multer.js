var uploadedFileName = '';
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // checking and creating uploads folder where files will be uploaded
        //var dirPath = __dirname + '/upload';
        var dirPath = 'client/upload';
        if (!fs.existsSync(dirPath)) {
            var dir = fs.mkdirSync(dirPath);
        }
        cb(null, dirPath + '/');
    },
    filename: function (req, file, cb) {
        // file will be accessible in `file` variable
        var ext = file.originalname.substring(file.originalname.lastIndexOf("."));
        var fileName = Date.now() + ext;
        uploadedFileName = fileName;
        cb(null, fileName);
    }
});
var upload = multer({
    storage: storage
}).array('file', 12);
Sample.upload = function (req, res, file, cb) {
    // console.log("request",req.image);
    upload(req, res, function (err) {
        if (err) {
            // An error occurred when uploading
            res.json(err);
        } else {
            // var response=res.location;
            console.log("ressssssss", uploadedFileName);
            // "back" is an alias for the referrer
            // if (url === 'back') {
            // loc = this.req.get('Referrer') || '/';
            // }
            // set location
            // return this.set('Location', encodeUrl(loc));
            cb(null, uploadedFileName)
        }
    })
}