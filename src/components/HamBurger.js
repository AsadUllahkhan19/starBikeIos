import { Image, View, StyleSheet, Text } from "react-native";
import { TouchableOpacity } from "react-native";
import HamBurgerLine from "../../assets/HamBurgerLine.png";
import { GlobalStyles } from "../../GlobalStyles";

const HamBurger = ({ navigation }) => {
  return (
    <TouchableOpacity
      style={[
        Styles.HamBurger,
        GlobalStyles.bg_black,
        GlobalStyles.alignItemsCenter,
      ]}
      onPress={() => navigation.toggleDrawer()}>
      <Image
        source={HamBurgerLine}
        style={[GlobalStyles.marginVertical_05, { height: 2 }]}
      />
      <Image
        source={HamBurgerLine}
        style={[GlobalStyles.marginVertical_05, { height: 2 }]}
      />
      <Image
        source={HamBurgerLine}
        style={[GlobalStyles.marginVertical_05, { height: 2 }]}
      />
    </TouchableOpacity>
  );
};

const Styles = StyleSheet.create({
  HamBurger: {
    padding: 10,
    width: 39,
    borderRadius: 50,
    position: "relative",
    top: 45,
    left: 0,
    zIndex: 1000006577867878678678678678
  }
});

export default HamBurger;
