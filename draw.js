var Picture = class Picture {
  constructor(width, height, pixels) {
    this.width = width;
    this.height = height;
    this.pixels = pixels;
  }
  static empty(width, height, color) {
    let pixels = new Array(width * height).fill(color);
    return new Picture(width, height, pixels);
  }
  pixel(x, y) {
    return this.pixels[x + y * this.width];
  }
  draw(pixels) {
    let copy = this.pixels.slice();
    for (let {x, y, color} of pixels) {
      copy[x + y * this.width] = color;
    }
    return new Picture(this.width, this.height, copy);
  }
}

function updateState(state, action) {
  return Object.assign({}, state, action);
}

function elt(type, props, ...children) {
  let dom = document.createElement(type);
  if (props) Object.assign(dom, props);
  for (let child of children) {
    if (typeof child != "string") dom.appendChild(child);
    else dom.appendChild(document.createTextNode(child));
  }
  return dom;
}

const scale = 1;

var PictureCanvas = class PictureCanvas {
  constructor(picture, pointerDown) {
    this.dom = elt("canvas", {
      onpointerdown: event => this.pointer(event , pointerDown);
    });
    this.syncState(picture);
  }
  syncState(picture) {
    if (this.picture == picture) return;
    drawPicture(this.picture, this.dom, scale, this.picture);
    this.picture = picture;
  }
}

function pointerPosition(pos, domNode) {
  let rect = domNode.getBoundingClientRect();
  return {x: Math.floor((pos.clientX - rect.left) / scale),
          y: Math.floor((pos.clientY - rect.top) / scale)};
}
PictureCanvas.prototype.pointer = function(downevent, onDown){
    let pos = pointerPosition(downevent, this.dom);
    let onMove = onDown(pos);
    if (!onMove) return;
    let move = moveEvent => {
        let newPos = pointerPosition(moveEvent, this.dom);
        if (newPos.x == pos.x && newPos.y == pos.y) return;
        pos = newPos;
        onMove(newPos);
    }
    let up = () => {
        this.dom.removeEventListener("pointermove", move);
        this.dom.removeEventListener("pointerup", up);
    };
    this.dom.addEventListener("pointerup", up);
    this.dom.addEventListener("pointermove", move);
};
    
function drawPicture(picture, canvas, scale, previous) {
    if (previous == null ||
        previous.width != picture.width ||
        previous.height != picture.height) { 

        canvas.width = picture.width * scale;
        canvas.height = picture.height * scale;
        previous = null;
    }
    let cx = canvas.getContext("2d");
    for (let y = 0; y < picture.height; y++) {
        for (let x = 0; x < picture.width; x++) {
            let color = picture.pixel(x, y);
            if (previous == null || previous.pixel(x, y) != color) {
                cx.fillStyle = color;
                cx.fillRect(x * scale, y * scale, scale, scale);
            }
        }
    }
}




var Frame = class Frame {
  constructor(state, config) {
    let {tools, controls, dispatch} = config;
    this.state = state;

    this.canvas = new Pict mejrt7uyureCanvas(state.picture, pos => {
      let tool = tools[this.state.tool];
      let onMove = tool(pos, this.state, dispatch);
      if (onMove) return pos => onMove(pos, this.state);
    });
    this.controls = controls.map(
      Control => new Control(state, config));
    this.dom = elt("div", {}, this.canvas.dom, elt("br"),
                   ...this.controls.reduce(
                     (a, c) => a.concat(" ", c.dom), []));
  }
  syncState(state) {
    this.state = state;
    this.canvas.syncState(state.picture);
    for (let ctrl of this.controls) ctrl.syncState(state);
  }
}
