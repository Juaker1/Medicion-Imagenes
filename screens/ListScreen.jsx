import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TouchableWithoutFeedback, Dimensions, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { getFontSize } from './components/responsiveFont';

const { width, height } = Dimensions.get('window');

const MeasurementActionModal = ({ visible, onClose, measurement, onNameChange, onViewMeasurement }) => {
  // Reset newName when modal opens/measurement changes
  const [newName, setNewName] = useState('');

  useEffect(() => {
    if (visible && measurement) {
      setNewName(measurement.name);
    }
  }, [visible, measurement]);

  const hasNameChanged = measurement?.name !== newName;
  const isNameValid = newName.trim() !== '';

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
            <View style={styles.actionModalContent}>
              <Text style={styles.actionModalTitle}>Opciones de medición</Text>
              <TextInput
                style={styles.actionModalInput}
                value={newName}
                onChangeText={setNewName}
                placeholder="Nombre de la medición"
              />
              <View style={styles.actionModalButtonsContainer}>
                <View style={styles.actionModalTopButtons}>
                  <TouchableOpacity
                    style={[styles.actionModalButton, styles.cancelButton]}
                    onPress={onClose}
                  >
                    <Text style={styles.actionModalButtonText}>Cancelar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.actionModalButton,
                      styles.editButton,
                      (!hasNameChanged || !isNameValid) && { opacity: 0.5 }
                    ]}
                    onPress={() => onNameChange(newName)}
                    disabled={!hasNameChanged || !isNameValid}
                  >
                    <Text style={styles.actionModalButtonText}>Cambiar Nombre</Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  style={[styles.actionModalButton, styles.viewButton, styles.viewMeasurementButton]}
                  onPress={onViewMeasurement}
                >
                  <Text style={styles.actionModalButtonText}>Ver Medición</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
const DeleteModal = ({ visible, onClose, onConfirm, message }) => (
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
            <MaterialIcons name="warning" size={width * 0.2} color="#FFA000" />
            <Text style={styles.modalTitle}>Borrar mediciones</Text>
            <Text style={styles.modalMessage}>{message}</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={onClose}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.deleteButton]}
                onPress={onConfirm}
              >
                <Text style={styles.modalButtonText}>Borrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  </Modal>
);


