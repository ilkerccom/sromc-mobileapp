import React, { useEffect, useState } from 'react';
import { ImageBackground, RefreshControl, Text, View, StyleSheet, ScrollView } from 'react-native'
import i18n from 'i18n-js';
import Server from '../components/blocks/Server';

export default function ServerStats({ route, navigation }) {

    const [refreshing, setRefreshing] = useState(true);
    const [servers, setServers] = useState([]);
    const [lastUpdateDate, setLastUpdateDate] = useState('');

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
    }

    useEffect(() => {
        if (servers.length > 0) {
            const utcDate = servers[0].lastUpdate.replace(' ', 'T') + "Z";
            const localDate = new Date(utcDate);
            setLastUpdateDate(localDate.toLocaleString());
        }
    }, [servers])


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
                <ScrollView refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={refresh}
                        colors={['#fff']}
                        tintColor={'#fff'}
                    />
                }>
                    <View style={styles.root}>
                        <ImageBackground style={styles.bg} source={require('../images/background.png')} resizeMode={'repeat'} resizeMethod={'scale'}>

                            {servers.length > 0 ?
                                <View style={{ marginBottom: 30 }}>
                                    <Text style={styles.localeTitleFirst}>iSRO</Text>
                                    {
                                        servers.filter((a => a.game == 'iSRO')).map((s, i) => {
                                            return (
                                                <Server key={i} name={s.serverName} capacity={s.serverCapacity} status={s.serverStatus} />
                                            )
                                        })
                                    }
                                    <Text style={styles.localeTitle}>TRSRO</Text>
                                    {
                                        servers.filter((a => a.game == 'TRSRO')).map((s, i) => {
                                            return (
                                                <Server key={i} name={s.serverName} capacity={s.serverCapacity} status={s.serverStatus} />
                                            )
                                        })
                                    }
                                    <Text style={styles.localeTitle}>kSRO</Text>
                                    {
                                        servers.filter((a => a.game == 'kSRO')).map((s, i) => {
                                            return (
                                                <Server key={i} name={s.serverName} capacity={s.serverCapacity} status={s.serverStatus} />
                                            )
                                        })
                                    }
                                    <Text style={styles.localeTitle}>C-SilkroadR</Text>
                                    {
                                        servers.filter((a => a.game == 'SilkroadR')).map((s, i) => {
                                            return (
                                                <Server key={i} name={s.serverName} capacity={s.serverCapacity} status={s.serverStatus} />
                                            )
                                        })
                                    }
                                    <Text style={styles.localeTitle}>vSRO</Text>
                                    {
                                        servers.filter((a => a.game == 'vSRO')).map((s, i) => {
                                            return (
                                                <Server key={i} name={s.serverName} capacity={s.serverCapacity} status={s.serverStatus} />
                                            )
                                        })
                                    }
                                    <View style={{ display: 'flex', alignContent: 'center', alignItems: 'center', marginBottom: 40, marginTop: 30 }}>
                                        <Text style={{ color: '#ccc', fontSize: 13 }}>{i18n.t('SonGuncelleme')}</Text>
                                        <Text style={{ color: '#fff', fontSize: 14 }}>{lastUpdateDate}</Text>
                                    </View>
                                </View>
                                : null}



                        </ImageBackground>
                    </View>
                </ScrollView>
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
        paddingTop: 30,
        paddingLeft: 20,
        paddingRight: 20
    },
    localeTitleFirst: {
        color: '#fff',
        fontSize: 19,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    localeTitle: {
        color: '#fff',
        fontSize: 19,
        fontWeight: 'bold',
        marginBottom: 5,
        marginTop: 25
    }
});