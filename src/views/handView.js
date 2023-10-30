export default class HandView
{
    #canvas = document.querySelector("#hands");
    #canvasContext = this.#canvas.getContext("2d");
    #fingerIndecex
    constructor({ fingerIndecex })
    {
        this.#canvasContext.width = globalThis.screen.availWidth;
        this.#canvasContext.height = globalThis.screen.availHeight;
        this.#fingerIndecex = fingerIndecex;
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
            this.#drawFingersAndHoversElements(keypoints);
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

            this.#canvasContext.arc(newX, newY, radius, startAngle, endAngle);
            this.#canvasContext.fill();
        }
    }


    loop(funct)
    {
        requestAnimationFrame(funct);
    }

    #drawFingersAndHoversElements(keypoints)
    {
        const fingers = Object.keys(this.#fingerIndecex);
        for(const finger of fingers)
        {
            const points = this.#fingerIndecex[finger].map(
                index => keypoints[index]
            );

            const region = new Path2D();
            // 0 palma da mão
            const [{ x, y }] = points;
            region.moveTo(x, y);

            for(const point of points)
            {
                region.lineTo(point.x, point.y);
            }

            this.#canvasContext.stroke(region);
        }
    }

    scrollPage(top)
    {
        scroll({
            top,
            behavior: "smooth"
        });
    }
}