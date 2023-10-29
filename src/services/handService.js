import { gestureStrings, knownGestures,  } from "./gesturesService.js"
export default class HandService
{
    #gestureEstimator
    #handPoseDetection
    #handsVersion
    #detector = null
    constructor({ figerpose, handPoseDetection, handsVersion })
    {
        this.#gestureEstimator = new window.fp.GestureEstimator(knownGestures);
        this.#handPoseDetection = handPoseDetection;
        this.#handsVersion = handsVersion;
    }

    async estimate(keypoints3D)
    {
        const predictions = await this.#gestureEstimator.estimate(
            this.#landMarksConvert(keypoints3D),
            9 // de 90 porecento de certeza que o elemento é uma mão
        );
        return predictions.gestures;
    }

    #landMarksConvert(keypoints3D)
    {
        const convert = keypoints3D.map(keypoint => 
            [keypoint.x, keypoint.y, keypoint.z]
        )

    }

    async * detectGestures(predictions)
    {
        for(const hand of predictions)
        {
            if(!hand.keypoints3D) continue;

            const gestures = await this.estimate(hand.keypoint3D);
            

            if(!gestures.length) continue;

            const result = gestures.reduce(
                (previous, current) => (previus.score > current.score) ? previous : current
            );

            const { x, y } = hand.keypoints.find( keypoint => keypoint.name === "index_finger_tip");

            yield { event: result.name, x, y}
            console.log("dectected mão" , gestureStrings[result.name]);
        }
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

