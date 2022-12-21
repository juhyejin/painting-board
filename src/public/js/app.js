const canvasSection = document.querySelector('#canvasSection')
const connectionSection = document.querySelector('#connectionSection')

const userInfoForm = document.querySelector('#userInfo')
const chattingRoomForm = document.querySelector('#chattingRoomForm')
const messageForm = document.querySelector('#message')
const socket = io();

const NICK_NAME = 'nickName'
let roomName;

function userNick(Nickname){
    const h2ForWelcome = document.createElement('h2');
    const welcome = document.querySelector('#welcome')
    userInfoForm.hidden = true
    h2ForWelcome.innerText = `환영합니다! ${Nickname}`;
    welcome.appendChild(h2ForWelcome)
    socket.emit(NICK_NAME, Nickname);
}

function submitNickName(event){
    event.preventDefault();
    const inputForNickname = userInfoForm.querySelector('input')
    const checkboxForSaveNickName = userInfoForm.querySelector('#saveNicknameCheck')
    const USER_NICK_NAME = inputForNickname.value
    if(checkboxForSaveNickName.checked){
        localStorage.setItem(NICK_NAME, USER_NICK_NAME)
    }
    userNick(USER_NICK_NAME)
}

function showRoom(){
    canvasSection.classList.remove('hidden')
    connectionSection.classList.add('hidden')
    const roomNameTitle = document.createElement('h3');
    roomNameTitle.innerText = `방이름 : ${roomName}`;
    document.querySelector('body').prepend(roomNameTitle)
}

function enterRoom(event){
    event.preventDefault();
    const inputForRoomName = chattingRoomForm.querySelector('input');
    const ROOM_NAME = inputForRoomName.value
    socket.emit("enter_room", ROOM_NAME, showRoom);
    roomName = ROOM_NAME;
    inputForRoomName.value = "";
}

function addMessage(msg){
    const ul = document.querySelector('ul');
    const li = document.createElement('li');
    li.innerText = msg;
    ul.appendChild(li);
}
function sendMessage(event){
    event.preventDefault();
    const inputForMessage = messageForm.querySelector('input');
    const value = inputForMessage.value
    socket.emit("new_message", value, roomName, () => {
        addMessage(`You: ${value}`);
    });
    inputForMessage.value = "";
}

if(localStorage.getItem(NICK_NAME)){
    userNick(localStorage.getItem(NICK_NAME))
}
socket.on("welcome", (user) => {
    addMessage(`${user} 입장했습니다!`);
});

socket.on("bye", (left) => {
    addMessage(`${left} 방을 떠났습니다.`);
})
socket.on("new_message", addMessage);

socket.on('room_change', (rooms) => {
    const roomList = connectionSection.querySelector('ul');
    roomList.innerHTML = ''
    if(rooms.length === 0){
        return;
    }
    rooms.forEach((room) => {
        const li = document.createElement('li');
        li.innerText = room
        roomList.appendChild(li)
    })
})

userInfoForm.addEventListener('submit', submitNickName)
chattingRoomForm.addEventListener('submit',enterRoom)
messageForm.addEventListener('submit', sendMessage)
