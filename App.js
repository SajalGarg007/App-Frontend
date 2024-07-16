import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./Screens/HomeNormal"
import Login from "./Screens/Login"
import { Alert } from "react-native";
import Profile from "./Screens/Profile";


const Stack=createNativeStackNavigator();

 function App(){
    return(
        <NavigationContainer>
             <Stack.Navigator screenOptions={{headerShown:false}}  initialRouteName="login">
                {/* <Stack.Screen name="Login" component={Login}/> */}
                <Stack.Screen name="Home Screen" component={HomeScreen}/>
                <Stack.Screen name="Profile Screen" component={Profile}/>
            </Stack.Navigator>
        </NavigationContainer>

        
    );
};

export default App;