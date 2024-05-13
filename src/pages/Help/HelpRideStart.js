import EllipsePng from "../../../assets/Ellipse.png";
import ExitButton from "../../components/ExitButton";
import Heading from "../../components/Heading";
import {
  View,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  Text,
} from "react-native";
import { GlobalStyles } from "../../../GlobalStyles";
import Item from "../../components/Item";

const data = [
  "You do not have a strong mobile network connection.",
  "You do not have a valid payment method on file or have a low star Cash balance. Check your Wallet to confirm.",
  "The scooter you want to ride is low on battery. Return to the map to find a different scooter.",
];

const HelpRideStart = ({ navigation }) => {
  return (
    <View style={[GlobalStyles.flex_1]}>
      <ExitButton navigation={navigation} path="HelpMain" />
      <View style={[GlobalStyles.marginTop_3]}>
        <Heading text={"Help"} />
      </View>
      <View style={[Styles.main]}>
        <View style={[GlobalStyles.marginHorizontal_5]}>
          <Text
            style={[
              GlobalStyles.marginVertical_1,
              GlobalStyles.fw_bold,
              GlobalStyles.fs_3,
            ]}
          >
            Ride won't start
          </Text>
          <Text style={[GlobalStyles.marginVertical_1]}>
            You may be unable to start a ride if:
          </Text>
          <FlatList
            data={data}
            keyExtractor={(item, index) => index}
            renderItem={({ item }) => (
              <View
                style={[
                  GlobalStyles.marginVertical_05,
                  GlobalStyles.flex_row,
                  GlobalStyles.alignItemsCenter,
                ]}
              >
                <Image
                  source={EllipsePng}
                  style={[GlobalStyles.marginHorizontal_3]}
                />
                <Text>{item}</Text>
              </View>
            )}
          />
        </View>
        <View style={[GlobalStyles.marginVertical_5]}>
          <Item text="Go Payment methods" path="" navigation={navigation} />
        </View>
      </View>
    </View>
  );
};
const Styles = StyleSheet.create({
  Exit: {
    padding: 10,
    zIndex: 4,
    width: 35,
    borderRadius: 50,
    position: "relative",
    top: 45,
    left: 20,
  },
  main: {
    flex: 10,
    paddingVertical: 30,
  },
});
export default HelpRideStart;
