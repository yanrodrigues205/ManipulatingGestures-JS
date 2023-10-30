export default class HandView
{
    #canvas = document.querySelector("#hands");
    #canvasContext = this.#canvas.getContext("2d");

    constructor()
    {
        this.#canvasContext.width = globalThis.screen.availWidth;
        this.#canvasContext.height = globalThis.screen.availHeight;
    }

    clearCanvas()
    {
        this.#canvasContext.clearRect(0, 0, this.#canvasContext.width, this.#canvasContext.height);
    }

    drawResults(hands)
    {
        for(const { keypoints, handedness } of hands )
        {
            if(!keypoints) continue;

            this.#canvasContext.fillStyle = handedness === "Left" ? "red" : "green";
            this.#canvasContext.strokeStyle = "black";
            this.#canvasContext.lineWidth = 8;
            this.#canvasContext.lineJoin = "round";
            this.#drawJuntas(keypoints);
        }   
    }

    #drawJuntas(keypoints)
    {
        for(const { x, y} of keypoints)
        {
            this.#canvasContext.beginPath();;

            const newX = x + 2;
            const newY = y + 2;
            const radius = 3;
            const startAngle = 0;
            const endAngle = 2 * Math.PI;

            this.#canvasContext.arc(newX, newY, radius, startAngle, endAng);
            this.#canvasContext.fill();
        }
    }


    loop(funct)
    {
        requestAnimationFrame(funct);
    }

    scrollPage(top)
    {
        scroll({
            top,
            behavior: "smooth"
        });
    }
}