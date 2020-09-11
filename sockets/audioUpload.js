const {formatMessage,formatOldMessage} = require('../utils/messages');
const Model = require('../models/model')
const {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers,
    date
} = require('../utils/users');
module.exports = function(socket,io) {
    socket.on('audio',audio  =>{
        const user = getCurrentUser(socket.id);
        Model.insertMessage(user.room,user.username,audio,'audio',date())

        io.to(user.room).emit('audioFile', formatMessage(user.username, audio));
    })

};