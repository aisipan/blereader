import React from 'react';
import { ToastAndroid, PermissionsAndroid, NativeModules, Platform } from 'react-native';
import RNBluetoothClassic, { BluetoothDevice } from 'react-native-bluetooth-classic';
// import BleManager from 'react-native-ble-manager';
import { BleManager } from 'react-native-ble-plx'
import { Buffer } from 'buffer';
import {
  setBluetoothEnabled,
  setBluetoothLogData,
  setBluetoothReadSubscription,
  setBluetoothToggleConnection,
  setEnabledSubscription,
  setDisabledSubscription,
  setDiscovering,
  setDevices,
  setDevice,
} from '../redux/actions'
import { store } from '../redux/store';
import * as RootNavigation from '../routes/RootNavigation';

const COMMAND_GET_FCM_DATA = '.log:1';
const MAX_LENGTH_LOG_DATA = 20

// BLE
// const BleManagerModule = NativeModules.BleManager;
// const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);
// var BleManagerDiscoverPeripheral = null;
// var BleManagerStopScan = null;
// var BleManagerDisconnectPeripheral = null;
// var BleManagerDidUpdateValueForCharacteristic = null;

var bleManager = null;

// Zeera
const COMMAND_START = 'DAA5';
const COMMAND_STOP = 'DB';

export const checkBluetoothEnabled = async () => {
  try {
    // console.log('[OsbleHeadlessTask - checkBluetoothEnabled] Checking bluetooth status');
    let enabled = await RNBluetoothClassic.isBluetoothEnabled();

    // console.log(`[OsbleHeadlessTask - checkBluetoothEnabled] Status: ${enabled}`);
    store.dispatch(setBluetoothEnabled(enabled))
  } catch (error) {
    console.log('[OsbleHeadlessTask - checkBluetoothEnabled] Status Error: ', error);
    store.dispatch(setBluetoothEnabled(false))
  }
}

export const requestEnabled = async () => {
  try {
    console.log('requestEnabled');
    RNBluetoothClassic.requestBluetoothEnabled(true);
  } catch (error) {
    RNBluetoothClassic.requestBluetoothEnabled(false);
    ToastAndroid.show(`Error occurred while enabling bluetooth: ${error.message}`, ToastAndroid.SHORT);
  }
};

export const initializeBluetoothSubscription = () => {
  let enabledSubscription = RNBluetoothClassic.onBluetoothEnabled((event) => onStateChanged(event));
  let disabledSubscription = RNBluetoothClassic.onBluetoothDisabled((event) => onStateChanged(event));

  store.dispatch(setEnabledSubscription(enabledSubscription));
  store.dispatch(setDisabledSubscription(disabledSubscription));
}

export const uninitializeBluetoothSubscription = () => {
  const { enabledSubscription, disabledSubscription } = store.getState().appReducer;
  enabledSubscription.remove();
  disabledSubscription.remove();

  store.dispatch(setEnabledSubscription(null));
  store.dispatch(setDisabledSubscription(null));
}

/**
 * Handle state change events.
 * When turn on / off bluetooth
 *
 * @param stateChangedEvent event sent from Native side during state change
 */
export const onStateChanged = (stateChangedEvent) => {
  // console.log('App::onStateChanged event used for onBluetoothEnabled and onBluetoothDisabled');
  // console.log('stateChangedEvent', stateChangedEvent);
  store.dispatch(setBluetoothEnabled(stateChangedEvent.enabled)) // ini artinya ngeset true / false di state bluetoothEnabled
  store.dispatch(setDevice(stateChangedEvent.enabled ? store.getState().appReducer.device : null)); // ini artinya kalo bluetoothnya dimatiin diclear state devicenya
}

