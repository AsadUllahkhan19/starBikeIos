import React, { useState, useEffect } from "react";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem
} from "@react-navigation/drawer";
import axios from "axios";
import { DrawerActions } from '@react-navigation/native'
import * as Location from "expo-location";
import { Image, Text, View, TouchableNativeFeedback } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSelector, useDispatch } from "react-redux";
import { GoogleSignin } from "@react-native-google-signin/google-signin";


import History from "../pages/History/History";
import Safety from "../pages/Safety/Safety";
import Checkout from "../pages/Checkout";
import BottomNavigator from "./BottomNavigator";
import Track from "../../assets/track.png";
import Scooter from "../../assets/kick-scooter.png";
import { GlobalStyles } from "../../GlobalStyles";
import Wallet from "../../assets/wallet.png";

import Information from "../../assets/information.png";
import Coins from "../../assets/coins_count.png";
import HistoryPng from "../../assets/history.png";
import Security from "../../assets/security.png";
import SignOut from "../../assets/signout.png";
import Currency from "../../assets/currency.png";
import LogoutSvg from '../../assets/AppIcons/Logout.svg'
import makeRequest from "../services/axiosInstance";
import baseUrl from "../services/baseUrl";
import { putTotalAmount } from "../store/reducers/User";

const CustomDrawerContent = (props) => {
  const [coins, setCoins] = useState(0);
  const [miles, setMiles] = useState(0);
  const [rides, setRides] = useState(0);

  const dispatch = useDispatch();

  const userData = useSelector(state => state.user.userAuthCredentials);
  const totalAmount = useSelector(state => state.user.totalAmount);
  useEffect(() => {
    // const unsubscribe = props.navigation.addListener('drawerClose', () => {
    //   props.navigation.closeDrawer();
    //   // Your logic when the drawer is closed
    // });

    // if(userData?.email) {
    makeRequest('post', 'scooter/checkstars', { email: userData?.email })
      .then((res) => {
        // console.log(credit?.credit ,credit ,'From_Navigator', typeof credit)
        dispatch(putTotalAmount(res.credit));
        // setCoins(res)
      })
    axios.post(`${baseUrl}/users/info`, { email: userData?.email })
      .then((res) => {
        setMiles(res?.data?.TotalMiles);
        setRides(res?.data?.TotalRides);
      }).catch((err) => {
        console.log('error', err)
      })
    // makeRequest('post', 'users/info', { email: userData?.email })
    // .then((res) => {
    //   setMiles(res?.TotalMiles);
    //   setRides(res?.TotalRides);
    // }).catch((err) => {
    //   console.log('error', err)
    // })
    // }

    // return unsubscribe;
  }, [props.navigation, userData]);

  const logout = async () => {
    props.navigation.closeDrawer();
    // props?.navigation?.navigate("SignIn");
    props?.navigation?.reset({
      index: 0,
      routes: [{ name: 'SignIn' }]
    })
    await AsyncStorage.clear();
    await GoogleSignin.revokeAccess();
    await GoogleSignin.signOut();
  };

  // const logout = async () => {
  //   try {
  //     await GoogleSignin.revokeAccess();
  //     await GoogleSignin.signOut();
  //     props.navigation.closeDrawer();
  //     AsyncStorage.clear().then((res) => {
  //       props?.navigation?.navigate("SignIn");
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  return (
    <DrawerContentScrollView  {...props}>
      <View
        style={[
          GlobalStyles.marginVertical_5,
          GlobalStyles.flex_row,
          GlobalStyles.marginHorizontal_7,
          GlobalStyles.justifyContentBetween,
        ]}
      >
        <View style={[GlobalStyles.alignItemsCenter]} >
          <Image source={Track} style={[GlobalStyles.h_5, GlobalStyles.w_5]} />
          <Text
            style={[
              GlobalStyles.fw_bold,
              GlobalStyles.fs_3,
              GlobalStyles.marginVertical_1,
            ]}
          >
            {miles}
          </Text>
          <Text style={[GlobalStyles.text_gray]}>Miles</Text>
        </View>
        <View style={[GlobalStyles.alignItemsCenter]}>
          <Image
            source={Scooter}
            style={[GlobalStyles.h_5, GlobalStyles.w_5]}
          />
          <Text
            style={[
              GlobalStyles.fw_bold,
              GlobalStyles.fs_3,
              GlobalStyles.marginVertical_1,
            ]}
          >
            {rides}
          </Text>
          <Text style={[GlobalStyles.text_gray]}>Rides</Text>
        </View>
        <View style={[GlobalStyles.alignItemsCenter]}>
          <Image
            source={Coins}
            style={[GlobalStyles.h_5, GlobalStyles.w_5]}
          />
          <Text
            style={[
              GlobalStyles.fw_bold,
              GlobalStyles.fs_3,
              GlobalStyles.marginVertical_1
            ]}
          >
            {totalAmount || 0}
          </Text>
          <Text style={[GlobalStyles.text_gray]}>Stars</Text>
        </View>
      </View>
      <View>
        <View>
          <DrawerItem
            label="Home"
            icon={({ focused, color, size }) => (
              <Image source={Wallet} style={[GlobalStyles.marginLeft_5]} />
            )}
            onPress={() => {
              props.navigation.reset({
                index: 0,
                routes: [{ name: 'Home' }]
              });
              // dispatched({ type: 'UNMOUNT' });
              // setTimeout(() => {
              // props.navigation.navigate('Home', { screen: 'Map' });
              // props.navigation.closeDrawer();
              // }, 0)
              // setTimeout(() => {
              //   // dispatched({ type: 'MOUNT' });
              // }, 1000)
            }}
          />
          {/* <DrawerItem
            label="Wallet"
            icon={({ focused, color, size }) => (
              <Image source={Wallet} style={[GlobalStyles.marginLeft_5]} />
            )}
            onPress={() => props.navigation.navigate("Payment")}
          /> */}
          <DrawerItem
            label="History"
            icon={({ focused, color, size }) => (
              <Image source={HistoryPng} style={[GlobalStyles.marginLeft_5]} />
            )}
            onPress={() => props.navigation.navigate("History")}
          />
          <DrawerItem
            label="Safety"
            icon={({ focused, color, size }) => (
              <Image source={Security} style={[GlobalStyles.marginLeft_5]} />
            )}
            onPress={() => props.navigation.navigate("Safety")}
          />
          <DrawerItem
            label="Help"
            icon={({ focused, color, size }) => (
              <Image source={Information} style={[GlobalStyles.marginLeft_5]} />
            )}
            onPress={() => props.navigation.navigate("Help")}
          />
          {/* <DrawerItem
            label="Checkout"
            icon={({ focused, color, size }) => (
              <Image source={Information} style={[GlobalStyles.marginLeft_5]} />
            )}
            onPress={() => props.navigation.navigate("checkout")}
          /> */}
          <DrawerItem
            label="Stars"
            icon={({ focused, color, size }) => (
              <Image source={Currency} style={[GlobalStyles.marginLeft_5]} />
            )}
            onPress={() => props.navigation.navigate("coin", { onlyBuyCoins: true })}
          />
          {/* <DrawerItem
            label="Payment"
            icon={({ focused, color, size }) => (
              <Image source={Information} style={[GlobalStyles.marginLeft_5]} />
            )}
            onPress={() => props.navigation.navigate("Payment")}
          /> */}
          
        </View>
      </View>
      <View style={[GlobalStyles.bg_orange], {
        position: "relative"
      }}>
        <DrawerItem
          label="Sign Out"
          
          icon={({ focused, color, size }) => (
            <Image source={SignOut} style={[GlobalStyles.marginLeft_5]} />
          )}
          onPress={logout}
        />
      </View>
    </DrawerContentScrollView>
  );
};

const Drawer = createDrawerNavigator();

const MyDrawer = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  // useEffect(() => {
  //   const getLocationFromUser = async () => {
  //     let { status } = await Location.requestForegroundPermissionsAsync();
  //     if (status !== "granted") {
  //       setErrorMsg("Permission to access location was denied");
  //       return;
  //     }

  //     try {
  //       let userLocation = await Location.getCurrentPositionAsync({});
  //       setLocation(userLocation);
  //     } catch (error) {
  //       setErrorMsg("Error getting location: " + error.message);
  //     }
  //   };
  //   getLocationFromUser();
  // }, []);

  return (
    <Drawer.Navigator
      // useLegacyImplementation={true}
      drawerStyle={{
        // width: '95%',
        // right: 0
        width: 240
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      drawerType="slide"

    >
      <Drawer.Screen
        name="Home"
        initialParams={{ errorMsg, location }}
        component={BottomNavigator}
        options={{ headerShown: false }}
      />
    </Drawer.Navigator>
  );
};

export default MyDrawer;
