chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.msg === 'savePage') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      sendResponse({ currentTabTitle: tabs[0].title });
    });
    return true;
  } else if (request.msg === 'savePagesAll') {
    chrome.tabs.query({ windowId: chrome.windows.WINDOW_ID_CURRENT }, (tabs) => {
      let tabsTitles = [];
      tabs.forEach((tab) => {
        let newItem = {
          currentTabTitle: tab.title,
        };
        tabsTitles.push(newItem);
      });
      sendResponse({ currentTabTitles: tabsTitles });
    });
    return true;
  }
});
