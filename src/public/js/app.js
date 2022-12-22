const canvasSection = document.querySelector('#canvasSection')
const connectionSection = document.querySelector('#connectionSection')

const userInfoForm = document.querySelector('#userInfo')
const chattingRoomForm = document.querySelector('#chattingRoomForm')
const messageForm = document.querySelector('#message')
const welcome = document.querySelector('#welcome');
const checkboxForSaveNickName =  userInfoForm.querySelector('input[type="checkbox"]');
const socket = io();

const NICK_NAME = 'nickName'
let roomName;

function nicknameChange(){
    welcome.innerHTML = '';
    userInfoForm.hidden = false;
    checkboxForSaveNickName.checked = false;
    localStorage.clear();
}

function welcomeUser(Nickname){
    const h2ForWelcome = document.createElement('b');
    h2ForWelcome.innerText = `닉네임 : ${Nickname}`;
    h2ForWelcome.style.fontSize = '1.5rem';
    const btn = document.createElement('button');
    btn.type='button';
    btn.innerText = '변경';
    btn.addEventListener('click', nicknameChange);
    welcome.appendChild(h2ForWelcome);
    welcome.appendChild(btn);
    socket.emit(NICK_NAME, Nickname);
    userInfoForm.hidden = true;
}

function submitNickName(event){
    event.preventDefault();
    const inputForNickname = userInfoForm.querySelector('input')
    const USER_NICK_NAME = inputForNickname.value
    if(checkboxForSaveNickName.checked){
        localStorage.setItem(NICK_NAME, USER_NICK_NAME)
    }
    welcomeUser(USER_NICK_NAME)
    inputForNickname.value = ''
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
    const ul = canvasSection.querySelector('ul');
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
    welcomeUser(localStorage.getItem(NICK_NAME))
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
