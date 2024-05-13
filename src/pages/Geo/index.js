import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Button, PermissionsAndroid } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
// Function to get permission for location
const requestLocationPermission = async () => {
    try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
                title: 'Geolocation Permission',
                message: 'Can we access your location?',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK'
            },
        );
        
        if (granted === 'granted') {
            return true;
        } else {
            return false;
        }
    } catch (err) {
        return false;
    }
};

const Geo = () => {
    // state to hold location
    const [location, setLocation] = useState(false);
    // function to check permissions and get Location
    const getLocation = () => {
        const result = requestLocationPermission();
        result.then(res => {
            
            if (res) {
                Geolocation.getCurrentPosition(
                    position => {
                        setLocation(position);
                    },
                    (error) => {
                        // See error code charts below.
                        setLocation(false);
                    },
                    { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
                );
            }
        });
    };
    
    return (
        <View style={styles.container}>
            <Text>Welcome!</Text>
            <View
                style={{ marginTop: 10, padding: 10, borderRadius: 10, width: '40%' }}>
                <Button title="Get Location" onPress={getLocation} />
            </View>
            <Text>Latitude: {location ? location.coords.latitude : null}</Text>
            <Text>Longitude: {location ? location.coords.longitude : null}</Text>
            <View
                style={{ marginTop: 10, padding: 10, borderRadius: 10, width: '40%' }}>
                <Button title="Send Location" />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
export default Geo;