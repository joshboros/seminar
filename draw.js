function setup() {
    createCanvas(windowWidth, windowHeight);
    background(255);
}

function draw() {
    stroke(1);
    if (mouseIsPressed === true) {
        line(mouseX, mouseY, pmouseX, pmouseY);
        console.log(touches[mouseY]);
    }
}
