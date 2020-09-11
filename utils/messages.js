const moment = require('moment');

function formatMessage(username, text) {
  return {
    username,
    text,
    time: moment().format('kk:mm')
  };
}
function formatOldMessage(username, text,time) {
    return {
        username,
        text,
        time
    };
}
function getDate(time) {
    let date;
    date = new Date(time);

    let nowDate=new Date(Date.now()).getFullYear() + '-' +
        ('0' + (new Date(Date.now()).getMonth()+1)).slice(-2) + '-' +
        ('0' + new Date(Date.now()).getDate()).slice(-2)

    let msgDate=date.getFullYear() + '-' +
        ('0' + (date.getMonth()+1)).slice(-2) + '-' +
        ('0' + date.getDate()).slice(-2)

    let msgTime=('0' + date.getHours()).slice(-2) + ':' +
        ('0' + date.getMinutes()).slice(-2)
        if(nowDate===msgDate){
            return msgTime
        }else {
            return msgTime +" "+msgDate
        }
}
module.exports = {formatMessage,formatOldMessage,getDate};
