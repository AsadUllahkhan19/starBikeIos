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
  {
    text: "How to ride Star scooters",
    path: "HowToRide",
  },
  {
    text: "Report an accident",
    path: "ReportAccident",
  },
  {
    text: "Star's commitment to safety",
    path: "SafetyCommitment",
  },
];

const Safety = ({ navigation }) => {
  return (
    <View style={[GlobalStyles.flex_1]}>
      <ExitButton navigation={navigation} path="Main" />
      <Heading text="Safety" />
      <View style={[Styles.main]}>
        <View
          style={[
            GlobalStyles.marginHorizontal_5,
            GlobalStyles.marginVertical_3,
            GlobalStyles.text_lightgray,
          ]}
        >
          <Text>Learn more about safe riding in your city.</Text>
        </View>
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
  main: {
    flex: 10,
    paddingVertical: 30,
  },
});

export default Safety;
