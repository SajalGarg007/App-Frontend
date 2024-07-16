import React, { useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { View, TextInput, StyleSheet, KeyboardAvoidingView, Text, Image, Pressable } from "react-native";
import { ActivityIndicator } from "react-native-paper";

const LoginForm = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);


  const DisplayShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const [errors, setErrors] = useState({});


  // validation function
  const validateForm = () => {
    let errors = {};

    if (!username) {
      errors.username = "Username is required";
    }
    else if (!username.includes("@") || !username.includes(".")) {
      errors.username = "Enter a valid username";
    }
    //   else if (username.length < 5) {
    //     errors.username = "Username must be at least 5 characters long";
    //   }
    //   if (!password){ errors.password = "Password is required";
    //   } 
    //   else if (password.length < 5) {
    //   errors.password = "Password must be at least 5 characters long";
    // }
    setErrors(errors);
    return Object.keys(errors).length === 0;

  };


  //function call after login button is pressed
  const handleSubmit = () => {
    if (validateForm()) {
      setLoading(true);
      console.log("Submitted", username, password);
      setUsername("");
      setPassword("");
      setErrors({});
      setTimeout(() => {                         //load after 1.2s
        setLoading(false);
        navigation.navigate('Home Screen');
      },1200)
    }
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.mainContainer}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1A4278" />
        </View>
      ) : (
        <View style={styles.contentContainer}>
          
          <View style={styles.upperHalf}>
            <Image source={require('../assets/bsc-logo-blue.svg')} style={styles.logo} resizeMode="contain" />
          </View>

          <View style={styles.lowerHalf}>
            <Text style={styles.userText}>Username</Text>
            <View style={styles.user}>
              <TextInput
                style={styles.input}
                placeholder="Enter your username"
                value={username}
                onChangeText={setUsername}
              />
            </View>

            {errors.username ? (
              <Text style={styles.errorText}>{errors.username}</Text>
            ) : null}

            <Text style={styles.passText}>Password</Text>
            <View style={styles.user}>
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <MaterialCommunityIcons
                name={showPassword ? 'eye' : 'eye-off'}
                style={styles.icon}
                color="black"
                size={20}
                onPress={DisplayShowPassword}
              />
            </View>

            {errors.username ? (
              <Text style={styles.errorText}>{errors.password}</Text>
            ) : null}

            <Pressable style={(username && password) ? styles.button : styles.disabledButton}
              onPress={handleSubmit}
              disabled={!username || !password || loading}>
              <Text style={styles.text}>Login</Text>
            </Pressable>
          </View>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#CDE8E5",
  },
  contentContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  upperHalf: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  lowerHalf: {
    flex: 2,
    backgroundColor: '#FFF7F1',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 10,
    paddingVertical: 50,
    paddingHorizontal: 30
  },
  logo: {
    width: 300,
    height: 200,
  },
  userText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 0,
  },
  passText: {
    fontSize: 16,
    marginTop: 15,
    fontWeight: "bold",
    marginBottom: 0,
  },
  user: {
    borderWidth: 0.5,
    borderRadius: 15,
    borderColor: 'black',
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {

    width: "100%",
    padding: 10
  },

  errorText: {
    color: "red",
    alignSelf: 'flex-end',

  },
  form: {
    borderRadius: 10,
    shadowColor: "black",

  },
  icon: {
    marginRight: 20,
    paddingTop: 0,
    position: "absolute",
    right: -5,
    bottom: 5,
    top: 10,
  },
  text: {
    color: 'white',
    fontWeight: "bold",
  },
  button: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1A4278',
    borderRadius: 5,
    marginTop: 25,
  },
  disabledButton: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'silver',
    borderRadius: 5,
    marginTop: 25,
  },
});

export default LoginForm;