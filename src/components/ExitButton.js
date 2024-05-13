import {
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";

import Xpng from "../../assets/X.png";
import { GlobalStyles } from "../../GlobalStyles";


const ExitButton = ({ navigation, path }) => {
  return (
    <TouchableOpacity
      style={[Styles.Exit, GlobalStyles.bg_orange]}
      onPress={() => {
        navigation.reset({
          index: 0,
          routes: [{ name: path }]
        })
        // navigation.navigate(path);
      }}
    >
      <Image source={Xpng} />
      {/* <View style={[Styles.Exit, GlobalStyles.bg_orange]}> */}

      {/* </View> */}
    </TouchableOpacity>
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
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20
  },
});
export default ExitButton;
