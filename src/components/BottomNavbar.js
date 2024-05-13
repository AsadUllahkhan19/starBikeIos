import { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, TouchableHighlight, Image } from "react-native";
import { GlobalStyles } from "../../GlobalStyles";
import ScanIcon from "../../assets/QRcode.png";
import MapIcon from "../../assets/pin.png";
import ProfileIcon from "../../assets/user.png";
import ScanIconActive from "../../assets/QRcodeactive.png";
import MapIconActive from "../../assets/pinactive.png";
import ProfileIconActive from "../../assets/useractive.png";

const BottomNabBar = ({ state, descriptors, navigation }) => {
  const [checkScan, setCheckScan] = useState('Map');
  return (
    <View style={checkScan === "Scan" ? { flexDirection: "row", backgroundColor: 'black' } : { flexDirection: "row", position: 'absolute', bottom: 0 }}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        var label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
          });

          if (!isFocused && !event.defaultPrevented) {
            // navigation.navigate(route.name);
            navigation.reset({
              index: 0,
              routes: [{ name: route.name }]
            })
          }
          setCheckScan(route.name);
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key
          });
        };

        return (
          <View style={{ flex: 1 }}>
            {/* <TouchableHighlight
             activeOpacity={0.4}
             underlayColor='#FBA51C'
             accessibilityRole="button"
             accessibilityState={isFocused ? { selected: true } : {}}
             accessibilityLabel={options.tabBarAccessibilityLabel}
             testID={options.tabBarTestID}
             onPress={onPress}
             onLongPress={onLongPress}
             style={{ flex: 1, borderTopRightRadius: 25, borderTopLeftRadius: 25 }}
           >
             <TouchableOpacity
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={{ flex: 1 }}
            >  */}
            <View
              style={[
                GlobalStyles.bg_orange,
                NavbarStyles.nav,
                label === "Map" && GlobalStyles.borderTopLeftRadius,
                label === "Profile" && GlobalStyles.borderTopRightRadius,
              ]}
            >
              {label === "Map" && !isFocused ? (
                <TouchableHighlight
                  activeOpacity={0.4}
                  underlayColor='#FBA51C'
                  accessibilityRole="button"
                  accessibilityState={isFocused ? { selected: true } : {}}
                  accessibilityLabel={options.tabBarAccessibilityLabel}
                  testID={options.tabBarTestID}
                  onPress={onPress}
                  // onLongPress={onLongPress}
                  style={{ borderTopRightRadius: 25, borderTopLeftRadius: 25 }}
                >
                  <Image source={MapIcon} />
                </TouchableHighlight>
              ) : label === "Map" && isFocused ? (
                <TouchableHighlight
                  activeOpacity={0.4}
                  underlayColor='#FBA51C'
                  accessibilityRole="button"
                  accessibilityState={isFocused ? { selected: true } : {}}
                  accessibilityLabel={options.tabBarAccessibilityLabel}
                  testID={options.tabBarTestID}
                  onPress={onPress}
                  // onLongPress={onLongPress}
                  style={{ borderTopRightRadius: 25, borderTopLeftRadius: 25 }}
                >
                  <View style={NavbarStyles.iconActive}>
                    <Image
                      style={{ position: "relative" }}
                      source={MapIconActive}
                    />
                  </View>
                </TouchableHighlight>
              ) : label === "Scan" && isFocused ? (
                <TouchableHighlight
                  activeOpacity={0.4}
                  underlayColor='#FBA51C'
                  accessibilityRole="button"
                  accessibilityState={isFocused ? { selected: true } : {}}
                  accessibilityLabel={options.tabBarAccessibilityLabel}
                  testID={options.tabBarTestID}
                  onPress={onPress}
                  // onLongPress={onLongPress}
                  style={{ borderTopRightRadius: 25, borderTopLeftRadius: 25 }}
                >
                  <View style={NavbarStyles.iconActive}>
                    <Image
                      style={{ position: "relative" }}
                      source={ScanIconActive}
                    />
                  </View>
                </TouchableHighlight>
              ) : label === "Scan" && !isFocused ? (
                <TouchableHighlight
                  activeOpacity={0.4}
                  underlayColor='#FBA51C'
                  accessibilityRole="button"
                  accessibilityState={isFocused ? { selected: true } : {}}
                  accessibilityLabel={options.tabBarAccessibilityLabel}
                  testID={options.tabBarTestID}
                  onPress={onPress}
                  // onLongPress={onLongPress}
                  style={{ borderTopRightRadius: 25, borderTopLeftRadius: 25 }}
                >
                  <Image source={ScanIcon} />
                </TouchableHighlight>
              ) : label === "Profile" && isFocused ? (
                <TouchableHighlight
                  activeOpacity={0.4}
                  underlayColor='#FBA51C'
                  accessibilityRole="button"
                  accessibilityState={isFocused ? { selected: true } : {}}
                  accessibilityLabel={options.tabBarAccessibilityLabel}
                  testID={options.tabBarTestID}
                  onPress={onPress}
                  // onLongPress={onLongPress}
                  style={{ borderTopRightRadius: 25 }}
                >
                  <View style={NavbarStyles.iconActive}>
                    <Image
                      style={{ position: "relative" }}
                      source={ProfileIconActive}
                    />
                  </View>
                </TouchableHighlight>
              ) : label === "Profile" && !isFocused ? (
                <TouchableHighlight
                  activeOpacity={0.4}
                  underlayColor='#FBA51C'
                  accessibilityRole="button"
                  accessibilityState={isFocused ? { selected: true } : {}}
                  accessibilityLabel={options.tabBarAccessibilityLabel}
                  testID={options.tabBarTestID}
                  onPress={onPress}
                  // onLongPress={onLongPress}
                  style={{ borderTopRightRadius: 25 }}
                >
                  <Image source={ProfileIcon} />
                </TouchableHighlight>
              ) : null}
              <Text
                style={[
                  isFocused && NavbarStyles.activeText,
                  !isFocused && NavbarStyles.text,
                ]}
              >
                {label}
              </Text>
            </View>
            {/* </TouchableOpacity> */}
          </View>
        );
      })}
    </View>
  );
};

const NavbarStyles = StyleSheet.create({
  nav: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    position: "relative",
    height: 80,
  },
  iconActive: {
    position: "relative",
    bottom: 20,
    backgroundColor: "black",
    borderRadius: 35,
    padding: 10
  },
  activeText: {
    position: "relative",
    bottom: 15,
  },
  text: {
    paddingTop: 5,
  },
});

export default BottomNabBar;
