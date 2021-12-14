
import * as React from 'react';
import {
    View,
    Text,
    Platform,
    FlatList,
    StyleSheet,
    Button,
    Alert,
    SafeAreaView,
    Dimensions,
    ScrollView,
    TouchableOpacity
} from 'react-native';
import {useEffect, useState} from "react";
import MapView, { Marker,PROVIDER_GOOGLE } from 'react-native-maps';
import firebase from 'firebase';
import Constants from "expo-constants";
import * as Location from "expo-location";
import {Accuracy} from "expo-location";
import darkStyle from "../styles/darkStyle";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import getDirections from 'react-native-google-maps-directions'



const BarDetailsScreen = ({route,navigation}) => {

    const [hasLocationPermission, setlocationPermission] = useState(false)
    const [currentLocation, setCurrentLocation] = useState(null)
    const windowHeight = Dimensions.get('window').height;


    const updateLocation = async () => {
        await Location.getCurrentPositionAsync({accuracy: Accuracy.BestForNavigation}).then((item)=>{
            setCurrentLocation(item.coords)

        } );
    };

    useEffect (() => {
        updateLocation()
    },[]);


    const [bar,setBar] = useState({});

    useEffect(() => {
        /*Henter car values og sætter dem*/
        setBar(route.params.bar[1]);


        /*Når vi forlader screen, tøm object*/
        return () => {
            setBar({})
        }
    });

    const [friends,setFriends] = useState()
    const [num,setNum] = useState()

    useEffect(() => {
        if(!friends) {
            firebase
                .database()
                .ref(`/users/${firebase.auth().currentUser.uid}/friends`)
                .on('value', snapshot => {

                    setFriends(Object.values(snapshot.val()))
                    setNum(Object.values(snapshot.val()).length)

                });
        }
    },[]);








    let values = []
    for(let i = 0; i < num; i++){

        firebase
            .database()
            .ref(`/users/${friends[i]}`)
            .on('value', snapshot => {

                if(snapshot.val().location == bar.name){
                   values.push(snapshot.val().firstname +', ')
                }


            });
    }


















    const iAmHere = async () => {

        await
            firebase.database().ref(`/users/${firebase.auth().currentUser.uid}`).update(
                {location: bar.name}
            )
    }



    //for(let i = 0; i < friends )///



    let ratingDollar = '$'.repeat(bar.price)


    if (!bar) {
        return <Text>No data</Text>;
    }


//https://www.youtube.com/watch?v=nErdlbLWqtA&ab_channel=ProgrammingWithPrem
    //all content
    return (


                    <View style={styles.barDetails}>
                        <ScrollView>

                        <Text style={styles.barStyle}>{bar.name}</Text>
                            <View style={styles.line}>
                        <Text style={styles.barInfo}>{bar.address}</Text>
                        <Text style={styles.barInfo}>{'$'.repeat(bar.price)}</Text>
                        <Text style={styles.barInfo}>Rating: {bar.rating}</Text>
                        <Text style={styles.barInfo}>Friends here:</Text>
                        <Text style={styles.barInfo}>{values}</Text>

                         <TouchableOpacity style={styles.button} onPress={() => iAmHere()} >
                                    <Text style={styles.barText}>
                                        I am here!
                                    </Text>
                         </TouchableOpacity>


                            </View>
                        <MapView
                            region={{
                                latitude: bar.latitude,
                                longitude: bar.longitude,
                                latitudeDelta: 0.001,
                                longitudeDelta: 0.001
                            }}
                            minZoomeLevel={1}
                            maxZoomLevel = {20}
                            style={{ flex: 1, minHeight:200}}
                            customMapStyle={darkStyle}
                            provider={PROVIDER_GOOGLE}
                            showsUserLocation

                        >
                            <Marker coordinate={{ latitude: bar.latitude, longitude: bar.longitude}} pinColor={'#c11c57'} />

                        </MapView>
                        <Text style={styles.description}>{bar.description}</Text>
                        </ScrollView>
                    </View>




    );
}

export default BarDetailsScreen;

const styles = StyleSheet.create({

    container: { flex: 1, justifyContent: 'flex-start' },
    row: {
        margin: 5,
        padding: 5,
        flexDirection: 'row',
    },
    label: { width: 100, fontWeight: 'bold' },
    value: { flex: 1 },

    barDetails:{
        flex: 1,
        borderRadius:0,
        padding: 0,
        height: 0,
        justifyContent:'center',
        backgroundColor:'#2a2727',
        borderColor:'white',
        marginBottom: 60
    },
    barStyle:{
        color: 'white',
        fontFamily:'SquadaOne_400Regular',
        fontSize: 40,
        alignSelf: 'center',

    },
    barText:{
        color: 'white',
        fontFamily:'SquadaOne_400Regular',
        fontSize: 30,
        alignSelf: 'center',

    },
    button: {
        flex: 0.1,
        borderWidth: 1,
        borderRadius: 0,
        margin: 10,
        padding: 10,
        height: 50,
        justifyContent: 'center',
        backgroundColor: '#c11c57',
        borderColor: 'white'
    },
    barInfo:{
        color: 'white',
        fontFamily:'SquadaOne_400Regular',
        fontSize: 25,
        alignSelf: 'center',
    },
    line: {
        paddingTop:20,
        paddingBottom:20,
        marginTop: 10,
        marginBottom: 20,
        borderBottomColor: 'white',
        borderBottomWidth: 1,
        borderTopColor: 'white',
        borderTopWidth: 1,
    },
    description:{
        marginTop: 20,
        color: 'white',
        fontFamily:'SquadaOne_400Regular',
        fontSize: 25,
        alignSelf: 'center',
    }

});
