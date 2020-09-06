let users = [];

//when user join room
const addUser = (id, username, room) => {
    const user = {
        id,
        username,
        room
    };
    users.push(user);
   
    return user;
   
};

//All Users By Specific room name
const usersByRoomName = (room) => {
   return users.filter(user => user.room === room);
};

//Cuurent User By Socketid
const getCurrentUser = (id) => {
    return users.find(user => user.id === id);
}

//when user leave room
const getDisconnectUserById = (id) => {
   const index = users.findIndex(user => user.id === id);
   if(index != -1){
     return users.splice(index, 1)[0]
   }   
};

module.exports = {addUser, usersByRoomName, getCurrentUser, getDisconnectUserById};

