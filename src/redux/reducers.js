import { 
    SET_IS_LOADING,
    SET_START_SERVICE,
    SET_BLUETOOTH_ENABLED,
    SET_DISCOVERING,
    SET_DEVICES,
    SET_DEVICE,
    SET_IMEI,
    SET_BLE_ADDRESS,
    SET_VEHICLE,
    SET_AUTO_SEND,
    SET_IS_TERMINAL_ACTIVE,
    SET_TIMER,
    SET_BLUETOOTH_LOG_DATA,
    SET_BLUETOOTH_READ_SUBSCRIPTION,
    SET_BLUETOOTH_TOGGLE_CONNECTION,
    SET_ENABLED_SUBSCRIPTION,
    SET_DISABLED_SUBSCRIPTION,
    SET_RECORD_DATA,
    SET_PROGRESS_UPLOAD
} from "./actions";


const appInitialState = {
    isLoading: true, // app loading
    startService: false, // state of Start Service of OSBLE (button START / STOP)
    bluetoothEnabled: true, // check bluetoothEnabled on handphone
    discovering: false, // discover state bluetooth nearby
    devices: [], // paired bluetooth devices (after discovering)
    device: null, // connected bluetooth device (chosen by bleAddress)
    imei: '', // Vehicle IMEI
    bleAddress: '34:81:F4:27:F3:E1', // Bluetooth address for GPS Device
    vehicle: '', // Vehicle License Plate, for alert information when failed to connect bluetooth
    autoSend: true, // auto send record to API
    isTerminalActive: false, // terminal bluetooth view after success connecting device
    timer: null, // background timer object
    bluetoothLogData: [], // bluetooth log screen
    bluetoothReadSubscription: null, // when device.onDataReceived
    bluetoothToggleConnection: false, // state connection on bluetooth screen
    enabledSubscription: null, // bluetooth subscription (on state change of bluetooth)
    disabledSubscription: null, // bluetooth subscription (on state change of bluetooth)
    recordData: [], // record page
    progressUpload: false, // record page,
    startCommand: 'DAA5',
    stopCommand: 'DB',
};

const MAX_LENGTH_LOG_DATA = 20;

function appReducer(state = appInitialState, action) {
    switch(action.type) {
        case SET_IS_LOADING:
            return {...state, isLoading: action.payload}
        case SET_START_SERVICE:
            return {...state, startService: action.payload}
        case SET_BLUETOOTH_ENABLED:
            return {...state, bluetoothEnabled: action.payload}
        case SET_DISCOVERING:
            return {...state, discovering: action.payload}
        case SET_DEVICES:
            return {...state, devices: action.payload}
        case SET_DEVICE:
            return {...state, device: action.payload}
        case SET_IMEI:
            return {...state, imei: action.payload}
        case SET_BLE_ADDRESS:
            return {...state, bleAddress: action.payload}
        case SET_VEHICLE:
            return {...state, vehicle: action.payload}
        case SET_AUTO_SEND:
            return {...state, autoSend: action.payload}
        case SET_IS_TERMINAL_ACTIVE:
            return {...state, isTerminalActive: action.payload}
        case SET_TIMER:
            return {...state, timer: action.payload}
        case SET_BLUETOOTH_LOG_DATA:
            return {...state, bluetoothLogData: action.payload}
        case SET_BLUETOOTH_TOGGLE_CONNECTION:
            return {...state, bluetoothToggleConnection: action.payload}
        case SET_ENABLED_SUBSCRIPTION:
            return {...state, enabledSubscription: action.payload}
        case SET_DISABLED_SUBSCRIPTION:
            return {...state, disabledSubscription: action.payload}
        case SET_RECORD_DATA:
            return {...state, recordData: action.payload}
        case SET_PROGRESS_UPLOAD:
            return {...state, progressUpload: action.payload}
        default:
            return state;
    }
}

export default appReducer;