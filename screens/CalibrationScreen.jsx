import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Dimensions } from 'react-native';
import { globalStyles, colors } from '../styles/globalStyles';
import	{	MaterialIcons	}	from	'@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const MICROSCOPE_SCALES = [
  { label: '4x objetivo - 10x ocular', value: 4500 },
  { label: '10x objetivo - 10x ocular', value: 1800 },
  { label: '40x objetivo - 10x ocular', value: 450 },
  { label: '100x objetivo - 10x ocular', value: 180 },
];

export default function CalibrationScreen({ route, navigation }) {
  const { pixelDistance, onCalibrationComplete } = route.params;
  const [calibrationType, setCalibrationType] = useState(null);
  const [manualDistance, setManualDistance] = useState('');
  const [selectedScale, setSelectedScale] = useState(null);

  const handleConfirm = () => {
    let scale;
    if (calibrationType === 'manual') {
      scale = parseFloat(manualDistance) / pixelDistance;
    } else {
      scale = selectedScale / pixelDistance;
    }
    
    onCalibrationComplete(scale);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={width * 0.08} color={colors.navy} />
        </TouchableOpacity>
        <Text style={styles.title}>Seleccione el método de calibración</Text>
      </View>
      
      <View style={styles.methodContainer}>
        <TouchableOpacity
          style={[
            styles.methodButton,
            calibrationType === 'manual' && styles.selectedMethod
          ]}
          onPress={() => setCalibrationType('manual')}
        >
          <Text style={styles.methodText}>Manual</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.methodButton,
            calibrationType === 'automatic' && styles.selectedMethod
          ]}
          onPress={() => setCalibrationType('automatic')}
        >
          <Text style={styles.methodText}>Automático</Text>
        </TouchableOpacity>
      </View>

      {calibrationType === 'manual' && (
        <View style={styles.manualInput}>
          <Text style={styles.label}>Distancia conocida (µm):</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={manualDistance}
            onChangeText={setManualDistance}
            placeholder="Ingrese la distancia"
          />
        </View>
      )}

      {calibrationType === 'automatic' && (
        <View style={styles.scalesContainer}>
          {MICROSCOPE_SCALES.map((scale) => (
            <TouchableOpacity
              key={scale.value}
              style={[
                styles.scaleButton,
                selectedScale === scale.value && styles.selectedScale
              ]}
              onPress={() => setSelectedScale(scale.value)}
            >
              <Text style={styles.scaleText}>{scale.label}</Text>
              <Text style={styles.scaleValue}>{scale.value} µm</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <TouchableOpacity
        style={[
          styles.confirmButton,
          (!calibrationType || 
           (calibrationType === 'manual' && !manualDistance) ||
           (calibrationType === 'automatic' && !selectedScale)) && 
          styles.disabledButton
        ]}
        onPress={handleConfirm}
        disabled={
          !calibrationType || 
          (calibrationType === 'manual' && !manualDistance) ||
          (calibrationType === 'automatic' && !selectedScale)
        }
      >
        <Text style={styles.confirmButtonText}>Confirmar Calibración</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: width * 0.03,
    backgroundColor: colors.softWhite,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.03,
  },
  backButton: {
    padding: width * 0.002,
    marginRight: width * 0.055,
  },
  title: {
    flex: 1,
    fontSize: width * 0.06,
    fontWeight: 'bold',
    textAlign: 'center',
    color: colors.navy,
    marginRight: width * 0.12,
  },
  methodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: height * 0.01,
  },
  methodButton: {
    padding: width * 0.037,
    borderRadius: width * 0.02,
    backgroundColor: colors.lightGray,
    width: '45%',
  },
  selectedMethod: {
    backgroundColor: colors.mainBlue,
  },
  methodText: {
    textAlign: 'center',
    color: 'white',
    fontSize: width * 0.045,
  },
  manualInput: {
    marginVertical: height * 0.02,
  },
  label: {
    fontSize: width * 0.05,
    marginBottom: height * 0.015,
  },
  input: {
    borderWidth: height * 0.0015,
    borderColor: colors.lightGray,
    borderRadius: width * 0.02,
    padding: width * 0.025,
    fontSize: width * 0.05,
  },
  scalesContainer: {
    marginVertical: height * 0.02,
  },
  scaleButton: {
    padding: width * 0.037,
    borderRadius: width * 0.02,
    backgroundColor: colors.lightGray,
    marginBottom: height * 0.015,
  },
  selectedScale: {
    backgroundColor: colors.mainBlue,
  },
  scaleText: {
    color: 'white',
    fontSize: width * 0.05,
  },
  scaleValue: {
    color: 'white',
    fontSize: width * 0.04,
    marginTop: height * 0.004,
  },
  confirmButton: {
    backgroundColor: colors.mainBlue,
    padding: width * 0.037,
    borderRadius: width * 0.02,
    marginTop: height * 0.01,
  },
  disabledButton: {
    opacity: 0.5,
  },
  confirmButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: width * 0.05,
  },
});