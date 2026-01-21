
import { GoogleGenAI } from "@google/genai";

export async function getGameCommentary(event: string, score: number): Promise<string> {
  try {
    // Intentar obtener la API KEY de Vite o process.env de forma segura sin 'any'
    const viteApiKey = (import.meta as unknown as { env: Record<string, string> }).env?.VITE_API_KEY;
    const processApiKey = (typeof process !== 'undefined' && process.env) ? (process.env as Record<string, string>).API_KEY : undefined;
    const apiKey = viteApiKey || processApiKey;
    
    if (!apiKey) {
      console.warn("API Key no configurada o inaccesible desde el navegador. Usando respuesta por defecto.");
      return "SISTEMA OPERATIVO NOMINAL.";
    }

    const ai = new GoogleGenAI(apiKey);
    const model = ai.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
    });

    const prompt = `El jugador está en un juego de Pac-Man retro-futurista. Evento: ${event}. Puntaje: ${score}. Da un comentario corto, sarcástico y estilo cyberpunk en ESPAÑOL (máximo 12 palabras).`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text() || "DATOS ENCRIPTADOS.";
  } catch (error) {
    console.error("Fallo IA", error);
    return "CONEXIÓN NEURONAL PERDIDA.";
  }
}
