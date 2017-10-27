<p align="center">
 <img align="center" src="https://i.gyazo.com/8a514252c2b959d466c1f6cf4aecdd71.gif" />
</p>
<h1 align="center">Bunq Desktop</h1>
<h4 align="center">
A desktop implementation for Bunq's API. This app does everything within the application so you don't 
have to worry about sharing your API key with anyone else!</h4>

___   

## Download
Download the latest version of Bunq Desktop from the [GitHub releases page.](https://github.com/BunqCommunity/BunqDesktop/releases)

## Features
- View all your accounts and payments
- Send new payments to other users
- Encrypted storage on your device
- Available on Windows, Linux and Mac

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
running an electron instance.
```bash
$ yarn webpack:dev
$ yarn start
```

## Contact
We have a public [Telegram chat group](https://t.me/joinchat/G_JrZg8BxNdIOsQS1TfY3A) and a 
topic on [Bunq Together](https://together.bunq.com/topic/bunqdesktop-client).

Feel free to create a new issue for any suggestions, bugs or general ideas you have on Github or 
contact us through one of the above.
