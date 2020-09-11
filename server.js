const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
var multer  = require('multer')
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/audio')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname) //Appending extensi
    }
})
var upload = multer({ storage:storage,
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.includes("audio/wav")) {
            return cb(null, false);
        }
        cb(null, true);
    }})

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use('/public',express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));

let bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use('/uploads',express.static(path.join(__dirname, 'uploads')));

app.get('/socket.io-file-client.js', (req, res, next) => {
    return res.sendFile(__dirname + '/node_modules/socket.io-file-client/socket.io-file-client.js');
});
app.get('/index.html',function (req,res,next) {
    res.render('index.html')
})
app.get('/chat.html',function (req,res,next) {
    res.render('index.html')
})
app.post('/gonder',upload.any(),(req,res,next) =>{
    res.status(200).json({success: true});
})

const botName = 'E-tibbChat Bot';
// Run when client connects
io.on('connection', function (socket) {

    require('./sockets/fileUpload')(socket,io)
    require('./sockets/joinRoomSocket')(socket,io)
    require('./sockets/messageSocket')(socket,io)
    require('./sockets/audioUpload')(socket,io)


});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
