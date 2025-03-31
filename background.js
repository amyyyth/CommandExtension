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
  
  // Extract homepage from search URL if no homepage is specified
  function extractHomepage(url) {
    try {
      const urlObj = new URL(url);
      return urlObj.protocol + "//" + urlObj.hostname;
    } catch (e) {
      return url.split("/").slice(0, 3).join("/"); // Fallback method
    }
  }
  
  // Set the default suggestion
  chrome.omnibox.setDefaultSuggestion({
    description: 'Search Commander: Type a command or search query'
  });
  
  // Handle input changes (for suggestions)
  chrome.omnibox.onInputChanged.addListener((text, suggest) => {
    chrome.storage.sync.get(['searchEngines', 'quickLinks'], function(result) {
      const searchEngines = result.searchEngines || defaultSearchEngines;
      const quickLinks = result.quickLinks || defaultQuickLinks;
      
      const suggestions = [];
      const parts = text.split(' ');
      
      // Show suggestions for commands when user types a dash
      if (text.startsWith('-') && !text.includes(' ')) {
        // Suggest search engines
        Object.entries(searchEngines).forEach(([flag, data]) => {
          if (flag.startsWith(text)) {
            suggestions.push({
              content: flag,
              description: `Search Engine: <match>${flag}</match> - ${data.name}`
            });
          }
        });
        
        // Suggest quick links
        Object.entries(quickLinks).forEach(([flag, url]) => {
          if (flag.startsWith(text)) {
            suggestions.push({
              content: flag,
              description: `Quick Link: <match>${flag}</match> - ${url}`
            });
          }
        });
      }
      
      // Check if the last part might be a command
      if (parts.length > 1) {
        const lastPart = parts[parts.length - 1];
        if (lastPart.startsWith('-')) {
          const query = parts.slice(0, -1).join(' ');
          
          // Suggest search engines for the query
          Object.entries(searchEngines).forEach(([flag, data]) => {
            if (flag.startsWith(lastPart)) {
              suggestions.push({
                content: `${query} ${flag}`,
                description: `Search <match>${query}</match> with ${data.name}`
              });
            }
          });
        }
      }
      
      suggest(suggestions);
    });
  });
  
  // Handle when the user accepts a suggestion
  chrome.omnibox.onInputEntered.addListener((text, disposition) => {
    chrome.storage.sync.get(['searchEngines', 'quickLinks'], function(result) {
      const searchEngines = result.searchEngines || defaultSearchEngines;
      const quickLinks = result.quickLinks || defaultQuickLinks;
      
      let url = "";
      
      // Check if it's just a quick link command
      if (quickLinks[text]) {
        url = quickLinks[text];
      }
      // Check if it's a search engine command without a query
      else if (searchEngines[text]) {
        // If just the search engine flag is entered, navigate to its homepage
        url = searchEngines[text].homepage || extractHomepage(searchEngines[text].url);
      }
      // Check if it's a search command with query
      else {
        const parts = text.split(" ");
        const flag = parts[parts.length - 1];
        
        if (parts.length > 1 && searchEngines[flag]) {
          const query = parts.slice(0, -1).join(" ");
          url = searchEngines[flag].url + encodeURIComponent(query);
        }
        // If it's not a command, default to Google search
        else if (text && !text.startsWith("-")) {
          url = "https://www.google.com/search?q=" + encodeURIComponent(text);
        }
      }
      
      // Navigate based on disposition (where to open the URL)
      if (url) {
        // Get the current tab and update it with the new URL
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          if (tabs[0]) {
            chrome.tabs.update(tabs[0].id, {url: url});
          }
        });
      }
    });
  });