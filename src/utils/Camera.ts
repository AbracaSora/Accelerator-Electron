const canvas = document.createElement('canvas') as HTMLCanvasElement;
const video = document.createElement('video') as HTMLVideoElement;
export function StartCamera() {
    const constraints = {
        video: true
    };
    navigator.mediaDevices.getUserMedia(constraints)
        .then((stream) => {
            video.srcObject = stream;
        });
    video.play();
}
export function Capture(): string{
    canvas.width = 1280;
    canvas.height = 720;
    const context :CanvasRenderingContext2D | null = canvas.getContext('2d');
    context!.drawImage(video, 0, 0, 1280, 720);
    return canvas.toDataURL('image/jpeg');
}