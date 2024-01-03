import React from 'react';
import { Text, View, Image, StyleSheet } from 'react-native'

export default function Player({ charName, secondaryName, level, arg1, arg2, arg3, hideCharImage = false, showFlag = false, model = 'default' }) {

    return (
        <>
            <View style={styles.main}>
                {
                    hideCharImage ? null
                        :
                        <View style={{ position:'relative' }}>
                            <Image style={{ width: 50, height: 70 }} source={{ uri: 'https://sromc.com/_chars/' + model + '.png'}} />
                            {
                                showFlag ? 
                                <Image style={{ width:24, height:24, position:'absolute', right:0, top:0 }} source={require('../../images/flag.png')}/>
                                : null
                            }
                            
                        </View>
                }
                <View style={styles.player}>
                    <Text style={styles.charName}>{charName}</Text>
                    <Text style={styles.secondary}>{secondaryName}</Text>
                    <Text style={styles.level}>Level {level}</Text>
                </View>
                <View style={{ maxWidth: 120, paddingTop: 5, paddingBottom: 5, display: 'flex', alignContent: 'center', justifyContent: 'space-between' }}>
                    <View>{arg1}</View>
                    <View>{arg2}</View>
                    <View>{arg3}</View>
                </View>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    main: {
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: '#653A25',
        padding: 10,
        borderRadius: 10,
        marginBottom: 4
    },
    player: {
        flexGrow: 1,
        paddingLeft: 10,
        display: 'flex',
        justifyContent: 'space-between',
    },
    charName: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18
    },
    secondary: {
        color: '#fff',
        fontSize: 13,
        flexGrow: 1,
        paddingTop: 2,
        paddingBottom: 2
    },
    level: {
        color: '#F77F02'
    }
});