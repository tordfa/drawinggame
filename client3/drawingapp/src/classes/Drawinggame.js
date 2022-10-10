import Drawing from "./Drawing";

class Drawinggame {
    constructor(client, drawing, canvas) {
        this.client = client;
        this.canvas = document.getElementById('canvas');
        this.drawing = new Drawing(this.canvas);
        console.log("Game created")
        this.overlayActive = 0;
    }

    start(activateOverlay) {

        // Show screen tellin everybody who is drawing next. Word is shwon to active player
        this.overlayActive = 1
        this.client.ws.addEventListener("message", (msg) => {
            var jsonData = JSON.parse(msg.data)
            if (jsonData.type == "nextround") {
                activateOverlay(jsonData.activeplayer, jsonData.words)
            }
            if (jsonData.activeplayer == this.client.username) {
                console.log("DIN TUR mafakka")
                this.canvas.onmousedown = (e) => { this.drawing.startDraw(e); }
                this.canvas.onmousemove = (e) => { this.drawing.moveDraw(e) };
                this.canvas.onmouseup = () => {
                    this.drawing.stopDraw()
                    this.client.sendDrawing(this.drawing)

                };
            }
        })
        //wait 6s
        //Start Timer counting down from 120 s
        //Repeat
    }

}

function roundTimer(time) {
    setTimeout(() => {
        console.log(time)
        time++;
        roundTimer(time)
    }, 1000)
}
export default Drawinggame;