# Command & Search Browser Extension

## Background
This is a very short weekend project that came out of frustration. I was using the browser and I felt like everytime i need to search for something on YouTube, I need to go to the site and then search for it. It was just too many keystrokes and I just went ahead and made an extension for chromium based browsers. Sadly, I use Arc browser and it does not support extensions fully, but I hope this comes in handy for someone out there.

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
![Command input](https://github.com/user-attachments/assets/a565e051-8400-407b-b61f-6ab7f2684dee)

- **Keyboard Shortcut:** Use the keyboard shortcut `Alt+Shift+P` by default to launch the extension.
- **Search Commands:** Type a search term followed by a flag, e.g., `AI research -g` to search on Google.
- **Quick Links:** Type a flag alone, e.g., `-r`, to open Reddit.
- **Homepage Navigation:** Enter a search engine flag without a query, e.g., `-g`, to go to Google’s homepage.
- **Default Search:** If no command is recognized, it defaults to a Google search.

## Customization
- Go to the extension’s settings page to modify or add new search engines and quick links.
- Flags should be unique and prefixed with `-`.

## Development
- Modify `popup.js` to adjust command behavior.
- Modify `settings.js` to customize the settings page.
- Update `manifest.json` if adding new permissions or features.

## Permissions
- `storage`: To save user preferences.
- `tabs`: To open new tabs for search queries.

## Contribution
Feel free to fork the repository and submit pull requests with improvements or additional features.

## License
This project is open-source and licensed under the Apache License 2.0

