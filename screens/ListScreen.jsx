import React, {useState} from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TouchableWithoutFeedback, Dimensions} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

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
              onPress={() => toggleMeasureSelection(measurement.id)}
            >
              <View style={[
                styles.measurementCard,
                selectedMeasures.includes(measurement.id) && styles.selectedCard
              ]}>
                <Text style={styles.measurementText}>
                  Distancia: {measurement.distance} {measurement.units}
                </Text>
                <Text style={styles.timestampText}>
                  {measurement.timestamp}
                </Text>
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
    </View>

  );
}

const styles = StyleSheet.create({
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
  scrollView: {
    flex: 1,
    padding: width * 0.03,
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
    fontSize: width * 0.045,
    marginBottom: height * 0.003,
  },
  timestampText: {
    color: '#cccccc',
    fontSize: width * 0.04,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#cccccc',
    fontSize: width * 0.045,
  },
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
    fontSize: width * 0.04,
    fontWeight: '700',
  },
  disabledButton: {
    opacity: 0.5,
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
    fontSize: width * 0.07,
    fontWeight: 'bold',
    marginVertical: height * 0.01,
    color: '#34568B',
  },
  modalMessage: {
    fontSize: width * 0.05,
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
  cancelButton: {
    backgroundColor: '#9e9e9e',
    marginRight: width * 0.025,
  },
  deleteButton: {
    backgroundColor: '#d32f2f',
  },
  modalButtonText: {
    color: 'white',
    fontSize: width * 0.05,
    fontWeight: '500',
  },
});