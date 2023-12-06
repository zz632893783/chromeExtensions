(async () => {
    // Sends a message to the service worker and receives a tip in response
    const { tip } = await chrome.runtime.sendMessage({ greeting: 'tip' });
    const nav = document.querySelector('.devsite-tabs-wrapper');
    const tipWidget = createDomElement(`
        <button popovertarget="tip-popover" popovertargetaction="show" style="padding: 0; border: none; background: none; border: 20px solid red; position: fixed; left: 50%; top: 200px; transform: translate(-50%, -50%); font-size: 100px; line-height: 2;">
            点我试试
        </button>
    `);
    const popover = createDomElement(`<div id='tip-popover' popover>${tip}</div>`);

    document.body.append(popover);
    nav.append(tipWidget);
})();

function createDomElement(html) {
    const dom = new DOMParser().parseFromString(html, 'text/html');
    return dom.body.firstElementChild;
}