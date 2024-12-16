// screens/HomeScreen.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { globalStyles, colors } from '../styles/globalStyles';

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
      <Text style={[globalStyles.title, styles.welcomeText]}>
        Toma o selecciona una imagen{'\n'}y comienza a medir
      </Text>
      
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
  welcomeText: {
    textAlign: 'center',
    lineHeight: 30,
    marginBottom: 40,
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