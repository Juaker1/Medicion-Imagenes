import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../styles/globalStyles';

const TUTORIAL_STEPS = [
  {
    id: 1,
    title: 'Bienvenido',
    description: 'Esta aplicación te permite realizar mediciones precisas en imágenes microscópicas. Sigue este tutorial para aprender cómo usarla. Primero selecciona una imagen o toma una foto para comenzar.',
    images: []
  },
  {
    id: 2,
    title: 'Colocación de Puntos',
    description: 'Toca la pantalla para colocar puntos de medición:\n\n• Primer toque: Coloca el punto inicial\n• Segundo toque: Coloca el punto final\n• Botón "Punto 1": Modifica y reposiciona el punto1 \n• Botón "Punto 2": Modifica y reposiciona el punto 2 \n• Botón "Borrar": Elimina ambos puntos\n• Puedes hacer zoom y mover la imagen para mayor precisión',
    images: [
      require('../assets/points.png'),
      require('../assets/points2.png')
    ]
  },
  {
    id: 3,
    title: 'Calibración Automatica',
    description: 'Antes de medir, debes calibrar, para calibrar tienes que hacer una linea de medición, con esta linea puedes elegir entre dos metodos de calibración, con la calibración automatica:\n\n• Haz una linea de medición que vaya desde cada borde del lente del microscopio, un diametro del lente.\n• Luego, puedes elegir el metodo de calibración automatica, y seleccionar el aumento de tu microscopio.\n• Cuando hayas seleccionado el aumento, presiona el boton de confirmación.\n• La calibración se mantiene para mediciones posteriores.',
    images: [
      require('../assets/lineaautomatica.png'),
      require('../assets/calibracionautomatica.png')
    ]
  },
  {
    id: 4,
    title: 'Calibración Manual',
    description: 'Ahora para la medición manual:\n\n• Primero haz una linea de medición de una medición de la cual conozcas su distancia en la vida real.\n• Luego selecciona la calibración manual e ingresa esta distancia conocida.\n• Cuando hayas seleccionado el aumento, presiona el boton de confirmación.\n• La calibración se mantiene para mediciones posteriores.',
    images: [require('../assets/lineamanual.png'),
      require('../assets/calibracionmanual.png')
    ]
  },
  {
    id: 5,
    title: 'Visualización de Medidas',
    description: 'Las mediciones se muestran antes y despues de la calibración:\n\n• La distancia aparece en la esquina inferior\n• Antes de calibrar, se muestra la distancia en unidades, y sin calibración\n• Luego de la calibraciíon se muestra la distancia en (µm) junto con la escala de la imagen',
    images: [require('../assets/distanciasincalibrar.png'),
      require('../assets/distanciacalibrada.png')
    ]
  },
  {
    id: 6,
    title: 'Reinicio y Borrado',
    description: 'Con este botón puedes reiniciar la calibración.',
    images: [require('../assets/eliminarcalibracion.png')]
  },
  {
    id: 7,
    title: 'Guardar Mediciones',
    description: 'Si quieres hacer muchas mediciones puedes guardarlas: \n\n• Primero haz una linea de medición.\n• Una vez hecha, presiona el boton "Guardar Medición" para guardar la medición. \n • Para ver tus mediciones guardadas presiona el boton de "Ver Lista de Mediciones".',
    images: [require('../assets/guardar.png')]
  },
  {
    id: 8,
    title: 'Lista de Mediciones',
    description: 'En esta parte puedes ver todas tus mediciones guardadas: \n\n• Si te equivocaste en una medición, seleccionala y presiona el botón de "Borrar". \n• Puedes seleccionar varias mediciones para borrarlas. \n• Puedes borrar todas las mediciones si no tienes seleccionada ninguna con el boton de "Borrar Todas".',
    images: [require('../assets/Lista1.png'),
      require('../assets/Lista2.png'),
      require('../assets/Lista3.png'),
      require('../assets/Lista4.png')
    ]
  }
];

const ImageCarousel = ({ images }) => {
  const [activeImage, setActiveImage] = useState(0);

  if (!images || images.length === 0) return null;

  return (
    <View>
      <ScrollView 
        horizontal 
        pagingEnabled 
        showsHorizontalScrollIndicator={false}
        onScroll={event => {
          const slideSize = event.nativeEvent.layoutMeasurement.width;
          const index = event.nativeEvent.contentOffset.x / slideSize;
          setActiveImage(Math.round(index));
        }}
        scrollEventThrottle={200}
      >
        {images.map((image, index) => (
          <Image
            key={index}
            source={image}
            style={styles.carouselImage}
            resizeMode="contain"
          />
        ))}
      </ScrollView>
      {images.length > 1 && (
        <View style={styles.imageDots}>
          {images.map((_, index) => (
            <View
              key={index}
              style={[
                styles.imageDot,
                activeImage === index && styles.activeImageDot
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
};

export default function TutorialScreen() {
  const [currentStep, setCurrentStep] = useState(0);

  const goToNextStep = () => {
    if (currentStep < TUTORIAL_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.stepIndicator}>
          {TUTORIAL_STEPS.map((step, index) => (
            <View
              key={step.id}
              style={[
                styles.dot,
                currentStep === index && styles.activeDot
              ]}
            />
          ))}
        </View>

        <Text style={styles.stepTitle}>
          {TUTORIAL_STEPS[currentStep].title}
        </Text>

        <ImageCarousel 
        key = {currentStep}
        images={TUTORIAL_STEPS[currentStep].images} />

        <Text style={styles.description}>
          {TUTORIAL_STEPS[currentStep].description}
        </Text>
      </ScrollView>

      <View style={styles.navigation}>
        <TouchableOpacity
          style={[styles.navButton, currentStep === 0 && styles.disabledButton]}
          onPress={goToPreviousStep}
          disabled={currentStep === 0}
        >
          <MaterialIcons name="arrow-back" size={24} color="white" />
          <Text style={styles.buttonText}>Anterior</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navButton, currentStep === TUTORIAL_STEPS.length - 1 && styles.disabledButton]}
          onPress={goToNextStep}
          disabled={currentStep === TUTORIAL_STEPS.length - 1}
        >
          <Text style={styles.buttonText}>Siguiente</Text>
          <MaterialIcons name="arrow-forward" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.softWhite,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.lightGray,
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: colors.mainBlue,
    width: 12,
    height: 12,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.navy,
    textAlign: 'center',
    marginBottom: 20,
  },
  carouselImage: {
    width: Dimensions.get('window').width - 40,
    height: 200,
  },
  imageDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  imageDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.lightGray,
    marginHorizontal: 4,
  },
  activeImageDot: {
    backgroundColor: colors.mainBlue,
    width: 10,
    height: 10,
  },
  description: {
    fontSize: 16,
    color: colors.navy,
    lineHeight: 24,
    textAlign: 'center',
    marginTop: 20,
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: colors.softWhite,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.mainBlue,
    padding: 10,
    borderRadius: 5,
    minWidth: 120,
    justifyContent: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    color: 'white',
    marginHorizontal: 5,
  },
});