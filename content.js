function isGitLabPage() {
    return (
      document.querySelector('meta[name="gitlab"]') !== null ||
      document.querySelector('body[data-page]') !== null
    );
  }
  
  function getCommitInfo() {
    const commitHeader = document.querySelector('.header-main-content');
  
    if (!commitHeader) return;
  
    const fullCommitSha = commitHeader.querySelector('[data-clipboard-text]')?.getAttribute('data-clipboard-text');
    const authorName = commitHeader.querySelector('.commit-author-name').textContent;
    const commitDate = commitHeader.querySelector('time').getAttribute('datetime');
  
    const commitInfo = [
      `commit ${fullCommitSha}`,
      `Author: ${authorName}`,
      `Date: ${new Date(commitDate).toString()}`,
    ].join('\n');
  
    return commitInfo;
  }
  
  function copyCommitInfo() {
    const commitInfo = getCommitInfo();
  
    if (commitInfo) {
      navigator.clipboard
        .writeText(commitInfo)
        .then(() => console.log('Commit info copied to clipboard'))
        .catch((err) => console.error('Failed to copy commit info: ', err));
    }
  }
  
  function addCopyButton() {
    const commitHeader = document.querySelector('.header-main-content');
  
    if (!commitHeader) return;
  
    const button = document.createElement('a');
    button.classList.add('gl-button', 'btn', 'btn-md', 'btn-default', 'gl-mr-3', 'gl-w-full', 'gl-sm-w-auto', 'gl-mb-3', 'gl-sm-mb-0');
    button.href = '#';
    button.addEventListener('click', (e) => {
      e.preventDefault();
      copyCommitInfo();
    });
  
    const textSpan = document.createElement('span');
    textSpan.classList.add('gl-button-text');
    textSpan.textContent = 'Copy Full Commit';
  
    button.appendChild(textSpan);
    commitHeader.insertAdjacentElement('afterbegin', button);
  }
  
  chrome.storage.sync.get('additionalUrls', (data) => {
    const additionalUrls = data.additionalUrls || [];
    const urlPatterns = ['https://gitlab.com/*', ...additionalUrls.map((url) => `*://${url}/*`)];
  
    if (urlPatterns.some((pattern) => new URL(window.location.href).href.match(pattern))) {
      if (isGitLabPage()) {
        addCopyButton();
      }
    }
  });