import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import BottomNavbar from "../components/BottomNavbar";
import Profile from "../pages/Profile/Profile";
import Scan from "../pages/Scan/Scan";
import Map from "../pages/Map/Map";

const BottomNavigator = ({ navigation, route }) => {
  const { errorMsg, location } = route.params;
  const ScanWrapper = () => <Scan drawerNavigation={navigation} />;
  const ProfileWrapper = () => <Profile drawerNavigation={navigation} />;
  const MapWrapper = () => <Map drawerNavigation={navigation} />;

  const BottomTab = createBottomTabNavigator();
  return (
    <BottomTab.Navigator tabBar={(props) => <BottomNavbar {...props} />}>
      <BottomTab.Screen
        name="Map"
        component={MapWrapper}
        initialParams={{ errorMsg, location }}
        options={{ headerShown: false }}
      />
      <BottomTab.Screen
        name="Scan"
        component={ScanWrapper}
        options={{ headerShown: false }}
      />
      <BottomTab.Screen
        name="Profile"
        component={ProfileWrapper}
        options={{ headerShown: false }}
      />
    </BottomTab.Navigator>
  );
};
export default BottomNavigator;
