/*
 * ZeeraApp Headless Task
 * This is the function that runs background when ZeeraApp Service is activated
 * Main Function:
 * - auto start when device boot up
 * - check and connect to bluetooth FMC
 * - record data to sqLite
 * - auto send if there's internet connection 
 */

import { PermissionsAndroid, ToastAndroid } from 'react-native'
import RNBluetoothClassic from 'react-native-bluetooth-classic';
import {
  setIsLoading,
  setStartService,
  setBluetoothEnabled,
  setDiscovering,
  setDevices,
  setDevice,
  setImei,
  setBleAddress,
  setVehicle,
  setAutoSend,
  setIsTerminalActive,
  setTimer,
  setEnabledSubscription,
  setDisabledSubscription,
  setBluetoothLogData,
  setBluetoothToggleConnection,
} from '../redux/actions';
import { store } from '../redux/store';
import ZeeraAppService from './ZeeraAppService';
import * as RootNavigation from '../routes/RootNavigation';
import {
  checkBluetoothEnabled,
  requestEnabled,
  startDiscovery,
  startDiscoveryBLE
} from './BluetoothConnection'

export const ZeeraAppStartService = async () => {
  await store.dispatch(setStartService(true));
  await store.dispatch(setDiscovering(false)); // dibalikin ke false dulu
  ZeeraAppService.startService();
}

export const ZeeraAppStopService = async () => {
  ZeeraAppService.stopService();
  await store.dispatch(setStartService(false));
  await store.dispatch(setDiscovering(false));
  await store.dispatch(setDevice(null));
  await store.dispatch(setBluetoothLogData([]));
  await store.dispatch(setBluetoothToggleConnection(false));
}


export const ZeeraAppHeadlessTask = async () => {
  // console.log('Receiving ZeeraAppService!'); // ini terus jalan ketika servicenya dinyalain

  let currentRoute = null;

  // the logic goes here..

  // (1) checking bluetooth connection
  console.log('(1) checking bluetooth connection');

  // checkBluetoothEnabled();
  await checkBluetoothEnabled();

  if (!store.getState().appReducer.bluetoothEnabled) {
    // (2) if bluetooth disabled, turn on
    console.log('(2) if bluetooth disabled, turn on');
    requestEnabled();
  }

  // (3) check if device state is empty or not (already connected or not)
  else {
    console.log('(3) check if device state is empty or not (already connected or not)')
    if (!store.getState().appReducer.device) {
      // (4) check isDeviceConnected
      console.log('(4) check isDeviceConnected');
      if (store.getState().appReducer.bleAddress && store.getState().appReducer.bleAddress !== '') {
        // let isDeviceConnected = await RNBluetoothClassic.isDeviceConnected(store.getState().appReducer.bleAddress);
        // let isDeviceConnected = discovery()
        // console.log('isDeviceConnected?' , isDeviceConnected);

        // if (!isDeviceConnected) {
          if (!store.getState().appReducer.discovering) { // it runs only once when the discovering state is false
            startDiscoveryBLE();
          }
        // }
      }
    }
    else {
      console.log('(5) Device is connected. Bluetooth is logging data....');

      if (store.getState().appReducer.bluetoothLogData && store.getState().appReducer.bluetoothLogData.length > 0) {
        // just print last bluetoothLogData
        // because its inverted so access the array 0
        // console.log('last bluetoothLogData.........', store.getState().appReducer.bluetoothLogData[0]);
      }

      currentRoute = RootNavigation.getCurrentRouteName();
      // console.log('currentRoute', currentRoute);

      // kalo currentRoute.current nya 'DownloadData' redirect ke BluetoothScreen
      if (currentRoute && currentRoute.current === 'DownloadData') {
        RootNavigation.navigate('BluetoothScreen');
      }
      
    }
  }


  // (4) if failed try to reconnect again

  // (5) if still failed, unpair first then connect again (3)

  // (6) if success then set device and record data

  // (7) record data to sqlite

  // (8) watch if there's internet connection so upload to API

  // (9) if success upload clear record data

  setTimeout(() => {

    // ini kalo minimize gak jalan ke sini,
    // clear background baru ke sini (sekali)
    // kalo di foreground jalanin ke sini setelah Receiving ZeeraAppService
    // console.log('timeout ZeeraAppService');
  }, 1000);
};
