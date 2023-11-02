export default class HandView
{
    #canvas = document.querySelector("#hands");
    #canvasContext = this.#canvas.getContext("2d");
    #fingerIndecex
    #styler
    constructor({ fingerIndecex, styler })
    {
        this.#canvas.width =  document.body.clientWidth;
        this.#canvas.height = document.body.clientHeight;
        this.#fingerIndecex = fingerIndecex;
        this.#styler =styler;
        setTimeout(() => {
            styler.loadDocumentStyles();    
        }, 200);
    }

    clearCanvas()
    {
        this.#canvasContext.clearRect(0, 0, this.#canvas.width, this.#canvas.height);
    }

    drawResults(hands)
    {
        for(const { keypoints, handedness } of hands )
        {
            if(!keypoints) continue;

            this.#canvasContext.fillStyle = handedness === "Left" ? "red" : "green";
            this.#canvasContext.strokeStyle = "white";
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

            const newX = x - 2;
            const newY = y - 2;
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
            this.#hover(finger, points);
        }
    }

    #hover(finger, points)
    {
        if(finger !== "indexFinger") return;

        const tip = points.find(item => item.name === "index_finger_tip")
        const elemento = document.elementFromPoint(tip.x, tip.y);
        if(!elemento) return;

        this.#canvas.style.display = "none";
        const fn = () => this.#styler.toggleStyle(elemento, ":hover");
        fn();

        setTimeout(()=> fn(), 500);
        this.#canvas.style.display = "n";
    }

    clickOnElement(x, y)
    {
        this.#canvas.style.zIndex = "-1";
        const elemento = document.elementFromPoint(x, y);
        if(!elemento) return;
        const quadrado_elemento = elemento.getBoundingClientRect();
        
        const evento = new MouseEvent("click", {
            view: window,
            bubbles: true,
            cancelable: true,
            clientX: quadrado_elemento.left + x,
            clientY: quadrado_elemento.top + y
        });

       elemento.dispatchEvent(evento);

      // console.log({elemento, x, y});
       this.#canvas.style.zIndex = "0";

    }

    scrollPage(top)
    {
        scroll({
            top,
            behavior: "smooth"
        });
    }
}