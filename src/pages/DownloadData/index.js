import React, { Component, Fragment, useState, useEffect } from 'react'
import { useFocusEffect, useNavigation, useIsFocused } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Alert, Platform, PermissionsAndroid, ToastAndroid, Button as ButtonRN, ActivityIndicator,
  NativeModules, NativeEventEmitter } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import ModalSelector from 'react-native-modal-selector-searchable'
import Gap from '../../components/Gap';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_VEHICLE } from '../../constants';
import RNBluetoothClassic from 'react-native-bluetooth-classic';
import * as RootNavigation from '../../routes/RootNavigation';
import { 
  ZeeraAppStartService,
  ZeeraAppStopService,
} from '../../functions/ZeeraAppHeadlessTask';
import {
  checkBluetoothEnabled,
  requestEnabled,
  initializeBluetoothSubscription,
  uninitializeBluetoothSubscription,
  initializeBleListener,
  uninitializeBleListener
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
  setIsScanning
} from '../../redux/actions';
import { store } from '../../redux/store';
import BleManager from 'react-native-ble-manager';

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const Home = () => {

    const dispatch = useDispatch();
    const navigation = useNavigation();

    const {
      vehicle, 
      bleAddress,
      imei,
      startService,
      discovering,
      bluetoothEnabled,
      device,
      isScanning
    } = useSelector(state => state.appReducer);

    useEffect(() => {
      initializeBleListener();  
      
      return (() => {
        uninitializeBleListener();
      })
    }, [])

    // useFocusEffect(
    //   React.useCallback(() => {
    //       checkBluetoothEnabled();
    //       if (!bluetoothEnabled) {
    //         requestEnabled();
    //       }

    //       // if (device) {
    //       //   RootNavigation.navigate('BluetoothScreen');
    //       // }

    //   }, [])
    // )
 
    return (
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={{width: '80%'}}>
              <Text style={{fontSize: 18, fontWeight: "bold", color: '#ffffff', marginLeft: 5, paddingVertical: 5 }}>Home</Text>
            </View>

            <View style={{width: '20%', flexDirection: "row", justifyContent: "flex-end"}}>
              <TouchableOpacity onPress={() => navigation.navigate('Settings')} style={{ justifyContent: "center", marginRight: 10 }}>
                <AntDesign name="setting" size={26} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>

          <Gap height={20} />

          <View style={{  paddingHorizontal: 16, width : "100%" }}>
            
            <Gap height={20} />
            {
              startService ?
              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                {
                  discovering ? 
                  <>
                    <Text style={{marginBottom: 20, color: 'black'}}>Connecting to Bluetooth Device...</Text>
                    <ActivityIndicator style={{marginBottom: 20}} />
                    <TouchableOpacity
                      onPress={() => ZeeraAppStopService()}
                      style={{
                          backgroundColor: "#B71C1C", 
                          justifyContent: 'center',
                          alignItems: 'center',
                          paddingVertical: 12,
                          borderRadius: 5,
                          width: '100%'
                      }}
                    >
                      <Text style={{fontSize: 16, color: "#ffffff"}}>DISCONNECT</Text>
                    </TouchableOpacity>
                  </>
                  :
                  device ?
                  <>
                    <Text style={{marginBottom: 20, color: 'blue'}}>Device is connected</Text>
                    <TouchableOpacity
                      onPress={() => ZeeraAppStopService()}
                      style={{
                          backgroundColor: "#B71C1C", 
                          justifyContent: 'center',
                          alignItems: 'center',
                          paddingVertical: 12,
                          borderRadius: 5,
                          width: '100%'
                      }}
                    >
                      <Text style={{fontSize: 16, color: "#ffffff"}}>DISCONNECT</Text>
                    </TouchableOpacity>
                  </>
                  :
                  <>
                    <Text style={{marginBottom: 20, color: 'red'}}>Device is not connected</Text>
                    <TouchableOpacity
                      onPress={() => ZeeraAppStartService()}
                      style={{
                          backgroundColor: "#1B5E20", 
                          justifyContent: 'center',
                          alignItems: 'center',
                          paddingVertical: 12,
                          borderRadius: 5,
                          width: '100%'
                      }}
                    >
                      <Text style={{fontSize: 16, color: "#ffffff"}}>CONNECT</Text>
                    </TouchableOpacity>
                  </>
                }
              </View>
              :
              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{marginBottom: 20, color: 'red'}}>Device is not connected</Text>
                <TouchableOpacity
                  onPress={() => ZeeraAppStartService()}
                  style={{
                      backgroundColor: "#1B5E20", 
                      justifyContent: 'center',
                      alignItems: 'center',
                      paddingVertical: 12,
                      borderRadius: 5,
                      width: '100%'
                  }}
                >
                  <Text style={{fontSize: 16, color: "#ffffff"}}>CONNECT</Text>
                </TouchableOpacity>
              </View>
            }
          </View>
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
    }
})

export default Home
