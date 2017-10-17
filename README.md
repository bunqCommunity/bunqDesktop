<p align="center">
 <img align="center" src="https://user-images.githubusercontent.com/6953846/31667539-047c0916-b350-11e7-81ab-fff2535af83f.png" />
</p>
<h3 align="center">
A desktop implementation for Bunq's API. This app does everything within the application so you don't have to worry about 
sharing your API key with anyone else!</h3>

<hr/>   

## Download
Download the latest version of Bunq Desktop from the [GitHub releases page.](https://github.com/BunqCommunity/BunqDesktop/releases)

## Development
Clone this project and install its dependencies
```bash
$ git clone git@github.com:BunqCommunity/BunqDesktop.git && cd BunqDesktop
$ yarn 
```
Run these commands in 2 seperate consoles. One compiles the react app and the second takes care of running a electron instance.
```bash
$ yarn webpack:dev
$ yarn start
```
