import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../styles/globalStyles';

const { width, height } = Dimensions.get('window');

const TUTORIAL_STEPS = [
  {
    id: 1,
    title: 'Bienvenido',
    description: 'Esta aplicación te permite realizar mediciones precisas en imágenes microscópicas. Sigue este tutorial para aprender cómo usarla. \n\n Primero selecciona una imagen o toma una foto del microscopio para comenzar. \n Asegúrate de que en la foto se vea todo el borde del lente como en la imagen.',
    images: [require('../assets/sample.png')]
  },
  {
    id: 2,
    title: 'Colocación de Puntos',
    description: 'Toca la pantalla para colocar puntos de medición:\n\n• Primer toque: Coloca el punto inicial\n• Segundo toque: Coloca el punto final\n• Botón "Punto 1": Modifica y reposiciona el punto 1\n• Botón "Punto 2": Modifica y reposiciona el punto 2\n• Botón "Borrar": Elimina ambos puntos\n• Puedes hacer zoom y mover la imagen para mayor precisión',
    images: [
      require('../assets/points.png'),
      require('../assets/points2.png')
    ]
  },
  {
    id: 3,
    title: 'Calibración Automática',
    description: 'Antes de medir, debes calibrar. Para calibrar, tienes que hacer una línea de medición. Con esta línea puedes elegir entre dos métodos de calibración. \nPara la calibración automática:\n\n• Haz una línea de medición que vaya desde cada borde del lente del microscopio, un diámetro del lente.\n• Luego, puedes elegir el método de calibración automática y seleccionar el aumento de tu microscopio.\n• Cuando hayas seleccionado el aumento, presiona el botón de confirmación.\n• La calibración se mantiene para que puedas hacer la medición que quieras en la imagen.',
    images: [
      require('../assets/lineaautomatica.png'),
      require('../assets/calibracionautomatica.png')
    ]
  },
  {
    id: 4,
    title: 'Calibración Manual',
    description: 'Ahora para la medición manual:\n\n• Primero haz una línea de medición de una medición de la cual conozcas su distancia en la vida real.\n• Luego selecciona la calibración manual e ingresa esta distancia conocida.\n• Cuando hayas ingresado la distancia, presiona el botón de confirmación.\n• La calibración se mantiene para que puedas hacer la medición que quieras en la imagen.',
    images: [require('../assets/lineamanual.png'),
    require('../assets/calibracionmanual.png')
    ]
  },
  {
    id: 5,
    title: 'Visualización de Medidas',
    description: 'Las mediciones se muestran antes y después de la calibración:\n\n• La distancia aparece en la esquina inferior\n• Antes de calibrar, se muestra la distancia en unidades, y sin calibración\n• Luego de la calibración se muestra la distancia en (µm) junto con la escala de la imagen',
    images: [require('../assets/distanciasincalibrar.png'),
    require('../assets/distanciacalibrada.png')
    ]
  },
  {
    id: 6,
    title: 'Eliminar Calibración',
    description: 'Con este botón puedes reiniciar la calibración.',
    images: [require('../assets/eliminarcalibracion.png')]
  },
  {
    id: 7,
    title: 'Guardar Mediciones',
    description: 'Si quieres hacer muchas mediciones, puedes guardarlas:\n\n• Primero haz una línea de medición.\n• Una vez hecha, presiona el botón "Guardar Medición" para guardar la medición.\n• Para ver tus mediciones guardadas, presiona el botón de "Ver Lista de Mediciones".',
    images: [require('../assets/guardar.png')]
  },
  {
    id: 8,
    title: 'Lista de Mediciones',
    description: 'En esta parte puedes ver todas tus mediciones guardadas:\n\n• Si te equivocaste en una medición, selecciónala y presiona el botón de "Borrar".\n• Puedes seleccionar varias mediciones para borrarlas.\n• Puedes borrar todas las mediciones si no tienes seleccionada ninguna con el botón de "Borrar Todas".',
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
        onScroll={(event) => {
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
                activeImage === index && styles.activeImageDot,
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
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.stepIndicator}>
          {TUTORIAL_STEPS.map((step, index) => (
            <View
              key={step.id}
              style={[
                styles.dot,
                currentStep === index && styles.activeDot,
              ]}
            />
          ))}
        </View>

        <Text style={styles.stepTitle}>
          {TUTORIAL_STEPS[currentStep].title}
        </Text>

        <ImageCarousel images={TUTORIAL_STEPS[currentStep].images} />

        <Text style={styles.description}>
          {TUTORIAL_STEPS[currentStep].description}
        </Text>
      </ScrollView>

      <View style={styles.navigation}>
        <TouchableOpacity
          style={[
            styles.navButton,
            currentStep === 0 && styles.disabledButton,
          ]}
          onPress={goToPreviousStep}
          disabled={currentStep === 0}
        >
          <MaterialIcons name="arrow-back" size={width * 0.06} color="white" />
          <Text style={styles.buttonText}>Anterior</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.navButton,
            currentStep === TUTORIAL_STEPS.length - 1 && styles.disabledButton,
          ]}
          onPress={goToNextStep}
          disabled={currentStep === TUTORIAL_STEPS.length - 1}
        >
          <Text style={styles.buttonText}>Siguiente</Text>
          <MaterialIcons name="arrow-forward" size={width * 0.06} color="white" />
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
    flexGrow: 1,
    padding: width * 0.05,
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: height * 0.01,
  },
  dot: {
    width: width * 0.02,
    height: width * 0.02,
    borderRadius: width * 0.1,
    backgroundColor: colors.lightGray,
    marginHorizontal: width * 0.01,
  },
  activeDot: {
    backgroundColor: colors.mainBlue,
    width: width * 0.04,
    height: width * 0.025,
  },
  stepTitle: {
    fontSize: width * 0.08,
    fontWeight: 'bold',
    color: colors.navy,
    textAlign: 'center',
    marginBottom: height * 0.01,
  },
  carouselImage: {
    width: width * 0.9,
    height: height * 0.25,
  },
  imageDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: height * 0.01,
  },
  imageDot: {
    width: width * 0.02,
    height: width * 0.02,
    borderRadius: width * 0.1,
    backgroundColor: colors.lightGray,
    marginHorizontal: width * 0.01,
  },
  activeImageDot: {
    backgroundColor: colors.mainBlue,
    width: width * 0.04,
    height: width * 0.025,
  },
  description: {
    fontSize: width * 0.043,
    color: colors.navy,
    lineHeight: width * 0.06,
    textAlign: 'center',
    marginTop: height * 0.01,
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: width * 0.03,
    backgroundColor: colors.softWhite,
    borderTopWidth: width * 0.0012,
    borderTopColor: colors.lightGray,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.mainBlue,
    padding: height * 0.01,
    borderRadius: width * 0.015,
    minWidth: width * 0.2,
    justifyContent: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    color: 'white',
    marginHorizontal: width * 0.02,
    fontSize: width * 0.045,
  },
});