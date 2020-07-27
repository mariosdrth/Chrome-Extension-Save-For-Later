chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.msg === 'savePage') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      sendResponse({
        currentTab: {
          title: tabs[0].title,
          id: tabs[0].id,
          favIconUrl: tabs[0].favIconUrl,
          url: tabs[0].url,
        },
      });
    });
    return true;
  } else if (request.msg === 'savePagesAll') {
    chrome.tabs.query({ windowId: chrome.windows.WINDOW_ID_CURRENT }, (tabs) => {
      let tabsToSave = tabs.map((tab) => ({
        title: tab.title,
        id: tab.id,
        favIconUrl: tab.favIconUrl,
        url: tab.url,
      }));
      sendResponse({ currentTabs: tabsToSave });
    });
    return true;
  } else if (request.msg === 'openAll') {
    request.tabsToOpen.forEach((tab) => {
      chrome.tabs.create({ url: tab.url, active: false });
    });
  } else if (request.msg === 'openPage') {
    chrome.tabs.create({ url: request.url, active: false }, () => {
      sendResponse({ msg: 'OK' });
    });
    return true;
  }
});
