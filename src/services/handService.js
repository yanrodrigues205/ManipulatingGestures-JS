export default class HandService
{
    #fingerpose
    #handPoseDetection
    #handsVersion
    #detector = null
    constructor({ figerpose, handPoseDetection, handsVersion })
    {
        this.#fingerpose = figerpose;
        this.#handPoseDetection = handPoseDetection;
        this.#handsVersion = handsVersion;
    }

    async detectorHands(video)
    {
        console.log("entrou!");
        return this.#detector.estimateHands(video, {
            flipHorizontal: true
        });
    }

    async initializeDetector()
    {
        if (this.#detector)
        {
            return this.#detector;
        }

        const detectorConfig = {
            runtime: 'mediapipe',
            solutionPath: `https://cdn.jsdelivr.net/npm/@mediapipe/hands@${this.#handsVersion}`,
            modelType: 'lite',
            maxHands: 2,
        }

        this.#detector = await this.#handPoseDetection.createDetector(
            this.#handPoseDetection.SupportedModels.MediaPipeHands,
            detectorConfig
        )

        return this.#detector;
    }
}

