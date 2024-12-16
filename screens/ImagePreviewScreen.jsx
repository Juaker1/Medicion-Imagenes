
import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { globalStyles } from '../styles/globalStyles';

export default function ImagePreviewScreen({ route, navigation }) {
  const { imageUri } = route.params;

  const handleConfirm = () => {
    navigation.navigate('Measurement', { imageUri });
  };

  const handleRetake = () => {
    navigation.navigate('Camera');
  };

  return (
    <View style={styles.container}>
      <Image 
        source={{ uri: imageUri }} 
        style={styles.previewImage} 
        resizeMode="contain"
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[globalStyles.button, styles.button, styles.retakeButton]} 
          onPress={handleRetake}
        >
          <MaterialIcons name="replay" size={24} color="white" />
          <Text style={styles.buttonText}>Volver a Tomar</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[globalStyles.button, styles.button, styles.confirmButton]} 
          onPress={handleConfirm}
        >
          <MaterialIcons name="check" size={24} color="white" />
          <Text style={styles.buttonText}>Confirmar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  previewImage: {
    flex: 1,
    width: '100%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    gap: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  retakeButton: {
    backgroundColor: '#d32f2f',
  },
  confirmButton: {
    backgroundColor: '#388e3c',
  },
});