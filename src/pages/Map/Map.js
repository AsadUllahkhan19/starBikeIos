import MapView, { Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import React, { useEffect, useState, useRef } from "react";
import { getPreciseDistance } from "geolib";
import {
  BarIndicator
} from 'react-native-indicators';
import { StyleSheet, Text, View, TouchableOpacity, Image, PermissionsAndroid, Dimensions, Button } from "react-native";
import Paho from 'paho-mqtt';
import { useSelector, useDispatch } from 'react-redux';
import { WebView } from 'react-native-webview';
import Geolocation from 'react-native-geolocation-service';
import axios from "axios";

import {
  checkRideStatus,
  resetTimeElapsed,
  resetUserRideLocation,
  setAmount,
  handleTimerRunning
} from '../../store/reducers/User';
import baseUrl from "../../services/baseUrl";
import { ScooterLocation } from "../../../mapData";
import HamBurger from "../../components/HamBurger";
// import scooter_icons from "../../../assets/Map_icons/ec.png";
// import icon_current_location from "../../../assets/Map_icons/location-pin.png";
// import icon_center from "../../../assets/Map_icons/center.png";
// import icon_cancel from "../../../assets/Map_icons/cancel.png";
// import icon_direction from "../../../assets/Map_icons/direction.png";
// import icon_nearest from "../../../assets/Map_icons/nearest.png";

const RandomLocation = {
  latitude: 35.2401,
  longitude: 24.8093,
  latitudeDelta: 0.5,
  longitudeDelta: 0.5,
};

const MarkerLocation = {
  latitude: 35.2401,
  longitude: 24.8093,
  latitudeDelta: 0.005,
  longitudeDelta: 0.005
};

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
      alert('We cannot use your location.');
      return false;
    }
  } catch (err) {
    return false;
  }
};

