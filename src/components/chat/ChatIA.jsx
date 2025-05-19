import React, { useState, useEffect, use } from 'react';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../../database/firebaseConfig';
import { Button, Form, ListGroup, Spinner, Modal} from "react-bootstrap"

const ChatIA = ({showChatModal, setshowChatModal }) => {
    // Código del componente 
};
export default ChatIA;

const [mensaje, setMensaje] = useState("");
const [mensajes, setMensajes] = useState ([]);
const [cargando, setCargando] = useState (false);

const chatCollection = collection(db, "chat");

useEffect(()=> {
    const q = query(chatCollection, orderBy ("timestamp", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot)=> {
        const mensajesObtenidos = snapshot.docs.map ((doc) => ({
            id: doc. id,
            ...doc.data(),
        }));
        setMensajes(mensajesObtenidos);
    });
    return () => unsubscribe();
}, []);

const enviarMensaje = async () => {
    if (!mensaje.trim()) return;
    const nuevoMensaje = {
        texto: mensaje,
        emisor: "usurio",
        timestamp: new Date(),
    };
    setCargando(true);
    setMensaje("");

    try {
        await addDoc(chatCollection, nuevoMensaje);
        const respuestoIA = await obtenerRespuestaIA(mensaje);
        await addDoc(chatCollection, {
            texto:'Ok, vamos a registar ${respuestaIA} en la base de datos.', 
            emisor:"ia", 
            timestamp: new Date (),
          });
          try {
            const datos = JSON.parse(respuestoIA);
            if (datos.nombre && datos.descripcion) {
                await addDoc (collection(db, "categorias"), {
                    nombre: datos. nombre,
                    descripcion: datos.descripcion,
                });
                await addDoc(chatCollection, {
                    texto: `Categoría "${datos.nombre}" registrada con éxito.`,
                    emisor: "IA",
                    timestamp: new Date(),
                });
            } else {
                await addDoc(chatCollection, {
                  texto: "No se pudo registrar la categoría. El JSON no contiene la información esperada.",
                  emisor: "IA",
                  timestamp: new Date(),
                });
            }
} catch (err) {
      console.error("Error al procesar el JSON:", err);
      await addDoc(chatCollection, {
        texto: "La IA no devolvió un JSON válido.",
        emisor: "IA",
        timestamp: new Date(),
      });
          }
    } catch (error) {
        console.error("Error al enviar mensaje:", error);
        await addDoc(chatCollection, {
          texto: "Hubo un error al procesar tu solicitud. Por favor, intenta de nuevo más tarde.",
          emisor: "IA",
          timestamp: new Date(),
        });
    } finally {
        setCargando(false);
      }
    };