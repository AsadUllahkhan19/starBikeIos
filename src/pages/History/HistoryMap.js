import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import ExitButton from "../../components/ExitButton";

export default function HistoryMap({ route, locationData, navigation }) {
    const mapRef = useRef(null);
    useEffect(() => {
        if (route?.params?.locationData?.origin) {
            regionofUser(route?.params?.locationData?.origin);
        }
    }, [route?.params?.locationData]);

    const regionofUser = (location) => {
        if (mapRef !== null && location !== null) {
            location.latitudeDelta = 0.005;
            location.longitudeDelta = 0.005;
            mapRef.current.animateToRegion(location);
        }
    };
    return (
        <View style={styles.container}>
            <View style={{ position: 'absolute', zIndex: 5050000505, top: 0, left: 10 }}>
                <ExitButton navigation={navigation} path="History" />
            </View>


            <MapView ref={mapRef} style={styles.map} initialRegion={{
                latitude: 35.2401,
                longitude: 24.8093,
                latitudeDelta: 0.5,
                longitudeDelta: 0.5,
            }}>
                <MapViewDirections
                    origin={route?.params?.locationData?.origin}
                    destination={route?.params?.locationData?.destination}
                    apikey="AIzaSyBmlfCX9N5NAKdGidMbSxMXkc4CNHcT6rQ"
                    strokeWidth={5}
                    strokeColor="#FBA51C"
                    mode="WALKING"
                    resetOnChange={false}
                // optimizeWaypoints={true}
                //   onReady={RegionBetweenUserandScooter}
                />

            </MapView>
        </View >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
        position: 'relative'
    },
    map: {
        width: "100%",
        height: "100%"
    }
})
