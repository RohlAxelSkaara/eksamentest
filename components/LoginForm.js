import React, { useState} from 'react';
import {
    Button,
    Text,
    View,
    TextInput,
    ActivityIndicator,
    StyleSheet, TouchableOpacity,
} from 'react-native';
import firebase from 'firebase';
import {SquadaOne_400Regular, useFonts} from "@expo-google-fonts/squada-one";
import {Image} from "react-native-web";




function LoginForm() {

    let [fontsLoaded, error] = useFonts({
        SquadaOne_400Regular,
    });

    //Instantiering af statevariabler, der skal benyttes i LoginForm
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isCompleted, setCompleted] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null)

    /*
    * Metoden herunder håndterer login af en eksisterende bruger ved at anvende den prædefinerede metode, som stilles til rådighed af firebase
    * signInWithEmailAndPassword tager en mail og et password med som argumenter og foretager et asynkront kald, der eksekverer login i firebase
    * Opstår der fejl under forsøget på login, vil der i catch blive fremsat en fejlbesked, som, ved brug af
    * setErrorMessage, angiver værdien for state-variablen, errormessage
    */
    const handleSubmit = async () => {
        try {
            await firebase.auth().signInWithEmailAndPassword(email, password).then((data)=>{
            });

        } catch (error){
            setErrorMessage(error.message)
        }
    }



//I return oprettes en tekstkomponent, der angiver at dette er loginfrom
//Dernæst er der to inputfelter, som løbeende sætter værdien af state-variablerne, mail og password.
// Afslutningsvis, angives det at, hvis errorMessage får fastsat en værdi, skal denne udskrives i en tekstkomponent.
    return (
        <View style={styles.container}>
            <Text style={styles.header}>NITEOUT</Text>
            <TextInput
                autoCapitalize='none'
                placeholderTextColor="#FFF"
                placeholder="email"
                value={email}
                onChangeText={(email) => setEmail(email)}
                style={styles.inputField}
                keyboardAppearance='dark'
            />
            <TextInput
                autoCapitalize='none'
                placeholderTextColor="#FFF"
                placeholder="password"
                value={password}
                onChangeText={(password) => setPassword(password) }
                secureTextEntry
                style={styles.inputField}
                keyboardAppearance='dark'
            />
            {errorMessage && (
                <Text style={styles.error}>Error: {errorMessage}</Text>
            )}
            <TouchableOpacity style={styles.button} onPress={() => handleSubmit()}>
                <Text style={styles.barStyle}>
                    Log in
                </Text>
            </TouchableOpacity>
        </View>
    );
}

//Lokal styling til brug i LoginFrom
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#2a2727',

    },
    error: {
        color: 'red',
    },
    inputField: {
        borderWidth: 1,
        margin: 10,
        padding: 10,
        borderColor: 'white',
        fontFamily: 'SquadaOne_400Regular',
        color: 'white',
        height: 50,
        fontSize: 30


    },
    header: {
        paddingTop: 70,
        fontSize: 80,
        fontFamily: 'SquadaOne_400Regular',
        alignSelf: "center",
        color: 'white'
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
    barStyle: {
        color: 'white',
        fontFamily: 'SquadaOne_400Regular',
        fontSize: 30,
        alignSelf: 'center'
    }
});

//Eksport af Loginform, således denne kan importeres og benyttes i andre komponenter
export default LoginForm
