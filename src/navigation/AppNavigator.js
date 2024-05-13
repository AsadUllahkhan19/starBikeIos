import { useEffect } from 'react';
import { createStackNavigator } from "@react-navigation/stack";
import SignIn from "../pages/signin/Signin.js";
import MyDrawer from "./DrawerNavigator.js";
import History from "../pages/History/History.js";
import Checkout from "../pages/Checkout";
import HelpStackNavigator from "./HelpStackNavigator.js";
import SafetyStackNavigator from "./SafetyStackNavigator";
import HistoryMap from "../pages/History/HistoryMap.js";
import Ride from '../pages/Ride'
import Coins from '../pages/Coins'
import baseUrl from '../services/baseUrl';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import BackgroundService from 'react-native-background-actions';
import { checkRideStatus, timeElapsed, handleTimerRunning, resetTimeElapsed, userRideCredentials, userRideLocation, setAmount, putAmount, resetUserRideLocation } from '../store/reducers/User.js';

const RootStack = () => {
  const dispatch = useDispatch();

  const userAuthData = useSelector(state => state?.user?.userAuthCredentials);
  const timerRunning = useSelector(state => state?.user?.timerRunning);
  const rideUserData = useSelector(state => state?.user?.userRideCred);
  useEffect(() => {
    handleBackground();
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
       if(userAuthData?.email){
         // Make the Axios POST request
         const response = await axios.post(`${baseUrl}/users/beat`, {
           email: userAuthData?.email
         });
       }
      } catch (error) {
        console.error('beatError', error);
      }
    };

    // Call fetchData initially
    fetchData();

    // Set up interval to call fetchData every 10 seconds
    const intervalId = setInterval(fetchData, 10000);

    // Clear interval on component unmount to prevent memory leaks
    return () => clearInterval(intervalId);
  }, [userAuthData]); // Empty dependency array ensures useEffect only runs once



  const sleep = (time) => new Promise((resolve) => setTimeout(() => {
    if (userAuthData?.email) {
      axios.post(`${baseUrl}/users/beat`, { email: userAuthData?.email })
    }
    resolve();
  }, time));

  const sleep2 =(time) => new Promise((resolve) => setTimeout(() => {
    if (timerRunning) {
      dispatch(timeElapsed(1));
    }
    let temp = rideUserData !== null ? /IMEI:(\d+)/.exec(rideUserData) : '';
    if (temp && userAuthData?.email) {
      axios.post(`${baseUrl}/scooter/isoccupied`, { imei: temp[1], email: userAuthData?.email })
        .then(async(response) => {
          if (response === false) {
            await BackgroundService.stop();
            dispatch(resetTimeElapsed());
            dispatch(resetRideLocation([]));
            dispatch(checkRideStatus('start'));
            setIsLoading(false);
            // dispatch(userRideCredentials(null));
            dispatch(handleTimerRunning(false));
            dispatch(putAmount(0));
            dispatch(resetUserRideLocation());
          }
        })
    }
    resolve();
  }, time));

  const veryIntensiveTask = async (taskDataArguments) => {
    // Example of an infinite loop task
    const { delay } = taskDataArguments;
    await new Promise(async (resolve) => {
      await sleep(delay);
    });
  };
  const backgroundTimerRunningCheck = async (taskDataArguments) => {
    // Example of an infinite loop task
    const { delay } = taskDataArguments;
    await new Promise(async (resolve) => {
      await sleep2(delay);
    });
  };

  const options = {
    taskName: 'Beat task',
    taskTitle: 'Beat Api',
    taskDesc: 'Keep Ride Alive Beats',
    taskIcon: {
      name: 'ic_launcher',
      type: 'mipmap',
    },
    color: '#ff00ff',
    linkingURI: 'yourSchemeHere://chat/jane', // See Deep Linking for more info
    parameters: {
      delay: 10000
    }
  };
  const options2 = {
    taskName: 'Ride Timer Track',
    taskTitle: 'Ride Timer Track',
    taskDesc: 'Ride Track Timer running',
    taskIcon: {
      name: 'ic_launcher',
      type: 'mipmap',
    },
    color: '#ff00ff',
    linkingURI: 'yourSchemeHere://chat/jane', // See Deep Linking for more info
    parameters: {
      delay: 1000
    }
  };

  const handleBackground = async () => {
    // const minute = 1000 * 60;
    await BackgroundService.start(veryIntensiveTask, options);
    // await BackgroundService.updateNotification({taskDesc: `${Math.round(Date.now() / year)}`});
    await BackgroundService.start(backgroundTimerRunningCheck, options2);
    // await BackgroundService.updateNotification({ taskDesc: 'New ExampleTask description' });
  }

  // const MainStack = () => {
  //   const MainStack = createStackNavigator();
  //   return (
  //     <MainStack.Navigator>
  //       <MainStack.Screen
  //         name="Main"
  //         component={MyDrawer}
  //         options={{ headerShown: false }}
  //       />
  //     </MainStack.Navigator>
  //   );
  // };

  const RootStack = createStackNavigator();
  return (
    <RootStack.Navigator
      mode="modal"
      initialRouteName="SignIn"
    >
      <RootStack.Screen
        name="Main"
        component={MyDrawer}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="History"
        component={History}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="Safety"
        component={SafetyStackNavigator}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="Help"
        component={HelpStackNavigator}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="checkout"
        component={Checkout}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="SignIn"
        component={SignIn}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="Ride"
        component={Ride}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="coin"
        component={Coins}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="HistoryMap"
        component={HistoryMap}
        options={{ headerShown: false }}
      />
    </RootStack.Navigator>
  );
};
export default RootStack;