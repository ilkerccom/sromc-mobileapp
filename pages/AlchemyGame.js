import React, { useEffect, useState } from 'react';
import { ImageBackground, RefreshControl, Text, View, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native'
import { WebView } from 'react-native-webview';

export default function AlchemyGame({ route, navigation }) {

    const [refreshing, setRefreshing] = useState(false);
    const [servers, setServers] = useState([]);
    const [dataReceived, setDataReceived] = useState(false);

    async function getServers() {
        setRefreshing(true);
        await fetch('https://api.sromc.com/serverstatus/get',
            {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            .then((res) => res.json())
            .then((res) => {
                setServers(res);
            }).catch(() => {
            });
        setRefreshing(false);
        setDataReceived(true);
    }

    useEffect(() => {
        getServers();
    }, []);

    function refresh() {
        getServers();
    }

    return (
        <>
            <View style={styles.border}></View>
            <View style={{ flex: 1 }}>
                <WebView
                style={{ backgroundColor:'#321507' }}
                    applicationNameForUserAgent={'SROMC/1.0.0'}
                    contentMode={'mobile'}
                    scrollEnabled={false}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    source={{
                        uri: 'https://jellybitz.github.io/xSROMap/',
                        headers: {
                            'secret': 'my-custom-header-value',
                            'lang': 'tr'
                        }
                    }} />
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    border: {
        width: '100%',
        height: 1,
        backgroundColor: '#F77F02'
    },
    root: {
        flex: 1,
        minHeight: '100%',
    },
    bg: {
        flex: 1,
        padding: 30
    },
    localeTitle: {
        color: '#fff',
        fontSize: 19,
        fontWeight: 'bold',
        marginBottom: 5,
        marginTop: 25
    }
});