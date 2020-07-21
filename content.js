const root = document.documentElement;
let savedPages = [];

document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.sync.get('savedPagesInStorage', (data) => updateList(data.savedPagesInStorage, true));
  chrome.storage.sync.get('theme', (data) => checkThemeOnStart(data.theme));
  document.getElementById('theme').addEventListener('click', (event) => toggleTheme(event.target.checked));
  document.getElementById('remove').addEventListener('click', (event) => toggleRemoveOnOpen(event.target.checked));

  document
    .getElementById('btn-save-page')
    .addEventListener('click', () => chrome.runtime.sendMessage({ msg: 'savePage' }, (response) => savePage(response)));
});

const updateList = (savedPagesPassed, initial = false) => {
  const ul = document.getElementById('pages-list');
  const emptyLi = '<li id="empty-list">No Pages!</li>';
  if (initial) savedPages = savedPagesPassed || [];
  if (savedPages.length > 0) {
    ul.innerHTML = '';
    ul.classList.remove('empty-list');
    savedPages.forEach((page) => {
      let li = document.createElement('li');
      li.innerHTML = `<a class="list-item">${page.currentTabTitle}</a>`;
      ul.appendChild(li);
    });
  } else {
    ul.innerHTML = emptyLi;
    ul.classList.add('empty-list');
  }
};

const savePage = (pageTitle) => {
  savedPages.push(pageTitle);
  chrome.storage.sync.set({ savedPagesInStorage: savedPages });
  updateList(savedPages);
};

const checkThemeOnStart = (theme) => {
  if (theme === 'light') {
    root.style.setProperty('--main-back-color', '#fcfcfc');
    root.style.setProperty('--main-color', '#313131');
    document.getElementById('theme').checked = false;
  } else {
    root.style.setProperty('--main-back-color', '#313131');
    root.style.setProperty('--main-color', '#fcfcfc');
    document.getElementById('theme').checked = true;
  }
};

const toggleTheme = (dark) => {
  if (dark) {
    root.style.setProperty('--main-back-color', '#313131');
    root.style.setProperty('--main-color', '#fcfcfc');
    chrome.storage.sync.set({ theme: 'dark' });
  } else {
    root.style.setProperty('--main-back-color', '#fcfcfc');
    root.style.setProperty('--main-color', '#313131');
    chrome.storage.sync.set({ theme: 'light' });
  }
};

const toggleRemoveOnOpen = (remove) => {
  chrome.storage.sync.set({ savedPagesInStorage: null });
  if (remove) {
    chrome.storage.sync.set({ remove: true });
  } else {
    chrome.storage.sync.set({ remove: false });
  }
};
