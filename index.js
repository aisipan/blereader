/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';
import { ZeeraAppHeadlessTask } from './src/functions/ZeeraAppHeadlessTask';;

AppRegistry.registerHeadlessTask('ZEERA_APP', () => ZeeraAppHeadlessTask);
AppRegistry.registerComponent(appName, () => App);
