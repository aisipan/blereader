## Documentation
This is BLE (Bluetooth Low Engine) Reader app example. <br/>
Author: Ardhi <br/>
Published Date: 5 October 2021

## Prerequisite
| Library | Min Version |
| ------- | ----------- |
| Node | 14.17.0 |
| React Native | 0.65.1 |
| React | 17.0.2 |

Check the `package.json` file for minimum version required

## Installation
```bash
npm install
```

## Running on local device (using physical device)
Make sure you have already installed `npx`
```bash
npx react-native run-android
```
or, I have already create npm scripts, use:
```bash
npm run android-debug
```
check the `package.json` file for running commands

## Debug
if it won't running on your device try to do these:
1. pull to update repo
2. delete node_modules folder -> `rm -rf node_modules`
3. delete package-lock.json file
4. install dependencies -> `npm install`
5. to fix audit error -> `npm audit fix`
6. reset cache -> `npx react-native start --reset-cache`
7. after a while just cancel after metro bundler reseted (because it won't go auto close)
8. after that, just run -> `npx react-native run-android` or `npm run android-debug`