require('dotenv').config()
module.exports = {
    mongoUrl: 'mongodb://localhost:27017/fundoo',
    secretKey:process.env.secretKey,
    // secretKey: 'abcd123',
    // auth: 'mineshmane94@gmail.com',
    auth:process.env.mail,
    email:process.env.email,
    password:process.env.password
    // email: 'mineshmane94@gmail.com'


}