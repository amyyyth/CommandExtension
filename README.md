# Command & Search Browser Extension

## Background
This is a very short weekend project that came out of frustration. I was using the browser and I felt like everytime i need to search for something on YouTube, I need to go to the site and then search for it. It was just too many keystrokes and I might be a bit too lazy for that. Hence, here we are now.

## Overview
This browser extension allows users to perform quick searches and navigate websites using simple commands. Users can customize their own commands and search queries to fit their needs.

## Features
- Quick search using predefined flags (e.g., `cats -g` for Google search).
- Direct navigation to favorite websites using shortcuts (e.g., `-r` for Reddit).
- Customizable commands to add or remove search engines and quick links.
- Saves settings using Chrome storage for persistence.
- Opens search results in new tabs for efficiency.

## Installation
1. Download the extension source code.
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable Developer Mode (toggle in the top right corner).
4. Click "Load unpacked" and select the extension folder.

## Usage
 ### Press Alt+Shift+P to open the command input
![Command input](https://github.com/user-attachments/assets/a565e051-8400-407b-b61f-6ab7f2684dee)
## Default Commands

### Search Commands  
**Format:** `[query] [suffix]`  
- `-g` → Google Search  
- `-y` → YouTube Search  
- `-gh` → GitHub Search  
- `-w` → Wikipedia Search  
- `-ym` → YouTube Music Search  
- `-ddg` → DuckDuckGo Search  
- `-b` → Bing Search  
- `-a` → Amazon Search  
- `-r` → Reddit Search  
- `-imdb` → IMDb Search  
- `-tw` → Twitter/X Search  
- `-gi` → Google Images Search  

### Quick Link Commands  
**Format:** `[command]`  
- `-r` → Reddit homepage  
- `-t` → Twitter/X homepage  
- `-m` → Gmail  
- `-ch` → ChatGPT  
- `-cl` → Claude.ai  
- `-ds` → DeepSeek Chat  
- `-n` → Netflix  
- `-h` → Browser History  

## Examples  
```bash
# Search commands
"AI news -y"     # Search YouTube for "AI news"
"cats -gi"       # Search Google Images for "cats"

# Quick links
"-m"             # Open Gmail
"-ch"            # Open ChatGPT
```

## Default Search:
 If no command is recognized, it defaults to a Google search.

## Customization
- Go to the extension’s settings page to modify or add new search engines and quick links.
- Flags should be unique and prefixed with `-`.

## Permissions
- `storage`: To save user preferences.
- `tabs`: To open new tabs for search queries.

## Contribution
Feel free to fork the repository and submit pull requests with improvements or additional features.

## License
This project is open-source and licensed under the Apache License 2.0

