import { createStackNavigator } from "@react-navigation/stack";
import Help from "../pages/Help/Help";
import HelpRideStart from "../pages/Help/HelpRideStart";
import HelpIllegalParking from "../pages/Help/HelpIllegalParking";

const HelpStackNavigator = () => {
  const HelpStackNavigator = createStackNavigator();
  return (
    <HelpStackNavigator.Navigator>
      <HelpStackNavigator.Screen
        name="HelpMain"
        component={Help}
        options={{ headerShown: false }}
      />
      <HelpStackNavigator.Screen
        name="HelpRideStart"
        component={HelpRideStart}
        options={{ headerShown: false }}
      />
      <HelpStackNavigator.Screen
        name="HelpIllegalParking"
        component={HelpIllegalParking}
        options={{ headerShown: false }}
      />
    </HelpStackNavigator.Navigator>
  );
};
export default HelpStackNavigator;
