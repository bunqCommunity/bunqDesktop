![Screenshot of the app](https://i.gyazo.com/b33c7e40e431814be4bd0d901fca0bc2.gif)


# bunqDesktop 
[![Github latest version](https://img.shields.io/github/release/bunqcommunity/bunqdesktop.svg) ](https://github.com/bunqCommunity/bunqDesktop/releases/latest)
[![Download counter](https://img.shields.io/github/downloads/bunqCommunity/bunqDesktop/total.svg) ](https://github.com/bunqCommunity/bunqDesktop/releases)
[![build status for master branch](https://api.travis-ci.org/bunqCommunity/bunqDesktop.svg?branch=master) ](https://travis-ci.org/bunqCommunity/bunqDesktop)
[![MIT License](https://img.shields.io/npm/l/all-contributors-cli.svg?style=flat-square)](https://github.com/bunqCommunity/bunqDesktop/blob/master/LICENSE) 
[![Wiki](https://img.shields.io/badge/wiki-guides-orange.svg)](https://wiki.bunqdesk.top/)

#### The unofficial, free and open source desktop application for the bunq API. 

___

## Download 

#### One click installers 
Download the latest version of bunqDesktop from the [GitHub releases page](https://github.com/bunqCommunity/bunqDesktop/releases/latest).

There is also a [Nightly build](https://github.com/bunqCommunity/bunqDesktop/releases/snapshot) which is built automatically every night and contains the latest experimental changes and features. Only use this if you want to test new features and are okay with potential errors.

#### [Snapcraft](https://snapcraft.io/bunqdesktop) [![bunqDesktop](https://snapcraft.io/bunqdesktop/badge.svg)](https://snapcraft.io/bunqdesktop)

You can directly search for 'bunqDesktop' in the Ubuntu store or use  the snap command.

`sudo snap install bunqdesktop`

#### [Brew Cask](https://caskroom.github.io/)

`brew cask install bunqcommunity-bunq`

#### [Chocolatey](https://chocolatey.org/packages/bunqdesktop) ![Download count for Chocolatey](https://img.shields.io/chocolatey/dt/bunqdesktop.svg)

`choco install bunqdesktop`

#### [AUR](https://aur.archlinux.org/packages/bunq-desktop-bin/)
Replace the $AURHELPER section with your AUR helper command.

`$AURHELPER -S bunq-desktop-bin`

## Features
- View all your accounts and payments
- Send new payments to other users
- Accept and decline requests
- Create and view bunq.me requests
- Custom categories to group events
- View and manage your cards
- Statistics page
- Encrypted storage on your device
- Available on Windows, Linux and Mac

## Keybinds
 - CTRL/CMD + Q : Closes the application
 - CTRL/CMD + U : Runs the background sync process
 - CTRL/CMD + H : Toggles the account balance visibility
 - CTRL/CMD + T : Toggles between the light and dark theme
 - CTRL/CMD + D : Dashboard
 - CTRL/CMD + P : Payment page
 - CTRL/CMD + R : Request page
 - ALT + C      : Cards page
 - ALT + S      : Settings page

## Translations
The app is developed in English but translations in Dutch and German are available. 
If you spot errors, possible improvements or want to help us translate the desktop app to a different language let us know or suggest a change on [Crowdin](https://crowdin.com/project/bunqdesktop)!

## Security
All sensitive data is encrypted with the password that is entered on startup. You can choose to skip this step which will encrypt the data with a default password so that you will be logged in without asking you for a password. 

The bunqDesktop settings, custom categories and category rules are not stored using encryption. This data is stored separately so it can be synced more easily across multiple devices.

Check out the settings page to see where this information is stored and to change this location if you'd like to move it. You can easily use services like Google Drive, iCloud Drive, Dropbox and other software to sync the settings file to always have the same categories and settings across your devices.

## Privacy
At no point is your API key, session information or other data directly sent to other servers or systems. All requests to the bunq API are done directly from the bunqDesktop client to the bunq servers.

We use Google Analytics with minimal settings ([Source code](./src/react/Functions/Analytics.js)) to check 
which version of the application is used and other basic information like system language, OS version and country. 
Your IP address is anonymized using [IP Anonymization in Analytics](https://support.google.com/analytics/answer/2763052?hl=en).
Google Analytics can be disabled on the settings page whenever you want.

## Development
We use [yarn](https://yarnpkg.com/en/) for package management and the following global packages:
```bash
$ yarn global add cross-env webpack gulp
```
Clone this project and install its dependencies.
```bash
$ git clone git@github.com:bunqCommunity/bunqDesktop.git && cd bunqDesktop
$ yarn 
```
Run these commands in 2 separate consoles. One compiles the react app and the second takes care of 
running an electron instance with hot reloading.
```bash
$ yarn webpack:dev
$ yarn start:dev 
```

## Contact
[![Together topic badge](https://img.shields.io/badge/Together-Discuss-orange.svg) ](https://together.bunq.com/d/6180-bunq-cli-a-new-unofficial-command-line-tool-for-the-bunq-api/11) [![Telegram chat badge](https://img.shields.io/badge/Telegram-Discuss-blue.svg) ](https://t.me/bunqcommunity) [![Telegram chat badge](https://img.shields.io/badge/Telegram-Announcements-blue.svg) ](https://t.me/bunqdesktop)

We have a public [Telegram chat group ](https://t.me/bunqcommunity) and a topic on [bunq together](https://together.bunq.com/d/5763-bunqdesktop-the-unofficial-free-and-open-source-desktop-application-for-bunq/).

If you just want a notification when a new version is released you can also join the [Telegram updates channel](https://t.me/bunqdesktop).

Feel free to create a new issue for any suggestions, bugs or general ideas you have on Github or 
contact us through one of the above.

## Contributors ![Contributer count](https://img.shields.io/github/contributors/bunqcommunity/bunqdesktop.svg)

[![](https://sourcerer.io/fame/crecket/bunqCommunity/bunqDesktop/images/0)](https://sourcerer.io/fame/crecket/bunqCommunity/bunqDesktop/links/0)[![](https://sourcerer.io/fame/crecket/bunqCommunity/bunqDesktop/images/1)](https://sourcerer.io/fame/crecket/bunqCommunity/bunqDesktop/links/1)[![](https://sourcerer.io/fame/crecket/bunqCommunity/bunqDesktop/images/2)](https://sourcerer.io/fame/crecket/bunqCommunity/bunqDesktop/links/2)[![](https://sourcerer.io/fame/crecket/bunqCommunity/bunqDesktop/images/3)](https://sourcerer.io/fame/crecket/bunqCommunity/bunqDesktop/links/3)[![](https://sourcerer.io/fame/crecket/bunqCommunity/bunqDesktop/images/4)](https://sourcerer.io/fame/crecket/bunqCommunity/bunqDesktop/links/4)[![](https://sourcerer.io/fame/crecket/bunqCommunity/bunqDesktop/images/5)](https://sourcerer.io/fame/crecket/bunqCommunity/bunqDesktop/links/5)[![](https://sourcerer.io/fame/crecket/bunqCommunity/bunqDesktop/images/6)](https://sourcerer.io/fame/crecket/bunqCommunity/bunqDesktop/links/6)[![](https://sourcerer.io/fame/crecket/bunqCommunity/bunqDesktop/images/7)](https://sourcerer.io/fame/crecket/bunqCommunity/bunqDesktop/links/7)

## License
Unless otherwise noted, the bunqDesktop source files are distributed under the MIT License found in the [LICENSE](https://github.com/bunqCommunity/bunqDesktop/blob/master/LICENSE) file.

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2FbunqCommunity%2FbunqDesktop.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2FbunqCommunity%2FbunqDesktop?ref=badge_large)
