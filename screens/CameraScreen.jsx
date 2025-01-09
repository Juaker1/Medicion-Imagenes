import React, { useState, useRef } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Modal, TouchableWithoutFeedback, Dimensions } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { MaterialIcons } from '@expo/vector-icons';
import { globalStyles } from '../styles/globalStyles';

const { width, height } = Dimensions.get('window');

const ErrorModal = ({ visible, onClose, message }) => (
  <Modal
    transparent
    visible={visible}
    animationType="fade"
    onRequestClose={onClose}
  >
    <TouchableWithoutFeedback onPress={onClose}>
      <View style={styles.modalOverlay}>
        <TouchableWithoutFeedback>
          <View style={styles.modalContent}>
            <MaterialIcons name="error" size={width * 0.2} color="#d32f2f" />
            <Text style={styles.modalTitle}>Error</Text>
            <Text style={styles.modalMessage}>{message}</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={onClose}
            >
              <Text style={styles.modalButtonText}>Aceptar</Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  </Modal>
);

export default function CameraScreen({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

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

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        if (photo?.uri) {
          navigation.navigate('ImagePreview', { imageUri: photo.uri });
        } else {
          setErrorMessage('No se pudo capturar la imagen');
          setShowErrorModal(true);
        }
      } catch (error) {
        console.error(error);
        setErrorMessage('Error al tomar la foto');
        setShowErrorModal(true);
      }
    }
  };

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('HomeScreen')}
        >
          <MaterialIcons name="arrow-back" size={width * 0.08} color="white" />
        </TouchableOpacity>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[globalStyles.button, styles.captureButton]}
            onPress={takePicture}
          >
            <View style={styles.captureButtonContent}>
              <Text style={styles.captureText}>Tomar Foto</Text>
              <MaterialIcons name="camera" size={width * 0.08} color="white" />
            </View>
          </TouchableOpacity>
        </View>
      </CameraView>
      <ErrorModal
        visible={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        message={errorMessage}
      />
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
    marginTop: height * 0.03,
    marginBottom: height * 0.03,
    fontSize: width * 0.05,
  },
  camera: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: height * 0.02,
    left: width * 0.02,
    zIndex: 2,
    padding: width * 0.01,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: height * 0.0001,
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  captureButton: {
    borderRadius: width * 0.02,
    padding: width * 0.04,
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: width * 0.01,
  },
  captureText: {
    color: 'white',
    fontSize: width * 0.04,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: width * 0.025,
    padding: width * 0.05,
    width: width * 0.8,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    marginVertical: height * 0.012,
    color: '#d32f2f',
  },
  modalMessage: {
    fontSize: width * 0.04,
    textAlign: 'center',
    marginBottom: height * 0.025,
    color: '#666',
  },
  modalButton: {
    backgroundColor: '#34568B',
    paddingVertical: height * 0.012,
    paddingHorizontal: width * 0.05,
    borderRadius: width * 0.012,
    minWidth: width * 0.25,
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontSize: width * 0.04,
    fontWeight: '500',
  },
});