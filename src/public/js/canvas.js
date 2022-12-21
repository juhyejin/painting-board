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

let brushType = "line"
let isDraw = false
let colorPalette = []

function draw(event) {
    let mousePointX = event.offsetX
    let mousePointY = event.offsetY
    let BRUSH_COLOR = colorInput.value
    let brushSize = brushSizeInput.value
    if (isDraw) {
        brush.beginPath();
        brush.strokeStyle = BRUSH_COLOR;
        brush.fillStyle = BRUSH_COLOR;
        brush.lineWidth = brushSize;
        switch (brushType) {
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
            default :
                brush.moveTo(mousePointX + event.movementX, mousePointY + event.movementY);
                brush.lineTo(mousePointX, mousePointY);
                brush.stroke();
        }
    }
}

function stackColorClick(event){
    let rgb = event.target.style.color
    rgb = rgb.split(' ').map((x) => parseInt(x.replace(/[^0-9]/g,''),10).toString(16)).join( "" );
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
function reset(){
    brush.clearRect(0,0, canvas.width, canvas.height)
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
    colorInput.value = "#" + rgb;
    colorStack()
}

canvas.addEventListener('mousedown', (event) => {
    isDraw = true
    draw(event)
})

canvas.addEventListener('mouseup', () => isDraw = false)
canvas.addEventListener('mousemove', draw)
lineBrush.addEventListener('click', () => brushType = "line")
circleBrush.addEventListener('click', () => brushType = "circle")
squareBrush.addEventListener('click',() => brushType = "square")
eraserBrush.addEventListener('click', () => brushType = "eraser")
paintBrush.addEventListener('click',() => brushType = "paint")
boardReset.addEventListener('click', reset)
brushSizeInput.addEventListener('input', brushSizeChange )
randomBrushColor.addEventListener('click',randomColor)
colorInput.addEventListener('change',colorStack)
download.addEventListener('click', event => event.target.href = canvas.toDataURL());
