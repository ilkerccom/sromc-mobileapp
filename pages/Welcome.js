import React, { useRef, useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import WelcomeBlock from '../components/blocks/WelcomeBlock';
import i18n from 'i18n-js';

export default function Welcome({ finishWelcome }) {


    const [activePage, setActivePage] = useState(1);

    // View ref
    const viewRef = useRef(null);

    // Next page
    function nextPage(page) {
        const c = activePage + 1;
        setActivePage(c)
    }

    return (
            <View style={styles.container}>
                {
                    activePage == 1 ?

                        <WelcomeBlock
                            title={i18n.t('W1baslik')}
                            desc={i18n.t('W1aciklama')}
                            image={require('../images/banner.png')}
                            imageBg={require('../images/game1.png')}
                            buttonText={i18n.t('DevamEt')}
                            page={0}
                            nextPage={nextPage}
                        />
                        : null
                }

                {
                    activePage == 2 ?

                        <WelcomeBlock
                            title={i18n.t('W2baslik')}
                            desc={i18n.t('W2aciklama')}
                            image={require('../images/banner.png')}
                            imageBg={require('../images/game2.png')}
                            buttonText={i18n.t('DevamEt')}
                            page={1}
                            nextPage={nextPage}
                        />
                        : null
                }

                {
                    activePage == 3 ?
                        <WelcomeBlock
                            title={i18n.t('W3baslik')}
                            desc={i18n.t('W3aciklama')}
                            image={require('../images/banner.png')}
                            imageBg={require('../images/game3.png')}
                            buttonText={i18n.t('Bitir')}
                            page={2}
                            nextPage={finishWelcome}
                        />
                        : null
                }

            </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: '100%',
        flexDirection: 'column',
        alignContent: 'center',
        alignItems: 'center',
        backgroundColor: '#321507'
    }
});