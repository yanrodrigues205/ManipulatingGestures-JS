import { prepareRunChecker } from "../services/timeService";
const { shouldRun: scrollShouldRun } = prepareRunChecker({ timerDelay: 200 });
export default class HandController
{
    #view
    #service
    #camera
    #lastDirection = {
        direction: '',
        y: 0
    }
    constructor({ view, service, camera})
    {
        this.#view = view;
        this.#service = service;
        this.#camera = camera;
    }

    #scrollPage(direction)
    {
        const qtd = 100;
        if(this.#lastDirection.direction === direction)
        {
            this.#lastDirection.y = (
                direction === "scroll-down" ?
                this.#lastDirection.y + qtd :
                this.#lastDirection.y - qtd 
            )
        }
        else
        {
            this.#lastDirection.direction = direction
        }

        this.#view.scrollPage(this.#lastDirection.y);
    }

    async #detectorHands()
    {
        try
        {
            const hands = await this.#service.detectorHands(this.#camera.video);
            for await(const { event, x, y} of this.#service.detectGestures(hands)) {
                if(event.includes("scroll"))
                {
                    if(!scrollShouldRun()) continue;
                    this.#scrollPage(event);
                }
            }
        }
        catch(err)
        {
            console.error("Error -> ", err);
        }
    }

    async #loop() 
    {
        await this.#service.initializeDetector()
        await this.#detectorHands();
        this.#view.loop(this.#loop.bind(this));
    }

    async init()
    {
      return this.#loop();
    }

    static async initialize(dependencies)
    {
        const controller = new HandController(dependencies);
        return controller.init();
    }
}