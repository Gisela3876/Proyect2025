import React, { useState, useEffect } from 'react';
import { Container, Spinner } from 'react-bootstrap';
import PalabraCard from './PalabraCard';

const Pronunciacion = () => {
  const [palabraActual, setPalabraActual] = useState('');
  const [resultado, setResultado] = useState(null);
  const [escuchando, setEscuchando] = useState(false);
  const [error, setError] = useState('');
  const [micAccess, setMicAccess] = useState(null); // Estado para permisos de micrófono

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const palabras = [
    'apple',
    'banana',
    'orange',
    'grape',
    'watermelon',
    'kiwi',
    'strawberry',
    'blueberry',
    'pineapple',
    'mango',
  ];

  useEffect(() => {
    generarNuevaPalabra();
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(() => {
          console.log('Permiso de micrófono concedido');
          setMicAccess(true);
        })
        .catch((err) => {
          console.error('Permiso de micrófono denegado:', err);
          setError('No se pudo acceder al micrófono. Por favor, habilítalo en la configuración del navegador.');
          setMicAccess(false);
        });
    } else {
      setError('Este navegador no soporta acceso al micrófono.');
      setMicAccess(false);
    }
  }, []);

  const generarNuevaPalabra = () => {
    const aleatoria = palabras[Math.floor(Math.random() * palabras.length)];
    setPalabraActual(aleatoria);
    setResultado(null);
    setError('');
  };

  const iniciarReconocimiento = () => {
    if (!SpeechRecognition) {
      setError('Este navegador no soporta reconocimiento de voz. Prueba con Chrome o Edge.');
      return;
    }
    if (!micAccess) {
      setError('No tienes permiso para usar el micrófono. Habilítalo y recarga la página.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    setEscuchando(true);
    setResultado(null);
    setError('');

    recognition.start();
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.trim().toLowerCase();
      const textoLimpio = transcript.replace(/[.,!?¿¡;:]+$/, '');
      const objetivo = palabraActual.trim().toLowerCase();
      setResultado({
        correcto: textoLimpio === objetivo,
        texto: textoLimpio,
      });
      setEscuchando(false);
    };
    recognition.onerror = (event) => {
      setError(`Error de reconocimiento: ${event.error}`);
      setEscuchando(false);
    };
    recognition.onend = () => {
      setEscuchando(false);
    };
  };

  return (
    <Container className="mt-5" style={{ maxWidth: '800px' }}>
      <h2 className="text-center mb-4">Ejercicio de Pronunciación</h2>
      {micAccess === null ? (
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </Spinner>
          <p>Verificando acceso al micrófono...</p>
        </div>
      ) : (
        <PalabraCard
          palabra={palabraActual}
          escuchando={escuchando}
          resultado={resultado}
          error={error}
          onHablar={iniciarReconocimiento}
          onNueva={generarNuevaPalabra}
        />
      )}
    </Container>
  );
};

export default Pronunciacion;