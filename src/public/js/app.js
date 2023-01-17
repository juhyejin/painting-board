const canvasSection = document.querySelector('#canvas-section')
const connectionSection = document.querySelector('#connection-section')

const userInfoForm = document.querySelector('#user-info')
const chattingRoomForm = document.querySelector('#chatting-room-form')
const messageForm = document.querySelector('#message')
const welcome = document.querySelector('#welcome');
const userInfoContainer = document.querySelector('#user-info-container')
const checkboxForSaveNickName =  document.querySelector('input[type="checkbox"]');
const socket = io();

const NICK_NAME = 'nickName'
let roomName;

function nicknameChange(){
    welcome.innerHTML = '닉네임 : ';
    welcome.classList.toggle('hidden')
    userInfoContainer.hidden = false;
    checkboxForSaveNickName.checked = false;
    localStorage.clear();
}

function welcomeUser(Nickname){
    const nickName = document.createElement('b')
    nickName.innerText = `${Nickname}`;
    const btn = document.createElement('button');
    btn.type='button';
    btn.innerText = '변경';
    btn.addEventListener('click', nicknameChange);
    welcome.classList.toggle('hidden')
    welcome.appendChild(nickName)
    welcome.appendChild(btn);
    socket.emit(NICK_NAME, Nickname);
    userInfoContainer.hidden = true;
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
    canvasSection.classList.add('canvasSection')
    const roomNameTitle = document.createElement('h3');
    roomNameTitle.classList.add('title-style')
    roomNameTitle.innerText = `방이름 : ${roomName}`;
    const body = document.querySelector('body')
    body.style.background = '#c5d9e1'
    body.prepend(roomNameTitle)
}

function enterRoom(event){
    event.preventDefault();
    const inputForRoomName = chattingRoomForm.querySelector('input');
    const ROOM_NAME = inputForRoomName.value
    socket.emit("enter_room", ROOM_NAME, showRoom);
    roomName = ROOM_NAME;
    inputForRoomName.value = "";
}

function addMessage(msg, userType){
    const ul = canvasSection.querySelector('ul');
    const li = document.createElement('li');
    li.classList.add(userType)
    li.innerText = msg;
    ul.appendChild(li);
    ul.scroll(0, ul.scrollHeight)
}
function sendMessage(event){
    event.preventDefault();
    const inputForMessage = messageForm.querySelector('input');
    const value = inputForMessage.value
    socket.emit("new_message", value, roomName, () => {
        addMessage(`${value}`, 'my-msg');
    });
    inputForMessage.value = "";
}

if(localStorage.getItem(NICK_NAME)){
    welcomeUser(localStorage.getItem(NICK_NAME))
}
socket.on("welcome", (user) => {
    addMessage(`${user} 입장했습니다!`,'system-msg');
});

socket.on("bye", (left) => {
    addMessage(`${left} 방을 떠났습니다.`,'system-msg');
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
socket.on('otherDraw',(paintingData) => {
    draw(paintingData)
})
socket.on('other-board-reset',(msg)=>{
    alert(msg)
    reset()
})
userInfoForm.addEventListener('submit', submitNickName)
chattingRoomForm.addEventListener('submit',enterRoom)
messageForm.addEventListener('submit', sendMessage)




