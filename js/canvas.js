let canvas = document.getElementById('canvas');
let brush = canvas.getContext("2d");
let pastMouseX = 0
let pastMouseY = 0
let isDraw = false
let lineWidth = 10


function draw(mouseX, mouseY) {
    if (isDraw) {
        brush.beginPath();
        brush.lineWidth = lineWidth;
        brush.strokeStyle = "green";
        brush.moveTo(pastMouseX, pastMouseY);
        brush.lineTo(mouseX, mouseY);
        brush.stroke();
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
    let sliderValue = document.getElementById('slider')
    lineWidth = sliderValue.value;
    document.getElementById('lindeWidth').innerText = String(lineWidth)
}

