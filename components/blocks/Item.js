import i18n from 'i18n-js';
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Image, Animated } from 'react-native'

export default function Item({ id, name, plus, count, durability, servername }) {

    // Rare animation loop
    const aniDuration = 20;
    const rareAnimationInitial = useRef(new Animated.Value(0)).current;
    Animated.loop(
        Animated.sequence([
            Animated.timing(rareAnimationInitial, {
                toValue: -32,
                useNativeDriver: true,
                duration: aniDuration,
            }),
            Animated.timing(rareAnimationInitial, {
                toValue: -64,
                useNativeDriver: true,
                duration: aniDuration
            }),
            Animated.timing(rareAnimationInitial, {
                toValue: -96,
                useNativeDriver: true,
                duration: aniDuration
            }),
            Animated.timing(rareAnimationInitial, {
                toValue: -128,
                useNativeDriver: true,
                duration: aniDuration
            }),
            Animated.timing(rareAnimationInitial, {
                toValue: -160,
                useNativeDriver: true,
                duration: aniDuration
            }),
            Animated.timing(rareAnimationInitial, {
                toValue: -192,
                useNativeDriver: true,
                duration: aniDuration
            }),
            Animated.timing(rareAnimationInitial, {
                toValue: -224,
                useNativeDriver: true,
                duration: aniDuration
            }),
            Animated.timing(rareAnimationInitial, {
                toValue: -256,
                useNativeDriver: true,
                duration: aniDuration
            }),
            Animated.timing(rareAnimationInitial, {
                toValue: -288,
                useNativeDriver: true,
                duration: aniDuration
            }),
            Animated.timing(rareAnimationInitial, {
                toValue: -320,
                useNativeDriver: true,
                duration: aniDuration
            }),
            Animated.timing(rareAnimationInitial, {
                toValue: -384,
                useNativeDriver: true,
                duration: aniDuration
            }),
            Animated.timing(rareAnimationInitial, {
                toValue: -416,
                useNativeDriver: true,
                duration: aniDuration
            }),
            Animated.timing(rareAnimationInitial, {
                toValue: -448,
                useNativeDriver: true,
                duration: aniDuration
            }),
            Animated.timing(rareAnimationInitial, {
                toValue: -480,
                useNativeDriver: true,
                duration: aniDuration
            }),
            Animated.timing(rareAnimationInitial, {
                toValue: -512,
                useNativeDriver: true,
                duration: aniDuration
            }),
            Animated.timing(rareAnimationInitial, {
                toValue: -544,
                useNativeDriver: true,
                duration: aniDuration
            }),
            Animated.timing(rareAnimationInitial, {
                toValue: -576,
                useNativeDriver: true,
                duration: aniDuration
            }),
            Animated.timing(rareAnimationInitial, {
                toValue: -608,
                useNativeDriver: true,
                duration: aniDuration
            }),
            Animated.timing(rareAnimationInitial, {
                toValue: -640,
                useNativeDriver: true,
                duration: aniDuration
            }),
            Animated.timing(rareAnimationInitial, {
                toValue: -704,
                useNativeDriver: true,
                duration: aniDuration
            }),
            Animated.timing(rareAnimationInitial, {
                toValue: -736,
                useNativeDriver: true,
                duration: aniDuration
            }),
            Animated.timing(rareAnimationInitial, {
                toValue: -768,
                useNativeDriver: true,
                duration: aniDuration
            }),
            Animated.timing(rareAnimationInitial, {
                toValue: -800,
                useNativeDriver: true,
                duration: aniDuration
            }),
            Animated.timing(rareAnimationInitial, {
                toValue: -832,
                useNativeDriver: true,
                duration: aniDuration
            }),
            Animated.timing(rareAnimationInitial, {
                toValue: -864,
                useNativeDriver: true,
                duration: aniDuration
            }),
            Animated.timing(rareAnimationInitial, {
                toValue: -896,
                useNativeDriver: true,
                duration: aniDuration
            }),
            Animated.timing(rareAnimationInitial, {
                toValue: -923,
                useNativeDriver: true,
                duration: aniDuration
            }),
            Animated.timing(rareAnimationInitial, {
                toValue: -960,
                useNativeDriver: true,
                duration: aniDuration
            }),
            Animated.timing(rareAnimationInitial, {
                toValue: -1024,
                useNativeDriver: true,
                duration: aniDuration
            })
        ]),
        {
            iterations: 4
        }
    ).start()

    function isRare(item) {
        if (item == undefined || item == null) {
            return false;
        }
        else if (item.indexOf('_RARE') > 0) {
            return true;
        }

        return false;
    }

    if (name == '') {
        return (
            <>
                <View style={styles.main}>
                    <View style={styles.right}>
                        <View style={styles.top}>
                            <Text style={styles.itemCount}>{i18n.t('BosSlot')}</Text>
                        </View>
                    </View>
                </View>
            </>
        )
    }

    return (
        <>
            <View style={styles.main}>
                <View style={styles.left}>
                    <View style={{ width: 32, height: 32, position: 'relative', overflow: 'hidden' }}>
                        <Image style={{ width: 32, height: 32, position: 'absolute', left: 0, top: 0 }} source={{ uri: 'https://api.sromc.com/charinfo/itemimage?S=' + servername }} />
                        {
                            isRare(servername) ?
                                <Animated.Image style={{ width: 1024, height: 32, position: 'absolute', left: 0, top: 0, transform: [{ translateX: rareAnimationInitial }] }} source={require('../../images/seal.png')} />
                                :
                                null
                        }
                    </View>
                </View>
                <View style={styles.right}>
                    <View style={styles.top}>
                        <Text style={isRare(servername) ? styles.itemNameRare : styles.itemName}>
                            {name}
                        </Text>
                        {
                            plus > 0 ?
                                <Text style={styles.plus}>(+{plus})</Text>
                                : null
                        }
                        {
                            isRare(servername) ?
                                <Text style={styles.rare}>Rare</Text>
                                : null
                        }
                    </View>
                    <View style={styles.bottom}>
                        <Text style={styles.itemCount}>
                            x{count}
                            {durability != 0 ? ' (D' + durability + ')' : null}
                        </Text>
                    </View>
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
        padding: 15,
        borderRadius: 10,
        marginBottom: 4
    },
    left: {
        marginRight: 15,
    },
    right: {
        flex: 1,
    },
    top: {
        display: 'flex',
        flexDirection: 'row',
        flex: 1,
    },
    itemName: {
        color: '#fff',
        fontSize: 14
    },
    itemNameRare: {
        color: 'yellow',
        fontSize: 14
    },
    plus: {
        paddingLeft: 5,
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold'
    },
    itemCount: {
        color: '#BE8B56'
    },
    rare: {
        flexGrow: 1,
        textAlign: 'right',
        color: 'yellow'
    }
});