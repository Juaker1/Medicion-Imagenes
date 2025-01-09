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
import Svg, { Line } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

const Toast = ({ message, isVisible }) => {
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (isVisible) {
      opacity.value = withSequence(
        withTiming(1, { duration: 300 }),
        withTiming(1, { duration: 2000 }),
        withTiming(0, { duration: 300 })
      );
    }
  }, [isVisible]);

  const toastStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.toast, toastStyle]}>
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

export default function MeasurementScreen({ route, navigation }) {
  const { imageUri } = route.params;
  const [points, setPoints] = useState([]);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [calibratedScale, setCalibratedScale] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [measurements, setMeasurements] = useState(route.params?.measurements || [])
  const [showNameModal, setShowNameModal] = useState(false);


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
    });
  };

  const clearPoints = () => {
    setPoints([]);
    setSelectedPoint(null);
  };



  const handleImagePress = (event) => {
    const { locationX, locationY } = event.nativeEvent;

    // Always use exact tap coordinates
    const newPoint = {
      x: locationX,
      y: locationY
    };

    if (selectedPoint !== null) {
      setPoints(prevPoints => {
        const newPoints = [...prevPoints];
        // Direct assignment of new coordinates
        newPoints[selectedPoint] = newPoint;
        return newPoints;
      });
      setSelectedPoint(null);
    } else if (points.length < 2) {
      setPoints(prevPoints => [...prevPoints, newPoint]);
    }
  };

  // Update renderPoints to ensure absolute positioning
  const renderPoints = () => {
    return points.map((point, index) => (
      <View
        key={index}
        style={[
          styles.pointContainer,
          {
            position: 'absolute',
            left: point.x - 6, // Offset for centering
            top: point.y - 6,  // Offset for centering
            zIndex: selectedPoint === index ? 3 : 2, // Higher z-index for selected point
          },
        ]}
      >
        <View
          style={[
            styles.point,
            { backgroundColor: selectedPoint === index ? 'yellow' : 'red' },
          ]}
        />
        <View style={styles.pointCenter} />
      </View>
    ));
  };
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
    setShowNameModal(true);
  };

  // Add this function
  const handleSaveMeasurement = (name) => {
    const measurement = {
      id: Date.now(),
      name: name || 'Medición sin nombre',
      distance: calculateRealDistance(),
      units: calibratedScale ? 'µm' : 'unidades',
      points: points,
      imageUri: imageUri,
      calibratedScale: calibratedScale
    };

    const updatedMeasurements = [...measurements, measurement];
    setMeasurements(updatedMeasurements);
    if (route.params?.setMeasurements) {
      route.params.setMeasurements(updatedMeasurements);
    }
    setShowNameModal(false);
    setToastMessage("Medición guardada exitosamente");
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 2000);
  };

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
            <MaterialIcons name="delete" size={width * 0.065} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.calibrationContainer}>
          {calibratedScale && (
            <TouchableOpacity
              style={styles.resetCalibrationButton}
              onPress={resetCalibration}
            >
              <MaterialIcons name="straighten" size={width * 0.065} color="white" />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.calibrateButton}
            onPress={handleCalibration}
          >
            <Text style={styles.calibrateButtonText}>Calibrar</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.imageContainer}>
        <GestureDetector gesture={composedGesture}>
          <Animated.View style={animatedStyle}>
            <TouchableOpacity onPress={handleImagePress} activeOpacity={1}>
              <Image
                source={{ uri: imageUri }}
                style={styles.image}
                resizeMode="contain"
              />
              {points.length === 2 && (
                <Svg style={StyleSheet.absoluteFill}>
                  <Line
                    x1={points[0].x}
                    y1={points[0].y}
                    x2={points[1].x}
                    y2={points[1].y}
                    stroke="white"
                    strokeWidth="2"
                  />
                </Svg>
              )}
              {renderPoints()}
            </TouchableOpacity>
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
          style={styles.saveButton}
          onPress={saveMeasurement}
        >
          <MaterialIcons name="save" size={width * 0.05} color="white" />
          <Text style={styles.bottomButtonText}>Guardar Medición</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.historyButton}
          onPress={() => navigation.navigate('MeasurementHistory', {
            measurements: measurements,
            setMeasurements: setMeasurements
          })}
        >
          <MaterialIcons name="format-list-bulleted" size={width * 0.05} color="white" />
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
    padding: width * 0.018,
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
    fontSize: width * 0.04,
  },
  calibrationContainer: {
    flexDirection: 'row',
    gap: width * 0.025,
    alignItems: 'center',
  },
  resetCalibrationButton: {
    backgroundColor: '#FFA000',
    padding: width * 0.018,
    borderRadius: width * 0.02,
  },
  calibrateButton: {
    backgroundColor: '#388e3c',
    padding: width * 0.027,
    borderRadius: width * 0.02,
    minWidth: width * 0.1,
  },
  calibrateButtonText: {
    color: 'white',
    fontSize: width * 0.04,
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
    fontSize: width * 0.035,
    marginVertical: height * 0.001,
  },
  imageContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  pointContainer: {
    width: width * 0.03,
    height: width * 0.026,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  point: {
    width: width * 0.03,
    height: width * 0.03,
    borderRadius: width * 0.02,
    borderWidth: width * 0.003,
    borderColor: 'white',
    backgroundColor: 'red',
    opacity: 0.4,
  },
  pointCenter: {
    position: 'absolute',
    width: width * 0.006,
    height: width * 0.006,
    backgroundColor: 'white',
    borderRadius: width * 0.2,
  },
  toast: {
    position: 'absolute',
    top: height * 0.08,
    left: width * 0.05,
    right: width * 0.05,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: width * 0.03,
    borderRadius: width * 0.02,
    zIndex: 1000,
    alignItems: 'center',
  },
  toastText: {
    color: 'white',
    fontSize: width * 0.04,
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
    fontSize: width * 0.035,
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
    fontSize: width * 0.06,
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
    fontSize: width * 0.04,
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
    fontSize: width * 0.04,
    color: 'white',
  },
});