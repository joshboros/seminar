function setup() {
    createCanvas(windowWidth,windowHeight)//(800, 600);
    background(255);
}

function draw() {
    if(mouseIsPressed)cursorcontrol(mouseX, mouseY, pmouseX, pmouseY);
}

function cursorcontrol(x, y, px, py) {
    var speed =  abs(y-py) + abs(x-px);//change in cursor location
    stroke('black');
    ellipse(x, y, 50-speed, 50-speed);//gives location,dimension to draw ellipse
    fill(0);
}//issue with ellipse sizes if you move quickly between 2 near locations
