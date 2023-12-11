// const canvas = new OffscreenCanvas(16, 16);
// const context = canvas.getContext('2d');
// context.clearRect(0, 0, 16, 16);
// context.beginPath();
// context.moveTo(0, 8);
// context.lineTo(16, 8);
// context.lineTo(5, 16);
// context.lineTo(8, 0);
// context.lineTo(11, 16);
// context.closePath();
// context.stroke();
// const imageData = context.getImageData(0, 0, 16, 16);
// chrome.action.setIcon({imageData: imageData}, () => {
//  console.log('插件图标修改成功');
// });
// chrome.action.setBadgeBackgroundColor({ color: 'red' }, () => {
//  console.log('图标颜色修改成功')
// });
// background.js
// chrome.action.onClicked.addListener(tab => {
//  chrome.scripting.executeScript({
//      target: {tabId: tab.id},
//      files: ['content.js']
//  });
// });
// const monthMap = [
//     { label: '一月', value: 1 },
//     { label: '二月', value: 2 },
//     { label: '三月', value: 3 },
//     { label: '四月', value: 4 },
//     { label: '五月', value: 5 },
//     { label: '六月', value: 6 },
//     { label: '七月', value: 7 },
//     { label: '八月', value: 8 },
//     { label: '九月', value: 9 },
//     { label: '十月', value: 10 },
//     { label: '十一月', value: 11 },
//     { label: '十二月', value: 12 }
// ];
let tokenCache = ''
const getToken = (apiKey = '1eYMV9g2AdVFOz7Gaa0ykbj5', SecretKey = 'AtU4CUxfYlIYUUiaoxSEVsktkjy7yZmk') => {
    return new Promise(resolve => {
        if (tokenCache) {
            return resolve(tokenCache);
        }
        const url = `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${ apiKey }&client_secret=${ SecretKey }`;
        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({})
        })
            .then(response => response.json())
            .then(data => resolve(tokenCache = data?.access_token))
    })
};
const sendMessage = (content  = '', role = 'user', token) => {
    return new Promise(resolve => {
        const requestBody = {
            messages: [
                { role, content }
            ]
        };
        const url = `https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/eb-instant?access_token=${ token }`
        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        })
            .then(response => response.json())
            .then(response => resolve(response.result))
    });
};
const calendarUrl = 'http://10.10.120.20:8089/zentao/effort-calendar.html';
const homeUrl = 'http://10.10.120.20:8089/zentao/my/';

// chrome.action.onClicked.addListener(tab => {
//     chrome.tabs.create({ url: calendarUrl }, newTab => {
//         chrome.scripting.executeScript({
//             target: { tabId: newTab.id },
//             function: (backgroundWindow) => {
//                 window.onload = async () => {
//                     const calendarContainer = document.querySelector('.calendar-views');
//                     let observer;
//                     await new Promise(resolve => {
//                         observer = new MutationObserver((mutationsList, observer) => {
//                             [...mutationsList].forEach(mutation => {
//                                 mutation.type === 'childList' && document.querySelector('.cell-day') && resolve();
//                             });
//                         });
//                         observer.observe(calendarContainer, { childList: true, subtree: true });
//                     });
//                     observer.disconnect();
//                     const cells = [...document.querySelectorAll('.cell-day')];
//                     const thisweekDateRange = [];
//                     const date = new Date();
//                     date.setDate(date.getDate() - date.getDay() + 1);
//                     for (let i = 0; i < 7; i++) {
//                         thisweekDateRange.push({
//                             label: backgroundWindow.monthMap.find(n => n.value === (date.getMonth() + 1))?.label,
//                             date: date.getDate()
//                         });
//                         date.setDate(date.getDate() + 1);
//                     }
//                     cells.forEach(cell => (cell.querySelector('.month').style.display = 'inline-block'));
//                     await Promise.resolve();
//                     const thisWeekTasks = cells.map(cell => {
//                         const match = cell.innerText.match(/^(\d{4}年 ?)?([一二三四五六七八九十]{1,2}月) (\d{1,2})([\w\W]*)/);
//                         const month = backgroundWindow.monthMap.find(n => n.label = match[2]).label;
//                         const date = parseInt(match[3]);
//                         const content = match[4];
//                         return (thisweekDateRange.find(n => n.label === month && Number(n.date) === Number(date))) ? content : '';
//                     }).filter(n => !!n).join(';');
//                 };
//             },
//             args: [backgroundWindow]
//         }, results => {
//             console.log('result')
//             // var pageTitle = results[0];
//             // console.log('第三方页面标题:', pageTitle);
//         });
//     });
// });
chrome.action.onClicked.addListener(tab => {
    chrome.tabs.create({ url: `${calendarUrl}?generateReport=1` }, newTab => {})
});
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    (async () => {
        const command = request.command;
        switch (command) {
            case 'generateReport':
                console.log('sender', sender);
                const token = await getToken();
                const date = new Date();
                date.setDate(date.getDate() - date.getDay() + 1);
                const startYear = date.getFullYear();
                const startMonth = date.getMonth() + 1;
                const startDate = date.getDate();
                date.setDate(date.getDate() + 4);
                const endYear = date.getFullYear();
                const endMonth = date.getMonth() + 1;
                const endDate = date.getDate();
                const content = `
                    本周上班时间是 ${ startYear }年${ startMonth }月${ startDate }日 - ${ endYear }年${ endMonth }月${ endDate }日
                    以下是我这周的工作内容，帮我总结一篇周报
                    ${ request.content }
                `;
                const report = await sendMessage(content, 'user', token);
                sendResponse({ result: report });
        }
    })();
    return true;
});
// (async () => {
//     const [ tab ] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
//     const token = await getToken();
//     console.log(`文档方法`, token);
//     const response = await chrome.tabs.sendMessage(tab.id, { token });
// })();