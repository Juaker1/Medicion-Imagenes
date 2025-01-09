import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { globalStyles, colors } from '../styles/globalStyles';
import icon from '../assets/icon.png';

const { width, height } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status === 'granted') {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        quality: 1,
      });

      if (!result.canceled) {
        navigation.navigate('Measurement', { imageUri: result.assets[0].uri });
      }
    }
  };

  return (
    <View style={[globalStyles.container, styles.container]}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.welcomeContainer}>
          <Image source={icon} style={styles.customIcon} />
          <Text style={[globalStyles.title, styles.welcomeTitle]}>
            ¡Bienvenido a MicroMeasure!
          </Text>
          <Text style={styles.welcomeDescription}>
            Tu herramienta precisa para mediciones microscópicas
          </Text>
          <Text style={styles.welcomeDescription}>
            Para comenzar, selecciona una de las siguientes opciones:
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[globalStyles.button, styles.button]}
            onPress={() => navigation.navigate('Camera')}
          >
            <Ionicons name="camera" size={width * 0.06} color={colors.softWhite} />
            <Text style={[globalStyles.buttonText, styles.buttonText]}>
              Tomar Foto
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[globalStyles.button, styles.button]}
            onPress={pickImage}
          >
            <Ionicons name="images" size={width * 0.06} color={colors.softWhite} />
            <Text style={[globalStyles.buttonText, styles.buttonText]}>
              Seleccionar Imagen
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: height * 0.02,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginBottom: height * 0.05,
    paddingHorizontal: width * 0.05,
  },
  customIcon: {
    width: width * 0.5,
    height: width * 0.5,
    resizeMode: 'contain',
  },
  welcomeTitle: {
    fontSize: width * 0.1,
    fontWeight: 'bold',
    marginTop: height * 0.01,
    marginBottom: height * 0.025,
    textAlign: 'center',
  },
  welcomeDescription: {
    fontSize: width * 0.045,
    color: colors.textGray,
    textAlign: 'center',
    marginBottom: height * 0.015,
    lineHeight: width * 0.055,
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: width * 0.04,
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: height * 0.015,
    paddingVertical: height * 0.02,
    width: '100%',
  },
  buttonText: {
    marginLeft: width * 0.02,
    fontSize: width * 0.045, // Scale text in buttons
  },
});

export default HomeScreen;
