import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { WebView } from 'react-native-webview';
import { useSelector, useDispatch } from 'react-redux';
import {
    BarIndicator,
} from 'react-native-indicators';

import { putAmount, putTotalAmount } from '../../store/reducers/User';
import baseUrl from '../../services/baseUrl';
import makeRequest from "../../services/axiosInstance";

export default function Checkout({ navigation, route }) {
    const [url, setUrl] = useState(false);
    const [flag, setFlag] = useState(true);
    // let flag = true;
    const dispatch = useDispatch();
    const { amount, stars } = route.params;

    const userData = useSelector(state => state.user.userAuthCredentials);
    useEffect(() => {
        if (amount && userData?.email) {
            
            makeRequest('post', 'scooter/pay', { amount: amount, useremail: userData.email, name: userData.firstName })
                // axios.post(`${baseUrl}/scooter/pay`, { amount: amount, useremail: userData.email, name: userData.firstName })
                .then(res => {
                    setUrl(res?.url);
                }).catch(err => {
                    console.log('form_pay', err);
                })
        }
    }, [amount, userData])

    const handleNavigationStateChange = (navState) => {
        const str = navState.url
        if (str && flag) {
            try {
                var matchobj = str.match(/\?t=([^&]+)&/)[1];
                // const tParam = parsedUrl.searchParams.get('t');
                if (matchobj) {
                    setFlag(false);
                    makeRequest('post', 'scooter/ispaid', { transactionid: matchobj, amount: amount, email: userData.email, stars: stars })
                        // axios.post(`${baseUrl}/scooter/ispaid`, { transactionid: matchobj, amount: amount, email: userData.email, stars: stars })
                        .then((res => {
                            // axios.post('http://192.168.18.21:4000/scooter/ispaid', { transactionid: matchobj, amount: 50, useremail: userData.email }).then((res => {
                            if (res) {
                                makeRequest('post', 'scooter/checkstars', { email: userData.email })
                                    // axios.post(`${baseUrl}/scooter/checkstars`, { email: userData.email })
                                    .then((res) => {
                                        // const temp = Number(res.data);
                                        dispatch(putAmount(res?.credit));
                                        
                                        if(route?.params?.buyCoins){
                                            dispatch(putTotalAmount(res));
                                            navigation.navigate('Map');
                                            return;
                                        }
                                        navigation.navigate('Ride');
                                        // navigation.navigate('Ride', { amount: temp + amount });
                                    })

                            } else {
                                navigation.navigate('Map');
                            }
                        }))

                }
            } catch (error) {
                return
            }
        }
    };

    return (
        <>
            {url ? <WebView
                // style={styles.container}
                source={{ uri: url }}
                onNavigationStateChange={handleNavigationStateChange}
            /> :
                <BarIndicator color='#FBA51C' />
            }
        </>
    )
}
