const SocketIOFile = require('socket.io-file');
const path = require('path');
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

    var uploader = new SocketIOFile(socket, {
        overwrite: false,
        accepts:['image/jpeg','image/jpg','image/png','application/vnd.openxmlformats-officedocument.wordprocessingml.document','application/msword','application/pdf'],
        uploadDir: {			// multiple directories
            document: 'uploads/document',
            image: 'uploads/image'
        },
        rename: function(filename, fileInfo) {
            var file = path.parse(filename);
            var fname = file.name;
            var ext = file.ext;
            return `${Date.now()}${ext}`
        }
    })
    uploader.on('start', (fileInfo) => {
        //console.log(fileInfo);
    });

    uploader.on('complete', (fileInfo) => {
        const user = getCurrentUser(uploader.socket.id);
        if(fileInfo.mime=='image/jpeg' || fileInfo.mime=='image/png' ){
            Model.insertMessage(user.room,user.username,fileInfo.name,'image',date())

            io.to(user.room).emit('image', formatMessage(user.username, fileInfo.name));
        }else {
            Model.insertMessage(user.room,user.username,fileInfo.name,'file',date())

            io.to(user.room).emit('file', formatMessage(user.username, fileInfo.name));
        }

    });
    uploader.on('error', (err) => {
        console.log('Error!', err);
    });
    uploader.on('abort', (fileInfo) => {
        console.log('Aborted: ', fileInfo);
    });

};