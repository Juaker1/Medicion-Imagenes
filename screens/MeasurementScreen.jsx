import React, { useState, useEffect } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
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

export default function MeasurementScreen({ route, navigation }) {
  const { imageUri } = route.params;
  const [points, setPoints] = useState([]);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [calibratedScale, setCalibratedScale] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [measurements, setMeasurements] = useState([]);

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
    
    // Store raw coordinates without scaling
    const x = locationX;
    const y = locationY;

    if (selectedPoint !== null) {
      const updatedPoints = [...points];
      updatedPoints[selectedPoint] = { x, y };
      setPoints(updatedPoints);
      setSelectedPoint(null);
    } else if (points.length < 2) {
      setPoints([...points, { x, y }]);
    }
  };

  const renderPoints = () => {
    return points.map((point, index) => (
      <View
        key={index}
        style={[
          styles.pointContainer,
          {
            left: point.x - 6,
            top: point.y - 6,
            position: 'absolute',
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
    setSelectedPoint(index);
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
  
    const measurement = {
      id: Date.now(),
      distance: calculateRealDistance(),
      units: calibratedScale ? 'µm' : 'unidades',
      timestamp: new Date().toLocaleString(),
    };
  
    setMeasurements(prev => [...prev, measurement]);
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
          onPress={() => navigation.navigate('HomeScreen')}
        >
          <MaterialIcons name="arrow-back" size={32} color="white" />
        </TouchableOpacity>
        
        <View style={styles.pointButtonsContainer}>
          <TouchableOpacity
            style={styles.pointButton}
            onPress={() => selectPoint(0)}
          >
            <Text style={styles.pointButtonText}>Punto 1</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.pointButton}
            onPress={() => selectPoint(1)}
          >
            <Text style={styles.pointButtonText}>Punto 2</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.deleteButton, points.length === 0 && styles.disabledButton]}
            onPress={clearPoints}
            disabled={points.length === 0}
          >
            <MaterialIcons name="delete" size={24} color="white" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.calibrationContainer}>
          {calibratedScale && (
            <TouchableOpacity
              style={styles.resetCalibrationButton}
              onPress={resetCalibration}
            >
              <MaterialIcons name="straighten" size={24} color="white" />
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
    <MaterialIcons name="save" size={24} color="white" />
    <Text style={styles.bottomButtonText}>Guardar Medición</Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={styles.historyButton}
    onPress={() => navigation.navigate('MeasurementHistory', { 
      measurements: measurements, 
      setMeasurements: setMeasurements 
    })}
  >
    <MaterialIcons name="format-list-bulleted" size={24} color="white" />
    <Text style={styles.bottomButtonText}>Ver Lista de Mediciones</Text>
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
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  backButton: {
    padding: 5,
  },
  pointButtonsContainer: {
    flexDirection: 'row',
    gap: 10,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#d32f2f',
    padding: 7,
    borderRadius: 5,
  },
  disabledButton: {
    opacity: 0.5,
  },
  pointButton: {
    backgroundColor: '#34568B',
    padding: 10,
    borderRadius: 5,
    minWidth: 80,
  },
  calibrationContainer: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  resetCalibrationButton: {
    backgroundColor: '#FFA000',
    padding: 7,
    borderRadius: 5,
  },
  calibrateButton: {
    backgroundColor: '#388e3c',
    padding: 10,
    borderRadius: 5,
    minWidth: 100,
  },
  calibrateButtonText: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
  },
  infoContainer: {
    position: 'absolute',
    bottom: 80,
    left: 20,
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 5,
    zIndex: 2, 
  },
  infoText: {
    color: 'white',
    fontSize: 16,
    marginVertical: 2,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  pointButton: {
    padding: 10,
    backgroundColor: '#34568B',
    borderRadius: 5,
  },
  pointButtonText: {
    color: 'white',
    fontSize: 14,
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
    position: 'absolute',
    width: 12,
    height: 12,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  point: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: 'white',
    backgroundColor: 'red',
    opacity: 0.4,
  },
  pointCenter: {
    position: 'absolute',
    width: 2,
    height: 2,
    backgroundColor: 'white',
    borderRadius: 1,
  },
  distanceContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 5,
  },
  distanceText: {
    color: 'white',
    fontSize: 16,
  },
  toast: {
    position: 'absolute',
    top: 90,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 15,
    borderRadius: 8,
    zIndex: 1000,
    alignItems: 'center',
  },
  toastText: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
  },

  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 1,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#388e3c',
    padding: 10,
    borderRadius: 5,
    gap: 8,
  },
  historyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#34568B',
    padding: 10,
    borderRadius: 5,
    gap: 8,
  },
  bottomButtonText: {
    color: 'white',
    fontSize: 12,
  },
});
