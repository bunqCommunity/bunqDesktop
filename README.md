![Screenshot of the app](https://i.gyazo.com/b33c7e40e431814be4bd0d901fca0bc2.gif)


# bunqDesktop 
![build status for master branch](https://api.travis-ci.org/bunqCommunity/bunqDesktop.svg?branch=master) 
[![All Contributors](https://img.shields.io/badge/all_contributors-16-orange.svg?style=flat-square)](#contributors)
[![MIT License](https://img.shields.io/npm/l/all-contributors-cli.svg?style=flat-square)](https://github.com/bunqCommunity/bunqDesktop/blob/master/LICENSE)

#### The unofficial, free and open source desktop application for the bunq API. 

___   

## Download
#### One click installers
Download the latest version of bunqDesktop from the [GitHub releases page.](https://github.com/bunqCommunity/bunqDesktop/releases)

#### [Snapcraft](https://snapcraft.io/bunqdesktop)
You can directly search for 'bunqDesktop' in the Ubuntu store or use  the snap command.

`sudo snap install bunqdesktop`

#### [Brew Cask](https://caskroom.github.io/)
`brew cask install bunq`

#### [Chocolatey](https://chocolatey.org/packages/bunqdesktop)
`choco install bunqdesktop`

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
 - CTRL/CMD + H : Toggles the account balance visibility
 - CTRL/CMD + T : Toggles between the light and dark theme
 - CTRL/CMD + D : Dashboard
 - CTRL/CMD + P : Payment page
 - CTRL/CMD + R : Request page
 - ALT + C      : Cards page
 - ALT + S      : Settings page

## Translations
The app is developed in English but translations in Dutch and German are available. 
If you spot errors or want to help us translate the desktop app to a different language let us know!

## Security
All sensitive data is encrypted with the password that is entered on startup. You can choose to skip this step which will encrypt the data with a default password so that you will be logged in without asking you for a password. 

The bunqDesktop settings, custom categories and category rules are not stored using encryption. This data is stored seperatly so it can be synced more easily across multiple devices.

Check out the settings page to see where this information is stored and to change this location if you'd like to move it. You can easily use services like Google Drive, iCloud Drive, Dropbox and other software to sync the settings file to always have the same categories and settings across your devices.

## Privacy
At no point is your API key, session information or other data directly sent to other servers or systems. All requests to the bunq API are done directly from the bunqDesktop client to the bunq servers.

We use Google Analytics with minimal settings ([Source code](./src/react/Helpers/Analytics.js)) to check which version of the application is used and other basic information like system language, OS version and country. Your IP address is anonimized using [IP Anonymization in Analytics](https://support.google.com/analytics/answer/2763052?hl=en).

Along that we use [Sentry](https://sentry.io/gregory-goijaerts/) to log errors when they occur. These only include fatal errors from within bunqDesktop and not any API errors received from bunq. We ensure that both in the client and within sentry that extra filters are in place to ensure no private data is sent or stored.

You can choose to disable Google Analytics on the settings page whenever you want. Since Sentry is important for us to find out about errors this can not be opted out of as of now.

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
Run these commands in 2 seperate consoles. One compiles the react app and the second takes care of 
running an electron instance with hot reloading.
```bash
$ yarn webpack:dev
$ yarn start:dev 
```

## Contact
We have a public [Telegram chat group](https://t.me/bunqcommunity) and a 
topic on [bunq together](https://together.bunq.com/topic/bunqdesktop-client).

If you just want a notification when a new version is released you can also join the [Telegram updates chanel](https://t.me/bunqdesktop).

Feel free to create a new issue for any suggestions, bugs or general ideas you have on Github or 
contact us through one of the above.

## Contributors

[![](https://sourcerer.io/fame/crecket/BunqCommunity/bunqDesktop/images/0)](https://sourcerer.io/fame/crecket/BunqCommunity/bunqDesktop/links/0)[![](https://sourcerer.io/fame/crecket/BunqCommunity/bunqDesktop/images/1)](https://sourcerer.io/fame/crecket/BunqCommunity/bunqDesktop/links/1)[![](https://sourcerer.io/fame/crecket/BunqCommunity/bunqDesktop/images/2)](https://sourcerer.io/fame/crecket/BunqCommunity/bunqDesktop/links/2)[![](https://sourcerer.io/fame/crecket/BunqCommunity/bunqDesktop/images/3)](https://sourcerer.io/fame/crecket/BunqCommunity/bunqDesktop/links/3)[![](https://sourcerer.io/fame/crecket/BunqCommunity/bunqDesktop/images/4)](https://sourcerer.io/fame/crecket/BunqCommunity/bunqDesktop/links/4)[![](https://sourcerer.io/fame/crecket/BunqCommunity/bunqDesktop/images/5)](https://sourcerer.io/fame/crecket/BunqCommunity/bunqDesktop/links/5)[![](https://sourcerer.io/fame/crecket/BunqCommunity/bunqDesktop/images/6)](https://sourcerer.io/fame/crecket/BunqCommunity/bunqDesktop/links/6)[![](https://sourcerer.io/fame/crecket/BunqCommunity/bunqDesktop/images/7)](https://sourcerer.io/fame/crecket/BunqCommunity/bunqDesktop/links/7)

