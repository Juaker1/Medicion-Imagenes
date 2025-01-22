import React, { useState, useEffect } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
  Modal,
  TextInput,
  TouchableWithoutFeedback
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSequence,

} from 'react-native-reanimated';
import Svg, { Line, Circle } from 'react-native-svg';
import { getFontSize } from './components/responsiveFont';

const { width, height } = Dimensions.get('window');

const Toast = ({ message, isVisible }) => {
  const opacity = useSharedValue(0);
  const zIndex = useSharedValue(0); // Start with low zIndex

  useEffect(() => {
    if (isVisible) {
      opacity.value = withTiming(1);
      zIndex.value = 1000; // High when visible
    } else {
      opacity.value = withTiming(0);
      zIndex.value = 0; // Low when hidden
    }
  }, [isVisible]);

  const toastStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    zIndex: zIndex.value,
  }));

  return (
    <Animated.View
      style={[styles.toast, toastStyle]}
      pointerEvents={isVisible ? "auto" : "none"}
    >
      <Text style={styles.toastText}>{message}</Text>
    </Animated.View>
  );
};

const NameMeasurementModal = ({ visible, onClose, onSave }) => {
  const [measurementName, setMeasurementName] = useState('');

  return (
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
              <Text style={styles.modalTitle}>Nombrar medición</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Ingrese un nombre para la medición"
                value={measurementName}
                onChangeText={setMeasurementName}
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={onClose}
                >
                  <Text style={styles.modalButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.savenameButton]}
                  onPress={() => {
                    onSave(measurementName);
                    setMeasurementName('');
                  }}
                >
                  <Text style={styles.modalButtonText}>Guardar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const EditConfirmationModal = ({ visible, onClose, onConfirm, measurement }) => {
  return (
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
              <Text style={styles.modalTitle}>Editar medición</Text>
              <Text style={styles.modalMessage}>
                ¿Deseas actualizar la medición "{measurement?.name}"?
              </Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={onClose}
                >
                  <Text style={styles.modalButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.editConfirmButton]}
                  onPress={onConfirm}
                >
                  <Text style={styles.modalButtonText}>Actualizar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default function MeasurementScreen({ route, navigation }) {
  const { imageUri } = route.params;
  const [points, setPoints] = useState([]);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [calibratedScale, setCalibratedScale] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [measurements, setMeasurements] = useState(route.params?.measurements || [])
  const [showNameModal, setShowNameModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  const imageWidth = screenWidth;
  const imageHeight = screenHeight;


  const MAX_ZOOM = 7;

  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);

  useEffect(() => {
    if (route.params?.existingMeasurement) {
      const { points: savedPoints, calibratedScale: savedScale } = route.params.existingMeasurement;
      setPoints(savedPoints);
      setCalibratedScale(savedScale);
      setIsEditMode(true);

      // Show edit mode instructions
      setToastMessage("Para salir del modo edición, presiona el botón borrar");
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    }
  }, [route.params?.existingMeasurement]);

  const handleBackPress = () => {
    const source = route.params?.source;

    if (source === 'Examples') {
      navigation.navigate('ExamplesMain');
    } else {
      navigation.navigate('HomeScreen');
    }
  };


  const calculatePixelDistance = () => {
    if (points.length !== 2) return 0;
    const dx = points[1].x - points[0].x;
    const dy = points[1].y - points[0].y;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const calculateRealDistance = () => {
    const pixelDistance = calculatePixelDistance();
    return calibratedScale ? (pixelDistance * calibratedScale).toFixed(2) : pixelDistance.toFixed(2);
  };

  const handleCalibration = () => {
    if (points.length !== 2) {
      setToastMessage("Por favor, dibuje una línea primero");
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 2000);
      return;
    }
    navigation.navigate('Calibration', {
      pixelDistance: calculatePixelDistance(),
      onCalibrationComplete: setCalibratedScale,
      source: route.params?.source
    });
  };

  const clearPoints = () => {
    if (isEditMode) {
      // Exit edit mode
      setIsEditMode(false);
    }
    // Normal clear points behavior
    setPoints([]);
    setSelectedPoint(null);

  };


  const handleImagePress = (event) => {
    const { locationX, locationY } = event.nativeEvent;
    const { width } = Dimensions.get('window');
    const hitArea = width * 0.03;

    // First check if there are already 2 points and no point is selected
    if (points.length === 2 && selectedPoint === null) {
      setToastMessage("Solo puedes colocar dos puntos. Puedes editar o borrar los existentes");
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 2000);
      return;
    }

    // Rest of the existing code...
    const isInsideExistingPoint = points.some((point, idx) => {
      const distance = Math.sqrt(
        Math.pow(locationX - point.x, 2) +
        Math.pow(locationY - point.y, 2)
      );
      return distance < hitArea;
    });

    if (isInsideExistingPoint && selectedPoint === null) {
      return;
    }

    const newPoint = {
      x: locationX,
      y: locationY
    };

    if (selectedPoint !== null) {
      setPoints(prevPoints => {
        const newPoints = [...prevPoints];
        newPoints[selectedPoint] = newPoint;
        return newPoints;
      });
      setSelectedPoint(null);
    } else if (points.length < 2) {
      setPoints(prevPoints => [...prevPoints, newPoint]);
    }
  };
  // Update renderPoints to ensure absolute positioning
  const selectPoint = (index) => {
    setSelectedPoint(prevSelected => prevSelected === index ? null : index);
  };

  const pinchGesture = Gesture.Pinch()
    .onUpdate((event) => {
      const newScale = savedScale.value * event.scale;
      scale.value = Math.min(Math.max(1, newScale), MAX_ZOOM);
    })
    .onEnd(() => {
      savedScale.value = scale.value;
    });

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      const nextTranslateX = savedTranslateX.value + event.translationX;
      const nextTranslateY = savedTranslateY.value + event.translationY;

      const scaledWidth = imageWidth * scale.value;
      const scaledHeight = imageHeight * scale.value;

      const maxTranslateX = Math.max((scaledWidth - screenWidth) / 2, 0);
      const maxTranslateY = Math.max((scaledHeight - screenHeight) / 2, 0);

      translateX.value = Math.min(Math.max(nextTranslateX, -maxTranslateX), maxTranslateX);
      translateY.value = Math.min(Math.max(nextTranslateY, -maxTranslateY), maxTranslateY);
    })
    .onEnd(() => {
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
    });

  const composedGesture = Gesture.Simultaneous(pinchGesture, panGesture);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  const resetCalibration = () => {
    setCalibratedScale(null);
    setToastMessage("Calibración eliminada");
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 2000);
  };

  const saveMeasurement = () => {
    if (points.length !== 2) {
      setToastMessage("Necesitas crear una línea de medición primero");
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 2000);
      return;
    }

    if (isEditMode) {
      setShowEditModal(true);
    } else {
      setShowNameModal(true);
    }
  };

  // Add this function
  const handleSaveMeasurement = (name) => {
    const measurement = {
      id: isEditMode ? route.params.existingMeasurement.id : Date.now(),
      name: name || 'Medición sin nombre',
      distance: calculateRealDistance(),
      units: calibratedScale ? 'µm' : 'unidades',
      points: points,
      imageUri: imageUri,
      calibratedScale: calibratedScale,
      lastModified: new Date().toISOString(),
    };

    let updatedMeasurements;
    if (isEditMode) {
      // Update existing measurement
      updatedMeasurements = measurements.map(m =>
        m.id === measurement.id ? measurement : m
      );
      setToastMessage("Medición actualizada exitosamente\nPara salir del modo edición, presiona el botón borrar");
    } else {
      // Add new measurement
      updatedMeasurements = [...measurements, measurement];
      setToastMessage("Medición guardada exitosamente");
    }

    setMeasurements(updatedMeasurements);
    if (route.params?.setMeasurements) {
      route.params.setMeasurements(updatedMeasurements);
    }

    setShowNameModal(false);
    setShowEditModal(false);
    setShowToast(true);

    setTimeout(() => {
      setShowToast(false);
    }, 2000);
  };

  const pointOuterRadius = width * 0.023; // Radio del círculo exterior
  const pointInnerRadius = width * 0.005; // Radio del punto central
  const strokeWidth = width * 0.006; // Grosor de la línea

  return (

    <View style={styles.container}>

      <Toast
        message={toastMessage}
        isVisible={showToast}
      />

      <View style={styles.topContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBackPress}
        >
          <MaterialIcons name="arrow-back" size={width * 0.08} color="white" />
        </TouchableOpacity>

        <View style={styles.pointButtonsContainer}>
          <TouchableOpacity
            style={[
              styles.pointButton,
              { opacity: selectedPoint === 0 ? 1 : 0.6 }
            ]}
            onPress={() => selectPoint(0)}
          >
            <Text style={styles.pointButtonText}>Punto 1</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.pointButton,
              { opacity: selectedPoint === 1 ? 1 : 0.6 }
            ]}
            onPress={() => selectPoint(1)}
          >
            <Text style={styles.pointButtonText}>Punto 2</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.deleteButton, points.length === 0 && styles.disabledButton]}
            onPress={clearPoints}
            disabled={points.length === 0}
          >
            <MaterialIcons name="delete" size={width * 0.075} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.calibrationContainer}>
          <TouchableOpacity
            style={styles.calibrateButton}
            onPress={handleCalibration}
          >
            <Text style={styles.calibrateButtonText}>Calibrar</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.imageContainer}>
        {calibratedScale && (

          <TouchableOpacity
            style={styles.resetCalibrationButton}
            onPress={resetCalibration}
            activeOpacity={0.7}
          >
            <MaterialIcons name="straighten" size={width * 0.07} color="white" />
          </TouchableOpacity>

        )}
        <GestureDetector gesture={composedGesture}>
          <Animated.View style={animatedStyle}>
            <TouchableWithoutFeedback onPress={handleImagePress}>
              <View>
                <Image
                  source={{ uri: imageUri }}
                  style={styles.image}
                  resizeMode="contain"
                />
                <Svg style={StyleSheet.absoluteFill}>
                  {points.length === 2 && (
                    <Line
                      x1={points[0].x}
                      y1={points[0].y}
                      x2={points[1].x}
                      y2={points[1].y}
                      stroke="white"
                      strokeWidth={strokeWidth}
                    />
                  )}

                  {points.map((point, index) => (
                    <React.Fragment key={index}>

                      <Circle
                        cx={point.x}
                        cy={point.y}
                        r={pointOuterRadius}
                        fill={selectedPoint === index ? '#FFD700' : '#FF4444'}
                        fillOpacity="0.3"
                        stroke="white"
                        strokeOpacity="0.3"
                        strokeWidth={strokeWidth}
                      />
                      <Circle
                        cx={point.x}
                        cy={point.y}
                        r={pointInnerRadius}
                        fill="white"
                      />
                    </React.Fragment>
                  ))}
                </Svg>
              </View>
            </TouchableWithoutFeedback>
          </Animated.View>
        </GestureDetector>
      </View>

      <View style={styles.infoContainer}>
        {calibratedScale ? (
          <Text style={styles.infoText}>
            Distancia: {calculateRealDistance()} µm | Escala: 1 unidad = {calibratedScale.toFixed(4)} µm
          </Text>
        ) : (
          <Text style={styles.infoText}>
            Distancia: {calculateRealDistance()} unidades | Sin calibrar
          </Text>
        )}
      </View>

      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[styles.saveButton, isEditMode && styles.editButton]}
          onPress={saveMeasurement}
        >
          <MaterialIcons
            name={isEditMode ? "edit" : "save"}
            size={width * 0.07}
            color="white"
          />
          <Text style={styles.bottomButtonText}>
            {isEditMode ? 'Actualizar Medición' : 'Guardar Medición'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.historyButton}
          onPress={() => navigation.navigate('MeasurementHistory', {
            measurements: measurements,
            setMeasurements: setMeasurements,
            source: route.params?.source
          })}
        >
          <MaterialIcons name="format-list-bulleted" size={width * 0.07} color="white" />
          <Text style={styles.bottomButtonText}>Ver Lista de Mediciones</Text>
        </TouchableOpacity>
      </View>
      <View>
        <NameMeasurementModal
          visible={showNameModal}
          onClose={() => setShowNameModal(false)}
          onSave={handleSaveMeasurement}
        />
      </View>
      <View>
        <EditConfirmationModal
          visible={showEditModal}
          onClose={() => setShowEditModal(false)}
          onConfirm={() => {
            handleSaveMeasurement(route.params.existingMeasurement.name);
          }}
          measurement={route.params?.existingMeasurement}
        />
      </View>
    </View>
  );
}

