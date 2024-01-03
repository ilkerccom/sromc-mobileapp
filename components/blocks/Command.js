import i18n from 'i18n-js';
import React from 'react';
import { Text, View, StyleSheet } from 'react-native'

export default function Command({ name, date, completed }) {
    return (
        <>
            <View style={styles.main}>
                <View style={{ display: 'flex', flexGrow: 1 }}>
                    <Text style={styles.name}>
                        {getName(name)}
                    </Text>
                    <Text style={styles.date}>{date}</Text>
                </View>
                {
                    completed ?
                        <Text style={{ color: '#3ABA13' }}>{i18n.t('Tamamlandi')}</Text>
                        :
                        <Text style={{ color: 'yellow' }}>{i18n.t('Bekliyor')}...</Text>
                }

            </View>
        </>
    )
}

function getName(name) {
    if (name == 'start_bot') {
        return i18n.t('BotuBaslat');
    }
    else if (name == 'stop_bot') {
        return i18n.t('BotuDurdur');
    }
    else if (name == 'set_training_radius') {
        return i18n.t('KasilmaAlaniBuyuklugu');
    }
    else if (name == 'set_training_position') {
        return i18n.t('KasilmaAlanPozisyonu');
    }
    else if (name == 'start_trace') {
        return i18n.t('OyuncuyuTakipEt');
    }
    else if (name == 'stop_trace') {
        return i18n.t('OyuncuTakibiniBirak');
    }
    else if (name == 'move_to') {
        return i18n.t('HareketEt');
    }
    else if (name == 'reverse_return') {
        return i18n.t('ReverseKulan');
    }
    else if (name == 'disconnect') {
        return i18n.t('OyunBaglantisiniKes');
    }
    else {
        return '-';
    }

}

const styles = StyleSheet.create({
    main: {
        display: 'flex',
        flexDirection: 'row',
        marginBottom: 15
    },
    name: {
        color: '#F77F02',
        marginBottom: 3
    },
    date: {
        color: '#A57056'
    }
});