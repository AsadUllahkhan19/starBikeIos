import { GlobalStyles } from "../../../GlobalStyles";
import React, { useState, useLayoutEffect } from "react";
import {
    View,
    Text,
    useWindowDimensions,
    Image,
    TouchableNativeFeedback,
    TouchableHighlight,
    TouchableOpacity,
} from "react-native";
import Carousel, { ParallaxImage } from "react-native-snap-carousel";
import { StyleSheet } from "react-native";
import { Dimensions } from "react-native";
import {
    useFonts,
    Livvic_400Regular,
    Livvic_700Bold,
    Livvic_600SemiBold,
} from "@expo-google-fonts/livvic";
import axios from "axios";

import baseUrl from "../../services/baseUrl";
import discountbg from "../../../assets/Map_icons/discountbg.png";
import Scooterbg from "../../../assets/Map_icons/scooterbg.png";
import Scooter from "../../../assets/Map_icons/scooter.png";
import Star from "../../../assets/Map_icons/Star.png";

const screenWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
import ExitButton from "../../components/ExitButton";

// const entries = [
//     {
//         id: 1,
//         type: "BASIC",
//         amount: 2.5,
//         desc: "Note: You dont have to use all Star at once",
//         stars: 10,
//         discount: 0
//     },
//     {
//         id: 2,
//         type: "STANDARD",
//         amount: 6,
//         desc: "Note: You dont have to use all Star at once",
//         stars: 30,
//         discount: 50
//     },
//     {
//         id: 3,
//         type: "PLUS",
//         amount: 10,
//         desc: "Note: You dont have to use all Star at once",
//         stars: 60,
//         discount: 15
//     }
// ];





const index = ({ route, navigation }) => {
    // const { onlyBuyCoins } = route.params;
    const [entries, setEntries] = useState([]);

    const [fontsLoaded] = useFonts({
        Livvic_400Regular,
        Livvic_700Bold,
        Livvic_600SemiBold,
    });

    useLayoutEffect(() => {
        axios.get(`${baseUrl}/users/packages`).then(res => {
            setEntries(res.data);
        })
    }, [])


    // <Button
    //             onPress={() => navigation.navigate('checkout', { amount: 30 })}
    //             title="30$"
    //             color="#841584"
    //             accessibilityLabel="30$ Coin"
    //         />
    //         <Button
    //             onPress={() => navigation.navigate('checkout', { amount: 40 })}
    //             title="40$"
    //             color="#841584"
    //             accessibilityLabel="40$ Coin"
    //         />
    //         <Button
    //             onPress={() => navigation.navigate('checkout', { amount: 500 })}
    //             title="50$"
    //             color="#841584"
    //             accessibilityLabel="50$ Coin"
    //         />



    const renderItem = ({ item, index }) => {
        return (
            <View style={styles.item}>
                <View
                    style={{
                        position: "relative",
                        width: "100%",
                        marginBottom: 100,
                    }}
                >
                    {item?.discount !== 0 && (
                        <>
                            <Image
                                style={{
                                    width: 100,
                                    objectFit: "contain",
                                    position: "absolute",
                                    left: 10,
                                    top: -5,
                                }}
                                source={discountbg}
                            />
                            <Text
                                style={{
                                    position: "absolute",
                                    top: 35,
                                    left: 32,
                                    fontFamily: "Livvic_700Bold",
                                    fontSize: 25,
                                    color: "white",
                                }}
                            >
                                {item?.discount}%
                            </Text>
                        </>
                    )}
                </View>
                <View
                    style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        marginBottom: 280,
                    }}
                >
                    <Image
                        style={{
                            width: "120%",
                            objectFit: "contain",
                            position: "absolute",
                            zIndex: 9,
                            top: -90,
                            right: -35,
                        }}
                        source={Scooter}
                    />
                    <Image
                        style={{ width: "90%", objectFit: "contain", position: "absolute" }}
                        source={Scooterbg}
                    />
                </View>

                <View
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: -10,
                    }}
                >
                    <Text
                        style={{
                            fontFamily: "Livvic_600SemiBold",
                            fontSize: 40,
                            color: "#FEBD42",
                        }}
                    >
                        {item?.type}
                    </Text>
                    <Text
                        style={{
                            fontFamily: "Livvic_700Bold",
                            fontSize: 60,
                            marginBottom: 15,
                        }}
                    >
                        €{item?.amount}
                    </Text>
                    <View
                        style={{
                            flexDirection: "row",

                            alignItems: "center",
                            marginBottom: 30,
                            marginLeft: 12,
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: "Livvic_700Bold",
                                fontSize: 15,
                                paddingRight: 12,
                            }}
                        >
                            {item?.stars} Stars
                        </Text>

                        <Image
                            style={{
                                objectFit: "contain",
                                width: 40,
                            }}
                            source={Star}
                        />
                    </View>
                    <TouchableOpacity onPress={() => {
                        if (route?.params?.onlyBuyCoins) {
                            navigation.navigate('checkout', { amount: item?.amount * 100, stars: item?.stars, buyCoins: route?.params?.onlyBuyCoins });
                            return;
                        }
                        navigation.navigate('checkout', { amount: item?.amount * 100, stars: item?.stars });
                    }}>
                        <View
                            style={{
                                width: 200,
                                height: 40,
                                backgroundColor: "#FBA51C",
                                alignItems: "center",
                                justifyContent: "center",
                                borderRadius: 50,
                            }}
                        >
                            <Text
                                style={{
                                    fontFamily: "Livvic_600SemiBold",
                                    fontSize: 15,
                                    color: "white",
                                }}
                            >
                                BUY NOW
                            </Text>
                        </View>
                    </TouchableOpacity>

                    <Text style={{ color: "grey", fontSize: 10, marginTop: 12 }}>
                        {/* {item?.desc} */}
                        Note: You dont have to use all Star at once
                    </Text>
                </View>
            </View>
        );
    };
    if (fontsLoaded) {
        return (
            <View
                style={{
                    width: "100%",
                    height: "100%",
                    // backgroundColor: "red",
                }}
            >
                <ExitButton navigation={navigation} path="Main" />
                <Carousel
                    sliderWidth={screenWidth}
                    sliderHeight={screenWidth}
                    itemWidth={screenWidth - 60}
                    data={entries}
                    renderItem={renderItem}
                />
            </View>
        );
    } else {
        null;
    }
};

export default index;

const styles = StyleSheet.create({
    item: {
        marginTop: 5,
        width: screenWidth - 60,
        height: (windowHeight * 95) / 100,
        backgroundColor: "white",
        borderRadius: 20,
    },
    imageContainer: {
        marginBottom: 1, // Prevent a random Android rendering issue
        backgroundColor: "white",
        borderRadius: 8,
    },
    image: {
        ...StyleSheet.absoluteFillObject,
        resizeMode: "cover",
    },
});
