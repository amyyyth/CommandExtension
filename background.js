// Add to top of background.js
chrome.action.onClicked.addListener((tab) => {
  injectOverlay(tab.id);
});

chrome.commands.onCommand.addListener((command) => {
  if (command === "_execute_action") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      injectOverlay(tabs[0].id);
    });
  }
});

function injectOverlay(tabId) {
  chrome.scripting.executeScript({
    target: { tabId },
    func: () => {
      // Remove existing overlay if present
      const existingOverlay = document.getElementById(
        "search-commander-overlay"
      );
      if (existingOverlay) existingOverlay.remove();

      // Create overlay container
      const overlay = document.createElement("div");
      overlay.id = "search-commander-overlay";
      overlay.innerHTML = `
        <div class="sc-overlay">
          <div class="sc-modal">
            <div class="sc-search-container">
              <input type="text" 
                    class="sc-search-input" 
                    placeholder="Search or enter command..." 
                    autofocus
                    id="sc-command-input"
                    autocomplete="off"
                    autocorrect="off"
                    autocapitalize="off"
                    spellcheck="false">
              <div class="sc-footer">
                Press ESC to close • <a class="sc-settings-link">Edit Commands</a>
              </div>
            </div>
          </div>
        </div>
      `;

      // Add styles
      const style = document.createElement("style");
      style.textContent = `
        .sc-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(1px);
          z-index: 9999;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          padding-top: 20vh;
        }

        .sc-modal {
          width: 600px;
          background: rgba(36, 36, 36, 0.95);
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.28);
          color: white;
          padding: 20px;
        }

        .sc-search-input {
          width: 100%;
          padding: 16px;
          font-size: 18px;
          background: transparent;
          border: none;
          color: white;
          outline: none;
          caret-color: #ffffff; /* Visible cursor */
          opacity: 1 !important; /* Force visibility */
          position: relative !important; /* Ensure proper stacking */
          z-index: 10000 !important; /* Higher than other elements */
        }

        .sc-search-input::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }

        .sc-footer {
          margin-top: 16px;
          color: rgba(255, 255, 255, 0.7);
          font-size: 14px;
          text-align: center;
        }

        .sc-settings-link {
          color: rgba(255, 255, 255, 0.7);
          cursor: pointer;
          text-decoration: none;
        }

        .sc-settings-link:hover {
          text-decoration: underline;
        }
      `;

      document.head.appendChild(style);
      document.body.appendChild(overlay);

      // Add event listeners
      const input = document.getElementById("sc-command-input");
      const settingsLink = overlay.querySelector(".sc-settings-link");

      // Explicit focus with a small timeout to ensure DOM readiness
      setTimeout(() => {
        input.focus();
        input.select();
      }, 50);

      // Add this event listener to prevent blur
      input.addEventListener("blur", () => {
        setTimeout(() => input.focus(), 10);
      });

      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          chrome.runtime.sendMessage({
            action: "executeCommand",
            command: input.value.trim(),
          });
          overlay.remove();
          style.remove();
        }
      });

      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          overlay.remove();
          style.remove();
        }
      });

      settingsLink.addEventListener("click", () => {
        chrome.runtime.sendMessage({ action: "openSettings" });
        overlay.remove();
        style.remove();
      });
    },
  });
}

// Add this to background.js
async function handleCommand(command) {
  const result = await chrome.storage.sync.get(["searchEngines", "quickLinks"]);
  const searchEngines = result.searchEngines || defaultSearchEngines;
  const quickLinks = result.quickLinks || defaultQuickLinks;

  let url = "";

  // Check if it's a quick link command
  if (quickLinks[command]) {
    url = quickLinks[command];
  }
  // Check if it's a search engine command without a query
  else if (searchEngines[command]) {
    url =
      searchEngines[command].homepage ||
      extractHomepage(searchEngines[command].url);
  }
  // Check if it's a search command with query
  else {
    const parts = command.split(" ");
    const suffix = parts[parts.length - 1];

    if (parts.length > 1 && searchEngines[suffix]) {
      const query = parts.slice(0, -1).join(" ");
      url = searchEngines[suffix].url + encodeURIComponent(query);
    }
    // Default to Google search
    else if (command && !command.startsWith("-")) {
      url = "https://www.google.com/search?q=" + encodeURIComponent(command);
    }
  }

  if (url) {
    chrome.tabs.create({ url });
  }
}

