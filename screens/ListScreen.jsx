import React, {useState} from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

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
              <MaterialIcons name="warning" size={40} color="#FFA000" />
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
          <MaterialIcons name="arrow-back" size={32} color="black" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.deleteContainer,
            localMeasurements.length === 0 && styles.disabledButton
          ]}
          onPress={handleClearAll}
          disabled={localMeasurements.length === 0}
        >
          <MaterialIcons name="delete-sweep" size={24} color="white" />
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
    padding: 15,
    backgroundColor: 'rgba(0,0,0,0)',
  },
  backButton: {
    padding: 5,
  },
  clearButton: {
    padding: 5,

  },
  title: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
    padding: 15,
  },
  measurementCard: {
    backgroundColor: '#34568B',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  selectedCard: {
    backgroundColor: '#d32f2f',
  },
  measurementText: {
    color: 'white',
    fontSize: 16,
    marginBottom: 5,
  },
  timestampText: {
    color: '#cccccc',
    fontSize: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#cccccc',
    fontSize: 16,
  },
  deleteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#d32f2f',
    padding: 10,
    borderRadius: 5,
    gap: 8,
  },
  deleteText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
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
    borderRadius: 10,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#34568B',
  },
  modalMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    minWidth: 100,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#9e9e9e',
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: '#d32f2f',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});