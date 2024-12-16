// styles/globalStyles.js
import { StyleSheet } from 'react-native';

export const colors = {
  mainBlue: '#34568B',
  softWhite: '#FAFAFA',
  lightGray: '#B0BEC5',
  navy: '#001F3F',
};

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.softWhite,
    padding: 20,
  },
  button: {
    backgroundColor: colors.mainBlue,
    padding: 15,
    borderRadius: 5,
    marginVertical: 10,
  },
  buttonText: {
    color: colors.softWhite,
    textAlign: 'center',
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    color: colors.navy,
    marginBottom: 20,
    textAlign: 'center',
  },
});