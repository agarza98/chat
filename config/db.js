// module.exports=function () {
//     var mysql = require('mysql')
// // Let’s make node/socketio listen on port 3000
// // Define our db creds
//     var db = mysql.createConnection({
//         host: 'localhost',
//         user: 'root',
//         password:'password',
//         database: 'etibb_chat'
//     })
// }

const Sequelize = require('sequelize');

const sequelize = new Sequelize('etibb_chat', 'root', 'password', {
    host: 'localhost',
    dialect: 'mysql',
    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    timezone: '+04:00'
});


module.exports = sequelize;