export default function MeasurementHistoryScreen({ route, navigation }) {
  const [localMeasurements, setLocalMeasurements] = useState(route.params.measurements);
  const [selectedMeasures, setSelectedMeasures] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedMeasurement, setSelectedMeasurement] = useState(null);
  const [showActionModal, setShowActionModal] = useState(false);


  const handleClearAll = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    const isSelectedMode = selectedMeasures.length > 0;
    if (isSelectedMode) {
      const remainingMeasurements = localMeasurements.filter(
        measure => !selectedMeasures.includes(measure.id)
      );
      setLocalMeasurements(remainingMeasurements);
      route.params.setMeasurements(remainingMeasurements);
      setSelectedMeasures([]);
    } else {
      setLocalMeasurements([]);
      route.params.setMeasurements([]);
      navigation.goBack();
    }
    setShowDeleteModal(false);
  };

  const toggleMeasureSelection = (measureId) => {
    setSelectedMeasures(prev =>
      prev.includes(measureId)
        ? prev.filter(id => id !== measureId)
        : [...prev, measureId]
    );
  };

  useEffect(() => {
    if (route.params?.measurements) {
      setLocalMeasurements(route.params.measurements);
    }
  }, [route.params?.measurements]);

  const handleViewMeasurement = () => {
    navigation.navigate('Measurement', {
      imageUri: selectedMeasurement.imageUri,
      existingMeasurement: selectedMeasurement,
      measurements: localMeasurements, // Pass current measurements
      setMeasurements: route.params.setMeasurements, // Pass the setter function
      source:route.params.source
    });
    setShowActionModal(false);
  };

  const handleMeasurementPress = (measurement) => {
    setSelectedMeasurement(measurement);
    setShowActionModal(true);
  };

  const handleNameChange = (newName) => {
    const updatedMeasurements = localMeasurements.map(m =>
      m.id === selectedMeasurement.id ? { ...m, name: newName } : m
    );
    setLocalMeasurements(updatedMeasurements);
    route.params.setMeasurements(updatedMeasurements);
    setShowActionModal(false);
  };



  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={width * 0.08} color="black" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.deleteContainer,
            localMeasurements.length === 0 && styles.disabledButton
          ]}
          onPress={handleClearAll}
          disabled={localMeasurements.length === 0}
        >
          <MaterialIcons name="delete-sweep" size={width * 0.06} color="white" />
          <Text style={styles.deleteText}>
            {selectedMeasures.length > 0
              ? `Borrar (${selectedMeasures.length})`
              : 'Borrar Todas'}
          </Text>
        </TouchableOpacity>
      </View>

      {localMeasurements.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No hay mediciones guardadas</Text>
        </View>
      ) : (
        <ScrollView style={styles.scrollView}>
          {localMeasurements.map((measurement) => (
            <TouchableOpacity
              key={measurement.id}
              onPress={() => selectedMeasures.length > 0
                ? toggleMeasureSelection(measurement.id)
                : handleMeasurementPress(measurement)}
              onLongPress={() => toggleMeasureSelection(measurement.id)}
            >
              <View style={[
                styles.measurementCard,
                selectedMeasures.includes(measurement.id) && styles.selectedCard
              ]}>
                <View style={styles.cardContent}>
                  <View style={styles.measurementInfo}>
                    <Text style={styles.measurementText}>
                      {measurement.name}
                    </Text>
                    <Text style={styles.distanceText}>
                      {measurement.distance} {measurement.units}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.checkboxContainer}
                    onPress={() => toggleMeasureSelection(measurement.id)}
                  >
                    <MaterialIcons
                      name={selectedMeasures.includes(measurement.id)
                        ? "check-box"
                        : "check-box-outline-blank"
                      }
                      size={width * 0.08}
                      color="white"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
      <DeleteModal
        visible={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        message={
          selectedMeasures.length > 0
            ? "¿Estás seguro de que deseas borrar las mediciones seleccionadas?"
            : "¿Estás seguro de que deseas borrar todas las mediciones?"
        }
      />
      <MeasurementActionModal
        visible={showActionModal}
        onClose={() => setShowActionModal(false)}
        measurement={selectedMeasurement}
        onNameChange={handleNameChange}
        onViewMeasurement={handleViewMeasurement}
      />
    </View>

  );
}

const styles = StyleSheet.create({
  // Main Container Styles
  container: {
    flex: 1,
  },
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: width * 0.03,
    backgroundColor: 'rgba(0,0,0,0)',
  },
  backButton: {
    padding: width * 0.002,
  },

  // List Styles
  scrollView: {
    flex: 1,
    padding: width * 0.03,
  },
  checkboxContainer: {
    marginRight: width * 0.03,
    padding: width * 0.01,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  measurementInfo: {
    flex: 1,
  },
  measurementCard: {
    backgroundColor: '#34568B',
    padding: width * 0.04,
    borderRadius: width * 0.02,
    marginBottom: height * 0.01,
  },
  selectedCard: {
    backgroundColor: '#d32f2f',
  },
  measurementText: {
    color: 'white',
    fontSize: getFontSize(16),
    marginBottom: height * 0.003,
    fontWeight: 'bold',
  },
  distanceText: {
    color: '#cccccc',
    fontSize: getFontSize(15),
  },

  // Empty State Styles
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#cccccc',
    fontSize: getFontSize(17),
  },
  // Delete Button Styles
  deleteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#d32f2f',
    padding: width * 0.025,
    borderRadius: width * 0.02,
    gap: width * 0.02,
  },
  deleteText: {
    color: 'white',
    fontSize: getFontSize(14),
    fontWeight: '700',
  },
  disabledButton: {
    opacity: 0.5,
  },

  // Modal Common Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Delete Modal Styles
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
    marginVertical: height * 0.01,
    color: '#34568B',
  },
  modalMessage: {
    fontSize: getFontSize(16),
    textAlign: 'center',
    marginBottom: height * 0.025,
    color: '#666',
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
  modalButtonText: {
    color: 'white',
    fontSize: getFontSize(15),
    fontWeight: '500',
  },

  // Action Modal Styles
  actionModalContent: {
    backgroundColor: 'white',
    borderRadius: width * 0.02,
    padding: width * 0.05,
    width: width * 0.8,
    alignItems: 'center',
  },
  actionModalTitle: {
    fontSize: getFontSize(23),
    fontWeight: 'bold',
    marginBottom: height * 0.02,
    color: '#34568B',
  },
  actionModalInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: width * 0.02,
    padding: width * 0.03,
    marginBottom: height * 0.02,
    fontSize: getFontSize(15),
  },
  actionModalButtonsContainer: {
    width: '100%',
    gap: height * 0.015,
  },
  actionModalTopButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: width * 0.02,
  },
  actionModalBottomButtons: {
    width: '100%',
  },
  actionModalButton: {
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.03,
    borderRadius: width * 0.02,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: height * 0.06,
  },
  actionModalButtonText: {
    color: 'white',
    fontSize: getFontSize(15),
    fontWeight: '500',
    textAlign: 'center',
  },
  fullWidthButton: {
    width: '100%',
  },
  viewMeasurementButton: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: height * 0.02,
  },
  // Button Color Variants
  cancelButton: {
    backgroundColor: '#9e9e9e',
    marginRight: width * 0.025,
  },
  deleteButton: {
    backgroundColor: '#d32f2f',
  },
  editButton: {
    backgroundColor: '#FFA000',
    marginRight: width * 0.0,
  },
  viewButton: {
    backgroundColor: '#388e3c',
  },
});