import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { colors } from '../styles/globalStyles';

const { width, height } = Dimensions.get('window');

export default function CalibrationExamplesScreen({ navigation }) {
    const examples = [
        {
            image: require('../assets/ImagenConMedida.png'),
            title: 'Calibración con medida en la Imagen',
            imageUri: '../assets/ImagenConMedida.png'
        },
        {
            image: require('../assets/SinMedida18mmX100.png'),
            title: 'Calibración sin medida en imagen - 18mm y X100',
            imageUri: '../assets/SinMedida18mmX100.png'
        },
        {
            image: require('../assets/SinMedida20mmX4.png'),
            title: 'Calibración Sin medida en imagen - 20mm y X10',
            imageUri: '../assets/SinMedida20mmX4.png'
        }
    ];

    return (
        <ScrollView style={styles.container}>
            {examples.map((item, index) => (
                <TouchableOpacity
                    key={index}
                    style={styles.card}
                    onPress={() => navigation.navigate('Measurement', { 
                        imageUri: Image.resolveAssetSource(item.image).uri,
                        source: "Examples"
                    })}
                >
                    <Image source={item.image} style={styles.image} resizeMode="contain" />
                    <Text style={styles.title}>{item.title}</Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.softWhite,
    },
    card: {
        backgroundColor: colors.mainBlue,
        margin: width * 0.03,
        borderRadius: width * 0.02,
        overflow: 'hidden',
        elevation: 3,
    },
    image: {
        width: '100%',
        height: height * 0.25,
        backgroundColor: colors.softWhite,
    },
    title: {
        color: colors.softWhite,
        fontSize: width * 0.04,
        padding: width * 0.03,
        textAlign: 'center',
    }
});