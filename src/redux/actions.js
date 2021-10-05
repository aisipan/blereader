export const SET_IS_LOADING = 'SET_IS_LOADING';
export const SET_START_SERVICE = 'SET_START_SERVICE';
export const SET_BLUETOOTH_ENABLED = 'SET_BLUETOOTH_ENABLED';
export const SET_DISCOVERING = 'SET_DISCOVERING';
export const SET_DEVICES = 'SET_DEVICES';
export const SET_DEVICE = 'SET_DEVICE';
export const SET_IMEI = 'SET_IMEI';
export const SET_BLE_ADDRESS = 'SET_BLE_ADDRESS';
export const SET_VEHICLE = 'SET_VEHICLE';
export const SET_AUTO_SEND = 'SET_AUTO_SEND';
export const SET_IS_TERMINAL_ACTIVE = 'SET_IS_TERMINAL_ACTIVE';
export const SET_TIMER = 'SET_TIMER';
export const SET_BLUETOOTH_LOG_DATA = 'SET_BLUETOOTH_LOG_DATA';
export const SET_BLUETOOTH_READ_SUBSCRIPTION = 'SET_BLUETOOTH_READ_SUBSCRIPTION';
export const SET_BLUETOOTH_TOGGLE_CONNECTION = 'SET_BLUETOOTH_TOGGLE_CONNECTION';
export const SET_ENABLED_SUBSCRIPTION = 'SET_ENABLED_SUBSCRIPTION';
export const SET_DISABLED_SUBSCRIPTION = 'SET_DISABLED_SUBSCRIPTION';
export const SET_RECORD_DATA = 'SET_RECORD_DATA';
export const SET_PROGRESS_UPLOAD = 'SET_PROGRESS_UPLOAD';

export const setIsLoading = param => dispatch => {
	dispatch({
		type: SET_IS_LOADING,
		payload: param
	})
};
export const setStartService = param => dispatch => {
	dispatch({
		type: SET_START_SERVICE,
		payload: param
	})
};
export const setBluetoothEnabled = param => dispatch => {
	dispatch({
		type: SET_BLUETOOTH_ENABLED,
		payload: param
	})
};
export const setDiscovering = param => dispatch => {
	dispatch({
		type: SET_DISCOVERING,
		payload: param
	})
};
export const setDevices = param => dispatch => {
	dispatch({
		type: SET_DEVICES,
		payload: param
	})
};
export const setDevice = param => dispatch => {
	dispatch({
		type: SET_DEVICE,
		payload: param
	})
};
export const setImei = param => dispatch => {
	dispatch({
		type: SET_IMEI,
		payload: param
	})
};
export const setBleAddress = param => dispatch => {
	dispatch({
		type: SET_BLE_ADDRESS,
		payload: param
	})
};
export const setVehicle = param => dispatch => {
	dispatch({
		type: SET_VEHICLE,
		payload: param
	})
};
export const setAutoSend = param => dispatch => {
	dispatch({
		type: SET_AUTO_SEND,
		payload: param
	})
};
export const setIsTerminalActive = param => dispatch => {
	dispatch({
		type: SET_IS_TERMINAL_ACTIVE,
		payload: param
	})
};
export const setTimer = param => dispatch => {
	dispatch({
		type: SET_TIMER,
		payload: param
	})
};
export const setBluetoothLogData = param => dispatch => {
	dispatch({
		type: SET_BLUETOOTH_LOG_DATA,
		payload: param
	})
};
export const setBluetoothReadSubscription = param => dispatch => {
	dispatch({
		type: SET_BLUETOOTH_READ_SUBSCRIPTION,
		payload: param
	})
};
export const setBluetoothToggleConnection = param => dispatch => {
	dispatch({
		type: SET_BLUETOOTH_TOGGLE_CONNECTION,
		payload: param
	})
};
export const setEnabledSubscription = param => dispatch => {
	dispatch({
		type: SET_ENABLED_SUBSCRIPTION,
		payload: param
	})
};
export const setDisabledSubscription = param => dispatch => {
	dispatch({
		type: SET_DISABLED_SUBSCRIPTION,
		payload: param
	})
};
export const setRecordData = param => dispatch => {
	dispatch({
		type: SET_RECORD_DATA,
		payload: param
	})
};
export const setProgressUpload = param => dispatch => {
	dispatch({
		type: SET_PROGRESS_UPLOAD,
		payload: param
	})
};