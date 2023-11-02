import "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-core@4.2.0/dist/tf-core.min.js"
import "https://unpkg.com/@tensorflow/tfjs-backend-webgl@3.7.0/dist/tf-backend-webgl.min.js"
import "https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1646424915/hands.min.js"
import "https://cdn.jsdelivr.net/npm/@tensorflow-models/hand-pose-detection@2.0.0/dist/hand-pose-detection.min.js" // detecção de mãoes retornando arrays de informações
import "https://cdn.jsdelivr.net/npm/fingerpose@0.1.0/dist/fingerpose.min.js" //manipular resultados do tensor flow, e transformando em gestos
//IMPORTAÇÕES DAS BIBLIOTECAS

import HandController from "../controllers/handController.js";
import HandView from "../views/handView.js";
import HandService from "../services/handService.js";
import CameraService from "../services/cameraService.js"
import { fingerIndecex, gestureStrings, knownGestures } from "../services/keypointHandsService.js"

const styler = new PseudoStyler();
const camera = await CameraService.init();
const handFactory = {
    async initialize()
    {
        return HandController.initialize({
            camera,
            view: new HandView({
                fingerIndecex,
                styler
            }),
            service: new HandService({
                fingerpose: window.fp,
                handPoseDetection: window.handPoseDetection,
                handsVersion: window.VERSION,
                gestureStrings,
                knownGestures
            }),
          
        });
       
        
    }
}

export default handFactory;