document.addEventListener("DOMContentLoaded", function () {
  const input = document.getElementById("commandInput");
  const settingsLink = document.getElementById("settingsLink");

  // Default settings in case storage is empty
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
    "-h": "chrome://history",
  };

  // Load settings from storage
  chrome.storage.sync.get(['searchEngines', 'quickLinks'], function(result) {
    const searchEngines = result.searchEngines || defaultSearchEngines;
    const quickLinks = result.quickLinks || defaultQuickLinks;
    
    // Update placeholder text with some examples
    updatePlaceholder(searchEngines, quickLinks);
    
    // Handle input commands
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        const command = input.value.trim();
        
        // Check if it's just a quick link command
        if (quickLinks[command]) {
          chrome.tabs.create({ url: quickLinks[command] });
          input.value = "";
          window.close();
          return;
        }
        
        // Check if it's a search engine command without a query
        if (searchEngines[command]) {
          // If just the search engine flag is entered, navigate to its homepage
          chrome.tabs.create({ url: searchEngines[command].homepage || extractHomepage(searchEngines[command].url) });
          input.value = "";
          window.close();
          return;
        }
        
        // Check if it's a search command with query
        const parts = command.split(" ");
        const suffix = parts[parts.length - 1];
        
        if (parts.length > 1 && searchEngines[suffix]) {
          const query = parts.slice(0, -1).join(" ");
          chrome.tabs.create({ url: searchEngines[suffix].url + encodeURIComponent(query) });
          input.value = "";
          window.close();
          return;
        }
        
        // If it's not a command, default to Google search
        if (command && !command.startsWith("-")) {
          chrome.tabs.create({ url: "https://www.google.com/search?q=" + encodeURIComponent(command) });
          input.value = "";
          window.close();
        }
      }
    });
  });
  
  // Open settings page
  settingsLink.addEventListener("click", function() {
    chrome.runtime.openOptionsPage();
    window.close();
  });
  
  // Update placeholder with examples based on current settings
  function updatePlaceholder(searchEngines, quickLinks) {
    // Get a random search engine and quick link for examples
    const searchFlags = Object.keys(searchEngines);
    const quickLinkFlags = Object.keys(quickLinks);
    
    const randomSearchFlag = searchFlags[Math.floor(Math.random() * searchFlags.length)];
    const randomQuickFlag = quickLinkFlags[Math.floor(Math.random() * quickLinkFlags.length)];
    
    const searchName = searchEngines[randomSearchFlag]?.name || "Google";
    
    input.placeholder = `Search or use commands (e.g., "cats ${randomSearchFlag}" for ${searchName} or "${randomQuickFlag}" for quick access)`;
  }
  
  // Extract homepage from search URL if no homepage is specified
  function extractHomepage(url) {
    try {
      const urlObj = new URL(url);
      return urlObj.protocol + "//" + urlObj.hostname;
    } catch (e) {
      return url.split("/").slice(0, 3).join("/"); // Fallback method
    }
  }

  // Focus on input when popup opens
  input.focus();
});