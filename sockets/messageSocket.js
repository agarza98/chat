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
    socket.on('chatMessage', msg => {
        const user = getCurrentUser(socket.id);
        Model.insertMessage(user.room,user.username,msg,'text',date())
        io.to(user.room).emit('message', formatMessage(user.username, msg));
    });


};