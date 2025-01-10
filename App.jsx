import 'react-native-gesture-handler';
import React from 'react';
import { Text, Image, View, Dimensions, StyleSheet } from 'react-native';
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
import CalibrationExamplesScreen from './screens/CalibrationExamplesScreen';
import { colors } from './styles/globalStyles';

const { width, height } = Dimensions.get('window');
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

function ExamplesStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ExamplesMain"
        component={CalibrationExamplesScreen}
        options={{ headerShown: false }}
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
  <View style={styles.headerContainer}>
    <Text style={styles.headerText}>{title}</Text>
    <Image
      source={require('./assets/logouct_blanco.png')}
      style={styles.headerImage}
      resizeMode="contain"
    />
  </View>
);

const Footer = () => (
  <View style={styles.footerContainer}>
    <Text style={styles.footerText}>
      Financiado por Proyecto de Innovación en Docencia (PID) UCT 2023
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
              let iconName =
                route.name === 'Inicio'
                  ? focused
                    ? 'home'
                    : 'home-outline'
                  : focused
                    ? 'book'
                    : 'book-outline';
              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: colors.mainBlue,
            tabBarInactiveTintColor: colors.lightGray,
            tabBarStyle: styles.tabBarStyle,
            headerStyle: styles.headerStyle,
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
              tabBarLabel: 'Inicio',
            })}
          />
          <Tab.Screen
            name="Tutorial"
            component={TutorialScreen}
            options={{
              headerTitle: () => <HeaderTitle title="Tutorial" />,
            }}
          />
          <Tab.Screen
            name="Ejemplos"
            component={ExamplesStack} // Cambiamos esto de CalibrationExamplesScreen a ExamplesStack
            options={({ route }) => ({
              headerTitle: () => {
                const routeName = getFocusedRouteNameFromRoute(route);
                let title;
                switch (routeName) {
                  case 'Measurement':
                    title = 'Medición';
                    break;
                  default:
                    title = 'Ejemplos de Calibración';
                }
                return <HeaderTitle title={title} />;
              },
              tabBarIcon: ({ focused, color, size }) => {
                const iconName = focused ? 'images' : 'images-outline';
                return <Ionicons name={iconName} size={size} color={color} />;
              },
            })}
          />
        </Tab.Navigator>
        <Footer />
      </View>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingRight: width * 0.03,
    paddingLeft: width * 0.01,
  },
  headerText: {
    color: 'white',
    fontSize: width * 0.055,
    fontWeight: 'bold',
  },
  headerImage: {
    width: width * 0.3, // Scaled based on width
    height: width * 0.3, // Keep aspect ratio
  },
  footerContainer: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: colors.mainBlue,
    paddingVertical: height * 0.0035, // Dynamic vertical padding
  },
  footerText: {
    fontSize: width * 0.025, // Scaled font size
    color: colors.softWhite,
    fontStyle: 'italic',
  },
  tabBarStyle: {
    backgroundColor: colors.softWhite,
    borderTopWidth: height * 0.001,
    borderTopColor: colors.lightGray,
    paddingBottom: height * 0.0,
    height: height * 0.06,
  },
  headerStyle: {
    backgroundColor: colors.mainBlue,
  },
});

