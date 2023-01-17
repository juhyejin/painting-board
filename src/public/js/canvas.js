const canvas = document.getElementById('canvas')
const brush = canvas.getContext("2d");
//color
const colorInput = document.getElementById('color-picker')
const colorPaletteForm = document.getElementById('color-palette')
//brush-size
const brushSizeInput = document.querySelector('#brush-size-slider')
//brush
const randomBrushColor = document.querySelector('#random-brush-color')
const selectBrushType = document.querySelector('#brush-type-section')
//download
const download = document.querySelector('a')
let colorPalette = []

let paintingData = {
    mousePointX : 0,
    mousePointY : 0,
    BRUSH_COLOR: colorInput.value,
    brushSize: brushSizeInput.value,
    isDraw: false,
    brushTypeTest: 'circle-brush',
    movementX : 0,
    movementY: 0
}

function draw(paintingData) {
    let mousePointX = paintingData.mousePointX
    let mousePointY = paintingData.mousePointY
    let BRUSH_COLOR = paintingData.BRUSH_COLOR
    let brushSize = paintingData.brushSize
    let movementX = paintingData.movementX
    let movementY = paintingData.movementY
    if (paintingData.isDraw) {
        brush.beginPath();
        brush.strokeStyle = BRUSH_COLOR;
        brush.fillStyle = BRUSH_COLOR;
        brush.lineWidth = brushSize;
        switch (paintingData.brushTypeTest) {
            case "circle-brush" :
                brush.arc(mousePointX, mousePointY, brushSize / 2, 0, Math.PI * 2);
                brush.closePath();
                brush.fill();
                break;
            case "square-brush" :
                brush.fillRect(mousePointX - brushSize / 2, mousePointY - brushSize / 2, brushSize, brushSize);
                break;
            case "eraser-brush" :
                brush.clearRect(mousePointX - brushSize/2,mousePointY - brushSize/2, brushSize, brushSize);
                break;
            case "paint-brush":
                brush.fillRect(0,0, canvas.width, canvas.height);
                break;
            case "line-brush" :
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
    const brushSizeLabel = document.querySelector('#brush-size-slider-value')
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

function mouseEvent(event){
    mousePoint(event)
    draw(paintingData)
}
function reset(){
    brush.clearRect(0,0, canvas.width, canvas.height)
}

function changeBrushType(event){
    const brush = event.target.id
    paintingData.brushTypeTest = brush
    if(brush === 'board-reset'){
        alert('다른 사람의 보드도 초기화가 되니 주의해서 사용해주세요.')
    }
}

canvas.addEventListener('mousedown', (event) => {
    paintingData.isDraw = true
    paintingData.BRUSH_COLOR = colorInput.value
    paintingData.brushSize =  brushSizeInput.value
    if(paintingData.brushTypeTest === 'board-reset'){
        reset()
        socket.emit('board-reset', roomName)
    }
    mouseEvent(event)
})
canvas.addEventListener('mouseup', () => paintingData.isDraw = false)
canvas.addEventListener('mousemove', (event)=> {
    if(paintingData.isDraw){
        mouseEvent(event)
        socket.emit('draw', roomName, paintingData)
    }
})

brushSizeInput.addEventListener('input', brushSizeChange )
randomBrushColor.addEventListener('click',randomColor)
colorInput.addEventListener('change',colorStack)
download.addEventListener('click', event => event.target.href = canvas.toDataURL());
selectBrushType.addEventListener('change', changeBrushType)