export const startDiscovery = async () => {
  console.log('start discovery.....');
  // console.log('store.getState().appReducer.devices', store.getState().appReducer.devices);

  let devices = [];
  if (store.getState().appReducer.devices) {
    devices = [...store.getState().appReducer.devices];
  }

  try {
    let granted = await requestAccessFineLocationPermission();

    if (!granted) {
      throw new Error('Access fine location was not granted');
    }

    await store.dispatch(setDiscovering(true));
    // console.log('store.getState().appReducer.discovering', store.getState().appReducer.discovering);

    try {
      let unpaired = await RNBluetoothClassic.startDiscovery();

      // console.log('[DownloadData] unpaired', JSON.stringify(unpaired));

      let index = devices.findIndex(d => !d.bonded);
      if (index >= 0) { devices.splice(index, devices.length - index, ...unpaired); }
      else { devices.push(...unpaired); }
      // console.log('[DownloadData] devices after discovery', JSON.stringify(devices));

      // console.log('devices.........', devices);
      store.dispatch(setDevices(devices));

    } finally {
      console.log('FINALLY!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!...')

      // connect to bluetooth using ble_address
      const { devices, bleAddress, vehicle } = store.getState().appReducer;
      // const ble_address = "78:02:F8:1C:19:09"; // Redmi 4 Prime Ardhi
      // const ble_address = "00:1E:42:3D:FB:08"; // FMC130
      // console.log('[DownloadData] devices', JSON.stringify(devices));
      // console.log('[DownloadData] ble_address', bleAddress);
      if (devices && devices.length > 0) {
        const device = devices.find(x => x.address === bleAddress) // filter the device using bleAddress
        // console.log('[DownloadData] device found', JSON.stringify(device));

        // success connect to device
        if (device) {
          await store.dispatch(setDevice(device));
          // await prepareToTerminal();
          // RootNavigation.navigate('BluetoothScreen'); // udah diredirect dari OsbleHeadlessTask
        }
        else {
          // misal gak nemu, show button reconnect
          ToastAndroid.show(`Tidak dapat menyandingkan dengan ${vehicle}. Klik Connect untuk mencoba lagi`, ToastAndroid.LONG);
        }

        store.dispatch(setDiscovering(false));
      }
    }
  } catch (err) {
    console.log('error startDiscovery', err);
    ToastAndroid.show(err.message, ToastAndroid.SHORT);
  }
};

export const cancelDiscovery = async () => {
  try {
    await RNBluetoothClassic.cancelDiscovery();
    await store.dispatch(setDevice(null));
    await store.dispatch(setDiscovering(false));
    await store.dispatch(setDevices([]));
  } catch (error) {
    ToastAndroid.show("Error occurred while attempting to cancel discover devices", ToastAndroid.SHORT);
  }
}; 

/**
 * Gets the currently bonded devices.
 */
export const getBondedDevices = async () => {
  console.log('get bonded devices......');
  try {
    let bonded = await RNBluetoothClassic.getBondedDevices();
    // console.log('[OsbleHeadlessTask - getBondedDevices] found', JSON.stringify(bonded));
    store.dispatch(setDevices(bonded));
  } catch (error) {
    store.dispatch(setDevices([]));
    ToastAndroid.show(error.message, ToastAndroid.SHORT);
  }
};


/**
 * See https://reactnative.dev/docs/permissionsandroid for more information
 * on why this is required (dangerous permissions).
 */
export const requestAccessFineLocationPermission = async () => {
  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    {
      title: 'Access fine location required for discovery',
      message:
        'In order to perform discovery, you must enable/allow ' +
        'fine location access.',
      buttonNeutral: 'Ask Me Later',
      buttonNegative: 'Cancel',
      buttonPositive: 'OK',
    }
  );
  return granted === PermissionsAndroid.RESULTS.GRANTED;
};

