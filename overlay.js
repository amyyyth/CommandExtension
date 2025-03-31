document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('commandInput');
    const overlay = document.querySelector('.overlay');
    const settingsLink = document.getElementById('settingsLink');
  
    // Close overlay
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        window.close();
      }
    });
  
    // Handle settings link
    settingsLink.addEventListener('click', () => {
      chrome.runtime.sendMessage({ action: 'openSettings' });
      window.close();
    });
  
    // Handle input
    input.addEventListener('keydown', async (e) => {
      if (e.key === 'Enter') {
        const command = input.value.trim();
        chrome.runtime.sendMessage({ action: 'handleCommand', command });
        window.close();
      }
    });
  });