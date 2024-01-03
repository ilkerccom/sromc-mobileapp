import i18n from 'i18n-js';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'


export default function Message({ from, message, date, type, toUser }) {
    return (
        <>
            <TouchableOpacity onPress={() => toUser(from)} activeOpacity={0.8} style={styles.main}>
                {
                    type != 'notice' ?
                        <View style={styles.mainTop}>
                            <Text style={type == 'pm' ? styles.fromPM : styles.from}>
                                {from}
                            </Text>
                            {MessageType(type)}
                            <Text style={styles.date}>{date}</Text>
                        </View>
                        : null
                }
                <View style={styles.mainBottom}>
                    <Text style={type == 'private' ? styles.messagePM : type == 'notice' ? styles.messageNotice : styles.message}>{message}</Text>
                </View>
            </TouchableOpacity>
        </>
    )
}

function MessageType(type) {
    if (type == 'global') {
        return (
            <Text style={{ color: '#FCF315', paddingLeft: 4 }}>Global</Text>
        )
    }
    else if (type == 'party') {
        return (
            <Text style={{ color: '#8EBEFF', paddingLeft: 4 }}>{i18n.t('Parti')}</Text>
        )
    }
    else if (type == 'guild') {
        return (
            <Text style={{ color: '#F77F02', paddingLeft: 4 }}>Guild</Text>
        )
    }
    else if (type == 'union') {
        return (
            <Text style={{ color: '#9BD38A', paddingLeft: 4 }}>Union</Text>
        )
    }
    else if (type == 'pm') {
        return (
            <Text style={{ color: '#69DCFF', paddingLeft: 4 }}>PM</Text>
        )
    }
    else if (type == 'academy') {
        return (
            <Text style={{ color: '#69DCFF', paddingLeft: 4 }}>{i18n.t('Akademi')}</Text>
        )
    }
    else if (type == 'stall') {
        return (
            <Text style={{ color: '#69DCFF', paddingLeft: 4 }}>{i18n.t('Tezgah')}</Text>
        )
    }
}

const styles = StyleSheet.create({
    main: {
        display: 'flex',
        padding: 15,
        borderBottomColor: '#A57056',
        borderBottomWidth: 1
    },
    mainTop: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    from: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 4
    },
    fromPM: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#69DCFF',
        marginBottom: 4
    },
    message: {
        color: '#ccc'
    },
    messagePM: {
        color: '#69DCFF',
        fontWeight: 'bold'
    },
    messageNotice: {
        color: '#A57056',
        textAlign: 'center'
    },
    date: {
        flexGrow: 1,
        textAlign: 'right',
        color: '#B7B7B7',
        fontSize: 12
    }
});