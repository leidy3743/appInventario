// Acceso a datos: subir fotos a Storage y leer/crear productos en la tabla.
import { supabase, BUCKET } from './supabase';

// Sube la foto local al bucket y devuelve su URL pública.
export async function subirFoto(foto) {
  const tipo = foto.mimeType ?? 'image/jpeg';
  const extension = tipo.split('/')[1] ?? 'jpg';
  const ruta = `${Date.now()}.${extension}`;

  // 1. Leer la foto local como ArrayBuffer
  const respuesta = await fetch(foto.uri);
  const arrayBuffer = await respuesta.arrayBuffer();

  // 2. Subirla al bucket
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(ruta, arrayBuffer, { contentType: tipo });
  if (error) throw error;

  // 3. Obtener la URL pública
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(ruta);
  return data.publicUrl;
}

// Crea el producto. Si hay foto, primero la sube y guarda su URL.
export async function guardarProducto(nombre, foto) {
  const foto_url = foto ? await subirFoto(foto) : null;

  // 4. Insertar el registro con foto_url
  const { error } = await supabase
    .from('productos')
    .insert({ nombre: nombre.trim(), foto_url });
  if (error) throw error;
}

// Lista los productos, del más reciente al más antiguo.
export async function listarProductos() {
  const { data, error } = await supabase
    .from('productos')
    .select('id, nombre, foto_url')
    .order('id', { ascending: false });
  if (error) throw error;
  return data ?? [];
}
