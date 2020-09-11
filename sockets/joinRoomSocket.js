const {formatMessage,formatOldMessage,getDate} = require('../utils/messages');
const {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers,
    date
} = require('../utils/users');
const botName = 'E-tibbChat Bot';
const Model = require('../models/model')

module.exports = async function(socket,io) {

    // if(io.engine.clientsCount<3) {
        socket.on('joinRoom', ({username, room}) => {
            let checkRoom=Model.checkRoom(room)
            checkRoom.then(function(result) {
                if(result[0][0]==undefined){
                    Model.insertRoom(room,username)
                    Model.setParticipants(room,username)
                }
                let getMessages= Model.getMessages(room)

                getMessages.then(function (messages) {
                    for(let msg of messages[0]){
                        if(msg.type=='text'){
                            io.to(user.room).emit('message', formatOldMessage(msg.user_id, msg.content,getDate(msg.date)));
                        }
                        else if(msg.type=='audio'){
                            io.to(user.room).emit('audioFile', formatOldMessage(msg.user_id, msg.content,getDate(msg.date)));
                        }
                        else if (msg.type=='file'){
                            io.to(user.room).emit('file', formatOldMessage(msg.user_id, msg.content,getDate(msg.date)));
                        }
                        else{
                            io.to(user.room).emit('image', formatOldMessage(msg.user_id, msg.content,getDate(msg.date)));
                        }
                    }
                })
            })


            const user = userJoin(socket.id, username, room);
            let count=getRoomUsers(user.room)
            if (count.length <=2) {
                socket.join(user.room);

                // Welcome current user
                //socket.emit('message', formatMessage(botName, 'Welcome to ChatCord!'));

                // Broadcast when a user connects
                socket.broadcast
                    .to(user.room)
                    .emit(
                        'message',
                        formatMessage(botName, `${user.username} has joined the chat`)
                    );
                if(count[1]!=undefined){
                    let usernames=count[0].username +','+count[1].username
                    Model.updateParticipants(room,usernames)
                }

                // Send users and room info
                io.to(user.room).emit('roomUsers', {
                    room: user.room,
                    users: getRoomUsers(user.room),
                });
            }else {
                var destination = '/index.html';
                socket.emit('full_room', destination)
            }

        });

    socket.on('disconnect', () => {

        const user = userLeave(socket.id);

        if (user) {
            let count=getRoomUsers(user.room)
            if (count.length <2) {
                io.to(user.room).emit(
                    'message',
                    formatMessage(botName, `${user.username} has left the chat`)
                );
            }
            // Send users and room info
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room),
            });
        }
    });
};