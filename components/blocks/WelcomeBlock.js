import React from 'react';
import { View, Text, StyleSheet, ImageBackground, Image } from 'react-native'
import ButtonOrange from '../ButtonOrange';

export default function WelcomeBlock({ title, desc, image, imageBg, buttonText, page, nextPage }) {
    return (
        <View style={styles.mainView}>
            <Image style={styles.banner} resizeMode={'cover'} resizeMethod={'scale'} source={image} />
            <View style={{ flex: 1 }}>
                <ImageBackground style={styles.imageBackground} resizeMethod='scale' source={imageBg}>
                    <View style={styles.centerArea}>
                        <View style={styles.titleHolder}>
                            <Text style={styles.title}>{title}</Text>
                            <Text style={styles.desc}>{desc}</Text>
                        </View>
                    </View>
                    {
                        page != 2
                            ? <ButtonOrange onPress={() => nextPage(page + 1)} title={buttonText} />
                            : <ButtonOrange onPress={() => nextPage(page)} title={buttonText} />
                    }
                </ImageBackground>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    mainView: {
        height: '100%',
        minHeight: '100%',
        maxHeight: '100%',
        flex: 1
    },
    banner: {
        width: '100%',
        minWidth: '100%',
        maxWidth: '100%',
        height: '35%',

    },
    imageBackground: {
        flex: 1,
    },
    centerArea: {
        flexGrow: 1,
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center',
        padding: 25
    },
    titleHolder: {

    },
    title: {
        fontSize: 27,
        textAlign: 'center',
        color: 'white',
        fontWeight: 'bold',
        marginBottom: 10
    },
    desc: {
        fontSize: 19,
        textAlign: 'center',
        color: '#B7B7B7'
    }
});