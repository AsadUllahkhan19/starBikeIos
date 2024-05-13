import { createStackNavigator } from "@react-navigation/stack";
import Safety from "../pages/Safety/Safety";
import HowToRide from "../pages/Safety/HowToRide";
import ReportAccident from "../pages/Safety/ReportAccident";
import SafetyCommitment from "../pages/Safety/SafetyCommitment";

const SafetyStackNavigator = () => {
  const SafetyStackNavigator = createStackNavigator();
  return (
    <SafetyStackNavigator.Navigator>
      <SafetyStackNavigator.Screen
        name="SafetyMain"
        component={Safety}
        options={{ headerShown: false }}
      />
      <SafetyStackNavigator.Screen
        name="HowToRide"
        component={HowToRide}
        options={{ headerShown: false }}
      />
      <SafetyStackNavigator.Screen
        name="ReportAccident"
        component={ReportAccident}
        options={{ headerShown: false }}
      />
      <SafetyStackNavigator.Screen
        name="SafetyCommitment"
        component={SafetyCommitment}
        options={{ headerShown: false }}
      />
    </SafetyStackNavigator.Navigator>
  );
};
export default SafetyStackNavigator;
