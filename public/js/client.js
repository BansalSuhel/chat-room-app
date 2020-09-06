const form = document.getElementById("form");
const roomName = document.getElementById("room");
const roomNameMobile = document.getElementById("room-mobile");
const usersName = document.getElementById("users");
const usersNameMobile = document.getElementById("users-mobile");
const messageBox = document.querySelector(".message-box");

const socket = io();

//Recieving username and room from URL
const {
    username,
    room
} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});


//emiting username,room to server
socket.emit('join-room', {
    username,
    room
});

//Recieving message from server
socket.on('message', (message) => {

    outputMessage(message);

     //scroll down
     messageBox.scrollTop = messageBox.scrollHeight;
    
     
});

//Recieving users-room event from server
socket.on('users-room', ({
    room,
    users
}) => {

    outputRoom(room);
    outputUsers(users);
});

//add submit listener to form
form.addEventListener('submit', (event) => {
    event.preventDefault();
    const msg = event.target.elements.msg.value;

    //emit chat message to server
    socket.emit('chat-message', msg);

    //Reseting input value
    event.target.elements.msg.value = '';
    event.target.elements.msg.focus();
})

//OutPut Message To Dom
const outputMessage = (message) => {
    const div = document.createElement('div');
    div.classList.add('chat-messages');
    div.innerHTML = `<p class="chat-messages__user">${message.username}<span>${message.time}</span></p>
    <p class="chat-messages__message">${message.text}</p>`;

    const messageBox = document.querySelector('.message-box');
    messageBox.appendChild(div);

}

//Output Room to Dom
const outputRoom = room => {
    roomName.innerText = room;
    roomNameMobile.innerText = room;
};

//Output ALL USERS TO DOM
const outputUsers = users => {
    usersName.innerHTML = `${users.map(user => `<li>${user.username}</li>`).join('')}`;
    usersNameMobile.innerHTML = `${users.map(user => `<li>${user.username}</li>`).join('')}`;
};