export const connect = async () => {
  console.log('[BluetoothConnection] connect......');
  // reset the initialized to prevent redudant
  // await uninitializeRead();

  let connection = store.getState().appReducer.bluetoothToggleConnection;
  // let connection = await store.getState().appReducer.device.isConnected();
  // console.log('bluetoothToggleConnection...', connection)
  // console.log('connection????', connection);

  if (!connection) {
    // console.log('device....', store.getState().appReducer.device);
    // console.log('address....', store.getState().appReducer.device.address);
    console.log(`Attempting connection to ${store.getState().appReducer.device.address}`);
    addData({
      data: `Attempting connection to ${store.getState().appReducer.device.address}`,
      timestamp: new Date(),
      type: 'error',
    });

    try {
      // connection = await store.getState().appReducer.device.connect();
      connection = await RNBluetoothClassic.connectToDevice(store.getState().appReducer.bleAddress)
      // connection = await BluetoothDevice.connect();

      // console.log('device.connect', connection);
      // LOG  device.connect {"_bluetoothModule": {"_eventEmitter": {"_nativeModule": [NativeModule]}, "_nativeModule": {"accept": [Function promiseMethodWrapper], "addListener": [Function nonPromiseMethodWrapper], "availableFromDevice": [Function promiseMethodWrapper], "cancelAccept": [Function promiseMethodWrapper], "cancelDiscovery": [Function promiseMethodWrapper], "clearFromDevice": [Function promiseMethodWrapper], "connectToDevice": [Function promiseMethodWrapper], "disconnectFromDevice": [Function promiseMethodWrapper], "getBondedDevices": [Function promiseMethodWrapper], "getConnectedDevice": [Function promiseMethodWrapper], "getConnectedDevices": [Function promiseMethodWrapper], "getConstants": [Function anonymous], "isBluetoothAvailable": [Function promiseMethodWrapper], "isBluetoothEnabled": [Function promiseMethodWrapper], "isDeviceConnected": [Function promiseMethodWrapper], "openBluetoothSettings": [Function nonPromiseMethodWrapper], "pairDevice": [Function promiseMethodWrapper], "readFromDevice": [Function promiseMethodWrapper], "removeAllListeners": [Function nonPromiseMethodWrapper], "removeListener": [Function nonPromiseMethodWrapper], "requestBluetoothEnabled": [Function promiseMethodWrapper], "setBluetoothAdapterName": [Function promiseMethodWrapper], "startDiscovery": [Function promiseMethodWrapper], "unpairDevice": [Function promiseMethodWrapper], "writeToDevice": [Function promiseMethodWrapper]}}, "_nativeDevice": {"address": "00:1E:42:3A:3E:EB", "bonded": true, "extra": {}, "id": "00:1E:42:3A:3E:EB", "name": "864292044474011"}, "address": "00:1E:42:3A:3E:EB", "bonded": true, "deviceClass": undefined, "extra": {}, "id": "00:1E:42:3A:3E:EB", "name": "864292044474011", "rssi": undefined}

      if (connection) {
        await initializeRead();

        addData({
          data: 'Connection successful',
          timestamp: new Date(),
          type: 'info',
        });

        // auto send log
        sendData();
        await store.dispatch(setBluetoothToggleConnection(true));
        await store.dispatch(setDevice(connection)); // karena callback connection itu isinya device dari native module
      }
    }
    catch (e) {
      console.log('error connect to device', e);
      ToastAndroid.show(e.toString(), ToastAndroid.SHORT);
      //  error connect to device [Error: java.io.IOException: read failed, socket might closed or timeout, read ret: -1]
      // OsbleStopService(); // sementara ini dulu nantinya jangan diterminate harus re-check sampe bisa connect
      if (e.toString().includes('read failed')) {
        // let clear = await RNBluetoothClassic.clearFromDevice(store.getState().appReducer.bleAddress);
        let unpair = await RNBluetoothClassic.unpairDevice(store.getState().appReducer.bleAddress);
        // console.log('clear', clear);
        console.log('unpair', unpair);
        await store.dispatch(setDiscovering(false));
        await store.dispatch(setDevice(null));
      }
    }
  }
}

export const disconnect = async() => {
  console.log('[BluetoothConnection] disconnect......');
  // Clear the reads, so that they don't get duplicated
  uninitializeRead();

  let disconnected = null;

  try {
    if (store.getState().appReducer.device) {
      // disconnected = await store.getState().appReducer.device.disconnect();
      disconnected = await RNBluetoothClassic.disconnectFromDevice(store.getState().appReducer.bleAddress);
      console.log('disconnected...', disconnected);
      addData({
        data: 'Disconnected',
        timestamp: new Date(),
        type: 'info',
      });

      store.dispatch(setBluetoothToggleConnection(disconnected));
      store.dispatch(setDevice(null));
    }
  } catch (error) {
    console.log('Disconnect failed: ', error.toString())
    addData({
      data: `Disconnect failed: ${error.toString()}`,
      timestamp: new Date(),
      type: 'error',
    });

    if (error.toString().includes('Not connected to')) {

    }
  }
}

