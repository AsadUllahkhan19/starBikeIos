import * as DocumentPicker from "expo-document-picker";
import AttachementImage from '../../../assets/attachement.png'
import {
  Button,
  FlatList,
  Text,
  TouchableOpacity,
  View,
  Image,
  StyleSheet,
  TextInput,
  ScrollView,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { useState } from "react";
import axios from "axios";

import baseUrl from "../../services/baseUrl";
import { GlobalStyles } from "../../../GlobalStyles";
import ExitButton from "../../components/ExitButton";
import Heading from "../../components/Heading";

const ReportAccident = ({ navigation }) => {
  const [reqData, setReqData] = useState({
    email: "",
    phone: "",
    issue: "",
    location: "",
    subject: "",
    description: "",
    file: null,
  });

  const pickDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync({});
    if (!result?.canceled) {
      setReqData({ ...reqData, ["file"]: result });
    }
  };
  const handleReqDataChange = (name, value) => {
    setReqData({ ...reqData, [name]: value });
  };
  const [openIssueDropdown, setOpenIssueDropdown] = useState(false);
  const [issueValue, setIssueValue] = useState(null);
  const [issueItems, setIssueItems] = useState([
    { label: "Apple", value: "apple" },
    { label: "Banana", value: "banana" },
  ]);

  const [openLocDropdown, setOpenLocDropdown] = useState(false);
  const [locValue, setLocValue] = useState(null);
  const [locItems, setLocItems] = useState([
    { label: "Apple", value: "apple" },
    { label: "Banana", value: "banana" },
  ]);

  const submit = async () => {
    const res = await axios.post(
      `${baseUrl}/users/accident-register`,
      {
        email: reqData.email,
        phoneNumber: reqData.phoneNumber,
        issue: reqData.issue,
        location: reqData.location,
        subject: reqData.subject,
        description: reqData.description,
      },
    );
    alert("Submited!");
  };

  return (
    <ScrollView style={[GlobalStyles.flex_1]}>
      <ExitButton navigation={navigation} path="SafetyMain" />
      <View
        style={[GlobalStyles.alignItemsCenter, GlobalStyles.marginVertical_3]}
      >
        <Text style={[GlobalStyles.fs_4, GlobalStyles.text_lightgray]}>
          Report an accident
        </Text>
        <View style={[GlobalStyles.marginTop_3]}>
          <Heading text="Submit Request" />
        </View>
      </View>
      <View style={[Styles.Main]}>
        <TextInput
          value={reqData.email}
          onChangeText={(val) => handleReqDataChange("email", val)}
          placeholder="Your Email Address"
          style={[Styles.Input]}
        />
        <Text style={[GlobalStyles.text_lightgray, GlobalStyles.fs_6]}>
          Please confirm that the phone number entered matches your star
          account.
        </Text>
        <TextInput
          value={reqData.phone}
          onChangeText={(val) => handleReqDataChange("phone", val)}
          placeholder="Phone number"
          style={[Styles.Input]}
        />
        <Text style={[GlobalStyles.text_lightgray, GlobalStyles.fs_6]}>
          The issue you are experiencing is most likely connected to:
        </Text>
        <View style={[GlobalStyles.marginVertical_1]}>
          <DropDownPicker
            open={openIssueDropdown}
            value={issueValue}
            items={issueItems}
            setOpen={setOpenIssueDropdown}
            setValue={setIssueValue}
            setItems={setIssueItems}
            placeholder="-"
            searchPlaceholder="Search..."
            searchable={true}
            addCustomItem={true}
            placeholderStyle={{
              color: "black",
              fontWeight: "bold",
              fontSize: 20,
            }}
            searchTextInputStyle={{
              color: "#000",
              borderWidth: 0,
            }}
            searchContainerStyle={{
              borderWidth: 0,
              borderColor: "white",
            }}
            dropDownContainerStyle={{
              backgroundColor: "#dfdfdf",
              backgroundColor: "white",
              borderWidth: 0,
            }}
            style={{
              borderWidth: 0,
            }}
            zIndex={1000}
          />
        </View>
        <Text style={[GlobalStyles.text_lightgray, GlobalStyles.fs_6]}>
          Where are you located?
        </Text>
        <View style={[GlobalStyles.marginVertical_1]}>
          <DropDownPicker
            zIndex={10}
            open={openLocDropdown}
            value={locValue}
            items={locItems}
            setOpen={setOpenLocDropdown}
            setValue={setLocValue}
            setItems={setLocItems}
            placeholder="-"
            searchPlaceholder="Search..."
            searchable={true}
            addCustomItem={true}
            placeholderStyle={{
              color: "black",
              fontWeight: "bold",
              fontSize: 20,
            }}
            searchTextInputStyle={{
              color: "#000",
              borderWidth: 0,
            }}
            searchContainerStyle={{
              borderWidth: 0,
              borderColor: "white",
            }}
            dropDownContainerStyle={{
              backgroundColor: "#dfdfdf",
              backgroundColor: "white",
              borderWidth: 0,
            }}
            style={{
              borderWidth: 0,
            }}
          />
        </View>
        <TextInput
          value={reqData.subject}
          onChangeText={(val) => handleReqDataChange("subject", val)}
          placeholder="Subject"
          style={[Styles.Input]}
        />
        <TextInput
          value={reqData.description}
          onChangeText={(val) => handleReqDataChange("description", val)}
          placeholder="Description"
          multiline
          numberOfLines={6}
          style={[Styles.Input, Styles.Description]}
          textAlignVertical="top"
        />
        <Text style={[GlobalStyles.text_lightgray, GlobalStyles.fs_6]}>
          Please enter the details of your request. A member of our support
          staff will respond as soon as possible.
        </Text>
	  <TouchableOpacity onPress={pickDocument}>
	  <View style={[GlobalStyles.alignItemsCenter,GlobalStyles.marginVertical_3,GlobalStyles.bg_white,GlobalStyles.paddingVertical_3]}>
	  <Text style={[GlobalStyles.alignItemsCenter , GlobalStyles.text_lightgray]}><Text style={[GlobalStyles.text_orange]}>Add file </Text> or drop file here.</Text>
	  </View>
	  </TouchableOpacity>
        {reqData.file && (
          <View style={[GlobalStyles.flex_row, GlobalStyles.marginVertical_3]}>
		{
			reqData?.file?.assets[0]?.mimeType?.startsWith("image") ?
			<Image style={[GlobalStyles.h_10,GlobalStyles.w_10, GlobalStyles.m_5, GlobalStyles.marginHorizontal_1]} source={{uri:`${reqData?.file?.assets[0]?.uri}`}} />
			:
			<View style={[GlobalStyles.alignItemsCenter,GlobalStyles.h_10,GlobalStyles.w_10,GlobalStyles.shadow]}>
			<Image style={[GlobalStyles.h_10,GlobalStyles.w_10, GlobalStyles.m_5, GlobalStyles.marginHorizontal_1]} source={AttachementImage} />
			<Text>{reqData?.file?.assets[0]?.name}</Text>
			</View>
		}
          </View>
        )}
        <TouchableOpacity onPress={() => submit()}>
          <View
            style={[
              GlobalStyles.alignItemsCenter,
              GlobalStyles.marginVertical_5,
            ]}
          >
            <Text
              style={[
                GlobalStyles.bg_orange,
                GlobalStyles.text_black,
                Styles.btn,
              ]}
            >
              Submit
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};
const Styles = StyleSheet.create({
  Main: {
    flex: 10,
    paddingVertical: 30,
    paddingHorizontal: 40,
  },
  Input: {
    backgroundColor: "white",

    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  btn: {
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 20,
  },
});

export default ReportAccident;
