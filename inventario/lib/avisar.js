// Alert.alert no muestra nada en la versión web, así que usamos window.alert allí.
import { Alert, Platform } from 'react-native';

export function avisar(titulo, mensaje) {
  if (Platform.OS === 'web') {
    window.alert(`${titulo}\n\n${mensaje}`);
  } else {
    Alert.alert(titulo, mensaje);
  }
}
