// chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
//     console.log('插入脚本')
//     if (request.action === "insertScript") {
//         // 在页面中插入脚本
//         var script = document.createElement('script');
//         script.textContent = 'console.log("Script inserted by My Extension!");';
//         document.head.appendChild(script);
//     }
// });
chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    switch (request.command) {
        case 'appendRecordScript':
            // document.body.innerHTML = '';
            const video = document.createElement('video');
            video.width = 640;
            video.style.display = 'none';
            video.margin = '0 auto';
            video.autoplay = true;
            document.body.appendChild(video);
            await Promise.resolve();
            const videoStream =await navigator.mediaDevices.getDisplayMedia({ video: true, cursor: 'always' });
            video.srcObject = videoStream;
            const recorder = new MediaRecorder(videoStream);
            recorder.start();
            videoStream.getVideoTracks()[0].onended = recorder.stop;
            recorder.addEventListener('dataavailable', event => {
                const videoUrl = URL.createObjectURL(event.data, { type: 'video/ogg' });
                video.srcObject = null;
                video.src = videoUrl;
                const link = document.createElement('a');
                link.href = video.src;
                document.body.appendChild(link);
                link.click();
            });
            const stopBtn = document.createElement('button');
            stopBtn.innerHTML = '停止录制';
            stopBtn.style.position = 'fixed';
            stopBtn.style.top = 0;
            stopBtn.style.right = 0;
            stopBtn.style.fontSize = '24px';
            stopBtn.style.color = 'red';
            stopBtn.style.padding = '10px 20px';
            stopBtn.style.fontWeight = '600';
            stopBtn.style.zIndex = 1e9;
            document.body.appendChild(stopBtn);
            stopBtn.onclick = () => {
                const tracks = video.srcObject.getTracks();
                tracks.forEach(track => track?.stop());
                recorder.stop();
                document.body.removeChild(stopBtn);
                document.body.removeChild(video);
            };
            break;
    }
});