// Example responsive component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: width * 0.02,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  backButton: {
    padding: width * 0.002,
  },
  pointButtonsContainer: {
    flexDirection: 'row',
    gap: width * 0.03,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#d32f2f',
    padding: width * 0.015,
    borderRadius: width * 0.02,
  },
  disabledButton: {
    opacity: 0.5,
  },
  activePointButton: {
    backgroundColor: '#1a2f4d',
  },
  pointButton: {
    backgroundColor: '#34568B',
    padding: width * 0.027,
    borderRadius: width * 0.02,
    minWidth: width * 0.1,
  },
  pointButtonText: {
    color: 'white',
    fontSize: getFontSize(15),
  },
  calibrationContainer: {
    flexDirection: 'row',
    gap: width * 0.025,
    alignItems: 'center',
  },
  resetCalibrationButton: {
    position: 'absolute',
    top: height * 0.005,
    right: width * 0.02,
    backgroundColor: '#FFA000',
    borderRadius: width * 0.02,
    zIndex: 999,
    width: width * 0.12,  // Ancho fijo
    height: width * 0.12, // Alto fijo
    justifyContent: 'center',
    alignItems: 'center',
  },
  calibrateButton: {
    backgroundColor: '#388e3c',
    padding: width * 0.027,
    borderRadius: width * 0.02,
    minWidth: width * 0.1,
  },
  calibrateButtonText: {
    color: 'white',
    fontSize: getFontSize(15),
    textAlign: 'center',
  },
  infoContainer: {
    position: 'absolute',
    bottom: height * 0.09,
    left: width * 0.02,
    padding: width * 0.025,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: width * 0.02,
    zIndex: 2,
  },
  infoText: {
    color: 'white',
    fontSize: getFontSize(13),
    marginVertical: height * 0.001,
  },
  imageContainer: {
    flex: 1,
    overflow: 'hidden',
    zIndex: 1,
  },
  image: {
    width: '100%',
    height: '100%',
  },

  toast: {
    position: 'absolute',
    top: height * 0.08,
    left: width * 0.05,
    right: width * 0.05,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: width * 0.03,
    borderRadius: width * 0.02,
    alignItems: 'center',
  },
  toastText: {
    color: 'white',
    fontSize: getFontSize(15),
    textAlign: 'center',
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: width * 0.02,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 1,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#388e3c',
    padding: width * 0.022,
    borderRadius: width * 0.02,
    gap: width * 0.01,
  },
  editButton: {
    backgroundColor: '#FFA000', // Orange color for edit mode
  },
  historyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#34568B',
    padding: width * 0.022,
    borderRadius: width * 0.02,
    gap: width * 0.01,
  },
  bottomButtonText: {
    color: 'white',
    fontSize: getFontSize(12),
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: width * 0.02,
    padding: width * 0.05,
    width: width * 0.8,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: getFontSize(20),
    fontWeight: 'bold',
    marginBottom: height * 0.02,
    color: '#34568B',
  },
  modalInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: width * 0.02,
    padding: width * 0.03,
    marginBottom: height * 0.02,
    fontSize: getFontSize(14),
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  modalButton: {
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.05,
    borderRadius: width * 0.02,
    minWidth: width * 0.25,
    alignItems: 'center',
  },
  savenameButton: {
    backgroundColor: '#388e3c',
  },
  cancelButton: {
    backgroundColor: '#9e9e9e',
    marginRight: width * 0.025,
  },
  modalButtonText: {
    fontSize: getFontSize(15),
    color: 'white',
  },
  modalMessage: {
    fontSize: getFontSize(14),
    textAlign: 'center',
    marginBottom: height * 0.02,
    color: '#666',
    paddingHorizontal: width * 0.05,
  },
  editConfirmButton: {
    backgroundColor: '#FFA000',
  },
});