/*
 * Zeera App Service
 * This is the bridge between React Native and Native Modules in Java
 */

import { NativeModules } from 'react-native';

const { ZEERA_APP } = NativeModules;

export default ZEERA_APP;

