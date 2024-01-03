import React, { useEffect, useState } from 'react';
import { StatusBar, StyleSheet, Text, View, ImageBackground, ActivityIndicator, Image, TouchableOpacity, Settings } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage'
import Welcome from './pages/Welcome';
import CreateAccount from './pages/CreateAccount';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './pages/Home';
import Character from './pages/Character';
import Prefences from './pages/Prefences';
import AddCharacter from './pages/AddCharacter';
import I18n from './src/lang/_i18n';
import ServerStats from './pages/ServerStats';
import Corpus from './pages/Corpus';
import AlchemyGame from './pages/AlchemyGame';


const navTheme = DefaultTheme;
navTheme.colors.background = '#321507';
const Stack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();

function App() {

  // States
  const [firstStart, setfirstStart] = useState(false);
  const [userActive, setUserActive] = useState(false);
  const [allLoad, setAllLoad] = useState(false);
  const [activeLang, setActiveLang] = useState('en');

  // App loaded
  useEffect(() => {
    async function checkStorage() {
      const selectedLang = await AsyncStorage.getItem('selectedLang');
      const FirstStart = await AsyncStorage.getItem('isFirstStart');
      const AccessToken = await AsyncStorage.getItem('accessToken');

      // Language
      if (selectedLang != null) {
        I18n.locale = selectedLang;
      }

      // Check is first
      if (FirstStart != null) {
        setfirstStart(true);
      }

      // Check access token
      if (AccessToken != null) {
        setUserActive(true);
      }

      // Selected language
      setAllLoad(true);

      // Remove for testing
      //const _r1 = await AsyncStorage.removeItem('isFirstStart')
      //const _r2 = await AsyncStorage.removeItem('accessToken')
      //const _r3 = await AsyncStorage.removeItem('selectedLang')
    }

    /*setInterval(() => {
      setActiveLang(I18n.locale)
    }, 1000);*/

    checkStorage();

  }, []);

  // Finish welcome
  function finishWelcome() {
    AsyncStorage.setItem("isFirstStart", 'true', (err, result) => { });
    setfirstStart(true);
  }

  // Finish account
  function finishAccount() {
    setUserActive(true);
  }

  // Loading
  if (!allLoad) {
    return (
      <>
        <StatusBar barStyle='light-content' />
        <View style={styles.root2}>
          <ImageBackground style={styles.bg} source={require('./images/background.png')} resizeMode={'repeat'} resizeMethod={'scale'}>
            <View style={{ flex: 1, alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
              <ActivityIndicator color={'#fff'} size={'large'} />
            </View>
          </ImageBackground>
        </View>
      </>
    )
  }

  // Welcome page on first start
  if (!firstStart) {
    return (
      <>
        <StatusBar barStyle='light-content' />
        <Welcome finishWelcome={finishWelcome} />
      </>
    )
  }

  // Create account if doesnt exists on first start
  if (!userActive && firstStart) {
    return (
      <>
        <StatusBar barStyle='light-content' />
        <View style={styles.root2}>
          <ImageBackground style={styles.bg} source={require('./images/background.png')} resizeMode={'repeat'} resizeMethod={'scale'}>
            <CreateAccount finishAccount={finishAccount} />
          </ImageBackground>
        </View>
      </>
    )
  }

  return (
    <>
      <StatusBar barStyle='light-content' />
      <NavigationContainer theme={navTheme}
        onStateChange={() => setActiveLang(I18n.currentLocale())}
      >
        <Tabs.Navigator
          screenProps={{ activeLang }}
          screenOptions={({ route }) => ({
            tabBarActiveTintColor: '#FFF',
            tabBarInactiveTintColor: '#999',
            tabBarShowLabel: true,
            tabBarStyle: {
              backgroundColor: '#190a03',
              border: 0,
              shadowColor: 'red',
              borderTopWidth: 1,
              borderTopColor: '#000',
              elevation: 0,
              shadowOffset: {
                width: 0, height: 0
              }
            },
            tabBarLabelStyle: {
              fontSize: 11,
              paddingBottom: 2
            },
            tabBarIconStyle: {
              marginTop: 2,
            },
            tabBarItemStyle: {
              borderTopColor: '#190a03',
              borderTopWidth: 1,
              borderLeftColor: '#301407',
              borderLeftWidth: 1,
            }
          })}
        >
          <Tabs.Screen initialParams={activeLang} name="Root" options={{ title: I18n.t('Tab1'), headerShown: false,  tabBarIcon: ({ color, size, focused }) => <Image style={{ width: 28, height: 28 }} width={28} height={28} source={focused ? require('./images/tab1.png') : require('./images/tab1p.png')} /> }} component={RootNav} />
          <Tabs.Screen initialParams={activeLang} name="ServerStats" options={{ title: I18n.t('Tab2'), headerShown: false, tabBarIcon: ({ color, size, focused }) => <Image style={{ width: 28, height: 28 }} width={28} height={28} source={focused ? require('./images/tab2.png') : require('./images/tab2p.png')} /> }} component={ServerStatsNav} />
          <Tabs.Screen initialParams={activeLang} name="Guide" options={{ title: I18n.t('Tab3'), headerShown: false, tabBarIcon: ({ color, size, focused }) => <Image style={{ width: 28, height: 28 }} width={28} height={28} source={focused ? require('./images/tab3.png') : require('./images/tab3p.png')} /> }} component={GuideNav} />
          <Tabs.Screen initialParams={activeLang} name="AlchemyGame" options={{ title: I18n.t('Tab4'), headerShown: false, tabBarIcon: ({ color, size, focused }) => <Image style={{ width: 28, height: 28 }} width={28} height={28} source={focused ? require('./images/tab3.png') : require('./images/tab3p.png')} /> }} component={AlchemyNav} />
          
        </Tabs.Navigator>
      </NavigationContainer>
    </>
  )
};

function AlchemyNav() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#653A25',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        }
      }}>
      <Stack.Screen name="GuidePage" options={({ navigation }) => ({
        title: I18n.t('SimyaOyunu'),
        headerLeft: () => (
          <Image style={{ width: 30, height: 30, marginRight: 15 }} resizeMethod={'scale'} resizeMode={'stretch'} source={require('./images/logo.png')} />
        )
      })}>
        {props => <AlchemyGame {...props} />}
      </Stack.Screen>

    </Stack.Navigator>
  )
}

