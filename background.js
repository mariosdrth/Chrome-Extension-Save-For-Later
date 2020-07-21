chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.msg === 'savePage') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      sendResponse({ currentTabTitle: tabs[0].title });
    });
    return true;
  }
});
