// Pantalla Inventario: formulario (nombre + foto) y lista responsive de productos.
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; // el de react-native está obsoleto
import * as ImagePicker from 'expo-image-picker';

import ListaProductos from '../components/ListaProductos';
import { guardarProducto, listarProductos } from '../lib/productos';
import { configurado } from '../lib/supabase';
import { avisar } from '../lib/avisar';

// Opciones comunes para cámara y galería
const OPCIONES_FOTO = {
  mediaTypes: ['images'], // reemplaza a MediaTypeOptions.Images (obsoleto)
  allowsEditing: true,
  aspect: [1, 1],
  quality: 0.5, // comprime la foto para que suba más rápido
};

export default function Inventario() {
  const [nombre, setNombre] = useState('');
  const [foto, setFoto] = useState(null); // asset devuelto por ImagePicker
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [guardando, setGuardando] = useState(false);

  const cargar = async () => {
    if (!configurado) return;
    setCargando(true);
    try {
      setProductos(await listarProductos());
    } catch (e) {
      avisar('No se pudo cargar la lista', e.message);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  // Paso 2 del flujo: tomar la foto con la cámara
  const tomarFoto = async () => {
    const { granted } = await ImagePicker.requestCameraPermissionsAsync();
    if (!granted) {
      avisar('Permiso denegado', 'Activa el permiso de cámara en los Ajustes del teléfono.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync(OPCIONES_FOTO);
    if (!result.canceled) setFoto(result.assets[0]);
  };

  // Alternativa para el emulador (no tiene cámara): elegir de la galería
  const elegirDeGaleria = async () => {
    const result = await ImagePicker.launchImageLibraryAsync(OPCIONES_FOTO);
    if (!result.canceled) setFoto(result.assets[0]);
  };

  // Paso 3: subir la foto a Storage e insertar el producto
  const onGuardar = async () => {
    setGuardando(true);
    try {
      await guardarProducto(nombre, foto);
      setNombre('');
      setFoto(null);
      await cargar(); // Paso 4: refrescar la lista
    } catch (e) {
      avisar('No se pudo guardar', e.message);
    } finally {
      setGuardando(false);
    }
  };

  const puedeGuardar = nombre.trim().length > 0 && !guardando;

  const formulario = (
    <View style={styles.form}>
      <Text style={styles.titulo}>Inventario</Text>

      {!configurado && (
        <Text style={styles.alerta}>
          
        </Text>
      )}

      <TextInput
        placeholder="Nombre del producto"
        value={nombre}
        onChangeText={setNombre}
        style={styles.input}
        returnKeyType="done"
      />

      <View style={styles.fila}>
        <Boton titulo="Tomar foto" onPress={tomarFoto} style={{ flex: 1 }} />
        <Boton titulo="Galería" onPress={elegirDeGaleria} secundario style={{ flex: 1 }} />
      </View>

      {foto && (
        <View style={styles.previewCaja}>
          <Image source={{ uri: foto.uri }} style={styles.preview} />
          <Pressable onPress={() => setFoto(null)}>
            <Text style={styles.quitar}>Quitar foto</Text>
          </Pressable>
        </View>
      )}

      <Boton
        titulo={guardando ? 'Guardando…' : 'Guardar'}
        onPress={onGuardar}
        disabled={!puedeGuardar}
      />
      {guardando && <ActivityIndicator />}

      <Text style={styles.subtitulo}>Productos ({productos.length})</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.pantalla}>
      <ListaProductos
        productos={productos}
        cargando={cargando}
        onRefrescar={cargar}
        encabezado={formulario}
      />
    </SafeAreaView>
  );
}

function Boton({ titulo, onPress, disabled, secundario, style }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.boton,
        secundario && styles.botonSecundario,
        disabled && styles.botonDeshabilitado,
        pressed && { opacity: 0.8 },
        style,
      ]}
    >
      <Text style={[styles.botonTexto, secundario && styles.botonTextoSecundario]}>{titulo}</Text>
    </Pressable>
  );
}

const LILA = '#7B4FA6';

const styles = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: '#f2f6fb' },
  form: { gap: 12, marginBottom: 4 },
  titulo: { fontSize: 28, fontWeight: 'bold', color: LILA },
  subtitulo: { fontSize: 18, fontWeight: 'bold', color: '#12263a', marginTop: 8 },
  alerta: { backgroundColor: '#fff4d6', color: '#7a5600', padding: 12, borderRadius: 8 },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#c9d6e3',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  fila: { flexDirection: 'row', gap: 12 },
  boton: {
    backgroundColor: LILA,
    borderWidth: 1.5,
    borderColor: LILA,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  botonSecundario: { backgroundColor: '#fff' },
  botonDeshabilitado: { backgroundColor: '#9fb3c8', borderColor: '#9fb3c8' },
  botonTexto: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  botonTextoSecundario: { color: LILA },
  previewCaja: { alignItems: 'center', gap: 6 },
  preview: { width: 180, height: 180, borderRadius: 12 },
  quitar: { color: '#b3261e', fontWeight: '600' },
});
