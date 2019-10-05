const multer = require('multer')
var uploadedFileName = '';
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // checking and creating uploads folder where files will be uploaded
        //var dirPath = __dirname + '/upload';
        var dirPath = 'public/image/upload';
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
// upload = multer({
//     storage: storage
// }).array('file', 12);


// upload = function (req, res, file, cb) {
//     // console.log("request",req.image);
//     upload(req, res, function (err) {
//         if (err) {
//             // An error occurred when uploading
//             res.json(err);
//         } else {
//             // var response=res.location;
//             console.log("ressssssss", uploadedFileName);
//             // "back" is an alias for the referrer
//             // if (url === 'back') {
//             // loc = this.req.get('Referrer') || '/';
//             // }
//             // set location
//             // return this.set('Location', encodeUrl(loc));
//             cb(null, uploadedFileName)
//         }
//     })
// }

// const aws = require('aws-sdk')
// const multer = require('multer')
// const multerS3 = require('multer-s3')
// const conf = {
//   AccessKeyID: process.env.AccessKeyID,
//   secretAccessKey: process.env.secretAccessKey,
//   region: process.env.region
// }
// const s3 = new aws.S3(conf)
// /**
//  * @description : filter image file by extension
//  * @param {* requested from frontend } req
//  * @param {* requested from frontend } file
//  * @param {* response to backend } callback
//  */

const fileFilter = function (req, file, callback) {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    callback(null, true)
  } else {
    callback(new Error('Invalid MIME type , only jpeg & png'), false)
  }
}

// /**
//   * @description    : Passing images to aws Bucket using multer-s3.
//   */
var upload = multer({
  fileFilter,
//   storage: multerS3({
//     s3: s3,
//     bucket: 'fundoo123',
//     acl: 'public-read',
//     metadata: function (req, file, callback) {
//       console.log('file data is ', req, file)
//       callback(null,
//         { fieldName: 'Test Meta Data' })
//     },
//     key: function (req, file, callback) {
//       callback(null, Date.now().toString())
//     }
//   })

    storage: storage


}).array('file', 12);

module.exports = upload