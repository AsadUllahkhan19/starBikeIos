import { View, Text } from "react-native";
import { GlobalStyles } from "../../GlobalStyles";

const Heading = ({ text }) => {
  return (
    <View
      style={[
        GlobalStyles.marginTop_3,
        GlobalStyles.justifyContentCenter,
        GlobalStyles.alignItemsCenter,
      ]}
    >
      <Text style={[GlobalStyles.fs_3, GlobalStyles.fw_bold]}>{text}</Text>
    </View>
  );
};
export default Heading;
