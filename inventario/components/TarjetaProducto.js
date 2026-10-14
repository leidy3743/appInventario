// Tarjeta de un producto: foto cuadrada + nombre.
// El ancho lo decide ListaProductos según el tamaño de la pantalla.
import { Image, StyleSheet, Text, View } from 'react-native';

export default function TarjetaProducto({ producto, ancho }) {
  return (
    <View style={[styles.card, { width: ancho }]}>
      {producto.foto_url ? (
        <Image source={{ uri: producto.foto_url }} style={styles.foto} />
      ) : (
        <View style={[styles.foto, styles.sinFoto]}>
          <Text style={styles.sinFotoTexto}>Sin foto</Text>
        </View>
      )}
      <Text style={styles.nombre} numberOfLines={2}>
        {producto.nombre}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 10,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#dbe4ee',
  },
  // aspectRatio: 1 mantiene la foto cuadrada en cualquier ancho
  foto: { width: '100%', aspectRatio: 1, borderRadius: 8, backgroundColor: '#e8eef5' },
  sinFoto: { alignItems: 'center', justifyContent: 'center' },
  sinFotoTexto: { color: '#6b7c8f' },
  nombre: { fontSize: 16, fontWeight: 'bold', marginTop: 8, color: '#12263a' },
});
