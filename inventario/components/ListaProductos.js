// Lista responsive: 1 columna en teléfono, 2 en teléfono grande o
// en horizontal, 3 en tablet o pantalla ancha.
import { FlatList, StyleSheet, Text, useWindowDimensions } from 'react-native';
import TarjetaProducto from './TarjetaProducto';

const ESPACIO = 12; // separación entre tarjetas
const MAX_ANCHO = 960; // en web no dejamos que la lista crezca sin límite

export default function ListaProductos({ productos, cargando, onRefrescar, encabezado }) {
  const { width } = useWindowDimensions();

  const columnas = width >= 768 ? 3 : width >= 480 ? 2 : 1;
  const anchoUtil = Math.min(width, MAX_ANCHO) - 32; // 16 px de margen a cada lado
  const anchoTarjeta = (anchoUtil - ESPACIO * (columnas - 1)) / columnas;

  return (
    <FlatList
      data={productos}
      key={columnas} // obligatorio: FlatList no admite cambiar numColumns en caliente
      numColumns={columnas}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => <TarjetaProducto producto={item} ancho={anchoTarjeta} />}
      columnWrapperStyle={columnas > 1 ? { gap: ESPACIO } : undefined}
      contentContainerStyle={[styles.contenido, { width: anchoUtil + 32 }]}
      ListHeaderComponent={encabezado}
      ListEmptyComponent={
        !cargando && <Text style={styles.vacio}>Aún no hay productos. ¡Agrega el primero!</Text>
      }
      refreshing={cargando}
      onRefresh={onRefrescar}
      style={styles.lista}
    />
  );
}

const styles = StyleSheet.create({
  lista: { flex: 1 },
  contenido: { padding: 16, gap: ESPACIO, alignSelf: 'center' },
  vacio: { textAlign: 'center', color: '#6b7c8f', marginTop: 24, fontSize: 16 },
});
