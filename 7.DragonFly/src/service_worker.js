chrome.webRequest.onBeforeRequest.addListener(details => {
    console.log('Received command from content script:', details.url);
    return {};
}, { urls: ['<all_urls>'] }, ['blocking']);