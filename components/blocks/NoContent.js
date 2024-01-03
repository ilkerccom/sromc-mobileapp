import React from 'react';
import { Text, View, StyleSheet, Image } from 'react-native'

export default function NoContent({title, desc}){
    return(
        <>
            <View style={styles.main}>
                <View style={styles.iconHolder}><Image style={styles.icon} source={require('../../images/nocontent.png')} /></View>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.desc}>{desc}</Text>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    main: {
        alignContent:'center',
        justifyContent:'center',
        marginTop:30,
        marginBottom:30,
        paddingBottom:15,
        borderRadius:10
    },
    iconHolder: {
        textAlign:'center',
        alignContent:'center',
        alignItems:'center',
        justifyContent:'center',
        marginTop:15,
        marginBottom:15
    },
    icon: {
        width:80,
        height:80
    },
    title: {
        color:'#fff',
        fontWeight:'bold',
        textAlign:'center',
        fontSize:19
    },
    desc: {
        color:'#A57056',
        textAlign:'center',
        fontSize:15,
        marginTop:10
    }
});
