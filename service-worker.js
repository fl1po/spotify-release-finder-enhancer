chrome.tabs.onUpdated.addListener((tabId, info) => {
    if (info.status === 'complete') {
        chrome.scripting.executeScript({
            target: {tabId},
            files: ['index.js']
        });
    }
});