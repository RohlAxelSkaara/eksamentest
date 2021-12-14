//Importerer ulike dependencies
import React, {useEffect, useState} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Text, View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {createStackNavigator} from "@react-navigation/stack";
import Ionicons from 'react-native-vector-icons/Ionicons';
import FilterScreen2 from "./screens/FilterScreen";
import BarDetailsScreen from "./screens/BarDetailsScreen";
import BarList from "./components/BarList";
import firebase from "firebase";
import { Card } from 'react-native-paper';
import SignUpForm from "./components/SignUpForm";
import LoginForm from "./components/LoginForm";
import All from "./screens/MapScreen";
import { useFonts, SquadaOne_400Regular } from '@expo-google-fonts/squada-one';


//Oppretter insanser av tab og stack navigator
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();




/*Oprettelse af root komponent
* Her oprettes først en Navigationscontainer-komponent, der står for at håndtere state-ændringer & deep linking
* Ydeligere info om denne komponent kan findes i følgende link: https://reactnavigation.org/docs/navigation-container/
*
* Dernæst kaldes Navigator, der styrer navigationen mellem de forskellige tabs.
* I Tab navigatoren kalder en funktion i screenOptions, der har til formål at bestemme den aktuelle rute.
* Pba. af ruten styles den pågældende tab ved at benytte de importerede ikoner og den fastsatte styling, som ,
*  er fastsat  i tabBaroptions.
*
* Afslutningsvis angives de screen komponenter, vi ønsker at fremvise for hver tab. Komponenterne har vi importeret fra vores
* componentsfolder. Hver komponent fremvises ved brug af en funktion, der returnerer de komponenter vi har defineret til vores tabNavigator
* Hver komponent indeholder en reference til den tekst, som skal præsenteres i komponenten. Dertil er der skabt en nested Stacknavigator, som placeres i vores "details" tab.
*
* */
 function App() {

     let [fontsLoaded, error] = useFonts({
         SquadaOne_400Regular,
     });
     //Setter våres database detaljer til en variabel, slik at denne kan brukes senere til kommunikasjon med databasen
     const firebaseConfig = {
         apiKey: "AIzaSyDWWv1ekhS7nqgu8nV_DgopqwfzL3ux5dU",
         authDomain: "niteout-b525d.firebaseapp.com",
         databaseURL: "https://niteout-b525d-default-rtdb.europe-west1.firebasedatabase.app",
         projectId: "niteout-b525d",
         storageBucket: "niteout-b525d.appspot.com",
         messagingSenderId: "557483758072",
         appId: "1:557483758072:web:6c382adbc0a85b4fc3060d"
     };


     //Kun en en én Firebase initasjon brukes til appen
     if (!firebase.apps.length) {
         //Ininitasjerer våres database ved bruk av firebaseConfig variabelen vi lagret tidligere
         firebase.initializeApp(firebaseConfig);
     }


     //State variabel for brukeren
     const [user, setUser] = useState({loggedIn: false});


//onAuthStateChange, predefinert funksjon fra Firebase, denne observerer om brukeren er logget inn eller ikke,
     function onAuthStateChange(callback) {
         return firebase.auth().onAuthStateChanged(user => {
             if (user) {
                 //Hvis brukeren er logged inn settes state variabelen til brukere ssom ble laget tidligere til true
                 callback({loggedIn: true, user: user});
             } else {
                 //Hvis brukeren ikke er logget inn settes denne til false
                 callback({loggedIn: false});
             }
         });
     }


     //UseEffecten sjekker om brukeren er aktiv
     useEffect(() => {
         const unsubscribe = onAuthStateChange(setUser);
         return () => {
             unsubscribe();
         };
     }, []);



//Guest page, hit sendes brukeren om ingen bruker er logget inn
//Henter ut komponentene for SignUpForm og LoginForm
     const GuestPage = () => {

         return (
             <View style={styles.container}>
                 <Text style={styles.paragraph}>
                     Opret eller Login med din firebase Email
                 </Text>

                 <Card style={{padding: 20}}>
                     <SignUpForm/>
                 </Card>

                 <Card style={{padding: 20}}>
                     <LoginForm/>
                 </Card>

             </View>
         )
     }

     const MainPage = () => {

         //handleLogout håndterer log ud af en aktiv bruger.
         //Metoden er en prædefineret metode, som firebase stiller tilrådighed
         //Metoden er et asynkrontkald.

         const BarNavigation = () => {
             return (
                 <Stack.Navigator>
                     <Stack.Screen name={'Locations'} component={BarList}
                                   options={{
                                       headerStyle: {
                                           backgroundColor: '#2a2727',
                                       },

                                        headerTintColor: '#fff',
                                         headerTitleStyle: {

                                           fontFamily: 'SquadaOne_400Regular',
                                           fontSize: 40,

                                       },
                                   }}
                     />
                     <Stack.Screen name={'Bar Details'} component={BarDetailsScreen}
                         options={{

                         headerStyle: {
                             backgroundColor: '#2a2727',
                         },

                         headerTintColor: '#fff',
                         headerTitleStyle: {

                             fontFamily: 'SquadaOne_400Regular',
                             fontSize: 40,
                             color: '#2a2727'

                         },
                     }}
                     />
                 </Stack.Navigator>
             )
         }


         return (
             <NavigationContainer>
                 <Tab.Navigator  screenOptions={({route}) => ({
                     tabBarIcon: ({color, size}) => {
                         if (route.name === 'Social') {
                             return (
                                 <Ionicons
                                     name={"person-circle-outline"}
                                     size={size}
                                     color={color}
                                 />
                             );
                         } else if (route.name === 'Locations') {
                             return (
                                 <Ionicons
                                     name='list-outline'
                                     size={size}
                                     color={color}
                                 />
                             );
                         } else if (route.name === 'Maps') {
                             return (
                                 <Ionicons
                                     name="location-outline"
                                     size={size}
                                     color={color}
                                 />
                             );
                         } else {
                             return (
                                 <Ionicons
                                     name="options-outline"
                                     size={size}
                                     color={color}
                                 />
                             );
                         }
                     },
                 })}
                 tabBarOptions={{
                     activeTintColor: 'white',
                     inactiveTintColor: 'white',
                     activeBackgroundColor: '#232121',
                     inactiveBackgroundColor: '#2a2727',
                     style: {
                         backgroundColor: 'transparent',
                         borderTopWidth: 0,
                         position: 'absolute',
                         left: 0,
                         right: 0,
                         bottom:0,
                         height: 60
                     }

                 }}
                 >

                     <Tab.Screen name={'Locations'} component={BarNavigation} options={{
                         tabBarIcon: () => (<Ionicons name='md-list-outline' color={'white'} size={20}/>),
                         headerShown: null}}/>
                     <Tab.Screen name="Maps" children={() => <All/>}/>
                     <Tab.Screen name="Filter" component={FilterScreen2}/>
                 </Tab.Navigator>
             </NavigationContainer>
         );
     }

     //Her sjekker vi user staten om brukeren er logget in eller ej, og sender til respektive side, Main hvis logget ind, Guset hvis ikke
     return user.loggedIn ? <MainPage/> : <GuestPage/>;



 }
export default App


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingTop: '5%',
        backgroundColor: 'transparent',
        padding: 20,
    },
    paragraph: {
        margin: 24,
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    navigationStyle:{
        borderColor: 'white'
    }

});
