import {StyleSheet, Text, View} from "react-native";
import * as React from "react";
import BarList from "../components/BarList";


//Renders the list of bars who meet the filter rquirements
function HomeScreen({prop}) {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Locations</Text>
            <BarList/>
        </View>
    );
}


export default HomeScreen

//Lokal styling til brug i MapScreen
const styles = StyleSheet.create({
    container: {
        borderColor: 'black',
        borderWidth: 20,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    text: {
        fontSize: 20,
    },
});
