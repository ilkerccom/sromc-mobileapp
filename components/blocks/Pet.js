import i18n from 'i18n-js';
import React from 'react';
import { Text, View, StyleSheet, Image } from 'react-native'
import Percentage from '../Percentage';

export default function Pet({ name, isActive, type, hp, servername }) {

    function imageUrl(servername){
        if(servername.indexOf('PET2') > 0){
            return servername;
        }

        return "ITEM_" + servername + "_SCROLL";
    }

    return (
        <>
            <View style={styles.main}>
                <View>
                    <Image style={{ width: 50, height: 50 }} source={{ uri: 'https://api.sromc.com/charinfo/itemimage?S=' + imageUrl(servername) }} />
                </View>
                <View style={styles.pet}>
                    <Text style={styles.petName}>{name}</Text>
                    {
                        isActive ?
                            <Text style={styles.active}>{i18n.t('Aktif')}</Text>
                            :
                            <Text style={styles.passive}>{i18n.t('Pasif')}</Text>
                    }
                    <Text style={styles.type}>
                        {
                            type == 'pick' ? i18n.t('ToplayiciPet') : null
                        }
                        {
                            type == 'fellow' ? 'Fellow Pet' : null
                        }
                        {
                            type == 'wolf' ? i18n.t('SaldiriPeti') : null
                        }
                    </Text>
                </View>
                {
                    type == 'wolf' || type == 'fellow' ?
                        <View style={{ width: 100 }}>
                            <Text style={{ textAlign: 'right', fontSize: 12, color: '#A57056', marginBottom: 10 }}>HP: {hp}</Text>
                            <Percentage perc={100} color={'#D34A4A'} />
                        </View>
                        : null
                }
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
        borderRadius: 5,
        marginBottom: 4
    },
    pet: {
        flexGrow: 1,
        paddingLeft: 10
    },
    petName: {
        color: '#fff',
        fontWeight: 'bold',
        marginBottom: 4
    },
    active: {
        color: '#3ABA13'
    },
    passive: {
        color: '#D34A4A'
    },
    type: {
        color: '#F77F02',
        marginTop: 10
    }
});