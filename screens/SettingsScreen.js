import * as React from 'react';
import {View, Text, FlatList, TouchableOpacity, StyleSheet, ScrollView} from 'react-native';
import firebase from 'firebase';
import {useEffect, useState} from "react";
import { useFonts, SquadaOne_400Regular } from '@expo-google-fonts/squada-one';
import FilterScreen2 from "./FilterScreen";
import ProfileScreen from "./ProfileScreen";



const SettingList = ({navigation}) => {

    //Loading the custom font
    let [fontsLoaded, error] = useFonts({
        SquadaOne_400Regular,
    });





     //Rendering the different setting options
    return (
        <ScrollView backgroundColor={'#2a2727'}>

                            <TouchableOpacity style={styles.container} onPress={() => navigation.navigate('Filter')}>
                                <Text style={styles.barStyle}>
                                    Filter
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.container} onPress={() => navigation.navigate('Friends')}>
                                <Text style={styles.barStyle}>
                                    Friends
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.container} onPress={() => navigation.navigate('Profile')}>
                                <Text style={styles.barStyle}>
                                    Profile
                                </Text>
                            </TouchableOpacity>
        </ScrollView>
    );

}

export default SettingList;



const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderWidth: 1,
        borderRadius:0,
        margin: 10,
        padding: 10,
        height: 90,
        justifyContent:'center',
        backgroundColor:'#2a2727',
        borderColor:'white'


    },
    label: { fontWeight: 'bold',

    },
    barStyle:{
        color: 'white',
        fontFamily:'SquadaOne_400Regular',
        fontSize: 40
    }
});