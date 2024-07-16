import React from 'react';
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
// import LinearGradient from 'react-native-linear-gradient';
// import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ScrollView } from 'react-native-gesture-handler';

const { width, height } = Dimensions.get('window');

const getPercentagePadding = (percentage, dimension) => {
  return (percentage / 100) * dimension;
};

const Profile = () => {
  const navigation = useNavigation();

  const Jump = () => {
    navigation.navigate('Home Screen')
  }

  return (
    <ScrollView style={styles.container}>
      {/* <LinearGradient
        // Background Linear Gradient
        colors={['#AFC7EB', '#C5E4E3']}
        style={styles.background}
      /> */}
      <View style={styles.topBody}>

        <View style={styles.avatarContainer}>
          <Text style={styles.avatar}>
            {/* <Image source={require('../assets/Virat_Kohli.jpg')} style={styles.avatars} /> */}
            SP
          </Text>
        </View>
        <View style={styles.nameContainer}>
          <Text style={styles.name}>Sanjeev Pandya</Text>
        </View>


      </View>

      <View style={styles.body}>


        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Email:</Text>
          <Text style={styles.infoText}>sanjeev17@gmail.com</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Designation:</Text>
          <Text style={styles.infoText}>Director, R&D</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Vendor:</Text>
          <Text style={styles.infoText}>BSC</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Team:</Text>
          <Text style={styles.infoText}>Leadership</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>subTeam:</Text>
          <Text style={styles.infoText}>Functional Management</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Location:</Text>
          <Text style={styles.infoText}>Gurgaon</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Work Mode:</Text>
          <Text style={styles.infoText}>Hybrid</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>RTW Tire:</Text>
          <Text style={styles.infoText}>Tier||</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Employee ID:</Text>
          <Text style={styles.infoText}>1076484</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Job Level:</Text>
          <Text style={styles.infoText}>Leadership</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Cost Center:</Text>
          <Text style={styles.infoText}>5626005</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Parking Sticker:</Text>
          <Text style={styles.infoText}>N</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Gender:</Text>
          <Text style={styles.infoText}>M</Text>
        </View>
        {/* <View style={styles.infoContainer}>
              <Text style={styles.infoLabel}>Portfolio:</Text>
              <Text style={styles.infoText}>https://yourportfolio.com</Text>
            </View> */}
      </View>

      <TouchableOpacity style={styles.icon1} onPress={Jump}>
        <MaterialCommunityIcons name="arrow-left" size={25} color="black" />
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    // background-image: linear-gradient(90deg, #020024 0%, #090979 35%, #00d4ff 100%),
    //   paddingHorizontal: getPercentagePadding(20, width), // 10% of the screen width
    marginTop: getPercentagePadding(3, height),   // 20% of the screen height
    // paddingHorizontal: getPercentagePadding(10, width), // 10% of the screen width
    //   alignItems: 'center',
    //   justifyContent: 'center',
  },
  icon1: {

    position: 'absolute',
    top: 0,
    left: 8,
    backgroundColor: 'transparent',
  },
  pad: {
    marginTop: 3,
  },
  avatars: {
    width: 150,
    height: 150,
    borderRadius: 75,
    // borderWidth: 5,
    // borderColor: 'white',
  },
  topBody: {
    //   marginTop:120,
    alignItems: 'center',
    // paddingHorizontal: getPercentagePadding(20, width), // 10% of the screen width
    justifyContent: 'center',
  },
  body: {
    marginTop:5,
    // paddingVertical: 10,
    backgroundColor: '#f4f4f4',
    // paddingTop: -20,
    // alignItems: 'center',
    // padding: 10,
    // borderBottomWidth: 1,
    // borderBottomColor: '#ddd',
    // paddingLeft: getPercentagePadding(10, width), // 10% of the screen width
    // width: getPercentagePadding(80, width), // 10% of the screen width
    justifyContent: 'center',
    // borderWidth: 2, // Width of the border
    // borderColor: 'black', // Color of the border
    // borderRadius: 20,
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 300,
  },
  avatarContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 6,
    shadowOpacity: 0.16,
  },
  avatar: {
    fontSize: 72,
    fontWeight: '700',
  },
  nameContainer: {
    // flex:1,
    // marginTop:0,
    marginTop: 8,
    alignItems: 'center',
  },
  name: {
    // marginTop:0,
    fontSize: 24,
    fontWeight: '600',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    backgroundColor: '#f4f4f4',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd'
  },
  infoLabel: {
    // fontSize: 16,
    // fontWeight: 'bold',
    // color: '#666666',
    // marginRight: 8,
    backgroundColor: '#f4f4f4',
    // padding: 10,
    // borderBottomWidth: 1,
    // borderBottomColor: '#ddd',
    fontSize: 18,
    fontWeight: 'bold'
  },
  infoText: {
    // fontWeight: "400",
    fontSize: 18,
    backgroundColor: '#f4f4f4',
    // padding: 10,
    // borderBottomWidth: 1,
    // borderBottomColor: '#ddd',

  },
});

export default Profile;