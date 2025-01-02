
import 'react-native-gesture-handler';
import React from 'react';
import { Text, Image, View } from 'react-native';
import { NavigationContainer, getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from './screens/HomeScreen';
import TutorialScreen from './screens/TutorialScreen';
import CameraScreen from './screens/CameraScreen';
import MeasurementScreen from './screens/MeasurementScreen';
import ImagePreviewScreen from './screens/ImagePreviewScreen'; 
import CalibrationScreen from './screens/CalibrationScreen';
import MeasurementHistoryScreen from './screens/ListScreen';
import { colors } from './styles/globalStyles';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="HomeScreen" 
        component={HomeScreen} 
        options={{ headerShown: false, title: 'MicroMeasure' }} 
      />
      <Stack.Screen 
        name="Camera" 
        component={CameraScreen} 
        options={{ headerShown: false, title: 'Tomar Foto' }} 
      />
      <Stack.Screen 
        name="Measurement" 
        component={MeasurementScreen} 
        options={{ 
          headerShown: false,
          title: 'Medición',
        }} 
      />
      <Stack.Screen 
        name="ImagePreview" 
        component={ImagePreviewScreen}
        options={{ headerShown: false, title: 'Vista Previa' }}
      />
      <Stack.Screen 
        name="MeasurementHistory" 
        component={MeasurementHistoryScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen 
        name="Calibration" 
        component={CalibrationScreen}
        options={{
          headerShown: false,
          title: 'Calibración',
        }}
      />
    </Stack.Navigator>
  );
}


const HeaderTitle = ({ title }) => (
  <View style={{ 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    width: '100%',
    paddingRight: 10
  }}>
    <Text style={{ color: 'white', fontSize: 20 }}>{title}</Text>
    <Image 
      source={require('./assets/logouct_blanco.png')} 
      style={{ width: 35, height: 35 }}
      resizeMode="contain"
    />
  </View>
);

const Footer = () => (
  <View style={{
    width: '100%',
    alignItems: 'center',
    backgroundColor: colors.mainBlue,
    paddingVertical: 5,
  }}>
    <Text style={{
      fontSize: 12,
      color: colors.softWhite,
      fontStyle: 'italic'
    }}>
      Financiado por Innovación Educacional
    </Text>
  </View>
);

export default function App() {
  return (
    <NavigationContainer>
      <View style={{ flex: 1 }}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName = route.name === 'Inicio' 
              ? focused ? 'home' : 'home-outline'
              : focused ? 'book' : 'book-outline';
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: colors.mainBlue,
          tabBarInactiveTintColor: colors.lightGray,
          tabBarStyle: {
            backgroundColor: colors.softWhite,
            borderTopWidth: 1,
            borderTopColor: colors.lightGray,
            paddingBottom: 5,
            height: 60,
          },
          headerStyle: {
            backgroundColor: colors.mainBlue,
          },
          headerTintColor: colors.softWhite,
        })}
      >
        <Tab.Screen 
          name="Inicio" 
          component={HomeStack} 
          options={({ route }) => ({
            headerTitle: () => {
              const routeName = getFocusedRouteNameFromRoute(route);
              let title;
              switch (routeName) {
                case 'Camera':
                  title = 'Tomar Foto';
                  break;
                case 'Measurement':
                  title = 'Medición';
                  break;
                case 'ImagePreview':
                  title = 'Vista Previa';
                  break;
                case 'Calibration':
                  title = 'Calibración';
                  break;
                case 'MeasurementHistory':
                  title = 'Lista de Mediciones';
                  break;
                case 'HomeScreen':
                default:
                  title = 'MicroMeasure';
              }
              return <HeaderTitle title={title} />;
            },
            tabBarLabel: 'Inicio'
          })}
        />
        <Tab.Screen 
          name="Tutorial" 
          component={TutorialScreen}
          options={{
            headerTitle: () => <HeaderTitle title="Tutorial" />
          }}
        />
      </Tab.Navigator>
      <Footer />
      </View>
    </NavigationContainer>
    
  );
}