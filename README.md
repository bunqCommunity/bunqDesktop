# BunqDesktop
A desktop implementation for Bunq's API. This app does everything within the application so you don't have to worry about sharing your API key with anyone else!

## Development
Clone the BunqJSClient (Temporarily until I create a proper release on the npm registry)
```bash
git clone git@github.com:Crecket/BunqJSClient.git
```
Clone this project and install its dependencies
```bash
git clone git@github.com:Crecket/BunqDesktop.git
cd BunqDesktop
yarn 
```
Run these commands in 2 seperate consoles. One compiles the react app and the second takes care of running a electron instance.
```bash
yarn webpack:dev
yarn start
```
