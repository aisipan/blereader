import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AppView from '../src/routes/index'
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './redux/store';

const App = () => {
    return (
        <Provider store={store}>
            <PersistGate loading={
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'white'
                }}>
                    <ActivityIndicator />
                </View>
             } persistor={persistor}>
                <AppView />
            </PersistGate>
        </Provider>
    )
}

export default App