// Add the extractHomepage function if not already present
function extractHomepage(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol + "//" + urlObj.hostname;
  } catch (e) {
    return url.split("/").slice(0, 3).join("/");
  }
}

// Add message handler
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "executeCommand") {
    // Move your existing command handling logic here
    handleCommand(request.command);
  }
  if (request.action === "openSettings") {
    chrome.runtime.openOptionsPage();
  }
});

// Default settings in case storage is empty
const defaultSearchEngines = {
  "-g": {
    name: "Google",
    url: "https://www.google.com/search?q=",
    homepage: "https://www.google.com",
  },
  "-y": {
    name: "YouTube",
    url: "https://www.youtube.com/results?search_query=",
    homepage: "https://www.youtube.com",
  },
  "-gh": {
    name: "GitHub",
    url: "https://github.com/search?q=",
    homepage: "https://github.com",
  },
  "-w": {
    name: "Wikipedia",
    url: "https://en.wikipedia.org/w/index.php?search=",
    homepage: "https://www.wikipedia.org",
  },
  "-ym": {
    name: "YT music",
    url: "https://music.youtube.com/search?q=",
    homepage: "https://music.youtube.com",
  },
  "-ddg": {
    name: "DuckDuckGo",
    url: "https://duckduckgo.com/?q=",
    homepage: "https://duckduckgo.com",
  },
  "-b": {
    name: "Bing",
    url: "https://www.bing.com/search?q=",
    homepage: "https://www.bing.com",
  },
  "-a": {
    name: "Amazon",
    url: "https://www.amazon.com/s?k=",
    homepage: "https://www.amazon.com",
  },
  "-r": {
    name: "Reddit",
    url: "https://www.reddit.com/search/?q=",
    homepage: "https://www.reddit.com",
  },
  "-imdb": {
    name: "IMDb",
    url: "https://www.imdb.com/find?q=",
    homepage: "https://www.imdb.com",
  },
  "-tw": {
    name: "Twitter",
    url: "https://x.com/search?q=",
    homepage: "https://x.com",
  },
  "-gi": {
    name: "Google Images",
    url: "https://www.google.com/search?tbm=isch&q=",
    homepage: "https://www.google.com/imghp",
  },
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
  description: "Search Commander: Type a command or search query",
});

// Handle input changes (for suggestions)
chrome.omnibox.onInputChanged.addListener((text, suggest) => {
  chrome.storage.sync.get(["searchEngines", "quickLinks"], function (result) {
    const searchEngines = result.searchEngines || defaultSearchEngines;
    const quickLinks = result.quickLinks || defaultQuickLinks;

    const suggestions = [];
    const parts = text.split(" ");

    // Show suggestions for commands when user types a dash
    if (text.startsWith("-") && !text.includes(" ")) {
      // Suggest search engines
      Object.entries(searchEngines).forEach(([flag, data]) => {
        if (flag.startsWith(text)) {
          suggestions.push({
            content: flag,
            description: `Search Engine: <match>${flag}</match> - ${data.name}`,
          });
        }
      });

      // Suggest quick links
      Object.entries(quickLinks).forEach(([flag, url]) => {
        if (flag.startsWith(text)) {
          suggestions.push({
            content: flag,
            description: `Quick Link: <match>${flag}</match> - ${url}`,
          });
        }
      });
    }

    // Check if the last part might be a command
    if (parts.length > 1) {
      const lastPart = parts[parts.length - 1];
      if (lastPart.startsWith("-")) {
        const query = parts.slice(0, -1).join(" ");

        // Suggest search engines for the query
        Object.entries(searchEngines).forEach(([flag, data]) => {
          if (flag.startsWith(lastPart)) {
            suggestions.push({
              content: `${query} ${flag}`,
              description: `Search <match>${query}</match> with ${data.name}`,
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
  chrome.storage.sync.get(["searchEngines", "quickLinks"], function (result) {
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
      url =
        searchEngines[text].homepage ||
        extractHomepage(searchEngines[text].url);
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
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        if (tabs[0]) {
          chrome.tabs.update(tabs[0].id, { url: url });
        }
      });
    }
  });
});
