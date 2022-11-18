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

function lineWidthReSize(buttonType){
    if(buttonType === '+') lineWidth++ ;
    else{
        if(lineWidth === 1){
            alert('1이하로 줄일수 없습니다.')
        }else{
            lineWidth--
        }
    }
    document.getElementById('lindeWidth').innerText = String(lineWidth)
}

function lineWidthReSizeForSlider(){
    let sliderValue = document.getElementById('brushSizeSlider')
    lineWidth = sliderValue.value;
    document.getElementById('lindeWidth').innerText = String(lineWidth)
}

function opacitySetForSlider(){
    let sliderValue = document.getElementById('opacitySlider')
    globalAlpha = sliderValue.value;
    document.getElementById('opacity').innerText = String(globalAlpha)
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
        let bTag = document.createElement('b')
        bTag.innerText = colorPalette[i]
        bTag.style.color = colorPalette[i]
        bTag.addEventListener('click', () => stackColorCLick(bTag.style.color))
        addElement.appendChild(bTag)
    }
}

function stackColorCLick(colorData){
   let rgb = colorData.split(' ').map((x) => parseInt(x.replace(/[^0-9]/g,''),10).toString(16).padStart(2,'0'))
    colorInput.value = "#" + rgb.join( "" );
    brushColor =  "#" + rgb.join( "" );
}

document.querySelector('a').addEventListener('click', event =>
    event.target.href = canvas.toDataURL()
);
