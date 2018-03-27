![Screenshot of the app](https://i.gyazo.com/aacd73b20ef1a2b0ea4e94c8569a6ffd.gif)

# BunqDesktop ![build status for master branch](https://api.travis-ci.org/BunqCommunity/BunqJSClient.svg?branch=master)

#### A desktop implementation for bunq's API. This app does everything within the application so you don't  have to worry about sharing your API key with anyone else!

___   

## Download
#### One click installers
Download the latest version of BunqDesktop from the [GitHub releases page.](https://github.com/BunqCommunity/BunqDesktop/releases)

#### [Snapcraft](https://snapcraft.io/bunqdesktop)
`sudo snap install bunqdesktop`

#### [Brew Cask](https://caskroom.github.io/)
`brew cask install bunq`

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
 - CTRL/CMD + H : Hides the application in the tray
 - CTRL/CMD + D : Dashboard
 - CTRL/CMD + P : Payment page
 - CTRL/CMD + R : Request page
 - ALT + C      : Cards page

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
We have a public [Telegram chat group](https://t.me/joinchat/G_JrZg8BxNdIOsQS1TfY3A) and a 
topic on [bunq together](https://together.bunq.com/topic/bunqdesktop-client).

Feel free to create a new issue for any suggestions, bugs or general ideas you have on Github or 
contact us through one of the above.
