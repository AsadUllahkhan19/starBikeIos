import { FlatList, Text, View, Image, StyleSheet } from "react-native";
import ExitButton from "../../components/ExitButton";
import Heading from "../../components/Heading";
import { GlobalStyles } from "../../../GlobalStyles";
import HelmetPng from "../../../assets/motor-helmet.png";
import PersonVehiclePng from "../../../assets/playing.png";
import ScooterPng from "../../../assets/kick-scooter.png";
import EighteenPlusPng from "../../../assets/18plus.png";
import TrafficLight from "../../../assets/trafficLight.png";
import Bottle from "../../../assets/bottle.png";
import Mp3Png from "../../../assets/mp3-player.png";
import TwoPersonsPng from "../../../assets/twopersons.png";
import SafetyPng from "../../../assets/securityActive.png";

const data = [
  {
    text: "Wear a helmet when riding.",
    image: HelmetPng,
  },
  {
    text: "One person per vehicle.",
    image: PersonVehiclePng,
  },
  {
    text: "Check your vehicle before riding.",
    image: ScooterPng,
  },
  {
    text: "You must be 18 or older to ride an e-scooter.",
    image: EighteenPlusPng,
  },
  {
    text: "Follow traffic rules",
    image: TrafficLight,
  },
  {
    text: "Never ride under the influence of drugs or alcohol.",
    image: TrafficLight,
  },
  {
    text: "Avoid while riding using headphones or listening to music.",
    image: Mp3Png,
  },
  {
    text: "Never ride on pavements.",
    image: TwoPersonsPng,
  },
  {
    text: "Ride you own risk",
    image: SafetyPng,
  },
];

const HowToRide = ({ navigation }) => {
  return (
    <View style={[GlobalStyles.flex_1]}>
      <ExitButton navigation={navigation} path="SafetyMain" />
      <View
        style={[GlobalStyles.alignItemsCenter, GlobalStyles.marginVertical_3]}
      >
        <Text style={[GlobalStyles.fs_4, GlobalStyles.text_lightgray]}>
          How to ride
        </Text>
        <Heading text="Scooter" />
        <View style={[GlobalStyles.marginTop_3]}>
          <Heading text="Local rules and regulations" />
        </View>
      </View>
      <View style={[Styles.Main]}>
        <FlatList
          data={data}
          keyExtractor={(item, index) => index}
          renderItem={({ item }) => (
            <View
              style={[
                GlobalStyles.flex_row,
                GlobalStyles.alignItemsCenter,
                GlobalStyles.marginVertical_3,
              ]}
            >
              <Image
                style={[GlobalStyles.marginHorizontal_3]}
                source={item.image}
              />
              <Text style={[GlobalStyles.text_lightgray]}>{item.text}</Text>
            </View>
          )}
        />
      </View>
    </View>
  );
};
const Styles = StyleSheet.create({
  Main: {
    flex: 10,
    paddingVertical: 30,
    paddingHorizontal: 40,
  },
});

export default HowToRide;
