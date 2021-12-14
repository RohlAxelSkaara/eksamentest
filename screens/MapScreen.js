import React,{useState,useEffect} from 'react';
import {StyleSheet, Text, View, Dimensions, Button, SafeAreaView, TouchableOpacity} from 'react-native';
import MapView, {Callout, Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import { useFonts, SquadaOne_400Regular } from '@expo-google-fonts/squada-one';
import firebase from 'firebase';
import Constants from "expo-constants";
import * as Location from "expo-location";
import {Accuracy} from "expo-location";
import {createStackNavigator} from "@react-navigation/stack";
import { useNavigation } from '@react-navigation/native';
import darkStyle from "../styles/darkStyle";



//Function for the map
const All = ({navigation}) =>{

    //The font used in the throughout the app
    let [fontsLoaded, error] = useFonts({
        SquadaOne_400Regular,
    });

    //Find the dimensions of the device, used later for fitting the map
    const windowHeight = Dimensions.get('window').height;


    //Array to store the locations
    const [datay,setDatay] = useState([]);

    //This use-effect queries the database for locations, then pushes them to the datay
    useEffect(()=>{
        let data = firebase.database().ref('locations/');
        data.once('value', (snapshot) => {
            const values=Object.values(snapshot.val()).map(value=>{
                return {
                    data:value.data,
                    description:value.description,
                    name:value.name,
                    price:value.price,
                    rating:value.rating,
                    type:value.type,
                    guests:value.guests,
                    latitude:parseFloat(value.latitude),
                    longitude:parseFloat(value.longitude),
                }
            })
            //Pushes the locations to the datay array

            setDatay(values)
        });
    },[])







    //Save the filter settings set by the user
    const [rating, setRating] = useState(1)

    //Query the users filter settings, then save it to filter
    useEffect(() => {
        firebase
            .database()
            .ref(`/users/${firebase.auth().currentUser.uid}`)
            .on('value', snapshot => {
                setRating(Object.values(snapshot.val()))

            });

    },[]);

  console.log(rating)






   //The marker array will contain those locations that fulfill the filter requriements
   let marker = [];
   //Loop goes through all quried locations in the datay, then pushes the approved locations to the marker array
   for(let i = 0; i < datay.length; i++){
        if(datay[i].rating >= rating[0]){

            marker.push(datay[i])

        }
    }



    //State variables for the permission to track the user and give the current locations
    const [hasLocationPermission, setlocationPermission] = useState(false)
    const [currentLocation, setCurrentLocation] = useState(null)


    /*
    Function uses the predefined method requestForegroundPermissionsAsync, which alerts the user with a reqest
    to find and use the device´s current location. The result of the request is then set to the location permission state.
    */
    const getLocationPermission = async () => {
        await Location.requestForegroundPermissionsAsync().then((item)=>{
            setlocationPermission(item.granted)
        } );
    };


    //The use effect calls on the getLocationPermission function to retrive the permission
    useEffect (() => {
        const response = getLocationPermission()
    });


    /*
    Function uses the predefined method getCurrentPositionAsync, which returns the location of the device, then sets the data to
    the currentLocation state.
    Accuracy referece to the accuracy of the posision, in our case it is set to BestForNavigation
    (The highest possible accuracy that uses additional sensor data to facilitate navigation apps.
    https://docs.expo.dev/versions/latest/sdk/location/)
    */

    const updateLocation = async () => {
        await Location.getCurrentPositionAsync({accuracy: Accuracy.BestForNavigation}).then((item)=>{
            setCurrentLocation(item.coords)
        } );
    };



   //Use effect to call on UpdateLocation function
    useEffect (() => {
        updateLocation()
    },[]);




    //RenderCurrent location check if the user has given permisson to use the location of the device
    //If the user has not permitted the user of the location, they will be prompted with text instructions to give permission
    const RenderCurrentLocation = (props) => {
        if (props.hasLocationPermission === null) {
            return null;
        }
        if (props.hasLocationPermission === false) {
            return <Text>No location access. Go to settings to change</Text>;
        }
        return null

    };



   //This should be removed
    const Load = () =>{return <Text>loading</Text>}



    //Function to navigate from the mapmarker to the map details
    const handleSelectBar = id => {
        //Converting the selected marker to JSON
        let idString = JSON.stringify(id)
        console.log(id)
        //Using the stringifyed id to find the correct bar
        const bar = Object.entries(marker).find(bar => bar[0] === idString /*id*/)
        console.log(bar)
        //Navigation to the bardetails
        nav.navigate('Bar Details', {bar})

    }


    //Queriyng all the bars
    const [bars, setBars] = useState()
    useEffect(() => {
        if (!bars) {
            firebase
                .database()
                .ref('/locations')
                .on('value', snapshot => {
                    setBars(snapshot.val())
                });
        }
    }, []);





    //To use the navigation dependencie to move to the selected bar
    const nav = useNavigation();

    let nrOfFriend = 0




    return(

        //To render the content within the boundaries of the device
        <SafeAreaView style={styles.container}   >

            {/*Initiating mapview*/}
            <MapView

                //Setting the inital region for the map to start
                //This will be set to currentLocation in the futire
                initialRegion={{
                    latitude: 55.6849749,
                    longitude: 12.57055,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421
                }}
                //Customizing the map
                minZoomeLevel={1}
                maxZoomLevel = {20}
                style={{ flex: 1,minHeight:windowHeight }}
                customMapStyle={darkStyle}
                provider={PROVIDER_GOOGLE}
                showsUserLocation

            >

                {/*Indexing through the locations from our database, then creating a map marker for each*/}
                {(marker.length !==0) ?marker.map((i,index)   =>



                    <Marker  key={index} coordinate={{ latitude: parseFloat(i.latitude), longitude: parseFloat(i.longitude)}}
                            // title={i.name} description={i.type+"\nRating:" + i.rating + "\nPrice:" + i.price}
                           //  backgroundColor={"2a2727"}
                             pinColor={'#c11c57'}
                        >

                        {/*This code creates the custom markerbox for then a marker is clicked  */}
                        {/*Showing the information of the bar                */}
                        {/*The callout calls the handleSelectebar, which will send the user to the bar details if the markerbox is clicked */}
                        <Callout tooltip onPress={() => handleSelectBar(index)}>

                            <View style={styles.markerBox} >
                                <View >
                                    <Text style={styles.markerTitle} >{i.name} </Text>
                                    <Text style={styles.markerDescription}>{i.type+"\nRating:" + i.rating + '\n'
                                    + '$'.repeat(i.price) + '\n' + 'Friends here: ' + '\n' + i.guests }</Text>
                                </View>

                            </View>
                            <View style={styles.arrowBorder}/>
                            <View style={styles.arrow}/>
                        </Callout>



                    </Marker>

                ): <Load/> }


            </MapView>
            </SafeAreaView>
    )

}

export default All;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingTop: Constants.statusBarHeight,
        backgroundColor: '#2a2727',
        padding: 8,
        marginBottom: 80
    },
    map: { flex: 1 },

    markerBox: {
        flexDirection: 'column',
        alignSelf: 'flex-start',
        backgroundColor: '#2a2727',
        borderColor: '#c11c57',
        borderWidth: 2,
        padding: 5,
        width: 150,
        color:'#ffffff'
    },
    markerTitle: {
            textAlign: "center",
            fontSize: 25,
            color:'#ffffff',
            marginBottom: 5,
            fontFamily: 'SquadaOne_400Regular',
    },
    markerDescription: {
        fontSize: 15,
        color:'#ffffff',
        marginBottom: 5,
        fontFamily: 'SquadaOne_400Regular',
    },
    arrowBorder: {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        borderTopColor: '#c11c57',
        borderWidth: 16,
        alignSelf: 'center',
        marginTop: -0.5,
        marginBottom: -15
    },


    infoBox: {
        height: 200,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,

        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    infoText: {
        fontSize: 15,
        color: 'white'
    },

});