export const initializeRead = () => {
  console.log('[BluetoothConnection] initializeRead......');
  let disconnectSubscription = RNBluetoothClassic.onDeviceDisconnected(() => disconnect());
  // this.onError = RNBluetoothClassic.onError(() => this.disconnect());

  console.log('=========================initializeRead======================');
  console.log('device', store.getState().appReducer.device);
  // let readSubscription = store.getState().appReducer.device.onDataReceived(data => {
  //   console.log('this.readSubscription', data);
  //   return onReceivedData(data)
  // });

  let readSubscription = RNBluetoothClassic.onDeviceRead(store.getState().appReducer.bleAddress, (data) => {
    // console.log('this.readSubscription', data);
    return onReceivedData(data)
  })

  // let readSubscription = BluetoothDevice.onDataReceived(data => {
  //   console.log('data readSubscription', data);
  //   return onReceivedData(data)
  // })

  console.log('readSubscription', readSubscription);

  store.dispatch(setBluetoothReadSubscription(readSubscription))
}

/**
 * Clear the reading functionality.
 */
export const uninitializeRead = () => {
  console.log('[BluetoothConnection] uninitializeRead......');
  if (store.getState().appReducer.bluetoothReadSubscription) {
    // this.readSubscription.remove();
    store.getState().appReducer.bluetoothReadSubscription.remove();
    store.dispatch(setBluetoothReadSubscription(null))
  }
}

export const addData = async(message) => {
  let data = [message, ...store.getState().appReducer.bluetoothLogData];
  // console.log('addData...', data);
  // this.setState({ data: [message, ...this.state.data] });
  if (data.length > MAX_LENGTH_LOG_DATA) {
      data.splice(MAX_LENGTH_LOG_DATA, data.length - MAX_LENGTH_LOG_DATA);
  }
  store.dispatch(setBluetoothLogData(data));
}

/**
 * Attempts to send data to the connected Device.  The input text is
 * padded with a NEWLINE (which is required for most commands)
 */
export const sendData = async() => {
  try {
    console.log(`Attempting to send data ${COMMAND_GET_FCM_DATA}`);
    let message = COMMAND_GET_FCM_DATA + '\r';
    await RNBluetoothClassic.writeToDevice(
      store.getState().appReducer.device.address,
      message
    );

    addData({
      timestamp: new Date(),
      data: COMMAND_GET_FCM_DATA,
      type: 'sent',
    });

    let data = Buffer.alloc(10, 0xEF);
    await store.getState().appReducer.device.write(data);
    // console.log("data:",data)
    addData({
      timestamp: new Date(),
      data: `Byte array: ${data.toString()}`,
      type: 'sent',
    });

    // this.setState({ text: undefined });
  } catch (error) {
    console.log('[BluetoothConnection] error sendData: ', error);
  }
}

/**
 * Handles the ReadEvent by adding a timestamp and applying it to
 * list of received data.
 *
 * @param {ReadEvent} event
 */
export const onReceivedData = async (event) => {
  event.timestamp = new Date();
  // console.log('event', JSON.stringify(event));
  // console.log('event.data',JSON.stringify(event.data));

  if (event && event.data && typeof(event.data) === 'string' && event.data.includes("[REC.GEN]") &&  event.data.includes("Record Content")) {
    console.log('=============================GET RECORD DATA!!!===================================');
    await getAndParseRecordData(event.data);
  }

  addData({
    ...event,
    timestamp: new Date(),
    type: 'receive',
  });
}


export const toggleConnection = () => {
  console.log('toggleConnection, state before:', store.getState().appReducer.bluetoothToggleConnection);
  if (store.getState().appReducer.bluetoothToggleConnection) {
    disconnect();
    OsbleStopService();
    ToastAndroid.show(`Disconnected Successfully`, ToastAndroid.LONG);
    RootNavigation.navigate('DownloadData');
  }
  else {
    connect();
    OsbleStartService();
  }
}


/*==============================================BLE==========================================================*/


/*
Flow
Connect:
- discover
- set to peripherals
- find by bleAddress
- get selected peripheral 
- set to peripheral
- connect it
- write data
-

*/





export const initializeBleListener = () => {
  // BleManager.start({showAlert: false});
  // BleManagerDiscoverPeripheral = bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', handleDiscoverPeripheral);
  // BleManagerStopScan = bleManagerEmitter.addListener('BleManagerStopScan', handleStopScan );
  // BleManagerDisconnectPeripheral = ble
  // ManagerEmitter.addListener('BleManagerDisconnectPeripheral', handleDisconnectedPeripheral );
  // BleManagerDidUpdateValueForCharacteristic = bleManagerEmitter.addListener('BleManagerDidUpdateValueForCharacteristic', handleUpdateValueForCharacteristic );

  // console.log('BleManagerDisconnectPeripheral', BleManagerDiscoverPeripheral);

  bleManager = new BleManager();

  // console.log('bleManager', bleManager);

  if (Platform.OS === 'android' && Platform.Version >= 23) {
    PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then((result) => {
        if (result) {
          console.log("Permission is OK");
        } else {
          PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then((result) => {
            if (result) {
              console.log("User accept");
            } else {
              console.log("User refuse");
            }
          });
        }
    });
  }

  // const connected = BleManager.isDeviceConnected(store.getState().appReducer.bleAddress).then(connected => connected);
  // console.log('isDeviceConnected?', connected);
  // console.log(BleManager.isDeviceConnected(rdsInfo.argoBleAddress).then(connected => connected))
}