const Map = ({ drawerNavigation }) => {

  const items = [
    {
      id: 'scooter_icons',
      image: require('../../../assets/Map_icons/ec.png'),
    },
    {
      id: 'icon_current_location',
      image: require('../../../assets/Map_icons/location-pin.png'),
    },
    {
      id: 'icon_center',
      image: require('../../../assets/Map_icons/center.png'),
    },
    {
      id: 'icon_cancel',
      image: require('../../../assets/Map_icons/cancel.png'),
    },
    {
      id: 'icon_direction',
      image: require('../../../assets/Map_icons/direction.png')
    },
    {
      id: 'icon_nearest',
      image: require('../../../assets/Map_icons/nearest.png')
    }
  ];
  //actual Location of User
  const [actualLocation, setActualLocation] = useState(null);
  const [Permission, setPermission] = useState(true);
  const [destination, setDestination] = useState({});
  const [errorMsg, setErrorMsg] = useState('');
  const [deferedState, setDeferedState] = useState(false);
  const [location, setLocation] = useState(null);
  const [showLoading, setShowLoading] = useState(true);
  const [toggle, setToggle] = useState(true);
  const [unoccupiedBikes, setUnoccupiedBikes] = useState({
    "862427062327087": '',
    "862427062323607": '',
    "862427062327145": '',
    "862427062322211": '',
    "862427062327285": '',
    "862427062327046": '',
    "862427065357917": '',
    "862427062327327": '',
    "862427062327301": '',
    "862427062323490": ''
  });

  const client = new Paho.Client(
    // '62c1e15b3b684f33bf165815ba87fadd.s2.eu.hivemq.cloud',
    // 'broker.hivemq.com',
    'broker.emqx.io',
    8084,
    `StarBike-${(new Date().getTime()).toString(36)}`
  );


  const dispatch = useDispatch();
  const mapRef = useRef(null);
  const limitRealTimeScooterLoc = useRef(0);

  const checkRideStatusVar = useSelector(state => state.ride.checkRideStatus);
  const rideUserData = useSelector(state => state?.user?.userRideCred);
  const userAuthData = useSelector(state => state?.user?.userAuthCredentials);

  const { width, height } = Dimensions.get('window');

  let clearLocation;

  const onMessage = (message) => {
    // console.log('check_report', message.destinationName);
    if (message.destinationName === `data/KW/scootor/862427062327087`) {
      const temp1 = JSON.parse(message.payloadString);
      setUnoccupiedBikes(state => {
        if (state['862427062327087']?.lat) {
          return state;
        }
        const temp = { ...state, '862427062327087': { lat: temp1?.la, long: temp1?.lo } };
        return temp;
      })
    }
    if (message.destinationName === `data/KW/scootor/862427062323607`) {
      const temp1 = JSON.parse(message.payloadString);
      setUnoccupiedBikes(state => {
        if (state['862427062323607']?.lat) {
          return state;
        }
        const temp = { ...state, '862427062323607': { lat: temp1?.la, long: temp1?.lo } };
        return temp;
      })
    }
    if (message.destinationName === `data/KW/scootor/862427062327145`) {
      const temp1 = JSON.parse(message.payloadString);

      setUnoccupiedBikes(state => {
        if (state['862427062327145']?.lat) {
          return state;
        }
        const temp = { ...state, '862427062327145': { lat: temp1?.la, long: temp1?.lo } };
        return temp;
      })
    }
    if (message.destinationName === `data/KW/scootor/862427062322211`) {
      const temp1 = JSON.parse(message.payloadString);
      setUnoccupiedBikes(state => {
        if (state['862427062322211']?.lat) {
          return state;
        }
        const temp = { ...state, '862427062322211': { lat: temp1?.la, long: temp1?.lo } };
        return temp;
      })
    }
    if (message.destinationName === `data/KW/scootor/862427062327285`) {
      const temp1 = JSON.parse(message.payloadString);
      setUnoccupiedBikes(state => {
        if (state['862427062327285']?.lat) {
          return state;
        }
        const temp = { ...state, '862427062327285': { lat: temp1?.la, long: temp1?.lo } };
        return temp;
      })
    }
    if (message.destinationName === `data/KW/scootor/862427062327046`) {
      const temp1 = JSON.parse(message.payloadString);
      setUnoccupiedBikes(state => {
        if (state['862427062327046']?.lat) {
          return state;
        }
        const temp = { ...state, '862427062327046': { lat: temp1?.la, long: temp1?.lo } };
        return temp;
      })
    }
    if (message.destinationName === `data/KW/scootor/862427065357917`) {
      const temp1 = JSON.parse(message.payloadString);
      setUnoccupiedBikes(state => {
        if (state['862427065357917']?.lat) {
          return state;
        }
        const temp = { ...state, '862427065357917': { lat: temp1?.la, long: temp1?.lo } };
        return temp;
      })
    }
    if (message.destinationName === `data/KW/scootor/862427062327327`) {
      const temp1 = JSON.parse(message.payloadString);
      setUnoccupiedBikes(state => {
        if (state['862427062327327']?.lat) {
          return state;
        }
        const temp = { ...state, '862427062327327': { lat: temp1?.la, long: temp1?.lo } };
        return temp;
      })
    }
    if (message.destinationName === `data/KW/scootor/862427062327301`) {
      const temp1 = JSON.parse(message.payloadString);
      setUnoccupiedBikes(state => {
        if (state['862427062327301']?.lat) {
          return state;
        }
        const temp = { ...state, '862427062327301': { lat: temp1?.la, long: temp1?.lo } };
        return temp;
      })
    }
    if (message.destinationName === `data/KW/scootor/862427062323490`) {
      const temp1 = JSON.parse(message.payloadString);
      setUnoccupiedBikes(state => {
        if (state['862427062323490']?.lat) {
          return state;
        }
        const temp = { ...state, '862427062323490': { lat: temp1?.la, long: temp1?.lo } };
        return temp;
      })
    }
    // if (Object.entries(unoccupiedBikes)?.length > 0) {
    // console.log('862427062327301', unoccupiedBikes['862427062327301']['lat']);
    // setUnoccupiedBikes(state => state);
    // }
    // ++limitRealTimeScooterLoc.current;
    // alert(`${unoccupiedBikes['862427062327301']['lat']}`);
    // alert(`${unoccupiedBikes['862427062327327']['lat']}`);
    // alert(`${unoccupiedBikes['862427062327087']['lat']}`);
  }

  const Imei = [
    "862427062327087", //YES 
    "862427062323607",
    "862427062327145", //YES
    "862427062322211", //YES
    "862427062327285", //YES
    "862427062327046", //YES
    "862427065357917", //YES
    "862427062327327", //Yes
    "862427062327301",
    "862427062323490", //YES
  ];

  useEffect(() => {
    if (rideUserData !== null && userAuthData?.email) {

      let temp = /IMEI:(\d+)/.exec(rideUserData);
      axios.post(`${baseUrl}/scooter/isoccupied`, { imei: temp[1], email: userAuthData?.email })
        .then((res) => {
          if (res.data.status) {
            dispatch(checkRideStatus('finish'));
            // drawerNavigation.navigate('Ride')
            drawerNavigation.reset({
              index: 0,
              routes: [{ name: 'Ride' }]
            })
          } else {
            dispatch(checkRideStatus('start'));
            dispatch(resetTimeElapsed());
            dispatch(resetUserRideLocation());
            dispatch(setAmount(0));
            dispatch(handleTimerRunning(false));
          }
        })
    } else {
      console.log('yup_cup', rideUserData);
    }

    client.connect({
      useSSL: true,
      cleanSession: true,
      onSuccess: () => {
        
        // for (let Subscribing_imei of Imei) {
        for (let i = 0; i < Imei.length; i++) {
          client.subscribe(`data/KW/scootor/${Imei[i]}`);
          client.onMessageArrived = onMessage;
        }
        // }
      },
      onFailure: () => {
        console.log('Failed to connect!');
      }
    })

    console.log('frm_loop', Imei);
    // console.log('frm_loop_2', client.isConnected());

    return () => {
      if (client.isConnected()) {
        // for (let Subscribing_imei of Imei) {
        for (let i = 0; i < Imei.length; i++) {
          client.unsubscribe(`data/KW/scootor/${Imei[i]}`);
        }
        client.disconnect();
      }
    }
    // retrieveData();
  }, [rideUserData])

  const getLocation = () => {
    const result = requestLocationPermission();
    result.then(res => {
      if (res) {
        Geolocation.getCurrentPosition(
          position => {

            setLocation({ latitude: position.coords.latitude, longitude: position.coords.longitude });
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

  const firstregionofUser = (latitude, longitude) => {
    mapRef.current.animateToRegion({
      latitude: latitude,
      longitude: longitude,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    });
  };

  useEffect(() => {
    const result = requestLocationPermission();
    result.then(res => {
      if (res) {
        Geolocation.getCurrentPosition(
          (position) => {
            setLocation({ latitude: position.coords.latitude, longitude: position.coords.longitude });
            if (mapRef !== null) {
              mapRef.current?.animateToRegion({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005
              })
            }
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

    return () => {
      mapRef.current = null;
    }
  }, [])


  const regionofUser = (location) => {
    if (mapRef !== null && location !== null) {
      mapRef.current.animateToRegion(location);
      // markerofUser();
    }
  };
  // const markerofUser = () => { };

  const nearestScooter = () => {
    let start = {
      latitude: actualLocation.latitude,
      longitude: actualLocation.longitude,
    };

    let list = [];

    for (let scooter of ScooterLocation) {
      let distance = 0;
      if (scooter.occupied === 0) {
        distance = getPreciseDistance(
          start,
          { latitude: scooter.lat, longitude: scooter.long },
          1,
        );
        list.push(distance);
      }
    }
  };

  const liveLocation = async () => {
    try {
      let userLocation = Geolocation.getCurrentPosition(
        position => {

          setLocation({ latitude: position.coords.latitude, longitude: position.coords.longitude });

        },
        (error) => {
          // See error code charts below.
          setLocation(false);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
      // setActualLocation({
      //   latitude: userLocation.coords.latitude,
      //   longitude: userLocation.coords.longitude,
      //   latitudeDelta: 0.005,
      //   longitudeDelta: 0.005,
      // });
    } catch (error) {
      setErrorMsg("Error getting location: " + error.message);
    }
  };

  const reCenter = async () => {
    // getPermission().then(res => {

    // })
    // Geolocation.getCurrentPosition(
    //   position => {
    //     setActualLocation({
    //       latitude: position.coords.latitude,
    //       longitude: position.coords.latitude,
    //       latitudeDelta: 0.005,
    //       longitudeDelta: 0.005,
    //     });
    //   },
    //   (error) => {
    //     // See error code charts below.
    //     setLocation(false);
    //   },
    //   { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    // );
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
            // regionofUser(obj)
            setLocation(obj);
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
  };

  const getCurrentUserLocation = async () => {
    // getPermission().then(res => {

    // })
    // Geolocation.getCurrentPosition(
    //   position => {
    //     setActualLocation({
    //       latitude: position.coords.latitude,
    //       longitude: position.coords.latitude,
    //       latitudeDelta: 0.005,
    //       longitudeDelta: 0.005,
    //     });
    //   },
    //   (error) => {
    //     // See error code charts below.
    //     setLocation(false);
    //   },
    //   { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    // );
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
            if (location != null) {
              regionofUser(obj)
            }
            setLocation(obj);
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
  };

  //Getting Permission
  // const getPermission = async () => {
  //   let { status } = await Location.requestForegroundPermissionsAsync();
  //   if (status !== "granted") {
  //     setErrorMsg("Permission to access location was denied");
  //     return;
  //   }
  //   setPermission(true);
  // };

  const getPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Geolocation Permission',
          message: 'Can we access your location?',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === 'granted') {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      return false;
    }
  };

  //For getting Location after Entering Page
  useEffect(() => {
    // setTimeout(() => {
    setShowLoading(false);
    setDeferedState(true);
    // }, 1000);
    getLocation();
    // getPermission();
    // const result = getPermission();
    // result.then(res => {
    //   console.log('res is:', res);
    //   if (res) {
    //       Geolocation.getCurrentPosition(
    //           position => {
    //             setActualLocation({
    //               latitude: position.coords.latitude,
    //               longitude: position.coords.latitude,
    //               latitudeDelta: 0.005,
    //               longitudeDelta: 0.005,
    //             });
    //           },
    //           (error) => {
    //               // See error code charts below.
    //               console.log('locations_errrrrr', error.code, error.message);
    //               setLocation(false);
    //           },
    //           { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    //       );
    //   }
    // });
    // reCenter();
  }, []);

  useEffect(() => {
    reCenter();
  }, [checkRideStatusVar]);

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
        }
      ],
      {
        // edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        edgePadding: {
          right: (width / 20),
          bottom: (height / 20),
          left: (width / 20),
          top: (height / 20)
        },
        animated: true
      }
    );
  }

  // return (
  //   <WebView
  //     style={styles.container}
  //     source={{ uri: 'https://expo.dev' }}
  //   />
  // )


  return (
    <View style={styles.container}>
      <View style={{ position: 'absolute', zIndex: 5050000505, top: 0, left: 10 }}>
        <HamBurger navigation={drawerNavigation} />
      </View>

      {showLoading ? <BarIndicator color='#FBA51C' />
        :
        <MapView ref={mapRef} style={styles.map} initialRegion={RandomLocation}>
          {!location && <Marker
            key={584}
            coordinate={RandomLocation}
          // tracksViewChanges={false}
          >
            <Image
              source={items[1]['image']}
              style={{ height: 40, width: 40 }}
              resizeMode="contain"
            />
          </Marker>}

          {location && (
            <Marker
              key={983}
              coordinate={location}
            // image={icon_current_location}
            // style={{ height: 35, width: 35 }}
            >
              <Image
                source={items[1]['image']}
                style={{ height: 40, width: 40 }}
                resizeMode="contain"
              />
            </Marker>
          )}
          {/* {location &&
            ScooterLocation.map((scooter) => {
              return scooter.occupied === 0 ? (
                <Marker
                  key={scooter.id}
                  coordinate={{
                    latitude: scooter.lat,
                    longitude: scooter.long,
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
          {
            Object.entries(unoccupiedBikes).map(([elem, item], index) => {
              if (item?.lat && item?.long) {
                // if(toggle){
                //   alert(item?.lat);
                // console.log(item?.lat, 'items_to_be_displayed', item?.long)
                // }
                return (
                  <Marker
                    tracksViewChanges={false}
                    // key={elem}
                    coordinate={{
                      latitude: item?.lat,
                      longitude: item?.long
                    }}
                    onPress={() => {
                      setDestination({
                        latitude: item?.lat,
                        longitude: item?.long,
                        latitudeDelta: 0.05,
                        longitudeDelta: 0.05
                      });
                    }}
                  >
                    <Image source={items[0]['image']} style={{ height: 25, width: 25, resizeMode: "contain" }} />
                  </Marker>
                )
              }
            })
          }
          {(deferedState && location && Object.keys(destination).length !== 0) && (
            <MapViewDirections
              origin={location}
              destination={destination}
              apikey="AIzaSyBmlfCX9N5NAKdGidMbSxMXkc4CNHcT6rQ"
              strokeWidth={5}
              strokeColor="#FBA51C"
              mode="WALKING"
              resetOnChange={false}
              optimizeWaypoints={true}
              onReady={RegionBetweenUserandScooter}
            />
          )}
        </MapView>}


      {(deferedState && actualLocation) && (
        <TouchableOpacity
          style={styles.nearestScooterButton}
          onPress={() => {
            nearestScooter();
          }}
        >
          <Image source={items[5]['image']} style={styles.Imagednearest} />
        </TouchableOpacity>
      )}

      {(deferedState && Object.keys(destination).length !== 0) ? (
        <TouchableOpacity
          style={styles.directionButton}
          onPress={() => {
            RegionBetweenUserandScooter();
          }}
        >
          <Image source={items[4]['image']} style={styles.Imagedirection} />
        </TouchableOpacity>
      ) : null}

      {(deferedState && Object.keys(destination).length !== 0) ? (
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => {
            setDestination({});
          }}
        >
          <Image source={items[3]['image']} style={styles.Imagecancel} />
        </TouchableOpacity>
      ) : null}

      <TouchableOpacity
        style={styles.recenterButton}
        onPress={getCurrentUserLocation}
        disabled={Permission !== true ? true : false}
      >
        <Image source={items[2]['image']} style={styles.Imagerecenter} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setToggle(state => !state)}>
        <Text>Test</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    position: 'relative'
  },
  map: {
    width: "100%",
    height: "100%"
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
  }
});

export default Map;