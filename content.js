const root = document.documentElement;
let savedPages = [];

document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.sync.get('savedPagesInStorage', (data) => updateList(data.savedPagesInStorage, true));
  chrome.storage.sync.get('theme', (data) => checkThemeOnStart(data.theme));
  document.getElementById('btn-save-page').addEventListener('click', () => chrome.runtime.sendMessage({ msg: 'savePage' }, (response) => savePage(response)));
  document.getElementById('btn-save-pages-all').addEventListener('click', () => chrome.runtime.sendMessage({ msg: 'savePagesAll' }, (response) => savePagesAll(response)));
  document.getElementById('btn-remove-all').addEventListener('click', () => removeAll());
  document.getElementById('btn-open-all').addEventListener('click', () => {
    chrome.runtime.sendMessage({ msg: 'openAll', tabsToOpen: savedPages });
    chrome.storage.sync.get('remove', (data) => {
      if (data.remove) {
        removeAll();
      }
    });
  });
  document.getElementById('options-link').addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
  });
});

const updateList = (savedPagesPassed, initial = false) => {
  const ul = document.getElementById('pages-list');
  const emptyLi = '<li id="empty-list">No Pages!</li>';
  if (initial) savedPages = savedPagesPassed || [];
  if (savedPages.length > 0) {
    ul.innerHTML = '';
    ul.classList.remove('empty-list');
    savedPages.forEach((page, index) => {
      let li = document.createElement('li');
      li.classList.add('list-li');
      li.innerHTML = `<a class="del-page-btn" id="close-${index}">&#10060;</a><a class="list-item" id="open-${index}"><img class="list-item-img" id="img-${index}" src="${page.favIconUrl || './no-icon.png'}" alt="icon"/><div id="text-${index}" class="list-item-text">${page.title}</div></a>`;
      ul.appendChild(li);
    });
    Array.from(document.getElementsByClassName('del-page-btn')).forEach((element) =>
      element.addEventListener('click', (event) => {
        savedPages.splice(parseInt(event.target.id.split('-')[1]), 1);
        chrome.storage.sync.set({ savedPagesInStorage: savedPages });
        updateList(savedPages);
      })
    );
    Array.from(document.getElementsByClassName('list-item')).forEach((element) =>
      element.addEventListener('click', (event) => {
        chrome.runtime.sendMessage({ msg: 'openPage', url: savedPages[parseInt(event.target.id.split('-')[1])].url }, (response) => {
          if (response.msg === 'OK') {
            console.log('ok');
            chrome.storage.sync.get('remove', (data) => {
              if (data.remove) {
                savedPages.splice(parseInt(event.target.id.split('-')[1]), 1);
                chrome.storage.sync.set({ savedPagesInStorage: savedPages });
                updateList(savedPages);
              }
            });
          }
        });
      })
    );
  } else {
    ul.innerHTML = emptyLi;
    ul.classList.add('empty-list');
  }
  updateDisabledButtons();
};

const savePage = (response) => {
  const savedPagesUpdated = savedPages.slice();
  savedPagesUpdated.push(response.currentTab);
  chrome.storage.sync.set({ savedPagesInStorage: savedPagesUpdated }, () => {
    if (chrome.runtime.lastError) {
      return alert('Storage Limit Reached');
    } else {
      savedPages = savedPagesUpdated.slice();
      updateList(savedPages);
    }
  });
};

const savePagesAll = (response) => {
  const savedPagesUpdated = savedPages.slice();
  response.currentTabs.forEach((page) => savedPagesUpdated.push(page));
  chrome.storage.sync.set({ savedPagesInStorage: savedPagesUpdated }, () => {
    if (chrome.runtime.lastError) {
      return alert('Storage Limit Reached');
    } else {
      savedPages = savedPagesUpdated.slice();
      updateList(savedPages);
    }
  });
};

const checkThemeOnStart = (theme) => {
  if (theme === 'light') {
    root.style.setProperty('--main-back-color', '#fcfcfc');
    root.style.setProperty('--main-color', '#313131');
  } else {
    root.style.setProperty('--main-back-color', '#313131');
    root.style.setProperty('--main-color', '#fcfcfc');
  }
};

const updateDisabledButtons = () => {
  if (isSavedPagesEmpty()) {
    document.getElementById('btn-open-all').disabled = true;
    document.getElementById('btn-remove-all').disabled = true;
  } else {
    document.getElementById('btn-open-all').disabled = false;
    document.getElementById('btn-remove-all').disabled = false;
  }
};

const isSavedPagesEmpty = () => {
  return savedPages.length === 0;
};

const removeAll = () => {
  chrome.storage.sync.set({ savedPagesInStorage: [] });
  savedPages = [];
  updateList(savedPages);
};
