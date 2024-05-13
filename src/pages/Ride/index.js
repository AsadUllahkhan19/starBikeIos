import React, { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import { View, StyleSheet, Image, Button, PermissionsAndroid, TouchableOpacity, Text, Dimensions, ToastAndroid, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MapView, { Marker, Polyline } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import Geolocation from 'react-native-geolocation-service';
import { useSelector, useDispatch } from 'react-redux';
import Paho from 'paho-mqtt';
import axios from 'axios';
import { BarIndicator } from 'react-native-indicators';
import BottomSheet from '@gorhom/bottom-sheet';
import StarRating from 'react-native-star-rating';

import { resetRideLocation } from '../../store/reducers/Ride';
import { checkRideStatus, timeElapsed, handleTimerRunning, resetTimeElapsed, userRideCredentials, userRideLocation, setAmount, putAmount, resetUserRideLocation } from '../../store/reducers/User';
// import { setChargedAmount } from '../../store/reducers/Ride';
import ExitButton from '../../components/ExitButton';
import makeRequest from '../../services/axiosInstance';

import icon_current_location from "../../../assets/Map_icons/location-pin.png";
import charging from '../../../assets/charging.png'
import baseUrl from '../../services/baseUrl';
import { RotateOutDownRight } from 'react-native-reanimated';



const requestLocationPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Geolocation Permission',
        message: 'Can we access your location?',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK'
      }
    );
    if (granted === 'granted') {
      return true;
    } else {
      // alert('We cannot use your location.');
      ToastAndroid.show('We cannot use your location.', ToastAndroid.SHORT);
      return false;
    }
  } catch (err) {
    return false;
  }
};

const windowHeight = Dimensions.get('window').height * 0.5;

