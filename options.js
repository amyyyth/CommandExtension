document.addEventListener('DOMContentLoaded', function() {
    // Default settings
    const defaultSearchEngines = {
      "-g": { name: "Google", url: "https://www.google.com/search?q=", homepage: "https://www.google.com" },
      "-y": { name: "YouTube", url: "https://www.youtube.com/results?search_query=", homepage: "https://www.youtube.com" },
      "-gh": { name: "GitHub", url: "https://github.com/search?q=", homepage: "https://github.com" },
      "-w": { name: "Wikipedia", url: "https://en.wikipedia.org/w/index.php?search=", homepage: "https://www.wikipedia.org" },
      "-ym": { name: "YT music", url: "https://music.youtube.com/search?q=", homepage: "https://music.youtube.com" },
      "-ddg": { name: "DuckDuckGo", url: "https://duckduckgo.com/?q=", homepage: "https://duckduckgo.com" },
      "-b": { name: "Bing", url: "https://www.bing.com/search?q=", homepage: "https://www.bing.com" },
      "-a": { name: "Amazon", url: "https://www.amazon.com/s?k=", homepage: "https://www.amazon.com" },
      "-r": { name: "Reddit", url: "https://www.reddit.com/search/?q=", homepage: "https://www.reddit.com" },
      "-imdb": { name: "IMDb", url: "https://www.imdb.com/find?q=", homepage: "https://www.imdb.com" },
      "-tw": { name: "Twitter", url: "https://x.com/search?q=", homepage: "https://x.com" },
      "-gi": { name: "Google Images", url: "https://www.google.com/search?tbm=isch&q=", homepage: "https://www.google.com/imghp" }
    };
    
    const defaultQuickLinks = {
      "-r": "https://www.reddit.com",
      "-t": "https://x.com",
      "-m": "https://mail.google.com",
      "-ch": "https://chatgpt.com",
      "-cl": "https://claude.ai",
      "-ds": "https://chat.deepseek.com",
      "-n": "https://www.netflix.com",
      "-h": "chrome://history"
    };
  
    // Load settings
    function loadSettings() {
      chrome.storage.sync.get(['searchEngines', 'quickLinks'], function(result) {
        const searchEngines = result.searchEngines || defaultSearchEngines;
        const quickLinks = result.quickLinks || defaultQuickLinks;
        
        // Populate search engines table
        populateSearchEnginesTable(searchEngines);
        
        // Populate quick links table
        populateQuickLinksTable(quickLinks);
      });
    }
    
    // Populate search engines table
    function populateSearchEnginesTable(searchEngines) {
      const tbody = document.getElementById('searchEnginesBody');
      tbody.innerHTML = '';
      
      Object.entries(searchEngines).forEach(([flag, data]) => {
        const row = document.createElement('tr');
        
        const flagCell = document.createElement('td');
        const flagInput = document.createElement('input');
        flagInput.type = 'text';
        flagInput.value = flag;
        flagInput.className = 'flag-input';
        flagCell.appendChild(flagInput);
        
        const nameCell = document.createElement('td');
        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.value = data.name;
        nameInput.className = 'name-input';
        nameCell.appendChild(nameInput);
        
        const urlCell = document.createElement('td');
        const urlInput = document.createElement('input');
        urlInput.type = 'text';
        urlInput.value = data.url;
        urlInput.className = 'url-input';
        urlCell.appendChild(urlInput);
        
        const homepageCell = document.createElement('td');
        const homepageInput = document.createElement('input');
        homepageInput.type = 'text';
        homepageInput.value = data.homepage || extractHomepage(data.url);
        homepageInput.className = 'homepage-input';
        homepageCell.appendChild(homepageInput);
        
        const actionCell = document.createElement('td');
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'delete';
        deleteButton.addEventListener('click', function() {
          row.remove();
        });
        actionCell.appendChild(deleteButton);
        
        row.appendChild(flagCell);
        row.appendChild(nameCell);
        row.appendChild(urlCell);
        row.appendChild(homepageCell);
        row.appendChild(actionCell);
        
        tbody.appendChild(row);
      });
    }
    
    // Populate quick links table
    function populateQuickLinksTable(quickLinks) {
      const tbody = document.getElementById('quickLinksBody');
      tbody.innerHTML = '';
      
      Object.entries(quickLinks).forEach(([flag, url]) => {
        const row = document.createElement('tr');
        
        const flagCell = document.createElement('td');
        const flagInput = document.createElement('input');
        flagInput.type = 'text';
        flagInput.value = flag;
        flagInput.className = 'flag-input';
        flagCell.appendChild(flagInput);
        
        const urlCell = document.createElement('td');
        const urlInput = document.createElement('input');
        urlInput.type = 'text';
        urlInput.value = url;
        urlInput.className = 'url-input';
        urlCell.appendChild(urlInput);
        
        const actionCell = document.createElement('td');
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'delete';
        deleteButton.addEventListener('click', function() {
          row.remove();
        });
        actionCell.appendChild(deleteButton);
        
        row.appendChild(flagCell);
        row.appendChild(urlCell);
        row.appendChild(actionCell);
        
        tbody.appendChild(row);
      });
    }
    
    // Add a new search engine row
    document.getElementById('addSearchEngine').addEventListener('click', function() {
      const tbody = document.getElementById('searchEnginesBody');
      const row = document.createElement('tr');
      
      const flagCell = document.createElement('td');
      const flagInput = document.createElement('input');
      flagInput.type = 'text';
      flagInput.placeholder = '-flag';
      flagInput.className = 'flag-input';
      flagCell.appendChild(flagInput);
      
      const nameCell = document.createElement('td');
      const nameInput = document.createElement('input');
      nameInput.type = 'text';
      nameInput.placeholder = 'Name';
      nameInput.className = 'name-input';
      nameCell.appendChild(nameInput);
      
      const urlCell = document.createElement('td');
      const urlInput = document.createElement('input');
      urlInput.type = 'text';
      urlInput.placeholder = 'https://example.com/search?q=';
      urlInput.className = 'url-input';
      urlCell.appendChild(urlInput);
      
      const homepageCell = document.createElement('td');
      const homepageInput = document.createElement('input');
      homepageInput.type = 'text';
      homepageInput.placeholder = 'https://example.com';
      homepageInput.className = 'homepage-input';
      homepageCell.appendChild(homepageInput);
      
      const actionCell = document.createElement('td');
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      deleteButton.className = 'delete';
      deleteButton.addEventListener('click', function() {
        row.remove();
      });
      actionCell.appendChild(deleteButton);
      
      row.appendChild(flagCell);
      row.appendChild(nameCell);
      row.appendChild(urlCell);
      row.appendChild(homepageCell);
      row.appendChild(actionCell);
      
      tbody.appendChild(row);
    });
    
    // Add a new quick link row
    document.getElementById('addQuickLink').addEventListener('click', function() {
      const tbody = document.getElementById('quickLinksBody');
      const row = document.createElement('tr');
      
      const flagCell = document.createElement('td');
      const flagInput = document.createElement('input');
      flagInput.type = 'text';
      flagInput.placeholder = '-flag';
      flagInput.className = 'flag-input';
      flagCell.appendChild(flagInput);
      
      const urlCell = document.createElement('td');
      const urlInput = document.createElement('input');
      urlInput.type = 'text';
      urlInput.placeholder = 'https://example.com';
      urlInput.className = 'url-input';
      urlCell.appendChild(urlInput);
      
      const actionCell = document.createElement('td');
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      deleteButton.className = 'delete';
      deleteButton.addEventListener('click', function() {
        row.remove();
      });
      actionCell.appendChild(deleteButton);
      
      row.appendChild(flagCell);
      row.appendChild(urlCell);
      row.appendChild(actionCell);
      
      tbody.appendChild(row);
    });
    
    // Save settings
    document.getElementById('saveSettings').addEventListener('click', function() {
      // Collect search engines data
      const searchEngines = {};
      document.querySelectorAll('#searchEnginesBody tr').forEach(row => {
        const flag = row.querySelector('.flag-input').value.trim();
        const name = row.querySelector('.name-input').value.trim();
        const url = row.querySelector('.url-input').value.trim();
        const homepage = row.querySelector('.homepage-input').value.trim();
        
        if (flag && name && url) {
          searchEngines[flag] = { name, url, homepage };
        }
      });
      
      // Collect quick links data
      const quickLinks = {};
      document.querySelectorAll('#quickLinksBody tr').forEach(row => {
        const flag = row.querySelector('.flag-input').value.trim();
        const url = row.querySelector('.url-input').value.trim();
        
        if (flag && url) {
          quickLinks[flag] = url;
        }
      });
      
      // Save to storage
      chrome.storage.sync.set({ searchEngines, quickLinks }, function() {
        const statusMessage = document.getElementById('statusMessage');
        statusMessage.textContent = 'Settings saved successfully!';
        statusMessage.className = 'status success';
        statusMessage.style.display = 'block';
        
        setTimeout(function() {
          statusMessage.style.display = 'none';
        }, 3000);
      });
    });
    
    // Reset to defaults
    document.getElementById('resetDefaults').addEventListener('click', function() {
      if (confirm('Are you sure you want to reset all settings to defaults?')) {
        chrome.storage.sync.set({ 
          searchEngines: defaultSearchEngines, 
          quickLinks: defaultQuickLinks 
        }, function() {
          loadSettings();
          
          const statusMessage = document.getElementById('statusMessage');
          statusMessage.textContent = 'Settings reset to defaults!';
          statusMessage.className = 'status success';
          statusMessage.style.display = 'block';
          
          setTimeout(function() {
            statusMessage.style.display = 'none';
          }, 3000);
        });
      }
    });
    
    // Extract homepage from search URL
    function extractHomepage(url) {
      try {
        const urlObj = new URL(url);
        return urlObj.protocol + "//" + urlObj.hostname;
      } catch (e) {
        return url.split("/").slice(0, 3).join("/"); // Fallback method
      }
    }
    
    // Load settings on page load
    loadSettings();
  });