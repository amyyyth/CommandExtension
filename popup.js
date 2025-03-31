document.addEventListener("DOMContentLoaded", function () {
  const input = document.getElementById("commandInput");

  const searchEngines = {
    "-g": { name: "Google", url: "https://www.google.com/search?q=" },
    "-y": { name: "YouTube", url: "https://www.youtube.com/results?search_query=" },
    "-gh": { name: "GitHub", url: "https://github.com/search?q=" },
    "-w": { name: "Wikipedia", url: "https://en.wikipedia.org/w/index.php?search=" },
    "-ym": { name: "YT music", url: "https://music.youtube.com/search?q=" },
    "-ddg": { name: "DuckDuckGo", url: "https://duckduckgo.com/?q=" },
    "-b": { name: "Bing", url: "https://www.bing.com/search?q=" },
    "-a": { name: "Amazon", url: "https://www.amazon.com/s?k=" },
    "-r": { name: "Reddit", url: "https://www.reddit.com/search/?q=" },
    "-imdb": { name: "IMDb", url: "https://www.imdb.com/find?q=" },
    "-tw": { name: "Twitter", url: "https://x.com/search?q=" },
    "-gi": { name: "Google Images", url: "https://www.google.com/search?tbm=isch&q=" }
  };

  const quickLinks = {
    "-r": "https://www.reddit.com",
    "-t": "https://x.com",
    "-m": "https://mail.google.com",
    "-ch": "https://chatgpt.com",
    "-cl": "https://claude.ai",
    "-ds": "https://chat.deepseek.com",
    "-n": "https://www.netflix.com",
    "-h": "chrome://history",
  };

  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      const command = input.value.trim();
      const parts = command.split(" ");
      const suffix = parts[parts.length - 1];
      const query = parts.slice(0, -1).join(" ");

      if (searchEngines[suffix]) {
        chrome.tabs.create({ url: searchEngines[suffix].url + encodeURIComponent(query) });
      } else if (quickLinks[suffix]) {
        chrome.tabs.create({ url: quickLinks[suffix] });
      }

      input.value = "";
      window.close();
    }
  });

  input.focus();
});
