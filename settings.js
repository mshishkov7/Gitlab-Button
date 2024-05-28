document.addEventListener('DOMContentLoaded', () => {
    const urlsTextarea = document.getElementById('urls');
    const saveButton = document.getElementById('save');
  
    // Load saved URLs from storage
    chrome.storage.sync.get('additionalUrls', (data) => {
      urlsTextarea.value = data.additionalUrls ? data.additionalUrls.join('\n') : '';
    });
  
    // Save URLs to storage
    saveButton.addEventListener('click', () => {
      const urls = urlsTextarea.value.split('\n').filter((url) => url.trim() !== '');
      chrome.storage.sync.set({ additionalUrls: urls }, () => {
        console.log('Additional URLs saved.');
      });
    });
  });