// content.js
const url = 'http://10.10.120.20:8089';
const loginUrl = 'http://10.10.120.20:8089/zentao/user-login.html';
// window.open(loginUrl, '_blank');

// chrome.runtime.onMessage.addListener(
//     function(request, sender, sendResponse) {
//         console.log("收到来自background页面的消息:", request);
//         sendResponse({ result: "消息已收到" });
//     }
// );
const monthMap = [
    { label: '一月', value: 1 },
    { label: '二月', value: 2 },
    { label: '三月', value: 3 },
    { label: '四月', value: 4 },
    { label: '五月', value: 5 },
    { label: '六月', value: 6 },
    { label: '七月', value: 7 },
    { label: '八月', value: 8 },
    { label: '九月', value: 9 },
    { label: '十月', value: 10 },
    { label: '十一月', value: 11 },
    { label: '十二月', value: 12 }
];
(async () => {
    if (!window.location.href.includes('generateReport=1')) {
        return false;
    }
    const calendarContainer = document.querySelector('.calendar-views');
    const loadingMask = document.createElement('div');
    loadingMask.style.position = 'fixed';
    loadingMask.style.top = 0;
    loadingMask.style.right = 0;
    loadingMask.style.bottom = 0;
    loadingMask.style.left = 0;
    loadingMask.style.backgroundColor = 'rgba(0, 0, 0, 0.75)';
    loadingMask.style.fontSize = '100px';
    loadingMask.style.display = 'grid';
    loadingMask.style.alignItems = 'center';
    loadingMask.style.justifyContent = 'center';
    loadingMask.style.color = 'white';
    loadingMask.style.zIndex = 10e9;
    loadingMask.innerHTML = '生成中...';
    document.body.appendChild(loadingMask);
    let observer;
    await new Promise(resolve => {
        observer = new MutationObserver((mutationsList, observer) => {
            [...mutationsList].forEach(mutation => {
                mutation.type === 'childList' && document.querySelector('.cell-day') && resolve();
            });
        });
        observer.observe(calendarContainer, { childList: true, subtree: true });
    });
    observer.disconnect();
    const cells = [...document.querySelectorAll('.cell-day')];
    const thisweekDateRange = [];
    const date = new Date();
    date.setDate(date.getDate() - date.getDay() + 1);
    for (let i = 0; i < 7; i++) {
        thisweekDateRange.push({
            label: monthMap.find(n => n.value === (date.getMonth() + 1))?.label,
            date: date.getDate()
        });
        date.setDate(date.getDate() + 1);
    }
    const thisWeekContent = cells.map(cell => {
        const contetText = `${ cell.querySelector('.month')?.innerText || '' } ${ cell.querySelector('.number')?.innerText || '' } ${ cell.querySelector('.events')?.innerText || '' }`;
        const match = contetText.match(/^(\d{4}年 ?)?([一二三四五六七八九十]{1,2}月) (\d{1,2})([\w\W]*)/);
        const month = monthMap.find(n => n.label = match[2]).label;
        const date = parseInt(match[3]);
        const content = match[4];
        return (thisweekDateRange.find(n => n.label === month && Number(n.date) === Number(date))) ? content : '';
    }).filter(n => !!n.trim()).join(';');
    const response = await chrome.runtime.sendMessage({ command: 'generateReport', content: thisWeekContent });
    loadingMask.style.fontSize = '14px';
    loadingMask.style.display = 'block';
    loadingMask.style.padding = '32px';
    loadingMask.innerHTML = response.result.replace(/\n/g, '<br />');
})();
