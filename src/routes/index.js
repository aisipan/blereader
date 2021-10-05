import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { View, Text, ActivityIndicator, StatusBar } from 'react-native';
import BackgroundTimer from 'react-native-background-timer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { isReadyRef, navigationRef, routeNameRef } from './RootNavigation';
import { useDispatch } from 'react-redux';

import {
  setIsLoading,
  setBluetoothEnabled,
  setDevice,
  setImei,
  setBleAddress,
  setVehicle,
  setAutoSend,
  setIsTerminalActive,
  setTimer,
} from '../redux/actions';
import { store } from '../redux/store';

// Screens
import BluetoothScreen from '../pages/BluetoothScreen';
import DownloadData from '../pages/DownloadData';
import Settings from '../pages/Settings';


const Tab = createBottomTabNavigator();
const DownloadStack = createStackNavigator();
const Stack = createStackNavigator();


function AppView() {

  const dispatch = useDispatch();

  const initializeData = async () => {
    store.dispatch(setIsLoading(false));
  }

  // setiap kali masuk aplikasi
  React.useEffect(() => {
    setTimeout(async () => {
      try {
        initializeData()
      } catch (e) {
        console.log(e)
      }
    }, 1000);

    // componentWillUnmount
    return () => {
      isReadyRef.current = false
    };
  }, [])

  return (
    <>
        <StatusBar barStyle="default" backgroundColor="#115496"/>
        <NavigationContainer 
          ref={navigationRef} 
          onReady={() => {
            isReadyRef.current = true;
            routeNameRef.current = navigationRef.current.getCurrentRoute().name
          }}
          onStateChange={() => {
            const previousRouteName = routeNameRef.current
            const currentRouteName = navigationRef.current.getCurrentRoute().name

            if (previousRouteName !== currentRouteName) {
              // Do something here with it
            }

            // Save the current route name for later comparision
            routeNameRef.current = currentRouteName
          }}
        >
            <Stack.Navigator initialRouteName="DownloadData">
              <Stack.Screen options={{ headerShown: false }} name="DownloadData" component={DownloadData} />
              <Stack.Screen options={{ headerShown: false }} name="BluetoothScreen" component={BluetoothScreen} />
              <Stack.Screen options={{ headerShown: true }} name="Settings" component={Settings} />
            </Stack.Navigator>
        </NavigationContainer>
      </>
  );
}

export default AppView