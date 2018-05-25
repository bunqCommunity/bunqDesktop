![Screenshot of the app](https://i.gyazo.com/b33c7e40e431814be4bd0d901fca0bc2.gif)


# BunqDesktop 
![build status for master branch](https://api.travis-ci.org/BunqCommunity/BunqJSClient.svg?branch=master) 
[![All Contributors](https://img.shields.io/badge/all_contributors-16-orange.svg?style=flat-square)](#contributors)
[![MIT License](https://img.shields.io/npm/l/all-contributors-cli.svg?style=flat-square)](https://github.com/BunqCommunity/BunqDesktop/blob/master/LICENSE)

#### The unofficial, free and open source desktop application for the bunq API. 

___   

## Download
#### One click installers
Download the latest version of BunqDesktop from the [GitHub releases page.](https://github.com/BunqCommunity/BunqDesktop/releases)

#### [Snapcraft](https://snapcraft.io/bunqdesktop)
You can directly search for 'BunqDesktop' in the Ubuntu store or use  the snap command.

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

The BunqDesktop settings, custom categories and category rules are not stored using encryption. This data is stored seperatly so it can be synced more easily across multiple devices.

Check out the settings page to see where this information is stored and to change this location if you'd like to move it. You can easily use services like Google Drive, iCloud Drive, Dropbox and other software to sync the settings file to always have the same categories and settings across your devices.

## Privacy
At no point is your API key, session information or other data directly sent to other servers or systems. All requests to the bunq API are done directly from the BunqDesktop client to the bunq servers.

We use Google Analytics with minimal settings ([Source code](./src/react/Helpers/Analytics.js)) to check which version of the application is used and other basic information like system language, OS version and country. Your IP address is anonimized using [IP Anonymization in Analytics](https://support.google.com/analytics/answer/2763052?hl=en).

You can choose to disable Google Analytics on the settings page whenever you want.

## Development
We use [yarn](https://yarnpkg.com/en/) for package management and the following global packages:
```bash
$ yarn global add cross-env webpack gulp
```
Clone this project and install its dependencies.
```bash
$ git clone git@github.com:BunqCommunity/BunqDesktop.git && cd BunqDesktop
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

Thanks goes to these wonderful people ([emoji key](https://github.com/kentcdodds/all-contributors#emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
| [<img src="https://avatars2.githubusercontent.com/u/7481136?v=4" width="80px;"/><br /><sub><b>Gregory Goijaerts</b></sub>](https://www.masterypoints.com)<br />[💻](https://github.com/BunqCommunity/BunqDesktop/commits?author=Crecket "Code") [🎨](#design-Crecket "Design") [📖](https://github.com/BunqCommunity/BunqDesktop/commits?author=Crecket "Documentation") [🚇](#infra-Crecket "Infrastructure (Hosting, Build-Tools, etc)") [👀](#review-Crecket "Reviewed Pull Requests") [📦](#platform-Crecket "Packaging/porting to new platform") [💬](#question-Crecket "Answering Questions") [🐛](https://github.com/BunqCommunity/BunqDesktop/issues?q=author%3ACrecket "Bug reports") | [<img src="https://avatars3.githubusercontent.com/u/6953846?v=4" width="80px;"/><br /><sub><b>Dennis Snijder</b></sub>](http://snijder.io)<br />[🐛](https://github.com/BunqCommunity/BunqDesktop/issues?q=author%3ADennisSnijder "Bug reports") [💻](https://github.com/BunqCommunity/BunqDesktop/commits?author=DennisSnijder "Code") [🎨](#design-DennisSnijder "Design") [🤔](#ideas-DennisSnijder "Ideas, Planning, & Feedback") [📖](https://github.com/BunqCommunity/BunqDesktop/commits?author=DennisSnijder "Documentation") [💬](#question-DennisSnijder "Answering Questions") | [<img src="https://avatars2.githubusercontent.com/u/3780207?v=4" width="80px;"/><br /><sub><b>Nick D.</b></sub>](https://github.com/nduijvelshoff)<br />[🐛](https://github.com/BunqCommunity/BunqDesktop/issues?q=author%3Anduijvelshoff "Bug reports") [💻](https://github.com/BunqCommunity/BunqDesktop/commits?author=nduijvelshoff "Code") [🤔](#ideas-nduijvelshoff "Ideas, Planning, & Feedback") [🚇](#infra-nduijvelshoff "Infrastructure (Hosting, Build-Tools, etc)") | [<img src="https://avatars0.githubusercontent.com/u/6396615?v=4" width="80px;"/><br /><sub><b>basst85</b></sub>](https://github.com/basst85)<br />[🐛](https://github.com/BunqCommunity/BunqDesktop/issues?q=author%3Abasst85 "Bug reports") [💻](https://github.com/BunqCommunity/BunqDesktop/commits?author=basst85 "Code") [🤔](#ideas-basst85 "Ideas, Planning, & Feedback") [💬](#question-basst85 "Answering Questions") | [<img src="https://avatars2.githubusercontent.com/u/533616?v=4" width="80px;"/><br /><sub><b>Kees Kluskens</b></sub>](https://webduck.nl)<br />[🐛](https://github.com/BunqCommunity/BunqDesktop/issues?q=author%3ASpaceK33z "Bug reports") [🤔](#ideas-SpaceK33z "Ideas, Planning, & Feedback") | [<img src="https://avatars1.githubusercontent.com/u/15219858?v=4" width="80px;"/><br /><sub><b>Tim</b></sub>](https://github.com/TimZ99)<br />[🐛](https://github.com/BunqCommunity/BunqDesktop/issues?q=author%3ATimZ99 "Bug reports") [💻](https://github.com/BunqCommunity/BunqDesktop/commits?author=TimZ99 "Code") | [<img src="https://avatars3.githubusercontent.com/u/17928966?v=4" width="80px;"/><br /><sub><b>Kevin Hellemun</b></sub>](https://www.linkedin.com/in/kevin-hellemun-9b3ab8130)<br />[💬](#question-OGKevin "Answering Questions") [🤔](#ideas-OGKevin "Ideas, Planning, & Feedback") [🐛](https://github.com/BunqCommunity/BunqDesktop/issues?q=author%3AOGKevin "Bug reports") |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| [<img src="https://avatars1.githubusercontent.com/u/1172106?v=4" width="80px;"/><br /><sub><b>Jan Brodda</b></sub>](http://janbrodda.de)<br />[🐛](https://github.com/BunqCommunity/BunqDesktop/issues?q=author%3Ajanxb "Bug reports") | [<img src="https://avatars1.githubusercontent.com/u/34551774?v=4" width="80px;"/><br /><sub><b>remcomldr</b></sub>](https://github.com/remcomldr)<br />[🐛](https://github.com/BunqCommunity/BunqDesktop/issues?q=author%3Aremcomldr "Bug reports") | [<img src="https://avatars0.githubusercontent.com/u/10500054?v=4" width="80px;"/><br /><sub><b>nimpie</b></sub>](https://github.com/nimpie)<br />[🐛](https://github.com/BunqCommunity/BunqDesktop/issues?q=author%3Animpie "Bug reports") | [<img src="https://avatars3.githubusercontent.com/u/3186640?v=4" width="80px;"/><br /><sub><b>Emile Bons</b></sub>](http://www.emilebons.nl)<br />[💻](https://github.com/BunqCommunity/BunqDesktop/commits?author=EmileBons "Code") | [<img src="https://avatars3.githubusercontent.com/u/1083400?v=4" width="80px;"/><br /><sub><b>Peter van der Veeken</b></sub>](http://petervdveeken.nl)<br />[🐛](https://github.com/BunqCommunity/BunqDesktop/issues?q=author%3Apetervdv "Bug reports") | [<img src="https://avatars2.githubusercontent.com/u/7243299?v=4" width="80px;"/><br /><sub><b>Cas Eliëns</b></sub>](https://github.com/cascer1)<br />[🐛](https://github.com/BunqCommunity/BunqDesktop/issues?q=author%3Acascer1 "Bug reports") | [<img src="https://avatars1.githubusercontent.com/u/6145026?v=4" width="80px;"/><br /><sub><b>Timo N.</b></sub>](https://github.com/ntimo)<br />[🌍](#translation-ntimo "Translation") |
| [<img src="https://avatars1.githubusercontent.com/u/12037024?v=4" width="80px;"/><br /><sub><b>Luit Hollander</b></sub>](https://luithollander.nl)<br />[🐛](https://github.com/BunqCommunity/BunqDesktop/issues?q=author%3AMrLuit "Bug reports") | [<img src="https://avatars0.githubusercontent.com/u/36280159?v=4" width="80px;"/><br /><sub><b>s-john19</b></sub>](https://github.com/s-john19)<br />[🐛](https://github.com/BunqCommunity/BunqDesktop/issues?q=author%3As-john19 "Bug reports") |
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/kentcdodds/all-contributors) specification. Contributions of any kind welcome!
