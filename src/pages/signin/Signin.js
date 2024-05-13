import {
  TouchableOpacity,
  ImageBackground,
  Image,
  StyleSheet,
  View,
  Text,
  NativeModules,
  ActivityIndicator
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { LoginManager, AccessToken } from "react-native-fbsdk-next";
import { useState, useEffect } from "react";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import auth from "@react-native-firebase/auth";
import { useSelector, useDispatch } from "react-redux";
// const { RNTwitterSignIn } = NativeModules;


import { userAuthCredentials } from "../../store/reducers/User";
import { rideToken } from "../../store/reducers/Ride";
import GoogleIcon from "../../../assets/google.png";
import bgImage from "../../../assets/bgimage.png";
import StarLogo from "../../../assets/Vector.png";
import CircleLogo from "../../../assets/Group.png";
import Divider from "../../../assets/divider.png";
import Facebook from "../../../assets/facebook.png";
import Logo from '../../../assets/AppIcons/logo.png'
import Scooter from '../../../assets/AppIcons/scooter.png'
import Twitter from "../../../assets/twitter.png";
import Instagram from "../../../assets/instagram.png";
import baseUrl from "../../services/baseUrl";

// =================================================
import {
  BallIndicator,
  BarIndicator,
  DotIndicator,
  MaterialIndicator,
  PacmanIndicator,
  PulseIndicator,
  SkypeIndicator,
  UIActivityIndicator,
  WaveIndicator,
} from 'react-native-indicators';
// ==========================  Just Check  ===============================

const SignIn = ({ navigation }) => {
  const [loading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const retrieveData = async () => {
    let value;
    try {
      value = await AsyncStorage.getItem("loggedIn");
      if (value !== null) {
      }
    } catch (error) {
      console.log(error);
    }
    return value;
  };
  const storeData = async (value) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem("userData", jsonValue);
    } catch (e) {
      console.log(e);
    }
  };
  const storeToken = async (value) => {
    try {
      // const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem("token", value);
    } catch (e) {
      console.log(e);
    }
  };

  async function onFacebookButtonPress() {
    try {
      const result = await LoginManager.logInWithPermissions([
        "public_profile",
        "email",
      ]);

      if (result.isCancelled) {
        throw "user cancelled the login process";
      }

      const data = await AccessToken.getcurrentaccesstoken();

      if (!data) {
        throw "something went wrong obtaining access token";
      }

      const facebookcredential = auth.facebookauthprovider.credential(
        data.accesstoken,
      );
      const { user } = await auth().signinwithcredential(facebookcredential);
      const [firstname, lastname] = user?.displayname?.split(" ");

      const res = await axios.post(
        `${baseUrl}/users/login`,
        {
          email: user?.email,
          firstname: firstname,
          lastname: lastname,
          image: user?.photourl,
          type: "facebook",
        },
      );
      await storeData(res?.data?.token);
      navigation.navigate("Main");
    } catch (error) {
      console.log(error);
    }
  }

  async function onGoogleButtonPress() {
    try {
      setIsLoading(true);
      GoogleSignin.configure({
        webClientId:
          "496402510831-j3cjtn5cejdbq9hed625u1bgsurhkqta.apps.googleusercontent.com",
      });
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      const { idToken, user } = await GoogleSignin.signIn();
      const res = await axios.post(
        `${baseUrl}/users/login`,
        {
          email: user?.email,
          firstName: user?.givenName,
          lastName: user?.familyName,
          image: user?.photo,
          type: "Google",
        },
      );
      // Create a Google credential with the token

      // Sign-in the user with the credential
      dispatch(userAuthCredentials(res?.data?.data));
      dispatch(rideToken(res?.data?.token))
      await storeData(res?.data?.data);
      await storeToken(res?.data?.token);
      setIsLoading(false);
      navigation.navigate("Main");
    } catch (error) {
      console.log('error_from_google', error);
    }
  }

  // const API_KEY = {
  //   apiKey: "UkxXbDZVanhhcEplX2lWQlFiTDk6MTpjaQ",
  //   apiSecret: "EMP5AKOGUcpB0_UadyKMYjZAmOKJxQmuR8-Y5gcIyknW1MwQ6v",
  //   redirectUri: "mycoolredirect://",
  // };
  // RNTwitterSignIn.init(API_KEY.apiKey, API_KEY.apiSecret).then(() =>
  //   console.log("Twitter SDK initialized"),
  // );
  // async function onTwitterButtonPress() {
  //   console.log("lollllllll");
  //   //	console.log(RNTwitterSignIn)
  //   //				RNTwitterSignIn.logIn()
  //   //				.then(loginData => {
  //   //							console.log(loginData)
  //   //						})
  //   //		.catch(error => {
  //   //					console.log(error)
  //   //				})

  //   // Perform the login request
  //   const { authToken, authTokenSecret } = await RNTwitterSignIn.logIn();
  //   console.log(authToken);

  //   // Create a Twitter credential with the tokens
  //   // const twitterCredential = auth.TwitterAuthProvider.credential(authToken, authTokenSecret);

  //   // Sign-in the user with the credential
  //   //  return auth().signInWithCredential(twitterCredential);
  // }

  return (
    <View style={styles.container}>
      {loading && <BallIndicator color="#B31312" style={styles.loading} />}
      <ImageBackground source={Scooter} resizeMode="cover" style={styles.image}>
        <View style={styles.logo}>
          {/* <View style={styles.logoParent}> */}
            <Image source={Logo} />
            {/* <Image style={styles.circlelogo} source={Logo} /> */}
          {/* </View> */}
        </View>
        <View style={styles.parent}>
          <Text style={styles.text}>
            New Rider: By continuing and signing up for an account, you confirm
            that you agree to star’s{" "}
            <Text style={styles.orangeText}> User Agreement </Text>, and
            acknowledge that you have read star’s{" "}
            <Text style={styles.orangeText}> Privacy Notice </Text>
          </Text>
          <TouchableOpacity
          
            onPress={() =>
              onGoogleButtonPress().then(() =>
                console.log("Signed in with Google!"),
              )
            }
          >
            <View style={styles.googleBtn}>
                <Image source={GoogleIcon} style={{marginRight:"10px"}} />
              <Text style={styles.btnText}>
                Sign in with Google
              </Text>
            </View>
          </TouchableOpacity>
          {/* <View
            style={{
              alignItems: "center",
              flexDirection: "row",
              marginTop: 20,
            }}
          >
            <Image source={Divider} />
            <Text style={styles.text}> Or continue with</Text>
            <Image source={Divider} />
          </View> */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              width: 120,
            }}
          >
            {/* <TouchableOpacity
           title="Facebook Sign-In"
           onPress={() =>
             onFacebookButtonPress().then(() =>
               console.log("Signed in with Facebook!"),
             )
           }
          >
            <View style={[styles.googleBtn,{backgroundColor:"#3B5998"}]}>
                <Image source={Facebook} />
              <Text style={[styles.btnText,{color:"white"}]}>
                Sign in with Facebook
              </Text>
            </View>
          </TouchableOpacity> */}
            {/* <TouchableOpacity
              title="Facebook Sign-In"
              onPress={() =>
                onFacebookButtonPress().then(() =>
                  console.log("Signed in with Facebook!"),
                )
              }
            >
              <Image source={Facebook} />
            </TouchableOpacity> */}
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative'
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain", // or 'contain', 'stretch', 'repeat', 'center'
    justifyContent: "space-between",
    alignItems: "center",
  },
  circlelogo: {
    position: "absolute",
  },
  logo: {
    height: 400,
    justifyContent: "flex-end"
  },
  logoParent: {
    position: "relative",
  },
  text: {
    color: "white",
    fontSize: 14,
    textAlign: "center",
    marginHorizontal: 20,
  },
  orangeText: {
    fontWeight: "bold",
    color: "#FBA51C",
  },
  parent: {
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 70,
  },
  googleBtn: {
    display:"flex",
    flexDirection:"row",
    paddingBottom: 15,
    paddingTop: 8,
    gap:15,
    justifyContent: "center",
    backgroundColor: "#FBA51C",
    marginTop: 30,
    alignItems: "center",
    borderRadius: 20,
    width: 300,
  },
  btnText: {
    color: "black",
    fontSize: 15,
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

export default SignIn;
