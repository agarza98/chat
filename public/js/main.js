const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
const fileUpload = document.getElementById('fileUpload');

//Get username and room from URL
const { username,room} = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});
const socket = io();
// var username;
// var room;
// fetch('http://localhost:3001/login') // Call the fetch function passing the url of the API as a parameter
//     .then((response) => {
//         return response.json()
//     })
//     .then(function(data) {
//     console.log(data)
//         username = data.username
//         room=data.room
//
//     })


// Join chatroom
socket.emit('joinRoom', { username,room });


socket.on('full_room', (destination) => {
    console.log('Socket event callback: full_room')
    window.location.href = destination;

    alert('The room is full, please try another one')
})
// Get room and users
socket.on('roomUsers', ({ room,users }) => {
    //outputRoomName(room);
    outputUsers(users);
});

// Message from server
socket.on('message', message => {
  outputMessage(message);

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});
socket.on('file' ,file =>{
    outputFile(file);

    // Scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
})
socket.on('image' ,file =>{
    outputImage(file);

    // Scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
})
socket.on('audioFile',audio =>{
    outputAudio(audio)
    // Scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
})
socket.on('data', data => {
    console.log(data);
});
// Message submit
chatForm.addEventListener('submit', e => {
  e.preventDefault();

  // Get message text
  const msg = e.target.elements.msg.value;

  // Emit message to server
  socket.emit('chatMessage', msg);

  // Clear input
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
})

// Output message to DOM
function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
  <p class="text">
    ${message.text}
  </p>`;
  document.querySelector('.chat-messages').appendChild(div);
}

// Add room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
  userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
  `;
}
var uploader = new SocketIOFileClient(socket);


uploader.on('error', function(err) {
    console.log('Error!', err);
});
uploader.on('abort', function(fileInfo) {
    console.log('Aborted: ', fileInfo);
});

fileUpload.addEventListener( 'submit',function(ev) {
    ev.preventDefault();


    var fileEl = document.getElementById('file');
    console.log(fileEl.files[0].type)
    if(fileEl.files[0].type==='image/jpeg' || fileEl.files[0].type==='image/jpg' || fileEl.files[0].type==='image/png'){
        var uploadIds = uploader.upload(fileEl.files,{
            uploadTo: 'image'
        });
    }
    else if (fileEl.files[0].type==='application/vnd.openxmlformats-officedocument.wordprocessingml.document' || fileEl.files[0].type==='application/msword' ||  fileEl.files[0].type==='application/pdf' ){
        var uploadIds = uploader.upload(fileEl.files,{
            uploadTo: 'document'
        });
    }

    chatMessages.scrollTop = chatMessages.scrollHeight;
});
function outputImage(file) {
    const div = document.createElement('div');
    div.classList.add('message');
    console.log(file)
    div.innerHTML = `<p class="meta">${file.username} <span>${file.time}</span></p>
  <image src="/uploads/image/${file.text}"></image>
  `;
    document.querySelector('.chat-messages').appendChild(div);
}
function outputFile(file) {
    const div = document.createElement('div');
    div.classList.add('message');
    console.log(file)
    div.innerHTML = `<p class="meta">${file.username} <span>${file.time}</span></p>
  <a href="/uploads/document/${file.text}" target="_blank">${file.text}</a>
  `;
    document.querySelector('.chat-messages').appendChild(div);
}
function outputAudio(audio) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${audio.username} <span>${audio.time}</span></p>
   <audio controls="" src="/uploads/audio/${audio.text}"></audio>
    `;
    document.querySelector('.chat-messages').appendChild(div);
}