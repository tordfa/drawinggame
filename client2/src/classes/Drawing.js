class Drawing {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.strokeStyle = 'black'
        this.ctx.strokeStyle = this.strokeStyle;
        this.ctx.lineWidth = 5;
        this.ctx.lineCap = 'round';
        this.x= 0;
        this.y = 0;
        this.savedDrawingXTemp = []
        this.savedDrawingYTemp = []
        this.savedDrawingX = []
        this.savedDrawingY = []
    }

    startDraw(e) {
        this.x = e.clientX - this.canvas.offsetLeft;
        this.y = e.clientY - this.canvas.offsetTop;
        this.savedDrawingXTemp.push(this.x);
        this.savedDrawingYTemp.push(this.y);
    }

    stopDraw() {
        this.savedDrawingX = this.savedDrawingXTemp;
        this.savedDrawingY = this.savedDrawingYTemp;
        this.savedDrawingXTemp = [];
        this.savedDrawingYTemp = [];
        this.ctx.closePath();
    }

    moveDraw(e) {
        if (e.buttons !== 1) return;
        this.ctx.beginPath(); // begin
        this.ctx.moveTo(this.x, this.y); // from
        this.startDraw(e);
        this.ctx.lineTo(this.x, this.y); // to
        this.ctx.stroke(); // draw it!
    }
    changeColor(color){
        this.ctx.strokeStyle = color
    }

    clearCanvas(){
    var strokeStyleTemp = this.ctx.strokeStyle;
    this.ctx.strokeStyle = 'white';
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.ctx.strokeStyle = strokeStyleTemp;
    }
    redraw(posX, posY) {
        this.ctx.beginPath()
        for (let i = 0; i < posX.length - 1; i++) {
            this.ctx.moveTo(posX[i], posY[i]); // from
            this.ctx.lineTo(posX[i + 1], posY[i + 1]); // to
        }
        this.ctx.closePath();
        this.ctx.stroke();
    }
}

export default Drawing;