const API_URL = import.meta.env.VITE_API_URL;

// ANALIZAR IMAGEN
// Envía la imagen al backend, que se encarga de llamar a Gemini y buscar las películas en TMDB.
// De esta forma la clave de la API nunca queda expuesta en el cliente.
export async function analizar_imagen(imageFile, token) {
  // Convierte la imagen a base64 para enviarla por la API
  const base64Image = await fileToBase64(imageFile);

  const response = await fetch(`${API_URL}/analyze-image/`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ image_data: base64Image, mime_type: imageFile.type }),
  });

  if (!response.ok) {
    throw new Error(`Error al analizar imagen: ${response.status}`);
  }

  return await response.json();
}

// Convierte la imagen a base64 para enviarlo por API
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      // Quita el prefijo tipo: data:image/jpeg;base64,
      const base64 = reader.result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = error => reject(error);
  });
}
