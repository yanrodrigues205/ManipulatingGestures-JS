export default class HandController
{
    #view
    #service
    constructor({ view, service})
    {
        this.#view = view;
        this.#service = service;
    }

    async init()
    {
        this.#service.initializeDetector();

    }

    static async initialize(dependencies)
    {
        const controller = new HandController(dependencies);
        return controller.init();
    }
}