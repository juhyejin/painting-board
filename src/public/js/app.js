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
    canvasSection.classList.add('canvasSection')
    const roomNameTitle = document.createElement('h3');
    roomNameTitle.innerText = `방이름 : ${roomName}`;
    const body = document.querySelector('body')
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

function addMessage(msg){
    const ul = canvasSection.querySelector('ul');
    const li = document.createElement('li');
    li.innerText = msg;
    ul.appendChild(li);
    ul.scroll(0, ul.scrollHeight)
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
socket.on('otherDraw',(paintingData) => {
    draw(paintingData)
})

userInfoForm.addEventListener('submit', submitNickName)
chattingRoomForm.addEventListener('submit',enterRoom)
messageForm.addEventListener('submit', sendMessage)

const canvas = document.getElementById('canvas')
const brush = canvas.getContext("2d");
//color
const colorInput = document.getElementById('colorPicker')
const colorPaletteForm = document.getElementById('colorPalette')
//brush-size
const brushSizeInput = document.querySelector('#brushSizeSlider')

//brush
const brushTypeDiv = document.querySelector('div #brushTypeSection')
const lineBrush = brushTypeDiv.querySelector('#lineBrush')
const circleBrush = brushTypeDiv.querySelector('#circleBrush')
const squareBrush = brushTypeDiv.querySelector('#squareBrush')
const eraserBrush = brushTypeDiv.querySelector('#eraserBrush')
const paintBrush = brushTypeDiv.querySelector('#paintBrush')
const boardReset = brushTypeDiv.querySelector('#boardReset')
const randomBrushColor = document.querySelector('#randomBrushColor')

//download
const download = document.querySelector('a')

let brushType = 'line'
let isDraw = false
let colorPalette = []

let paintingData = {
    mousePointX : 0,
    mousePointY : 0,
    BRUSH_COLOR: colorInput.value,
    brushSize: brushSizeInput.value,
    isDraw: false,
    brushTypeTest: 'line',
    movementX : 0,
    movementY: 0
}

function draw(paintingData) {
    console.log(paintingData)
    let mousePointX = paintingData.mousePointX
    let mousePointY = paintingData.mousePointY
    let BRUSH_COLOR = paintingData.BRUSH_COLOR
    let brushSize = paintingData.brushSize
    let movementX = paintingData.movementX
    let movementY = paintingData.movementY
    if (paintingData.isDraw) {
        console.log('그려짐?')
        brush.beginPath();
        brush.strokeStyle = BRUSH_COLOR;
        brush.fillStyle = BRUSH_COLOR;
        brush.lineWidth = brushSize;
    switch (paintingData.brushTypeTest) {
            case "circle" :
                brush.arc(mousePointX, mousePointY, brushSize / 2, 0, Math.PI * 2);
                brush.closePath();
                brush.fill();
                break;
            case "square" :
                brush.fillRect(mousePointX - brushSize / 2, mousePointY - brushSize / 2, brushSize, brushSize);
                break;
            case "eraser" :
                brush.clearRect(mousePointX - brushSize/2,mousePointY - brushSize/2, brushSize, brushSize);
                break;
            case "paint":
                brush.fillRect(0,0, canvas.width, canvas.height);
                break;
            case "reset":
                brush.clearRect(0,0, canvas.width, canvas.height)
                break;
            default :
                brush.moveTo(mousePointX + movementX, mousePointY + movementY);
                brush.lineTo(mousePointX, mousePointY);
                brush.stroke();
        }
    }
}

function stackColorClick(event){
    let rgb = event.target.style.color
    rgb = rgb.split(' ').map((x) => parseInt(x.replace(/[^0-9]/g,''),10).toString(16).padStart(2,'0')).join( "" );
    colorInput.value = "#" + rgb;
}

function colorStack(){
    colorPaletteForm.innerHTML = ''
    colorPalette.push(colorInput.value)
    colorPalette = colorPalette.slice(-5)
    for(let i = 0; i < colorPalette.length; i++){
        let stackColor = document.createElement('div')
        stackColor.classList.add('colorStack')
        stackColor.style.color = colorPalette[i]
        stackColor.style.background = colorPalette[i]
        stackColor.addEventListener('click', stackColorClick)
        colorPaletteForm.append(stackColor)
    }
}

function brushSizeChange(event){
    let brushSizeInputValue =  event.target.value
    const brushSizeLabel = document.querySelector('#brushSizeSliderValue')
    brushSizeLabel.innerText = brushSizeInputValue
}

function randomColor(){
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    let rgb = `${r},${g},${b}`
    const randomNumber = Math.floor(Math.random() * 0xf).toString(16)
    rgb = rgb.split(',').map((x) => parseInt(x.replace(/[^0-9]/g,''),10).toString(16).padStart(2,randomNumber)).join('')
    console.log(rgb)
    colorInput.value = "#" + rgb;
    colorStack()
}
function mousePoint(event){
    paintingData.mousePointX = event.offsetX
    paintingData.mousePointY = event.offsetY
    paintingData.movementX  = event.movementX
    paintingData.movementY = event.movementY
}

canvas.addEventListener('mousedown', (event) => {
    paintingData.isDraw = true
    paintingData.BRUSH_COLOR = colorInput.value
    paintingData.brushSize =  brushSizeInput.value
    mousePoint(event)
    draw(paintingData)
})


canvas.addEventListener('mouseup', () => paintingData.isDraw = false)
canvas.addEventListener('mousemove', (event)=> {
    if(paintingData.isDraw){
        mousePoint(event)
        draw(paintingData)
        socket.emit('draw', roomName, paintingData)
    }
})

function brushTypeChange(event){
    console.log(event)
}

lineBrush.addEventListener('click', () => paintingData.brushTypeTest = "line")
circleBrush.addEventListener('click', () => paintingData.brushTypeTest = "circle")
squareBrush.addEventListener('click',() => paintingData.brushTypeTest = "square")
eraserBrush.addEventListener('click', () => paintingData.brushTypeTest = "eraser")
paintBrush.addEventListener('click',() => paintingData.brushTypeTest = "paint")
boardReset.addEventListener('click', () => paintingData.brushTypeTest = "reset")
brushSizeInput.addEventListener('input', brushSizeChange )
randomBrushColor.addEventListener('click',randomColor)
colorInput.addEventListener('change',colorStack)
download.addEventListener('click', event => event.target.href = canvas.toDataURL());