export default function Ride({ navigation, route }) {

  const [location, setLocation] = useState(false);
  const [destination, setDestination] = useState({});
  const [bottomSheetSize, setBottomSheetSize] = useState('20%');
  const [stopTime, setStopTime] = useState(0);
  const [flags, setFlags] = useState(true);
  const [value, setValue] = useState([]);
  const [batteryLife, setBatteryLife] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [rideEnded, setRideEnded] = useState(true);
  const [imeiMatch, setImeiMatch] = useState('');
  const [description, setDescription] = useState("");
  const bottomSheetREF = useRef();
  const [rating, setRating] = useState(0);
  const [chargedAmount, setChargedAmount] = useState(0);
  const [scooter, setScooter] = useState({
    latitude: 35.2401,
    longitude: 24.8093
  });


  const mapRef = useRef(null);
  const markerRef = useRef(null);

  const [userLocation, setUserLocation] = useState({
    latitude: 35.2401,
    longitude: 24.8093,
    latitudeDelta: 0.5,
    longitudeDelta: 0.5
  });

  // const client = new Paho.Client(
  //   // '62c1e15b3b684f33bf165815ba87fadd.s2.eu.hivemq.cloud',
  //   'broker.hivemq.com',
  //   Number(8000),
  //   `mqtt-async-test-${parseInt(Math.random() * 6)}`
  // );

  const client = new Paho.Client(
    // '62c1e15b3b684f33bf165815ba87fadd.s2.eu.hivemq.cloud',
    // 'broker.hivemq.com',
    'broker.emqx.io',
    8084,
    `StarBike-${(new Date().getTime()).toString(36)}`
  );

  // Redux Store
  const ridePathOfScooter = useSelector(state => state?.user?.ridePath);
  const rideUserData = useSelector(state => state?.user?.userRideCred);
  const userAuthData = useSelector(state => state?.user?.userAuthCredentials);
  const checkRideStatus1 = useSelector(state => state?.user?.checkRideStatus);
  const timeElpasedVariable = useSelector(state => state?.user?.timeElapsed);
  const timerRunning = useSelector(state => state?.user?.timerRunning);
  const amountRemaining = useSelector(state => state?.user?.amount);
  // const chargedAmount = useSelector(state => state?.ride?.chargedAmount);
  const dispatch = useDispatch();


  const RandomLocation = {
    latitude: 35.2401,
    longitude: 24.8093,
    latitudeDelta: 0.5,
    longitudeDelta: 0.5
  };


  const onMessage = (message) => {

    if (rideUserData === null) {
      return
    }
    let temp = /IMEI:(\d+)/.exec(rideUserData);
    if (message.destinationName == `data/KW/scootor/${temp[1]}`) {
      // if (message.destinationName == `data/starBike/scootor/${retrieveData()}`) {
      const newData = JSON.parse(message.payloadString);
      console.log(newData?.sb)
      if (newData?.sb) {
        setBatteryLife(newData?.sb);
      }
      if (newData?.sb <= 10) {
        setIsLoading(true);

        // if (userAuthData?.email) {
        let temp = /IMEI:(\d+)/.exec(rideUserData);
        makeRequest('post', 'scooter/stop', { topic: temp[1], userid: userAuthData.email })
          // axios.post(`${baseUrl}/scooter/stop`, { topic: temp[1], userid: userAuthData.email })
          .then((res) => {
            makeRequest('post', 'scooter/lock', { topic: temp[1], userid: userAuthData.email })
              // axios.post(`${baseUrl}/scooter/lock`, { topic: temp[1], userid: userAuthData.email })
              .then((res) => {
                dispatch(resetTimeElapsed());
                dispatch(resetRideLocation([]));
                dispatch(checkRideStatus('start'));
                setIsLoading(false);
                // dispatch(userRideCredentials(null));
                dispatch(handleTimerRunning(false));
                dispatch(putAmount(0));
                dispatch(resetUserRideLocation());

              }).then(() => {
                // alert('Ride ended.');
                ToastAndroid.show('Ride ended.', ToastAndroid.SHORT);
                // navigation.navigate('Main');
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Main' }]
                })
              })
          }).catch(err => {
            setIsLoading(false);
          })
      }
      // setNumbers(newData);
      if (newData?.la) {
        const temp1 = { latitude: newData?.la, longitude: newData?.lo };
        setScooter(temp1);
        dispatch(userRideLocation({ latitude: newData?.la, longitude: newData?.lo }));
        // setValue((state) => {
        //   const temp = [...state, { latitude: newData?.la, longitude: newData?.lo }];
        //   return temp;
        // });
      }
    }
  }

  useEffect(() => {
    if (markerRef.current && ridePathOfScooter?.length > 3) {
      // Animate marker to new coordinates
      const markerCoor = ridePathOfScooter[ridePathOfScooter?.length - 1];
      markerRef.current.animateMarkerToCoordinate(markerCoor, 500);
    }
    if (mapRef.current && ridePathOfScooter?.length > 3) {
      const markerCoor = ridePathOfScooter[ridePathOfScooter?.length - 1];

      // Animate map camera to follow marker
      mapRef.current.animateCamera({
        center: markerCoor,
        zoom: 15,
      });
    }
  }, [ridePathOfScooter]);

  useEffect(() => {
    if (rideUserData) {
      let temp = /IMEI:(\d+)/.exec(rideUserData);
      if (temp[1]) {
        client.connect({
          useSSL: true,
          cleanSession: true,
          onSuccess: () => {
            let temp = /IMEI:(\d+)/.exec(rideUserData);
            setImeiMatch(temp[1])
            client.subscribe(`data/KW/scootor/${temp[1]}`);
            // client.subscribe(`data/starBike/scootor/${retrieveData()}`);
            client.onMessageArrived = onMessage;
          },
          onFailure: () => {
            console.log('Failed to connect!');
          }
        })
      }
    }

    return () => {
      if (client.isConnected()) {
        let temp = /IMEI:(\d+)/.exec(rideUserData);
        client.unsubscribe(`data/KW/scootor/${temp[1]}`);
        client.disconnect();
      }
      setUserLocation({
        latitude: 35.2401,
        longitude: 24.8093,
        latitudeDelta: 0.5,
        longitudeDelta: 0.5
      })
    }
  }, [rideUserData])

  // ===========================================================================
  useEffect(() => {
    let interval;
    if (timerRunning) {
      interval = setInterval(() => {
        // const remainingSeconds = (timeElpasedVariable + 1) % 60;d 
        // setSeconds(prevSeconds => prevSeconds + 1);
        dispatch(timeElapsed(1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning]);

  const minutes = Math.floor(timeElpasedVariable / 60);
  const remainingSeconds = timeElpasedVariable % 60;

  if (remainingSeconds === 0 && minutes > 0 && flags) {
    setFlags(false);
    // axios.post(`${baseUrl}/scooter/chargeuser`, { email: userAuthData.email, amount: 1 })
    makeRequest('post', 'scooter/chargeuser', { email: userAuthData.email, amount: 1 })
      .then((res1) => {
        makeRequest('post', 'scooter/checkstars', { email: userAuthData.email })

          // axios.post(`${baseUrl}/scooter/checkstars`, { email: userAuthData.email })
          .then((res) => {
            console.log('charges_now', res.chargesnow);
            setChargedAmount(res.chargesnow)
            // setChargedAmount(res.chargesnow);
            dispatch(putAmount(res.credit));
            
            if (res?.credit <= 0 && rideUserData !== null) {
              setIsLoading(true);

              // if (userAuthData?.email) {
              let temp = /IMEI:(\d+)/.exec(rideUserData);
              makeRequest('post', 'scooter/stop', { topic: temp[1], userid: userAuthData.email })
                // axios.post(`${baseUrl}/scooter/stop`, { topic: temp[1], userid: userAuthData.email })
                .then((res) => {
                  makeRequest('post', 'scooter/lock', { topic: temp[1], userid: userAuthData.email })
                    // axios.post(`${baseUrl}/scooter/lock`, { topic: temp[1], userid: userAuthData.email })
                    .then((res) => {
                      dispatch(resetTimeElapsed());
                      dispatch(resetRideLocation([]));
                      dispatch(checkRideStatus('start'));
                      setIsLoading(false);
                      // dispatch(userRideCredentials(null));
                      dispatch(handleTimerRunning(false));
                      dispatch(putAmount(0));
                      dispatch(resetUserRideLocation());

                    }).then(() => {
                      // alert('Ride ended.');
                      ToastAndroid.show('Ride ended.', ToastAndroid.SHORT);
                      // navigation.navigate('Main');
                      navigation.reset({
                        index: 0,
                        routes: [{ name: 'Main' }]
                      })
                    })
                }).catch(err => {
                  setIsLoading(false);
                })
            }
          }).then(() => {
            setFlags(true);
          })
          .catch(err => {
            dispatch(resetTimeElapsed());
            dispatch(resetRideLocation([]));
            dispatch(checkRideStatus('start'));
            setIsLoading(false);
            // dispatch(userRideCredentials(null));
            dispatch(handleTimerRunning(false));
            dispatch(putAmount(0));
            dispatch(resetUserRideLocation());
            ToastAndroid.show('Ride ended.', ToastAndroid.SHORT);
            // navigation.navigate('Main');
            navigation.reset({
              index: 0,
              routes: [{ name: 'Main' }]
            })

          })
      })
  }

  // ==============================================================================
  // const handleLocation = () => {
  //   let temp = /IMEI:(\d+)/.exec(rideUserData);
  //   if (temp[1]) {
  //     client.connect({
  //       onSuccess: () => {
  //         let temp = /IMEI:(\d+)/.exec(rideUserData);
  //         setImeiMatch(temp[1])
  //         client.subscribe(`data/KW/scootor/${temp[1]}`);
  //         // client.subscribe(`data/starBike/scootor/${retrieveData()}`);
  //         client.onMessageArrived = onMessage;
  //       },
  //       onFailure: () => {
  //         console.log('Failed to connect!');
  //       }
  //     })
  //   }

  //   return () => {
  //     if (client.isConnected()) {
  //       let temp = /IMEI:(\d+)/.exec(rideUserData);
  //       client.unsubscribe(`data/KW/scootor/${temp[1]}`);
  //       client.disconnect();
  //     }
  //     setUserLocation({
  //       latitude: 35.2401,
  //       longitude: 24.8093,
  //       latitudeDelta: 0.5,
  //       longitudeDelta: 0.5
  //     })
  //   }
  // }


  // useEffect(() => {
  // if (client.isConnected()) {
  //   client.disconnect();
  // }

  // retrieveData();
  // }, [rideUserData, temp[1]])

  useEffect(() => {
    // clearLocation = setInterval(() => {
    getLocation();
    // }, 2000);
    // return () => clearInterval(clearLocation);
  }, [])

  const retrieveData = async () => {
    let value;
    try {
      value = await AsyncStorage.getItem("mqttCred");
      if (value !== null) {
        const res = await JSON.parse(value);
        return res?.IMEI;
      }
    } catch (error) {
      console.log(error);
    }
  };

  // const result = requestLocationPermission();
  //   result.then(res => {
  //     if (res) {
  //       Geolocation.getCurrentPosition(
  //         position => {
  //           let obj = {
  //             latitude: position.coords.latitude,
  //             longitude: position.coords.longitude,
  //             latitudeDelta: 0.005,
  //             longitudeDelta: 0.005
  //           };
  //           if (location != null) {
  //             regionofUser(obj)
  //           }
  //           setLocation(obj);
  //           // setDestination({
  //           //   latitude: position.coords.latitude,
  //           //   longitude: position.coords.longitude,
  //           //   latitudeDelta: 0.005,
  //           //   longitudeDelta: 0.005,
  //           // });
  //         },
  //         (error) => {
  //           // See error code charts below.
  //           setLocation(false);
  //         },
  //         { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
  //       );
  //     }
  //   });

  // try {
  //   let userLocation = await Location.getCurrentPositionAsync({});
  //   setActualLocation({
  //     latitude: userLocation.coords.latitude,
  //     longitude: userLocation.coords.longitude,
  //     latitudeDelta: 0.005,
  //     longitudeDelta: 0.005,
  //   });

  //   firstregionofUser(
  //     userLocation.coords.latitude,
  //     userLocation.coords.longitude,
  //   );

  //   console.log(
  //     "after every 4 sec",
  //     userLocation.coords.latitude,
  //     userLocation.coords.longitude,
  //   );
  // } catch (error) {
  //   setErrorMsg("Error getting location: " + error.message);
  //   reCenter();
  // }
  // };

  const regionofUser = (location) => {
    if (mapRef !== null && location !== null) {
      // console.log('from_region', location)
      mapRef.current.animateToRegion(location);
      // markerofUser();
    }
  };

  const getLocation = () => {
    const result = requestLocationPermission();
    result.then(res => {
      if (res) {
        Geolocation.getCurrentPosition(
          position => {
            let obj = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005
            };
            regionofUser(obj);
            setUserLocation(obj);
            setScooter({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            })
            // setValue((state) => {
            //   const temp = [...state, {
            //     latitude: position.coords.latitude,
            //     longitude: position.coords.longitude
            //   }];
            //   return temp;
            // });
            // setValue((state) => {
            //   const temp = [...state, {
            //     latitude: position.coords.latitude,
            //     longitude: position.coords.longitude
            //   }];
            //   return temp;
            // });
            // setDestination({
            //   latitude: position.coords.latitude,
            //   longitude: position.coords.longitude,
            //   latitudeDelta: 0.005,
            //   longitudeDelta: 0.005,
            // });
          },
          (error) => {
            // See error code charts below.
            setLocation(false);
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
      }
    });
  };

  // const handleStart = () => {
  //   setStart(new Date());
  // }

  // const handlePause = () => {
  //   setStopTime(new Date());
  //   setPause(true);
  // }

  // const handleResume = () => {
  //   // console.log(rideTime);
  //   const data = new Date() - stopTime;
  //   setStopTime(data);

  //   setPause(false);
  // }

  // const handleStop = () => {
  //   var elapsed = new Date() - start;
  //   let seconds = 0;
  //   if (stopTime !== null) {
  //     seconds = (elapsed - stopTime) / 1000;
  //   } else {
  //     seconds = elapsed / 1000;
  //   }
  //   let minutes = 0;
  //   if (seconds >= 60) {
  //     minutes = seconds / 60;
  //     console.log('from_minutes', minutes);
  //   } else {
  //     console.log('from_seconds', seconds);
  //   }
  // }

  function RegionBetweenUserandScooter() {
    mapRef.current.fitToCoordinates(
      [
        {
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        },
        {
          latitude: destination.latitude,
          longitude: destination.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        },
      ],
      {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: true,
      }
    );
  }

  // const changeValue = () => {
  //   const temp = numbers + 1;
  //   const message = new Paho.Message(JSON.stringify(temp));
  //   message.destinationName = `data/KW/scootor/862427062327327`;
  //   // message.destinationName = `862427062327145`;
  //   client.send(message);
  // }


  // ref
  const bottomSheetModalRef = useRef(null);

  // variables
  const snapPoints = useMemo(() => ['25%', '30%'], []);

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handleSheetChanges = useCallback((index) => {
    // console.log('handleSheetChanges', index);
  }, []);

  // renders
  //  return (
  //   <BottomSheetModalProvider>
  //     <View style={styles.container}>
  //       <Button
  //         onPress={handlePresentModalPress}
  //         title="Present Modal"
  //         color="black"
  //       />
  //       <BottomSheetModal
  //         ref={bottomSheetModalRef}
  //         index={1}
  //         snapPoints={snapPoints}
  //         onChange={handleSheetChanges}
  //       >
  //         <View style={styles.contentContainer}>
  //           <Text>Awesome 🎉</Text>
  //         </View>
  //       </BottomSheetModal>
  //     </View>
  //   </BottomSheetModalProvider>
  // );


  return (
    <>
      <View style={styles.container}
      >


        {/* =============================== new code ======================================== */}

        {/* <MyBottomSheet hasDraggableIcon ref={bottomSheetREF} height={450} >
                    
                </MyBottomSheet>x */}


        {/* =========================== end new code  ====================== */}
        {/* {handleLocation()} */}
        <View style={{ position: 'absolute', zIndex: 5050000505, top: 0, left: 0 }}>
          <ExitButton navigation={navigation} path="Main" />
        </View>
        <View style={styles.map}>
          <MapView ref={mapRef} style={styles.map} initialRegion={userLocation}>
            {/* {!location && <Marker
              key={584}
              coordinate={RandomLocation}
            >
              <Image
                source={icon_current_location}
                style={{ height: 40, width: 40 }}
                resizeMode="contain"
              />
            </Marker>} */}

            {/* {location && (
            <Marker
              key={983}
              coordinate={location}
            // image={icon_current_location}
            // style={{ height: 35, width: 35 }}
            >
              <Image
                source={icon_current_location}
                style={{ height: 40, width: 40 }}
                resizeMode="contain"
              />
            </Marker>
          )} */}

            {/* {
              
              ridePathOfScooter.map((scooter) => {
                return scooter.occupied === 0 ? (
                  <Marker
                    key={scooter.id}
                    coordinate={{
                      latitude: scooter.lat,
                      longitude: scooter.long
                    }}
                    // image={scooter.image}
                    onPress={() => {
                      setDestination({
                        latitude: scooter.lat,
                        longitude: scooter.long,
                        latitudeDelta: 0.005,
                        longitudeDelta: 0.005
                      });
                    }}
                  >
                    <Image source={scooter_icons} style={{ height: 25, width: 25, resizeMode: "contain" }} />
                  </Marker>
                ) : null;
              })} */}
            <Polyline
              coordinates={ridePathOfScooter}
              strokeColor="#FBA51C"
              strokeWidth={4}
              geodesic={true}
            // lineDashPhase={value.length}
            />
            {/* {ridePathOfScooter?.length > 0 && <MapViewDirections
              origin={ridePathOfScooter[0]}
              destination={ridePathOfScooter[ridePathOfScooter?.length - 1]}
              apikey="AIzaSyBmlfCX9N5NAKdGidMbSxMXkc4CNHcT6rQ"
              strokeWidth={5}
              strokeColor="#000"
              mode="WALKING"
              resetOnChange={true}
            optimizeWaypoints={true}
            onReady={RegionBetweenUserandScooter}
            />} */}
            {/* {console.log(scooter?.longitude, 'leap_year', scooter?.latitude)} */}
            {scooter?.latitude ? <Marker
              ref={markerRef}
              key={'any_random_key'}
              coordinate={{
                latitude: scooter?.latitude,
                longitude: scooter?.longitude
              }}
              // style={{ height: 20, width: 20 }}
              resizeMode="contain"
            // image={scooterImage}
            // onPress={() => {
            //   setDestination({
            //     latitude: scooter.lat,
            //     longitude: scooter.long,
            //     latitudeDelta: 0.005,
            //     longitudeDelta: 0.005
            //   });
            // }}
            >
              <Image
                source={require('../../../assets/Map_icons/ec.png')}
                style={{ height: 40, width: 40 }}
                resizeMode="contain"
              />
            </Marker> : <></>}

          </MapView>
        </View>
      </View>

      <BottomSheet
        snapPoints={[bottomSheetSize]}
        enablePanDownToClose={false}
        enableDynamicSizing={false}
      >
        {rideEnded ? <>
          <View style={styles.controls}>
            {/* <Button
            onPress={handlePresentModalPress}
            title="Present Modal"
            color="black"
          /> */}
            {checkRideStatus1 === 'start' && <TouchableOpacity
              style={styles.controlButton}
              onPress={() => {
                if (userAuthData?.email && rideUserData) {
                  setIsLoading(true)
                  let temp = /IMEI:(\d+)/.exec(rideUserData);
                  // axios.post(`${baseUrl}/scooter/start`, { topic: temp[1], userid: userAuthData.email })

                  makeRequest('post', 'scooter/start', { topic: temp[1], userid: userAuthData.email })
                    .then((res) => {
                      makeRequest('post', 'scooter/unlock', { topic: temp[1], userid: userAuthData.email })
                        // axios.post(`${baseUrl}/scooter/unlock`, { topic: temp[1], userid: userAuthData.email })
                        .then((res) => {
                          makeRequest('post', 'scooter/chargeuser', { email: userAuthData.email, amount: 1 })
                            .then(() => {
                              // dispatch(setChargedAmount(1));
                              setIsLoading(false);
                              setChargedAmount(1);
                              dispatch(putAmount(1));
                              dispatch(resetRideLocation([]));
                              dispatch(checkRideStatus('finish'));
                              dispatch(handleTimerRunning(true));
                              // alert('Ride started.');
                            })
                          ToastAndroid.show('Ride started.', ToastAndroid.SHORT);
                        }).catch(err => {
                          console.log('inner', err);
                          setIsLoading(false);
                          dispatch(checkRideStatus('start'));
                          ToastAndroid.show('Bike already in use.', ToastAndroid.SHORT);
                          // alert('Bike already in use.');
                        })
                    })
                    .catch(err => {
                      console.log('please', err);
                      setIsLoading(false);
                      dispatch(checkRideStatus('start'));
                      ToastAndroid.show('Bike already in use.', ToastAndroid.SHORT);
                    })
                }
              }}
            >

              <Text>Start</Text>
            </TouchableOpacity>}
            {/* {checkRideStatus1 === 'unlock' && <TouchableOpacity
            style={styles.controlButton}
            onPress={() => {
              handlePresentModalPress();
              
              // if (userAuthData?.email) {
                let temp = /IMEI:(\d+)/.exec(rideUserData);
                axios.post('${baseUrl}/scooter/unlock', { topic: temp[1], userid: userAuthData.email })
                  .then((res) => {
                    dispatch(resetRideLocation([]));
                    dispatch(checkRideStatus('finish'));
                    alert('Ride ended.');
                  }).catch(err => {
                    console.log("errro", err);
                  })
              // }
            }

            }
          
          >
            <Text>Finish</Text>
          </TouchableOpacity>} */}
            {checkRideStatus1 === 'finish' && <TouchableOpacity
              style={styles.controlButton}
              onPress={() => {
                setIsLoading(true);
                dispatch(resetTimeElapsed());
                // if (userAuthData?.email) {
                let temp = /IMEI:(\d+)/.exec(rideUserData);
                makeRequest('post', 'scooter/stop', { topic: temp[1], userid: userAuthData.email })
                  // axios.post(`${baseUrl}/scooter/stop`, { topic: temp[1], userid: userAuthData.email })
                  .then((res) => {
                    makeRequest('post', 'scooter/lock', { topic: temp[1], userid: userAuthData.email })
                      // axios.post(`${baseUrl}/scooter/lock`, { topic: temp[1], userid: userAuthData.email })
                      .then((res) => {
                        dispatch(resetRideLocation([]));
                        dispatch(checkRideStatus('start'));
                        setIsLoading(false);
                        // dispatch(userRideCredentials(null));
                        dispatch(handleTimerRunning(false));
                        dispatch(putAmount(0))
                        dispatch(resetUserRideLocation());
                      }).then(() => {
                        ToastAndroid.show('Ride ended.', ToastAndroid.SHORT);
                        // navigation.navigate('Main');
                        setRideEnded(false);
                        setBottomSheetSize('70%');
                        // navigation.reset({
                        //   index: 0,
                        //   routes: [{ name: 'Main' }]
                        // })
                      })
                  }).catch(err => {
                    setIsLoading(false);
                    console.log("checkError", err);
                  })
                // }
              }
              }

            >
              <Text>Finish</Text>
            </TouchableOpacity>}
            {minutes === 0 ? <Text style={{ color: '#D1D5DB' }}>Time Elapsed: {remainingSeconds} seconds</Text> : <Text style={{ color: '#D1D5DB' }}>Time Elapsed: {minutes} minutes and {remainingSeconds} seconds</Text>}
            <View style={styles.subSection}>
              <View style={styles.batterySection}>
                <Image source={charging} style={styles.stretch} />
                <Text>{batteryLife} %</Text>
              </View>
              {minutes > 0 ? <Text style={{ color: '#6B7280' }}>{chargedAmount} Stars</Text> : <Text style={{ color: '#6B7280' }}> {chargedAmount} $</Text>}
            </View>
            <Text style={{ color: '#6B7280' }}> Stars Remaining: {amountRemaining} </Text>
          </View>
        </> :
          <View style={{ paddingLeft: 15, paddingRight: 15 }}>
            <View>
              <Text style={{ textAlign: "center", fontSize: 20, fontWeight: "bold", marginTop: 20 }}>
                How was your ride experience with us?
              </Text>
              <Text style={{ textAlign: "center", fontSize: 12, color: "gray", fontWeight: "light", marginTop: 5 }}>
                Kindly rate us, your feedback is will help us improve our services.
              </Text>
            </View>
            <View style={{ alignItems: "center", paddingTop: 10, paddingBottom: 20 }}>
              {/* <StarRating
                rating={rating}
                onChange={setRating}
              /> */}
              <StarRating
                disabled={false}
                maxStars={5}
                rating={rating}
                fullStarColor="#FBA51C"
                fullStar={'ios-star'}
                emptyStar={'ios-star-outline'}
                halfStar={'ios-star-half'}
                iconSet={'Ionicons'}
                containerStyle={{ maxWidth: 150, marginLeft: 'auto', marginRight: 'auto' }}
                starStyle={{ fontSize: 20 }}
                selectedStar={(rating) => setRating(rating)}
              />
            </View>
            <View style={{ paddingHorizontal: 10 }}>
              <TextInput
                value={description}
                onChangeText={(val) => setDescription(val)}
                placeholder="Description"
                multiline
                numberOfLines={6}
                style={[styles.Input]}
                textAlignVertical="top"
              />
            </View>
            <View style={{ alignItems: "center", flexDirection: "row", justifyContent: "center", marginTop: 15 }}>
              <TouchableOpacity onPress={() => {
                if (!rating) {
                  ToastAndroid.show('Rating required.', ToastAndroid.SHORT);
                  return
                }
                let temp = /IMEI:(\d+)/.exec(rideUserData);
                let email = userAuthData?.email
                let timestamp = new Date()

                axios.post('https://star.macworldproperties.com/users/feedback', {
                  email,
                  rating,
                  description,
                  scooterimei: temp[1],
                  timestamp,
                }).then((res) => {
                  ToastAndroid.show('Feedback Submitted', ToastAndroid.SHORT);
                  navigation.reset({
                    index: 0,
                    routes: [{ name: 'Main' }]
                  })
                }).catch((err) => {
                  console.log(err)
                }
                )


              }}>
                {/* <TouchableOpacity> */}
                <Text
                  style={{ backgroundColor: "#FBA51C", color: "white", padding: 10, textAlign: "center", borderRadius: 5, margin: 10, width: 90 }}
                >
                  Submit
                </Text>
                {/* </TouchableOpacity> */}

              </TouchableOpacity>
              <TouchableOpacity onPress={() => {
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Main' }]
                })
              }}>
                <Text
                  style={{ backgroundColor: "#FBA51C", color: "white", padding: 10, textAlign: "center", borderRadius: 5, margin: 10, width: 90 }}
                >
                  Later
                </Text>
              </TouchableOpacity>
            </View>
          </View>

        }
      </BottomSheet>
      {isLoading && <View style={{ backgroundColor: 'rgba(0,0,0,0.5)', position: 'absolute', height: '100%', width: '100%', zIndex: 999 }}>
        <BarIndicator color='#FBA51C' />
      </View>}
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: .8,
    backgroundColor: "#fff",
    alignItems: "start",
    justifyContent: "start",
    position: 'relative',
    height: windowHeight
  },
  map: {
    width: "100%",
    height: "100%"
  },
  controls: {
    alignItems: 'center',
    gap: 5,
  },
  nearestScooterButton: {
    position: "absolute",
    bottom: 150,
    right: 6,
    backgroundColor: "white",
    borderRadius: 30,
    padding: 0,
    elevation: 5
  },
  directionButton: {
    position: "absolute",
    bottom: 90,
    right: 6,
    backgroundColor: "white",
    borderRadius: 30,
    padding: 0,
    elevation: 5
  },
  recenterButton: {
    position: "absolute",
    bottom: 150,
    right: 6,
    backgroundColor: "white",
    borderRadius: 30,
    padding: 0,
    elevation: 5
  },
  cancelButton: {
    position: "absolute",
    top: 60,
    right: 6,
    backgroundColor: "white",
    borderRadius: 30,
    padding: 0,
    elevation: 5
  },
  Imagecancel: {
    width: 30,
    height: 30
  },
  Imagerecenter: {
    width: 50,
    height: 50
  },
  Imagedirection: {
    width: 50,
    height: 50
  },
  Imagednearest: {
    width: 50,
    height: 50
  },
  controlButton: {
    borderWidth: 1,
    borderColor: '#FBA51C',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 5,
    backgroundColor: '#FBA51C',
    // =========================
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 3
  },
  Input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingTop: 15,
    padding: 10
  },
  subSection: {
    flexDirection: 'row',
    gap: 15
    // justifyContent: 'space-between'
  },
  stretch: {
    width: 20,
    height: 20,
    resizeMode: 'stretch',
  },
  batterySection: {
    flexDirection: 'row'
  }
});
