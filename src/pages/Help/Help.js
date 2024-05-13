import {
  View,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  Text,
} from "react-native";
import { GlobalStyles } from "../../../GlobalStyles";
import ExitButton from "../../components/ExitButton";
import Heading from "../../components/Heading";
import Item from "../../components/Item";

const data = [
  {
    text: "Issue with a recent ride",
    path: "HelpRideIssue",
  },
  {
    text: "Ride won’t start",
    path: "HelpRideStart",
  },
  {
    text: "Improper or illegal parking",
    path: "HelpIllegalParking",
  },
  {
    text: "FAQs",
    path: "HelpFAQs",
  },
];

const Help = ({ navigation }) => {
  return (
    <View style={[GlobalStyles.flex_1]}>
      <ExitButton navigation={navigation} path="Main" />
      <View style={[GlobalStyles.marginTop_3]}>
        <Heading text="Help" />
      </View>
      <View style={[Styles.main]}>
        <FlatList
          data={data}
          keyExtractor={(item) => item.path}
          renderItem={({ item }) => (
            <Item text={item.text} navigation={navigation} path={item.path} />
          )}
        />
      </View>
    </View>
  );
};

const Styles = StyleSheet.create({
  HamBurger: {
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
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    paddingHorizontal: 25,
    marginHorizontal: 30,
    paddingVertical: 15,
    marginVertical: 5,
  },
});
export default Help;
