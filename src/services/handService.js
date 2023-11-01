import { knownGestures } from "./gesturesService.js"
export default class HandService
{
    #gestureEstimator
    #handPoseDetection
    #handsVersion
    #detector = null
    #gestureStrings

    constructor({ figerpose, handPoseDetection, handsVersion, gestureStrings})
    {
        this.#gestureEstimator = new window.fp.GestureEstimator(knownGestures);
        this.#handPoseDetection = handPoseDetection;
        this.#handsVersion = handsVersion;
        this.#gestureStrings = gestureStrings;

    }

    async estimate(keypoints3D)
    {
        const predictions = await this.#gestureEstimator.estimate(
            this.#landMarksConvert(keypoints3D),
            9 // de 90 porecento de certeza que o elemento é uma mão
        );
        return predictions.gestures;
    }

    async * detectGestures(predictions)
    {
        for(const hand of predictions)
        {
            if(!hand.keypoints3D) continue;

            const gestures = await this.estimate(hand.keypoints3D);
            

            if(!gestures.length) continue;

            const result = gestures.reduce(
                (previous, current) => (previous.score > current.score) ? previous : current
            );

            const { x, y } = hand.keypoints.find( keypoint => keypoint.name === "index_finger_tip");

            yield { event: result.name, x, y}
            console.log("dectected mão" , this.#gestureStrings[result.name]);
        }
    }


    #landMarksConvert(keypoints3D)
    {
        return keypoints3D.map(keypoint => 
            [keypoint.x, keypoint.y, keypoint.z]
        )
    }

   
    async detectorHands(video)
    {
     
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

