const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;

// LIMPIAR TEXTO
// Convierte el texto a minúsculas, elimina caracteres raros y deja solo letras, números y espacios
export function limpiar(t) {
  t = t.toLowerCase();
  t = t.replace(/[^a-z0-9\s]/g, '');
  return t.trim();
}

// BUSCAR EN TMDB
// Hace una petición a la API de TMDB para buscar una película por título
export async function buscar_tmdb(titulo) {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(titulo)}`
    );
    const data = await res.json();

    // Si hay resultados, devuelve id titulo e imagen
    if (data.results && data.results.length > 0) {
      const peli = data.results[0];
      return {
        id: peli.id,
        imdb_id: peli.imdb_id || String(peli.id),
        title: peli.title,
        image: peli.poster_path 
          ? `https://image.tmdb.org/t/p/w500${peli.poster_path}` 
          : null,
      };
    }
    return null;
  } catch (error) {
    console.error('Error searching TMDB:', error);
    return null;
  }
}

// GEMINI
export async function analizar_imagen(imageFile) {
  try {
    // Convierte la imagen a base64
    const base64Image = await fileToBase64(imageFile);

    // la petición a Gemini
    const requestBody = {
      contents: [{
        parts: [
          { text: "Analiza esta imagen de DVDs y devuelve SOLO títulos de películas, uno por línea." },
          {
            inline_data: {
              mime_type: imageFile.type,
              data: base64Image
            }
          }
        ]
      }],
      generationConfig: {
        temperature: 0.1,
        topK: 16,
        topP: 0.8,
        maxOutputTokens: 1024,
      }
    };

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Extraer el texto generado por gemini
    let texto = '';
    if (data.candidates && data.candidates.length > 0) {
      const candidate = data.candidates[0];
      if (candidate.content && candidate.content.parts) {
        texto = candidate.content.parts
          .map(part => part.text)
          .join('\n');
      }
    }

    // Separar por líneas (cada posible peli)
    const lineas = texto.split('\n');
    const resultados = [];

    // Procesar cada línea
    for (const linea of lineas) {
      const limpio = limpiar(linea);
      if (limpio.length > 2) {
        // Buscar cada título en TMDB para obtener datos completos
        const peli = await buscar_tmdb(limpio);
        if (peli) {
          resultados.push(peli);
        }
      }
    }

    // Quitar duplicados 
    const uniqueById = [...new Map(resultados.map(item => [item.id, item])).values()];
    return uniqueById;
  } catch (error) {
    console.error('Error analyzing image:', error);
    throw error;
  }
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