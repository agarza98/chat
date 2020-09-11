const db = require('../config/db');
module.exports = class Model {
    static   insertMessage(chat_id, user_id,content,type,date) {
        return db.query("INSERT INTO messages (chat_id, user_id,content,type,date)"+
            "VALUES ('"+ chat_id+"','"+user_id+"','"+content+"','"+type +"','"+ date+"')")
    }
    static   insertRoom(chat_name, user_id,) {
        return db.query("INSERT INTO chat (name,user_id)"+
            "VALUES ('"+ chat_name+"','"+user_id+"')")
    }
    static   checkRoom(chat_name,) {
        return db.query("Select * from chat where name ='"+chat_name+"'" )
    }
    static   getMessages(chat_name) {
        return db.query("Select * from messages where chat_id ='"+chat_name+"'" )
    }
    static   setParticipants(chat_name,users_id) {
        return db.query("INSERT INTO participants (chat_id,users_id)"+
            "VALUES ('"+ chat_name+"','"+users_id+"')")
    }
    static   updateParticipants(chat_name,users_id) {
        return db.query("UPDATE participants SET users_id='"+ users_id+"' WHERE `chat_id`="+chat_name);
    }
}