import React from 'react';
import Employee from './Employee';
import Department from './Department';
import Statistics from './Statistics';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TouchableOpacity, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Entypo } from '@expo/vector-icons';

const Tab = createBottomTabNavigator()
const HomeScreen = () => {

//Navigate to profile screen
    const navigation = useNavigation();
    const Jump = () => {
        navigation.navigate('Profile Screen')
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>

            <Tab.Navigator initialRouteName="Home" detachInactiveScreens={false}
                screenOptions={{
                    headerShown: true, tabBarActiveTintColor: 'black',
                    tabBarInactiveTintColor: 'grey',
                    tabBarStyle: { backgroundColor: 'white' },
                    headerStyle: { backgroundColor: 'white' },
                }}
            >
                <Tab.Screen name=" " component={Employee}
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="account" size={35} color={color} />
                        ),
                    }} />
                <Tab.Screen name="  " component={Department}
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="account-group" size={35} color={color} />
                        )
                    }} />
                <Tab.Screen name="   " component={Statistics}
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <Entypo name="bar-graph" size={28} color={color} />
                        )
                    }} />
            </Tab.Navigator>

            <TouchableOpacity style={styles.HeaderIcon} onPress={Jump}>
                <MaterialCommunityIcons name="account-circle-outline" size={40} color="black" />
            </TouchableOpacity>

            <Text style={styles.HeaderUser}>Welcome Sanjeev!</Text>

        </SafeAreaView>

    )
}
const styles = StyleSheet.create({
    HeaderIcon: {
        position: 'absolute',
        top: 10,
        right: 8,
        backgroundColor: 'transparent',
    },

    HeaderUser: {
        position: 'absolute',
        top: 15,
        left: 15,
        fontSize: 20,
        fontWeight: 'bold',
        color: "black"
    }
})

export default HomeScreen;