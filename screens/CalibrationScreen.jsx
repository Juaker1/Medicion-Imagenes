import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { globalStyles, colors } from '../styles/globalStyles';
import	{	MaterialIcons	}	from	'@expo/vector-icons';

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
          <MaterialIcons name="arrow-back" size={32} color={colors.navy} />
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
    padding: 20,
    backgroundColor: colors.softWhite,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    padding: 5,
    marginRight: 10,
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: colors.navy,
    marginRight: 47,
  },
  methodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  methodButton: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: colors.lightGray,
    width: '45%',
  },
  selectedMethod: {
    backgroundColor: colors.mainBlue,
  },
  methodText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 16,
  },
  manualInput: {
    marginVertical: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  scalesContainer: {
    marginVertical: 20,
  },
  scaleButton: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: colors.lightGray,
    marginBottom: 10,
  },
  selectedScale: {
    backgroundColor: colors.mainBlue,
  },
  scaleText: {
    color: 'white',
    fontSize: 16,
  },
  scaleValue: {
    color: 'white',
    fontSize: 14,
    marginTop: 5,
  },
  confirmButton: {
    backgroundColor: colors.mainBlue,
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  disabledButton: {
    opacity: 0.5,
  },
  confirmButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
  
});