function GuideNav() {
  return (
    <Stack.Navigator screenOptions={{
      headerStyle: {
        backgroundColor: '#653A25',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      }
    }}>

      <Stack.Screen name="GuidePage" options={({ navigation }) => ({
        title: I18n.t('CanavarKulliyati'),
        headerLeft: () => (
          <Image style={{ width: 30, height: 30, marginRight: 15 }} resizeMethod={'scale'} resizeMode={'stretch'} source={require('./images/logo.png')} />
        )
      })} >
        {props => <Corpus {...props} />}
      </Stack.Screen>

    </Stack.Navigator>
  )
}

function ServerStatsNav() {
  return (
    <Stack.Navigator screenOptions={{
      headerStyle: {
        backgroundColor: '#653A25',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      }
    }}>

      <Stack.Screen name="ServerStatsPage" options={({ navigation }) => ({
        title: I18n.t('SunucuDurumu'),
        headerLeft: () => (
          <Image style={{ width: 30, height: 30, marginRight: 15 }} resizeMethod={'scale'} resizeMode={'stretch'} source={require('./images/logo.png')} />
        )
      })}>
        {props => <ServerStats {...props} />}
      </Stack.Screen>

    </Stack.Navigator>
  )
}

function RootNav() {
  return (
    <Stack.Navigator screenOptions={{
      headerStyle: {
        backgroundColor: '#653A25',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      }
    }}>
      <Stack.Group>
        <Stack.Screen name="Chars" options={({ navigation }) => ({
          title: I18n.t('Karakterlerim'),
          headerLeft: () => (
            <Image style={{ width: 30, height: 30, marginRight: 15 }} resizeMethod={'scale'} resizeMode={'stretch'} source={require('./images/logo.png')} />
          ),
          headerRight: () => (
            <TouchableOpacity onPress={() => navigation.navigate('Settings')} style={{ width: 30, height: 30, borderRadius: 100, alignContent: 'center', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F77F02' }}>
              <Image style={{ width: 22, height: 22 }} source={require('./images/settings.png')}></Image>
            </TouchableOpacity>
          ),
        })} component={Home} />

        <Stack.Screen name="Character" options={({ route }) => ({
          title: route.params.name,
        })} component={Character} />

        <Stack.Screen name="AddCharacter" options={({ navigation }) => ({
          title: I18n.t('KarakterEkle'),
        })} component={AddCharacter} />

        <Stack.Screen name="Settings" options={({ navigation }) => ({
          title: I18n.t('Ayarlar'),
        })} component={Prefences} />

      </Stack.Group>

    </Stack.Navigator>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#321507',
    borderTopWidth: 2,
    borderTopColor: '#F77F02'
  },
  root2: {
    flex: 1,
    backgroundColor: '#321507',
  },
  bg: {
    flex: 1
  }
});

export default App;