export const uninitializeBleListener = () => {
  console.log('unmount');
  // bleManagerEmitter.removeListener('BleManagerDiscoverPeripheral', handleDiscoverPeripheral);
  // bleManagerEmitter.removeListener('BleManagerStopScan', handleStopScan );
  // bleManagerEmitter.removeListener('BleManagerDisconnectPeripheral', handleDisconnectedPeripheral );
  // bleManagerEmitter.removeListener('BleManagerDidUpdateValueForCharacteristic', handleUpdateValueForCharacteristic );

  // BleManagerDiscoverPeripheral.remove();
  // BleManagerStopScan.remove();
  // BleManagerDisconnectPeripheral.remove();
  // BleManagerDidUpdateValueForCharacteristic.remove();

  bleManager.remove();
}


// export const startScan = () => {
//   if (!isScanning) {
//     BleManager.scan([], 3, true).then((results) => {
//       console.log('Scanning...');
//       store.dispatch(setDiscovering(true));
//     }).catch(err => {
//       console.error('Error scanning', err);
//       ToastAndroid.show(`Error Scanning: ${err.toString()}`, ToastAndroid.SHORT);
//       // store.dispatch(setDiscovering(false));
//       handleStopScan();
//     });
//   }    
// }

export const handleStopScan = () => {
  console.log('Scan is stopped');
  store.dispatch(setDiscovering(false));
}


export const startDiscoveryBLE = async () => {
  console.log('start discovery ble.....');
  // console.log('store.getState().appReducer.devices', store.getState().appReducer.devices);

  let devices = [];
  if (store.getState().appReducer.devices) {
    devices = [...store.getState().appReducer.devices];
  }

  try {
    let granted = await requestAccessFineLocationPermission();

    if (!granted) {
      throw new Error('Access fine location was not granted');
    }

    await store.dispatch(setDiscovering(true));

    // check with bleAddress
    let isDeviceConnected = await bleManager.isDeviceConnected(store.getState().appReducer.bleAddress).then(connected => connected);
    let connectToDevice = null;

    console.log('isDeviceConnected?', isDeviceConnected);
    if (!isDeviceConnected) {

      console.log(`Attempting connection to ${store.getState().appReducer.bleAddress}`);
      addData({
        data: `Attempting connection to ${store.getState().appReducer.bleAddress}`,
        timestamp: new Date(),
        type: 'error',
      });

      try {
        connectToDevice = await bleManager.connectToDevice(store.getState().appReducer.bleAddress).then(device => device);

        console.log('connectToDevice', connectToDevice);

        if (connectToDevice) {
          // console.log('connect was successful', connectToDevice.id);
          // this.props.setBleConnected(true);
          // this.props.setBleStatus(`Argo connection was successful`);
          
          // store.dispatch(setDevice(connectToDevice));
          // store.dispatch()
          // observeDevice(connectToDevice);

          addData({
            data: 'Connection successful',
            timestamp: new Date(),
            type: 'info',
          });

          // auto send log
          // sendData();
          await store.dispatch(setBluetoothToggleConnection(true));
          await store.dispatch(setDevice(connectToDevice)); // karena callback connection itu isinya device dari native module
          observeDevice(connectToDevice);
        }
      }
      catch (e) {
        // this.props.setBleConnected(false);
        // this.props.setBleStatus(`Error: ${e.toString()}`);
        // this.props.setArgoCmd(null);
        console.log(`Error connect to device: ${e.toString()}`);
        addData({
          data: `Error connect to device: ${e.toString()}`,
          timestamp: new Date(),
          type: 'error',
        });
        ToastAndroid.show(`Error connect to device: ${e.toString()}`, ToastAndroid.LONG);
        // store.dispatch(setDiscovering(false));
        // store.dispatch(setDevice(null));
      }
    }
  }
  catch(e) {
    console.log('Error discovery', e.toString());
    addData({
      data: `Error discovery ${e.toString()}`,
      timestamp: new Date(),
      type: 'error',
    });
    ToastAndroid.show(`Error discovery ${e.toString()}`, ToastAndroid.LONG);
  }
}

