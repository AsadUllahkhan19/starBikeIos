import { GlobalStyles } from "../../../GlobalStyles";
import ExitButton from "../../components/ExitButton";
import Heading from "../../components/Heading";
import QRcode from "../../../assets/QRcodeactive.png";
import rectangle from "../../../assets/Rectangle.png";
import plus from "../../../assets/plus.png";
import * as DocumentPicker from "expo-document-picker";
import {
  TouchableOpacity,
  View,
  StyleSheet,
  Image,
  Text,
  TextInput,
} from "react-native";
import { useState } from "react";

const HelpIllegalParking = ({ navigation }) => {
  const [reqData, setReqData] = useState({
    description: "",
    file: null,
  });
  const [image, setImage] = useState();

  const pickDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync({});

    if (result.type === "success") {
      setImage(result);
    }
  };
  const handleReqDataChange = (name, value) => {
    setReqData({ ...reqData, [name]: value });
  };
  return (
    <View style={[GlobalStyles.flex_1]}>
      <ExitButton navigation={navigation} path="Main" />
      <View style={[GlobalStyles.marginTop_3]}>
        <Heading text="Help" />
      </View>
      <View style={[GlobalStyles.margintop_9]}>
        <Heading text="Improper And Illegal Parking" />
      </View>
      <View
        style={[
          GlobalStyles.flex_row,
          GlobalStyles.margintop_9,
          GlobalStyles.marginHorizontal_5,
          GlobalStyles.borbott,
          GlobalStyles.pbottom2,
        ]}
      >
        <Image style={[GlobalStyles.marginHorizontal_3]} source={QRcode} />

        <Text
          style={[
            GlobalStyles.fs_4,
            GlobalStyles.text_lightgray,
            GlobalStyles.marginLeft_5,
          ]}
        >
          Scan the vehicle and scan its id
        </Text>
      </View>
      <TouchableOpacity onPress={pickDocument}>
        <View
          style={[
            GlobalStyles.margintop_6,
            GlobalStyles.marginHorizontal_5,
            Styles.holderparent,
          ]}
        >
          <Image style source={rectangle} />
          <Image style={[Styles.plus]} source={plus} />
        </View>
      </TouchableOpacity>
      <Text
        style={[
          GlobalStyles.fs_7,
          GlobalStyles.text_lightgray,
          GlobalStyles.marginHorizontal_5,
          GlobalStyles.marginVertical_05,
        ]}
      >
        Add Photo 0/3
      </Text>

      <TextInput
        value={reqData.description}
        onChangeText={(val) => handleReqDataChange("description", val)}
        placeholder="Description"
        multiline
        numberOfLines={6}
        style={[Styles.Input, Styles.Description]}
        textAlignVertical="top"
      />
      <View
        style={[GlobalStyles.alignItemsCenter, GlobalStyles.marginVertical_5]}
      >
        <Text
          style={[GlobalStyles.bg_orange, GlobalStyles.text_black, Styles.btn]}
        >
          Sign Out
        </Text>
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
  holderparent: {
    position: "relative",
  },
  plus: {
    position: "absolute",
    top: 22,
    left: 20,
  },
  Input: {
    margin: 20,
    backgroundColor: "white",
    height: 130,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  btn: {
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 600,
  },
});
export default HelpIllegalParking;
