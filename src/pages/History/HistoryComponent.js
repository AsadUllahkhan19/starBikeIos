import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { GlobalStyles } from "../../../GlobalStyles";
import pin from "../../../assets/pin.png";
import pinactive from "../../../assets/new_dest.png";
import { setKey, geocode, RequestType } from "react-geocode";
// import { apiKey } from "../../services/baseUrl";


const screenWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;


const truncateText = (text, maxLength) => {
  if (text.length > maxLength) {
    return `${text.slice(0, maxLength - 3)}...`;
  }
  return text;
};

const HistoryComp = ({ item, navigation, route }) => {

  const [origin, setOrigin] = useState({});
  const [destination, setDestination] = useState({});

  useEffect(() => {

    if (item) {
      handlePositionDest(item?.destination?.latitude, item?.destination?.longitude);
      handlePositionOrigin(item?.origin?.latitude, item?.origin?.longitude);
    }
  }, [item])


  const locationData = {
    date: "July 9, 2023",
    pkr: "$900",
    pickup: "sector 8, Ned University of engineering and technology, Karachi",
    destination:
      "sector 9, Ned University of engineering and technology, Karachi",
  };

  const maxAddressLength = 51;
  // const truncatedPickup = truncateText(item?.from, maxAddressLength);
  // const truncatedDestination = truncateText(
  //   item?.to,
  //   maxAddressLength,
  // );

  const handlePositionOrigin = async (latitude, longitude) => {
    if (latitude) {
      try {
        setKey('AIzaSyDNtTiWsqgeSv0IdENvpBY1d0vhqcl5epM'); // Set your Google Maps API Key

        // Get address from latitude & longitude.
        const response = await geocode(RequestType.LATLNG, `${latitude},${longitude}`);
        const address = response.results[0].formatted_address;
        setOrigin(address);
      } catch (error) {
        console.error('Error while getting address:', error);
        // or handle the error in a way that suits your application
      }

    }
  }
  const handlePositionDest = async (latitude, longitude) => {
    if (latitude) {
      try {
        setKey('AIzaSyDNtTiWsqgeSv0IdENvpBY1d0vhqcl5epM'); // Set your Google Maps API Key

        // Get address from latitude & longitude.
        const response = await geocode(RequestType.LATLNG, `${latitude},${longitude}`);
        const address = response.results[0].formatted_address;
        setDestination(address);
      } catch (error) {
        console.error('Error while getting address:', error);
        // or handle the error in a way that suits your application
      }

    }
  }



  return (
    <TouchableOpacity onPress={() => {
      navigation.navigate('HistoryMap', { locationData: item, route: route });
    }}>
      <View style={Styles.container}>

        <View>
          <View style={Styles.sub_container}>
            <View
              style={[
                GlobalStyles.flex_row,
                GlobalStyles.justifyContentBetween,
                GlobalStyles.marginVertical_1,
              ]}
            >
              <Text
                style={[
                  GlobalStyles.fs_5,
                  GlobalStyles.text_black,
                  GlobalStyles.marginLeft_5,
                  GlobalStyles.bg_orange,
                  GlobalStyles.shadowRadius,
                  GlobalStyles.paddingLeft,
                  GlobalStyles.paddingRight,
                  GlobalStyles.paddingVertical2,
                  GlobalStyles.borderRadius
                ]}
              >
                Time {item?.time}
              </Text>
              <Text
                style={[
                  GlobalStyles.fs_5,
                  GlobalStyles.text_black,
                  GlobalStyles.marginRight_3,
                  GlobalStyles.bg_orange,
                  GlobalStyles.shadowRadius,
                  GlobalStyles.paddingLeft,
                  GlobalStyles.paddingRight,
                  GlobalStyles.paddingVertical2,
                  GlobalStyles.borderRadius
                ]}
              >
                Distance {item?.tripdistance}
              </Text>
              <Text
                style={[
                  GlobalStyles.fs_5,
                  GlobalStyles.text_black,
                  GlobalStyles.marginRight_3,
                  GlobalStyles.bg_orange,
                  GlobalStyles.shadowRadius,
                  GlobalStyles.paddingLeft,
                  GlobalStyles.paddingRight,
                  GlobalStyles.paddingVertical2,
                  GlobalStyles.borderRadius
                ]}
              >
                {item?.charge} Euro
              </Text>
            </View>
            {/* Origin Section */}
            <View
              style={[
                GlobalStyles.flex_row,
                GlobalStyles.marginVertical_1,
                GlobalStyles.marginHorizontal_3,
                GlobalStyles.justifyContentBetween,
                Styles.originSection
              ]}
            >
              <Text style={Styles.topSection}>
                <Image
                  source={pinactive}
                  style={{ width: 20, height: 20, marginRight: 2 }}
                />

                <Text style={[GlobalStyles.text_lightgray, Styles.heading]}> Origin</Text>
              </Text>
            </View>
            <Text style={[GlobalStyles.fs_5, GlobalStyles.text_lightgray, { width: '90%', marginLeft: 'auto', marginRight: 'auto' }]}>{` ${origin}`}</Text>
          </View>
          {/* Destination Section */}
          <View>
            <View
              style={[
                GlobalStyles.flex_row,
                GlobalStyles.marginHorizontal_3,
                GlobalStyles.justifyContentBetween,
                { marginBottom: 5 }
              ]}
            >
              <Text style={Styles.topSection}>
                <Image
                  source={pinactive}
                  style={{ width: 20, height: 20, marginRight: 2 }}
                />
                <Text style={[GlobalStyles.text_lightgray, Styles.heading]}> Destination</Text>
              </Text>
            </View>
            <Text style={[GlobalStyles.fs_5, GlobalStyles.text_lightgray, { width: '90%', marginLeft: 'auto', marginRight: 'auto' }]}>{` ${destination}`}</Text>
          </View>
        </View>





        {/* <View
        style={[
          GlobalStyles.flex_row,
          GlobalStyles.justifyContentBetween,
          GlobalStyles.marginVertical_1,
        ]}
      >
        <Text
          style={[
            GlobalStyles.fs_5,
            GlobalStyles.text_lightgray,
            GlobalStyles.marginLeft_5,
            GlobalStyles.bg_blue,
            GlobalStyles.shadowRadius,
            GlobalStyles.paddingLeft,
            GlobalStyles.paddingRight,
            GlobalStyles.paddingVertical2,
            GlobalStyles.borderRadius
          ]}
        >
          time {item?.time}
        </Text>
        <Text
          style={[
            GlobalStyles.fs_5,
            GlobalStyles.text_lightgray,
            GlobalStyles.marginRight_3,
            GlobalStyles.bg_red,
            GlobalStyles.shadowRadius,
            GlobalStyles.paddingLeft,
            GlobalStyles.paddingRight,
            GlobalStyles.paddingVertical2,
            GlobalStyles.borderRadius
          ]}
        >
          distance {item?.tripdistance}
        </Text>
        <Text
          style={[
            GlobalStyles.fs_5,
            GlobalStyles.text_lightgray,
            GlobalStyles.marginRight_3,
            GlobalStyles.bg_green,
            GlobalStyles.shadowRadius,
            GlobalStyles.paddingLeft,
            GlobalStyles.paddingRight,
            GlobalStyles.paddingVertical2,
            GlobalStyles.borderRadius
          ]}
        >
          {item?.charge} euro
        </Text>
      </View>
      <View style={GlobalStyles.flex_1}>
        <View style={[]}>
          <View
            style={[
              GlobalStyles.flex_row,
              GlobalStyles.marginVertical_1,
              GlobalStyles.marginHorizontal_3,
              GlobalStyles.justifyContentBetween
            ]}
          >
            <Image
              source={pin}
              style={{ width: 20, height: 20, marginRight: 2 }}
            />
            <Text style={[GlobalStyles.fs_5, GlobalStyles.text_lightgray]}>
              <Text style={[GlobalStyles.fs_4, GlobalStyles.text_lightgray]}>origin</Text> {"\n"}
          {` ${origin}`}
            </Text>
          </View>
          <View
            style={[
              GlobalStyles.flex_row,
              GlobalStyles.marginVertical_1,
              GlobalStyles.marginHorizontal_3,
              GlobalStyles.justifyContentBetween
            ]}
          >
            <Image
              source={pinactive}
              style={{ width: 20, height: 20, marginRight: 2 }}
            />
            <Text style={[GlobalStyles.fs_5, GlobalStyles.text_lightgray]}>
            <Text style={[GlobalStyles.fs_4, GlobalStyles.text_lightgray]}>destination</Text> 
            {"\n"} {`${destination}`}
            </Text>
          </View>
        </View>
      </View> */}
      </View>
    </TouchableOpacity>
  );
};

const Styles = StyleSheet.create({
  container: {
    width: screenWidth - 50,
    padding: 10,
    // borderWidth: 1,
    // borderColor: "black",
    marginLeft: 'auto',
    marginRight: 'auto',
    borderRadius: 12,
    backgroundColor: '#fff',
    // Add other styles as needed
    shadowColor: '#171717',
    shadowOffset: { width: -20, height: -40 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5
  },
  originSection: {
    borderTopWidth: 1,
    // borderBottomWidth: 1,
    borderColor: "lightgray",
    paddingTop: 5,
    // paddingBottom: 5,
    marginTop: 10
  },
  destSection: {
    borderTopWidth: 1,
    // borderBottomWidth: 1,
    borderColor: "lightgray",
    paddingTop: 5,
    // paddingBottom: 5,
    // marginTop: 10
  },
  sub_container: {
    // borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "lightgray",
    // paddingTop: 5,
    paddingBottom: 5,
    marginBottom: 10
  },
  heading: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 30
  }
});
export default HistoryComp;
