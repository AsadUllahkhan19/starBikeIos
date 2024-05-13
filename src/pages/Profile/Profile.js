import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  TextInput,
  ActivityIndicator
} from "react-native";
import axios from 'axios'
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BarIndicator } from 'react-native-indicators';

import HamBurger from "../../components/HamBurger";
import { GlobalStyles } from "../../../GlobalStyles";
import baseUrl from "../../services/baseUrl";


const Profile = ({ drawerNavigation }) => {
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setIsLoading] = useState(false);
  const [showLoading, setShowLoading] = useState(true);

  const getUserData = async () => {
    const jsonValue = await AsyncStorage.getItem("userData");
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  };


  useEffect(() => {
    getUserData()
      .then((data) => {
        setFirstName(data?.firstName)
        setLastName(data?.lastName)
        setEmail(data?.email);
      })
      .catch((error) => {
        console.log(error);
      });
    setTimeout(() => {
      setShowLoading(false);
    }, 2000)
  }, []);

  const save = async () => {
    setIsLoading(true)
    const res = await axios.post(`${baseUrl}/users/update-profile`, {
      email,
      firstName,
      lastName
    }).then(async (res) => {
      // console.log('response_from_backend', res?.data?.data);
      // setFirstName(res?.data?.data?.firstName);
      // setLastName(res?.data?.data?.lastName);
      // setEmail(res?.data?.data?.email)
      const jsonValue = JSON.parse(await AsyncStorage.getItem("userData"));
      jsonValue.email = email;
      jsonValue.firstName = firstName;
      jsonValue.lastName = lastName;
      await AsyncStorage.setItem("userData", JSON.stringify(jsonValue));
      setIsLoading(false)
    })
    // console.log('response_from_backend', res?.data?.data);
  }

  if (showLoading) {
    return <BarIndicator color='#FBA51C' />
  } else {
    return (
      <View style={[ProfileStyles.container]}>
        {/* <ActivityIndicator size="large" color="#00ff00" /> */}
        {loading && <BarIndicator color='#FBA51C' style={ProfileStyles.loading} />}
        <View style={{ position: 'absolute', zIndex: 5050000505, top: 0, left: 10 }}>
          <HamBurger navigation={drawerNavigation} />
        </View>
        <View style={[GlobalStyles.flex_2]}>
          <View style={[GlobalStyles.justifyContentCenter, GlobalStyles.flex_1]}>
            <Text style={ProfileStyles.label}>First name</Text>
            <TextInput
              value={firstName}
              onChangeText={setFirstName}
              style={ProfileStyles.textInput}
            />
            <Text style={ProfileStyles.label}>Last name</Text>
            <TextInput
              value={lastName}
              onChangeText={setLastName}
              style={ProfileStyles.textInput}
            />
            <Text style={ProfileStyles.label}>Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              style={[ProfileStyles.textInput, { color: "#7A7A7A", }]}
              editable={false}
            />
            <View
              style={[{ paddingHorizontal: 40 }, GlobalStyles.marginVertical_5]}
            >
              <Text style={[GlobalStyles.text_red]}>Delete your account.</Text>
            </View>
            <View
              style={[
                GlobalStyles.alignItemsCenter,
                GlobalStyles.marginVertical_5,
              ]}
            >
              <TouchableOpacity onPress={() => {

              }}>
                <Text
                  onPress={save}
                  style={[
                    GlobalStyles.bg_orange,
                    GlobalStyles.text_black,
                    ProfileStyles.btn
                  ]}
                >
                  Save
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={[GlobalStyles.flex_01]}></View>
      </View>
    );
  }
};

const ProfileStyles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative'
  },
  textInput: {
    borderBottomColor: "#939393",
    borderBottomWidth: 1,
    fontSize: 16,
    marginHorizontal: 40,
    color: '#0c0a09'
  },
  label: {
    color: "#7A7A7A",
    marginHorizontal: 40,
    fontSize: 16,
    marginTop: 10,
  },
  btn: {
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 20,
  },
  loading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999
  }
});

export default Profile;
