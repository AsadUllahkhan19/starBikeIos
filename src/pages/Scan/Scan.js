import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Button, Dimensions } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BarIndicator } from 'react-native-indicators';
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import { userRideCredentials } from "../../store/reducers/User";
import HamBurger from "../../components/HamBurger";
import { GlobalStyles } from "../../../GlobalStyles";
import baseUrl from "../../services/baseUrl";
import { putAmount } from '../../store/reducers/User';
import makeRequest from "../../services/axiosInstance";

export default function Scan({ drawerNavigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [showLoading, setShowLoading] = useState(true);

  const dispatch = useDispatch();
  const userData = useSelector(state => state.user.userAuthCredentials);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getBarCodeScannerPermissions();

    setTimeout(() => {
      setShowLoading(false);
    }, 2000);
  }, []);

  const storeData = async (value) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem("mqttCred", jsonValue);
    } catch (e) {
      console.log(e);
    }
  };

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);
    makeRequest('post', 'scooter/checkstars', { email: userData.email }).then(async (res) => {
      const temp = Number(res.credit)
      if (temp > 0) {
        // alert(`Barcode with type ${type} and data ${data} has been scanned!`);
        dispatch(userRideCredentials(data));
        dispatch(putAmount(temp));
        drawerNavigation.reset({
          index: 0,
          routes: [{ name: 'Ride' }]
        });
        await storeData(data);
      } else {
        dispatch(userRideCredentials(data));
        drawerNavigation.reset({
          index: 0,
          routes: [{ name: 'coin' }]
        });
      }
    })
    //  console.log('jeanser', data);
    // axios.post(`${baseUrl}/scooter/checkstars`, { email: userData.email })
    // // axiosInstance.post(`/scooter/checkstars`, { email: userData.email })
    // .then(async (res) => {
    //   console.log('check_stars', res);
    // })
    // .catch(err => {
    //   console.log('kidding_error', err);
    // })
  };

  if (showLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: 'black' }}>
        <BarIndicator color='#FBA51C' />
      </View>
    );
  }

  if (hasPermission === null) {
    return (
      <View
        style={[
          GlobalStyles.flex_1,
          GlobalStyles.justifyContentCenter,
          GlobalStyles.alignItemsCenter,
        ]}
      >
        <Text style={[GlobalStyles.fs_4]}>
          Requesting for camera permission!
        </Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View
        style={[
          GlobalStyles.flex_1,
          GlobalStyles.justifyContentCenter,
          GlobalStyles.alignItemsCenter,
        ]}
      >
        <Text style={[GlobalStyles.fs_4]}>No access to camera!</Text>
      </View>
    );
  }


  return (
    <View style={styles.container}>
      <View style={{ position: 'absolute', zIndex: 5050000505, top: 0, left: 10 }}>
        <HamBurger navigation={drawerNavigation} />
      </View>
      <Text style={[styles.text]}>Scan to Ride!</Text>
      <BarCodeScanner
        key={scanned ? 1 : 2}
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={[
          StyleSheet.absoluteFillObject,
          styles.container,
          styles.scanner
        ]}
        barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
      >

        <View style={styles.layerTop} />
        <View style={styles.layerCenter}>
          <View style={styles.layerLeft} />
          <View style={styles.focused} />
          <View style={styles.layerRight} />
        </View>
        <View style={styles.layerBottom} />
      </BarCodeScanner>
      {scanned && (
        <View style={{ position: 'absolute', bottom: 100, width: Dimensions.get('window').width, justifyContent: 'center', alignItems: 'center' }}>
          <Button
            color="#FBA51C"
            title={"Tap to Scan Again"}
            onPress={() => setScanned(false)}
          />
        </View>
      )}
    </View>
  );
}

const opacity = "rgba(0, 0, 0, .9)";
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  layerTop: {
    flex: 2,
    backgroundColor: opacity,
  },
  layerCenter: {
    flex: 3,
    flexDirection: "row",
    borderRadius: 20,
  },
  layerLeft: {
    flex: 1,
    backgroundColor: opacity,
  },
  focused: {
    flex: 10,
  },
  layerRight: {
    flex: 1,
    backgroundColor: opacity
  },
  layerBottom: {
    flex: 2,
    backgroundColor: opacity
  },
  text: {
    position: "relative",
    color: "white",
    top: 150,
    textAlign: "center",
    zIndex: 100
  }
});
