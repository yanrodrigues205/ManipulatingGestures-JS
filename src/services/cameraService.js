export default class CameraService
{
    constructor()
    {
        this.video = document.createElement("video");
    }

    static async init()
    {
        if(!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia)
        {
            throw new Error(`The browser does not supporte the use of the camera function! ,
                            O seu navegador não suporta a utilização da camêra!`);
        }

        const videoConfig = {
            audio: false,
            video: {
                width: globalThis.screen.availWidth,
                height: globalThis.screen.availHeight
            },
            frameRate: {
                ideal: 60
            }
        }

        

        const stream = await navigator.mediaDevices.getUserMedia(videoConfig);
        const camera = new CameraService();
         camera.video.srcObject = stream;
        // camera.video.height = 240;
        // camera.video.width = 320;
        // document.body.prepend(camera.video)

        await new Promise((resolve) => {
            camera.video.onloadedmetadata = () => {
                resolve(camera.video)
            } 
        });

        camera.video.play();

        return camera;
    }
}