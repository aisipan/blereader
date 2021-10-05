import React, { Component, Fragment, useState, useEffect } from 'react'
import { useFocusEffect, useNavigation, useIsFocused } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { StyleSheet, Text, ScrollView, View, TouchableOpacity, TextInput, Alert, PermissionsAndroid, ToastAndroid, Button as ButtonRN, ActivityIndicator } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import ModalSelector from 'react-native-modal-selector-searchable'
import Gap from '../../components/Gap';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_VEHICLE } from '../../constants';
import { config } from '../../constants/config';
import RNBluetoothClassic from 'react-native-bluetooth-classic';
import * as RootNavigation from '../../routes/RootNavigation';
import { 
  OsbleStartService,
  OsbleStopService,
} from '../../functions/OsbleHeadlessTask';
import {
  checkBluetoothEnabled,
  requestEnabled,
  initializeBluetoothSubscription,
  uninitializeBluetoothSubscription
} from '../../functions/BluetoothConnection';
import {
  setIsLoading,
  setStartService,
  setBluetoothEnabled,
  setDiscovering,
  setDevice,
  setImei,
  setBleAddress,
  setVehicle,
  setAutoSend,
  setIsTerminalActive,
  setTimer,
} from '../../redux/actions';
import { store } from '../../redux/store';

const Settings = () => {

  const dispatch = useDispatch();

  const {
    vehicle, 
    bleAddress,
    imei,
    startService,
    discovering,
    bluetoothEnabled,
    device
  } = useSelector(state => state.appReducer);

  const [vehicle_, setVehicle_] = useState('');
  const [bleAddress_, setBleAddress_] = useState('');
  const [imei_, setImei_] = useState('');

  useEffect(() => {
    initData();

    return () => {
      // This is its cleanup.
    };
  }, []);

  const initData = async () => {
    setVehicle_(vehicle)
    setImei_(imei)
    setBleAddress_(bleAddress)
  }

  const saveData = async () => {
    dispatch(setVehicle(vehicle_));
    dispatch(setImei(imei_));
    dispatch(setBleAddress(bleAddress_));
    ToastAndroid.show('Saved successfully', ToastAndroid.LONG);
  }

  return (
    <View style={styles.container}>
      <ScrollView style={{  paddingHorizontal: 16, width : "100%" }}>

        <Gap height={20} />

        {/*<Text style={styles.textLabel}>Vehicle</Text>
        <TextInput
          value={vehicle_}
          onChangeText={(text) => setVehicle_(text)}
          style={styles.textInput}
        />*/}

        {/*<Text style={styles.textLabel}>IMEI</Text>
        <TextInput
          value={imei_}
          onChangeText={(text) => setImei_(text)}
          style={styles.textInput}
        />*/}

        <Text style={styles.textLabel}>Bluetooth Address</Text>
        <TextInput
          value={bleAddress_}
          onChangeText={(text) => setBleAddress_(text)}
          style={styles.textInput}
        />

        <TouchableOpacity style={{backgroundColor: 'green', paddingVertical: 14, justifyContent: 'center', marginVertical: 20,borderRadius: 10}}
        onPress={() => saveData()}
        >
          <Text style={{color: '#FFFFFF', fontSize: 16, fontWeight: 'bold', textAlign: 'center'}}>SAVE</Text>
        </TouchableOpacity>

        <Gap height={20} />


      </ScrollView>

      
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
    },
    header: {
        width: "100%",
        height: 50,
        backgroundColor: "#1E90FF",
        paddingVertical: 8,
        paddingHorizontal: 8,
        flexDirection: 'row'
    },
    view: {
      // flex: 0.5,
      justifyContent: 'center',
      alignItems: 'center',
    },
    button: {
      backgroundColor: 'gray',
      padding: 10,
      margin: 10,
    },
    instructions: {
      fontSize: 20,
      color: 'white',
    },
    textLabel: {
      fontSize: 16,
      fontWeight: 'bold',
      marginVertical: 5
    },
    textInput: {
      fontSize: 16,
      backgroundColor: '#FFFFFF',
      paddingHorizontal: 10,
      borderRadius: 10,
      marginBottom: 10
    }

})

export default Settings
