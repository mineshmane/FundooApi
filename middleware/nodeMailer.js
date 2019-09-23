const nodemailer = require("nodemailer");
const config = require('../config/config');
module.exports = {

    sendMail(to, url) {
        console.log(config.email,config.password);
        
        console.log(" email to ",to);
        
        var transport = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user:'mineshmane94@gmail.com',
                pass: 'Rahul@12345'
            }
        });
        var mailOptions = {
            from: 'mineshmane94@gmail.com', // sender address
            to: to, // list of receivers
            subject: "Reset Your Password ", // Subject line
            text: "", // plaintext body
            html: "<h4>We received a request to reset the password for your fundoo account.</h4></br>\
               <h5>EmailId:<p>"+to+"</p></h5> </br>\
               <p>click below link to generate a new password.</p>  </br>\
               \n \n  "+ url + "</br></br> <h5>Warm Regards</h5> </br><p>Team FUNDOO</p>"
        }

        transport.sendMail(mailOptions, function (error, response) {
            if (error) {
                console.log(error);
            } else {
                console.log("Message sent: " + response);
            }
            transport.close(); // shut down the connection pool, no more messages
        });
    }
}
// const nodemailer = require("nodemailer");
// const config = require('../config/config');
// console.log(config.email,config.password);

// module.exports.mail = (email,url) => {
// console.log(" email ",email);
// console.log(" maaiiiiiiiiii======>>>>>>");

   
//     var transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         user: 'mineshmane94@gmail.com',
//         pass: 'Rahul@12345'
//       }
//     });
  
//     var mailOptions = {
//       from: 'mineshmane94@gmail.com',
//       to: email,
//       subject: 'Link for reset password ',
//       text: url
//     };
  
//     transporter.sendMail(mailOptions, function (error, info) {
//       if (error) {
//         console.log(error);
//       } else {
//         console.log('Email sent: ' + info.response);
//       }
  
//     });
  
// }