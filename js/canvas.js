let canvas = document.getElementById('canvas');
let brush = canvas.getContext("2d");
let colorInput = document.getElementById('colorPicker')
let addElement = document.getElementById('colorPalette')
let pastMouseX , pastMouseY = 0
let isDraw = false
let lineWidth = 10
let brushType = 'line'
let brushColor = colorInput.value
let colorPalette = []
let globalAlpha = 1

function draw(mouseX, mouseY) {
    if (isDraw){
            brush.beginPath();
            brush.strokeStyle = brushColor;
            brush.fillStyle = brushColor;
            brush.globalAlpha = globalAlpha
            if(brushType === 'line'){
                brush.lineWidth = lineWidth;
                // brush.lineJoin = 'round'
                brush.moveTo(pastMouseX, pastMouseY);
                brush.lineTo(mouseX, mouseY);
                brush.stroke();
            }else if(brushType === 'circle'){
                brush.arc(mouseX, mouseY, lineWidth/2, 0, Math.PI*2);
                brush.closePath();
                brush.fill();
            }else if(brushType === 'eraser'){
                brush.clearRect(mouseX-lineWidth/2,mouseY-lineWidth/2,lineWidth,lineWidth)
            }else if(brushType === 'square'){
                brush.fillRect(mouseX-lineWidth/2,mouseY-lineWidth/2, lineWidth, lineWidth)
            }
            else{
                brush.fillRect(0,0, canvas.width, canvas.height)
            }
    }
    pastMouseX = mouseX;
    pastMouseY = mouseY;
}

canvas.addEventListener('mousedown', () => isDraw = true)
canvas.addEventListener('mouseup', () => isDraw = false)
canvas.addEventListener('mousemove', event => draw(event.offsetX, event.offsetY))

function lineWidthReSizeForSlider(){
    let sliderValue = document.getElementById('brushSizeSlider')
    lineWidth = sliderValue.value;
    document.getElementById('brushSizeSliderValue').innerText = String(lineWidth)
}

function opacitySetForSlider(){
    let sliderValue = document.getElementById('opacitySlider')
    globalAlpha = sliderValue.value;
    document.getElementById('opacitySliderValue').innerText = String(globalAlpha)
}

function brushTypeChange(brushTypeData){
    brushType = brushTypeData
}

function canvasReset(){
    brush.clearRect(0,0, canvas.width, canvas.height)
}

function randomColor(){
    brushColor = '#' + Math.round(Math.random() * 0xffffff).toString(16)
    colorInput.value = brushColor
    stackColor(brushColor)
}

function colorPicker(){
    brushColor = colorInput.value
}

document.getElementById('colorPicker').addEventListener('change', () => stackColor(colorInput.value))

function stackColor(colorData){
    colorPalette.push(colorData)
    colorPalette= colorPalette.slice(-5)
    addElement.innerHTML = ''
    for(let i = 0; i < colorPalette.length; i++){
        let pastBrushColor = document.createElement('div')
        pastBrushColor.textContent = ' '
        pastBrushColor.style.color = colorPalette[i]
        pastBrushColor.style.background = colorPalette[i]
        pastBrushColor.style.width = '20px'
        pastBrushColor.style.height = '20px'
        pastBrushColor.style.margin = '2px'
        pastBrushColor.style.borderRadius = '8px'
        pastBrushColor.addEventListener('click', () => stackColorCLick(pastBrushColor.style.background))
        addElement.appendChild(pastBrushColor)
    }
}

function stackColorCLick(colorData){
    let rgb = colorData.split(' ').map((x) => parseInt(x.replace(/[^0-9]/g,''),10).toString(16).padStart(2,'0'))
    colorInput.value = "#" + rgb.join( "" );
    brushColor =  "#" + rgb.join( "" );
}

document.getElementById('aEvent').addEventListener('click', event =>{
    console.log(event)
    event.target.href = canvas.toDataURL()}
);

