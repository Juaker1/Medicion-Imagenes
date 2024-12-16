import React, { useState, useRef } from 'react';
import { View, TouchableOpacity, StyleSheet, Alert, Text } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { MaterialIcons } from '@expo/vector-icons';
import { globalStyles } from '../styles/globalStyles';

export default function CameraScreen({ navigation }) {
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>
          Necesitamos tu permiso para usar la cámara
        </Text>
        <TouchableOpacity style={[globalStyles.button, styles.button]} onPress={requestPermission}>
          <Text style={globalStyles.buttonText}>Dar Permiso</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const toggleCameraFacing = () => {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        if (photo?.uri) {
          navigation.navigate('ImagePreview', { imageUri: photo.uri });
        } else {
          Alert.alert('Error', 'No se pudo capturar la imagen');
        }
      } catch (error) {
        console.error(error);
        Alert.alert('Error', 'Error al tomar la foto');
      }
    }
  };

  return (
    <View style={styles.container}>
      <CameraView 
        ref={cameraRef}
        style={styles.camera} 
        facing={facing}
      >
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.navigate('HomeScreen')}
        >
          <MaterialIcons name="arrow-back" size={32} color="white" />
        </TouchableOpacity>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[globalStyles.button, styles.flipButton]}
            onPress={toggleCameraFacing}
          >
            <MaterialIcons name="flip-camera-android" size={24} color="white" />
            <Text style={styles.flipText}>Voltear Cámara</Text>
          </TouchableOpacity>
          <TouchableOpacity
  style={[globalStyles.button, styles.captureButton]}
  onPress={takePicture}
>
  <View style={styles.captureButtonContent}>
    <Text style={styles.captureText}>Tomar Foto</Text>
    <MaterialIcons name="camera" size={32} color="white" />
  </View>
</TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  permissionText: {
    textAlign: 'center',
    color: 'white',
    marginBottom: 20,
  },
  camera: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 5,
    zIndex: 2,
    padding: 10,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 30,
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  flipButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
    borderRadius: 50,
  },
  flipText: {
    marginLeft: 5,
    color: 'white',
  },
  captureButton: {
    borderRadius: 50,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  captureText: {
    color: 'white',
    fontSize: 16,
  },
}); 