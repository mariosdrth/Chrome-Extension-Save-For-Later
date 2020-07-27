const saveOptions = () => {
  const remove = document.getElementById('remove').checked;
  const theme = document.getElementById('theme').checked ? 'dark' : 'light';
  chrome.storage.sync.set({ remove: remove, theme: theme }, () => {
    const status = document.getElementById('status');
    status.style.visibility = 'visible';
    setTimeout(() => {
      status.style.visibility = 'hidden';
    }, 1000);
  });
};

const restoreOptions = () => {
  chrome.storage.sync.get(
    {
      remove: true,
      theme: 'dark',
    },
    (items) => {
      document.getElementById('remove').checked = items.remove;
      document.getElementById('theme').checked = items.theme === 'dark';
    }
  );
};
document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);
