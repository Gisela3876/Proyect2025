import React, { useEffect, useState } from 'react';
import { collection, addDoc, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../../assets/database/firebaseconfig';
import { Button, Form, ListGroup, Spinner, Modal } from 'react-bootstrap';

const ChatIA = ({ showChatModal, setShowChatModal }) => {
  const [mensaje, setMensaje] = useState("");
  const [mensajes, setMensajes] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null); // Added to display errors

  const chatCollection = collection(db, "chat");

  useEffect(() => {
    const q = query(chatCollection, orderBy("timestamp", "asc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const mensajesObtenidos = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMensajes(mensajesObtenidos);
        setError(null);
      },
      (err) => {
        console.error("Error al cargar mensajes del chat:", err);
        setError("No se pudieron cargar los mensajes del chat.");
      }
    );
    return () => unsubscribe();
  }, []);

  const obtenerRespuestaIA = async (promptUsuario) => {
    const apikey = import.meta.env.VITE_GOOGLE_AI_API_KEY;
    const prompt = `Extrae el nombre y la descripción de categoría en este mensaje: "${promptUsuario}". Si el usuario no provee una descripción, genera una descripción corta basándote en el nombre. Asegúrate que el nombreCategoria y descripcionCategoria comiencen con mayúsculas. Devuélvelo en JSON como {"nombreCategoria": "...", "descripcionCategoria": "..."}. Si el mensaje no contiene información suficiente, devuelve un mensaje de error en formato JSON como {"error": "El mensaje no contiene la información solicitada."}.`;

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apikey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: prompt,
                  },
                ],
              },
            ],
            generationConfig: {
              response_mime_type: "application/json",
            },
          }),
        }
      );

      if (response.status === 429) {
        return JSON.stringify({ error: "Has alcanzado el límite de solicitudes. Intenta de nuevo más tarde." });
      }

      if (!response.ok) {
        throw new Error(`Error en la solicitud a la API: ${response.statusText}`);
      }

      const data = await response.json();
      const respuestaIA = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!respuestaIA) {
        return JSON.stringify({ error: "No hubo respuesta de la IA." });
      }

      return respuestaIA;
    } catch (error) {
      console.error("Error al obtener respuesta de la IA:", error);
      return JSON.stringify({ error: "No se pudo conectar con la IA. Verifica tu conexión o API Key." });
    }
  };

  const enviarMensaje = async () => {
    if (!mensaje.trim()) return;

    const nuevoMensaje = {
      texto: mensaje, // Use the actual user input
      emisor: "usuario",
      timestamp: new Date(),
    };

    setCargando(true);
    setMensaje("");
    setError(null);

    try {
      await addDoc(chatCollection, nuevoMensaje);
      const respuestaIA = await obtenerRespuestaIA(mensaje);

      // First, check if respuestaIA is a valid JSON string
      let datos;
      try {
        datos = JSON.parse(respuestaIA);
      } catch (err) {
        console.error("Error al procesar el JSON:", err);
        await addDoc(chatCollection, {
          texto: `La IA devolvió una respuesta inválida: ${respuestaIA}`,
          emisor: "ia",
          timestamp: new Date(),
        });
        return;
      }

      // Check if the response contains an error
      if (datos.error) {
        await addDoc(chatCollection, {
          texto: datos.error,
          emisor: "ia",
          timestamp: new Date(),
        });
        return;
      }

      // If no error, proceed to register the category
      await addDoc(chatCollection, {
        texto: `ok, vamos a registrar ${JSON.stringify(datos)} en la base de datos.`,
        emisor: "ia",
        timestamp: new Date(),
      });

      if (datos.nombreCategoria && datos.descripcionCategoria) {
        await addDoc(collection(db, "categorias"), {
          nombreCategoria: datos.nombreCategoria,
          descripcionCategoria: datos.descripcionCategoria,
        });
        await addDoc(chatCollection, {
          texto: `Categoría "${datos.nombreCategoria}" registrada con éxito.`,
          emisor: "ia",
          timestamp: new Date(),
        });
      } else {
        await addDoc(chatCollection, {
          texto: "No se pudo registrar la categoría. El JSON no contiene la información esperada.",
          emisor: "ia",
          timestamp: new Date(),
        });
      }
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
      await addDoc(chatCollection, {
        texto: "Hubo un error al procesar tu solicitud. Por favor, intenta de nuevo más tarde.",
        emisor: "ia",
        timestamp: new Date(),
      });
    } finally {
      setCargando(false);
    }
  };

  return (
    <Modal show={showChatModal} onHide={() => setShowChatModal(false)} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Chat con IA</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && (
          <div className="alert alert-danger text-center" role="alert">
            {error}
          </div>
        )}
        <ListGroup style={{ maxHeight: "300px", overflowY: "auto" }}>
          {mensajes.map((msg) => (
            <ListGroup.Item key={msg.id} variant={msg.emisor === "ia" ? "light" : "primary"}>
              <strong>{msg.emisor === "ia" ? "IA: " : "Tú: "}</strong>
              {msg.texto}
            </ListGroup.Item>
          ))}
        </ListGroup>
        <Form.Control
          className="mt-3"
          type="text"
          placeholder="Escribe tu mensaje..."
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && enviarMensaje()}
          disabled={cargando}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowChatModal(false)}>
          Cerrar
        </Button>
        <Button onClick={enviarMensaje} disabled={cargando}>
          {cargando ? <Spinner size="sm" animation="border" /> : "Enviar"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ChatIA;