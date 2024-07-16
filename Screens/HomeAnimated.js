import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useEffect, useRef } from 'react'
import { Platform, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Icon, { Icons } from './colors/Icons';
import Colors from './colors/Colors';
import ColorScreen from './colors/ColorScreen';
import * as Animatable from 'react-native-animatable';
import Employee from './Employee';
import Department from './Department';
import Statistics from './Statistics';
import { useNavigation } from '@react-navigation/native';
import { Entypo } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const TabArr = [
  { route: ' ', label: 'Employee', type: Icons.Ionicons, activeIcon: 'grid', inActiveIcon: 'grid-outline', component: Employee },
  { route: '  ', label: 'Department', type: Icons.MaterialCommunityIcons, activeIcon: 'timeline-plus', inActiveIcon: 'timeline-plus-outline', component:Department },
  { route: '   ', label: 'Stats', type: Icons.MaterialCommunityIcons, activeIcon: 'graph', inActiveIcon: 'graph-outline', component: Statistics },
  // { route: 'Account', label: 'Account', type: Icons.FontAwesome, activeIcon: 'user-circle', inActiveIcon: 'user-circle-o', component: ColorScreen },
];

const Tab = createBottomTabNavigator();

const TabButton = (props) => {
  const { item, onPress, accessibilityState } = props;
  const focused = accessibilityState.selected;
  const viewRef = useRef(null);

  useEffect(() => {
    if (focused) {
      viewRef.current.animate({ 0: { scale: .5, rotate: '0deg' }, 1: { scale: 1.5, rotate: '360deg' } });
    } else {
      viewRef.current.animate({ 0: { scale: 1.5, rotate: '360deg' }, 1: { scale: 1, rotate: '0deg' } });
    }
  }, [focused])

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={1}
      style={[styles.container, { top: 0 }]}>
      <Animatable.View
        ref={viewRef}
        duration={1000}
      >
        <Icon type={item.type}
          name={focused ? item.activeIcon : item.inActiveIcon}
          color={focused ? Colors.primary : Colors.primaryLite} />
      </Animatable.View>
    </TouchableOpacity>
  )
}

export default function HomeScreen() {

    const navigation = useNavigation();

    const Jump = () => {
        navigation.navigate('Profile Screen')
    }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Tab.Navigator
        screenOptions={{
          headerShown: true,
          tabBarStyle: {
            backgroundColor:'white',
            height: 60,
            // position: 'absolute',
            // margin: 16,
            // borderRadius: 16,
            borderTopRightRadius:16,
            borderTopLeftRadius:16,
            // justifyContent: 'center',
            // alignItems: 'center',
          }
        }}
      >
        {TabArr.map((item, index) => {
          return (
            <Tab.Screen key={index} name={item.route} component={item.component}
              options={{
                tabBarShowLabel: false,
                tabBarButton: (props) => <TabButton {...props} item={item} />
              }}
            />
          )
        })}
      </Tab.Navigator>

      <TouchableOpacity style={styles.icon} onPress={Jump}>
                <MaterialCommunityIcons name="account-circle-outline" size={40} color="black" />
            </TouchableOpacity>
            <Text style={styles.user}>Welcome Sanjeev!</Text>
            {/* <TouchableOpacity onPress={()=>setModalVisible(true)} style={styles.icon2}>
				<MaterialCommunityIcons name='pencil-plus-outline' size={40}color='black'/>
				</TouchableOpacity> */}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
  },
  icon: {
        position: 'absolute',
        top: 10,
        right: 8,
        backgroundColor: 'transparent',
    },
    icon2:{
        position: 'absolute', 
        bottom: 10,
        right: 60,
    },
    user: {
        position: 'absolute',
        top: 15,
        left: 15,
        fontSize: 20,
        fontWeight: 'bold',
    }
})

/* 
//desktop view
          <StackedBarChart
          data={{
            labels: labels,
            legend: ['Males', 'Females'],
            data: data,
            barColors: ['#FFA726', '#66BB6A'],
          }}
          width={getPercentageWidth(43  , width)} 
          height={400}
          chartConfig={{
            backgroundColor: '#FFFFFF',
            backgroundGradientFrom: '#FFFFFF',
            backgroundGradientTo: '#FFFFFF',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            barPercentage: .6, // Adjust bar width relative to available space
  categoryPercentage: 0.7, 
            propsForBackgroundLines: {
              strokeDasharray: '', // solid background lines with no dashes
              strokeWidth: 0.5,
              stroke: '#E3E3E3',
            },
            propsForLabels: {
              fontSize: 8,
              fontWeight: 'bold',
              color: '#000',
            },
          }}
          showLegend={true}
          showValuesOnTopOfBars={true}
        />

        const data = teamsData.map(team => [
          team.male !== 0 ? team.male : null, 
          team.female !== 0 ? team.female : null
        ]);
*/