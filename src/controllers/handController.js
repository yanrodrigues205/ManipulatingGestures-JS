export default class HandController
{
    #view
    #service
    #camera
    constructor({ view, service, camera})
    {
        this.#view = view;
        this.#service = service;
        this.#camera = camera;
    }

    async #detectorHands()
    {
        try
        {
            const hands = await this.#service.detectorHands(this.#camera.video);
            for await(const gesture of this.#service.detectGestures(hands)) {}
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