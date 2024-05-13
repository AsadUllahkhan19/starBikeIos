import { useEffect } from 'react';
import 'react-native-gesture-handler';
import 'expo-dev-client';
import { Provider } from 'react-redux';
import { SafeAreaView, StatusBar, StyleSheet, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Platform } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
// import { store } from './src/store/Index';
import { PersistGate } from 'redux-persist/integration/react';

import { persistor, store } from './src/store/Index';
export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
          <StatusBar
            animated={true}
            backgroundColor="#0c0a09"
            hidden={false}
          />
          {Platform.OS === "ios" ? (
            <NavigationContainer>
              <AppNavigator />
            </NavigationContainer>
          ) : (
            <SafeAreaView style={styles.container}>
              <NavigationContainer>
                <AppNavigator />
              </NavigationContainer>
            </SafeAreaView>
          )}
      </PersistGate>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
});
