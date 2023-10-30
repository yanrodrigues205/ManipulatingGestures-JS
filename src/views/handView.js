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
        console.assert;
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