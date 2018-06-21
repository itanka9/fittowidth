chrome.browserAction.onClicked.addListener(function (tab) {
    chrome.tabs.sendMessage(tab.id, { cmd: 'toggle' });
})

chrome.runtime.onMessage.addListener(function (msg, sender) {
    if (msg.cmd === "status" && sender.tab) {
        chrome.browserAction.setIcon({
            path: msg.fit ? 'fitted.png' : 'default.png',
            tabId: sender.tab.id
        })
    }
})
