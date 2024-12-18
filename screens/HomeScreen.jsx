import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { globalStyles, colors } from '../styles/globalStyles';
import icon from '../assets/icon.png';

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
      <View style={styles.welcomeContainer}>
      <Image 
          source={icon} 
          style={styles.customIcon} 
        />
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
          <Ionicons name="camera" size={24} color={colors.softWhite} />
          <Text style={[globalStyles.buttonText, styles.buttonText]}>
            Tomar Foto
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[globalStyles.button, styles.button]} 
          onPress={pickImage}
        >
          <Ionicons name="images" size={24} color={colors.softWhite} />
          <Text style={[globalStyles.buttonText, styles.buttonText]}>
            Seleccionar Imagen
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeContainer: {
    alignItems: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  customIcon: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 15,
    textAlign: 'center',
  },
  welcomeDescription: {
    fontSize: 20,
    color: colors.textGray,
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: 24,
  },
  instructions: {
    fontSize: 14,
    color: colors.textGray,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 20,
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    paddingVertical: 15,
    width: '100%',
  },
  buttonText: {
    marginLeft: 10,
  }
});

export default HomeScreen;