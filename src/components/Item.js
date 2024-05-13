import { TouchableOpacity, View, Image, StyleSheet, Text } from "react-native";
import ArrowPng from "../../assets/Line.png";

const Item = ({ text, path, navigation }) => {
  return (
    <TouchableOpacity onPress={() => navigation.navigate(`${path}`)}>
      <View style={Styles.item}>
        <Text>{text}</Text>
        <Image source={ArrowPng} />
      </View>
    </TouchableOpacity>
  );
};

const Styles = StyleSheet.create({
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
export default Item;
