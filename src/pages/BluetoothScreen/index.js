import React, { useEffect, useRef } from 'react';
import { useFocusEffect, useNavigation, useIsFocused } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import {
  FlatList,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Dimensions,
  ToastAndroid
} from 'react-native';
import {
  Container,
  Text,
  Header,
  Left,
  Button,
  Icon,
  Body,
  Title,
  Subtitle,
  Right,
} from 'native-base';
import { windowHeight } from '../../constants/styles';
// import ConnectionScreen from './Connection';
import * as RootNavigation from '../../routes/RootNavigation';
import { store } from '../../redux/store';
import {
  connect,
  disconnect,
  toggleConnection
} from '../../functions/BluetoothConnection';
import moment from 'moment';

const BluetoothScreen = () => {

  const { device, bluetoothToggleConnection, bluetoothLogData } = useSelector(state => state.appReducer)
  const scannedDataList = useRef(null)
  let toggleIcon = bluetoothToggleConnection ? 'radio-button-on' : 'radio-button-off';

  // useFocusEffect(
  //   React.useCallback(() => {
  //     if (!device) {
  //       disconnect();
  //       RootNavigation.navigate('DownloadData');
  //     }
  //     else {
  //       connect();
  //     }
  //   }, [device, bluetoothToggleConnection])
  // )

  useEffect(() => {
    console.log('BluetoothScreen useEffect.....');
    if (!device) {
      console.log('no device!')
      RootNavigation.navigate('DownloadData');
    }
    else {
      console.log('a device found! try to connect....')
      setTimeout(() => connect(), 0);
    }
  }, [device, bluetoothToggleConnection])

  return (
    <View>
      {device && (
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={{width: '20%'}}>
              <Button transparent onPress={() => RootNavigation.navigate('DownloadData')}>
                <Icon type="Ionicons" name="arrow-back" />
              </Button>
            </View>
            <View style={{width: '60%'}}>
              <Title>{device.name}</Title>
              <Subtitle>{device.address}</Subtitle>
            </View>
            <View style={{width: '20%'}}>
              <Button transparent onPress={() => toggleConnection()}>
                <Icon type="Ionicons" name={toggleIcon} />
              </Button>
            </View>
            
          </View>

          <View style={styles.connectionScreenWrapper}>
            <FlatList
              style={styles.connectionScreenOutput}
              inverted
              ref={scannedDataList}
              data={bluetoothLogData}
              keyExtractor={(item) => moment(item.timestamp).toISOString()}
              renderItem={({ item }) => (
                <View
                  id={moment(item.timestamp).toISOString()}
                  flexDirection={'row'}>
                  {/*<Text>{item.timestamp.toLocaleDateString()}</Text>*/}
                  <Text style={{flex: 3, fontSize: 12, color: item.data.includes('[REC.GEN]') ? 'green' : 'black'}}>{`${moment(item.timestamp).format('YYYY/MM/DD')}\n${moment(item.timestamp).format('HH:mm:ss')}`}</Text>
                  <Text style={{flex: 1, fontSize: 12, color: item.data.includes('[REC.GEN]') ? 'green' : 'black'}}>{item.type === 'sent' ? ' < ' : ' > '}</Text>
                  <Text style={{flex: 10, fontSize: 12, color: item.data.includes('[REC.GEN]') ? 'green' : 'black'}}>{item.data}</Text>
                </View>
              )}
            />
          </View>
        </View>
      )}
    </View>
  )
}

export default BluetoothScreen;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    // width: "100%"
  },
  header: {
    width: "100%",
    height: 60,
    backgroundColor: "#1E90FF",
    paddingVertical: 8,
    paddingHorizontal: 8,
    flexDirection: 'row'
  },
  connectionScreenWrapper: {
    // flex: 1,
    flexDirection: 'row',
    width: "100%",
    // flexShrink: 1,
    height: windowHeight - 140
  },
  connectionScreenOutput: {
    flex: 1,
    // paddingHorizontal: 8,
    width: '100%'
    // height: 800
    // marginTop: 100
    // height: windowHeight - 125
  },
  inputArea: {
    flexDirection: 'row',
    alignContent: 'stretch',
    backgroundColor: '#ccc',
    paddingHorizontal: 16,
    paddingVertical: 6,
    height: 50
  },
  inputAreaConnected: {
    flexDirection: 'row',
    alignContent: 'stretch',
    backgroundColor: '#90EE90',
    paddingHorizontal: 16,
    paddingVertical: 6,
    height: 50
  },
  inputAreaTextInput: {
    flex: 1,
    height: 40,
  },
  inputAreaSendButton: {
    justifyContent: 'center',
    flexShrink: 1,
  },
  logText: {
    fontSize: 12
  }
})