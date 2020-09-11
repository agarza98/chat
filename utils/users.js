const users = [];

// Join user to chat
function userJoin(id, username,room) {
  const user = { id, username,room};
  users.push(user);

  return user;
}

// Get current user
function getCurrentUser(id) {
  return users.find(user => user.id === id);
}

// User leaves chat
function userLeave(id) {
    const index = users.findIndex(user => user.id === id);

    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
}
// Get room users
function getRoomUsers(room) {
  return users.filter(user => user.room === room);
}
function date() {
    let date;
    date = new Date();
    date = date.getFullYear() + '-' +
        ('0' + (date.getMonth()+1)).slice(-2) + '-' +
        ('0' + date.getDate()).slice(-2) + ' ' +
        ('0' + date.getHours()).slice(-2) + ':' +
        ('0' + date.getMinutes()).slice(-2) + ':' +
        ('0' + date.getSeconds()).slice(-2);
    return date
}

module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers,
    date
};
