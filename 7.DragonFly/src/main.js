const getByte = src => fetch(src)
    .then(res => res.blob())
    .then(data => (data.size / 1024).toFixed(2) + 'kB');

const showInfo = (el, byte) => (el.title = `真实尺寸: ${ el.naturalWidth }*${ el.naturalHeight }\n显示尺寸:${ el.width }*${ el.height }\n存储大小:${ byte }`);

document.addEventListener('mouseover', e => {
    //移动到图片元素上时、则显示信息
    e.target.tagName.toUpperCase() === 'IMG' && getByte(e.target.src).then(byte => showInfo(e.target,byte));
}, true);

document.addEventListener('dragend', async e => {
    if (e.target.tagName.toUpperCase() === 'IMG') {
        const response = await chrome.runtime.sendMessage({ type:'down', data: e.target.src });
        console.log(response);
    }
});

const btn = document.createElement('button');
btn.innerHTML = '跨域';
btn.style.position = 'fixed';
btn.style.top = 0;
btn.style.right = 0;
btn.style.fontSize = '32px';
btn.style.zIndex = 10e9;
document.body.appendChild(btn);
// btn.onclick = async () => {
btn.onclick = async function () {
    window.chomeObj = chrome;
    const response = await chrome.runtime.sendMessage({ command: 'crossDomainRequest' });
    console.log('response', response);
    // chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    //     if (message.type === 'images') {
    //         var imgs = [...document.querySelectorAll('img')];
    //         var srcs = imgs.map(img => img.src);
    //         sendResponse(srcs);
    //     }
    // });

};

// btn.onclick = callback => {
//     // 只有在这个函数中，才能拿到一些变量
//     console.log(btn.innerText, btn.testAttr);
// };
console.log('666')
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('123123123', message)
    if (message.type === 'images') {
        var imgs = [...document.querySelectorAll('img')];
        var srcs = imgs.map(img => img.src);
        sendResponse(srcs);
    }
});