export const observeDevice = async (device) => {
  if (!device) {
    return true;
  }
  try {
    const dev2 = await device.discoverAllServicesAndCharacteristics();
    const services = await bleManager.servicesForDevice(device.id)
    for (const svc of services) {
      // console.log(`Device service, id=${svc.id}, uuid=${svc.uuid}`, svc)
      const chars = await bleManager.characteristicsForDevice(device.id, svc.uuid)
      dumpDeviceCharacteristics(device, svc, chars)
    }
  } 
  catch (e) {
    console.log(`Error observeDevice: ${e.toString()}`);
    addData({
      data: `Error observeDevice: ${e.toString()}`,
      timestamp: new Date(),
      type: 'error',
    });
    ToastAndroid.show(`Error observeDevice: ${e.toString()}`, ToastAndroid.LONG);

    // store.dispatch(setDevice(null));
    // store.dispatch(setDiscovering(false));
  }
  return true
}

export const dumpDeviceCharacteristics = (dev, svc, chars) => {
  for (const ch of chars) {
    // console.log('Device Characteristics', ch)
    setupNotification(dev, svc, ch)
  }
}

export const setupNotification = (dev, svc, chr) => {
  let buffer = null;
  let bufString = null;
  if (!chr.isNotifiable) {
      return
  }
  dev.monitorCharacteristicForService(svc.uuid, chr.uuid, (e, c) => {
      if (e) {
          // console.log('Error monitor', e);
          // this.setState({bleStatus: `Error monitor: ${e.toString()}`, bleConnected: false});
          // this.props.setBleConnected(false);
          // this.props.setBleStatus(`Error monitor: ${e.toString()}`);
          // this.props.setArgoCmd(null);
          console.log(`Error monitor: ${e.toString()}`);
          addData({
            data: `Error monitor: ${e.toString()}`,
            timestamp: new Date(),
            type: 'error',
          });
      } else {
          // console.log(`UUID=${c.uuid}, value=${c.value}`, c)
          // this.props.setBleConnected(true);
          // this.props.setBleStatus(`Argo connection was successful`);
          addData({
            data: `Device connection was successful`,
            timestamp: new Date(),
            type: 'info',
          });
          // store.dispatch(setDiscovering(false));
          // store.dispatch(setDevice())
          buffer = Buffer.from(c.value, 'base64');
          // const res = this.argoData.push(buffer);

          addData({
            data: buffer,
            timestamp: new Date(),
            type: 'receive',
          });


          // if (res !== false) {
          //   //console.log(`cmd: ${this.argoData.lastCommand()}, frame to string: ${frame.toString('hex')}`);
          //   this.parseData(res.command, res.frame)
          // }
      }
  })
}

export const handleDiscoverPeripheral = (peripheral) => {
  console.log('Got ble peripheral', peripheral);
  if (!peripheral.name) {
    peripheral.name = 'NO NAME';
  }
  peripherals.set(peripheral.id, peripheral);
  setList(Array.from(peripherals.values()));
  store.dispatch(setPeripherals())
}

export const handleDisconnectedPeripheral = (data) => {
  let peripheral = peripherals.get(data.peripheral);
  if (peripheral) {
    peripheral.connected = false;
    peripherals.set(peripheral.id, peripheral);
    setList(Array.from(peripherals.values()));
  }
  console.log('Disconnected from ' + data.peripheral);
}

export const handleUpdateValueForCharacteristic = (data) => {
  console.log('Received data from ' + data.peripheral + ' characteristic ' + data.characteristic, data.value);
}

export const retrieveConnected = () => {
  BleManager.getConnectedPeripherals([]).then((results) => {
    if (results.length == 0) {
      console.log('No connected peripherals')
    }
    console.log(results);
    for (var i = 0; i < results.length; i++) {
      var peripheral = results[i];
      peripheral.connected = true;
      peripherals.set(peripheral.id, peripheral);
      setList(Array.from(peripherals.values()));
    }
  });
}

