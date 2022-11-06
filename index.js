// settings

///////////////// recommended ///////////////////////

// sides >= 30
// brushSize != 1 && brushSize (0 || 2)
// 2 <= intensity <= 100 
// rest of settings is something that can be played with

//////////////////////////////////////////////////////

var invislbeText = true;
var brushSize = 0;
var sides = 30;
var timeoutDelay = 3000;
var intensity = 50;
var decayRate = 5;
var addition = 5;
var pointReceiveRatio= 0.5;

//localStorage.setItem("point", 5);
if (localStorage.getItem("point") == null) {
    var points = localStorage.setItem("point", 0);
    document.querySelector('meta[name="HighScore"]').setAttribute("content", points);
} else {
    var points = localStorage.getItem("point")
    document.querySelector('meta[name="HighScore"]').setAttribute("content", points);
}
// fundemental function(s)

const range = (start, end) => {
    const length = end - start;
    return Array.from({ length }, (_, i) => start + i);
}

// colors

var colors = {};

// gradient calc

var color1 = 'ff0000';
var color2 = '0000ff';

function gradient(position) {
    var ratio = position/(intensity-1);
    var hex = function(x) {
        x = x.toString(16);
        return (x.length == 1) ? '0' + x : x;
    };

    var r = Math.ceil(parseInt(color1.substring(0,2), 16) * ratio + parseInt(color2.substring(0,2), 16) * (1-ratio));
    var g = Math.ceil(parseInt(color1.substring(2,4), 16) * ratio + parseInt(color2.substring(2,4), 16) * (1-ratio));
    var b = Math.ceil(parseInt(color1.substring(4,6), 16) * ratio + parseInt(color2.substring(4,6), 16) * (1-ratio));

    var endColor = hex(r) + hex(g) + hex(b);
    return endColor
}

for (i in range(1,intensity+1)){
    colors[Number(i)+1] = '#'+gradient(Number(i))
}
colors.x = 'white'

var z = 'x';

// initialize

var wWidth = window.innerWidth ;
var wHeight = window.innerHeight;
var columns = Math.floor(wWidth/sides);
var rows = Math.floor(wHeight/sides);
var elements = rows*columns;

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function initializeSetup() {

    wWidth = window.innerWidth ;
    wHeight = window.innerHeight;
    columns = Math.floor(wWidth/sides);
    rows = Math.floor(wHeight/sides);
    elements = rows*columns;

    for (i in range(1,elements+1)){
        var div = document.createElement("div");
        if (invislbeText == true) {
            div.style.color = 'transparent'
        }
        div.innerHTML = z;
        div.className = i
        div.style.textAlign = 'center'
        div.style.lineHeight = `${sides}px`
        div.style.height = `${sides}px`
        document.getElementsByClassName("grid-container")[0].appendChild(div);
    };
}

initializeSetup()

document.getElementsByClassName("grid-container")[0].style.gridTemplateColumns = `repeat(${columns}, ${sides}px)`;

// live update

// brush 

function brush (x,y,n) {
    lstBrush = [];
    lstBrush.push([x,y]);
    for (i in range(1,n+1)) {
        lstBrush.push([x+i*sides,y], [x-i*sides,y], [x,y+i*sides],  [x,y-i*sides])
    }
    return lstBrush
}

// cursor tracking

document.addEventListener('mousemove', (event) => {

        if (event.clientX>wWidth) {

        } else if (event.clientY>wHeight) {

        } else {
            brush(event.clientX,event.clientY, brushSize)
            for (i in lstBrush) {

            
                closeDiv = document.elementFromPoint(lstBrush[i][0], lstBrush[i][1]);
                
                try{if (closeDiv.parentElement.className == 'grid-container') {
                
                    if (closeDiv.innerHTML == 'x') {
                        closeDiv.innerHTML = 1
                        closeDiv.style.background = colors[closeDiv.innerHTML]
                    } else 
                    
                    if (closeDiv.innerHTML > (intensity-1) ) {
                        closeDiv.innerHTML = intensity
                        closeDiv.style.background = colors[closeDiv.innerHTML]
                    } else {
                        closeDiv.innerHTML = Number(closeDiv.innerHTML)+Number(addition)
                        closeDiv.style.background = colors[closeDiv.innerHTML]
                    }

                }}
                catch{}
            }
            
        }

});

// live lowering

var n = 0;

function lowerCount() {
    for (i in range(1,elements+1)){
        var container = document.getElementsByClassName(i)[0]
        if (container.innerHTML == 'x') {
        } else if (container.innerHTML > 1) {
            var minusAmount = Number(Number(container.innerHTML)-decayRate)
            if (minusAmount <1) {
                container.innerHTML = 1
            } else {
                container.innerHTML = minusAmount
            }
            container.style.background = colors[container.innerHTML]
        }
        if (container.innerHTML > (pointReceiveRatio*intensity)) {
            n = Number(n) + 1;
            if (n > points){
                localStorage.setItem("point", n);
                document.querySelector('meta[name="HighScore"]').setAttribute("content", points);
            }
        }
    }
    document.title = 'Density Cursor, Score: ' + String(n)
    
}

var intervalId = window.setInterval(function(){
    lowerCount()
  }, timeoutDelay);

