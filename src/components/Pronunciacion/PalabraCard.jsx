import React from 'react';
import { Button, Alert, Card } from 'react-bootstrap';
import { MicFill, ArrowRepeat } from 'react-bootstrap-icons';

const PalabraCard = ({ palabra, escuchando, resultado, error, onHablar, onNueva }) => {
  return (
    <Card className="p-4 shadow-sm" style={{ maxWidth: '500px', margin: '0 auto' }}>
      <Card.Body className="text-center">
        <h4 className="mb-3">Pronuncia esta palabra:</h4>
        <h1 className="display-4 mb-4" style={{ fontSize: '3rem' }}>
          {palabra}
        </h1>
        <div className="d-flex justify-content-center gap-2 mb-3">
          <Button
            variant="primary"
            onClick={onHablar}
            disabled={escuchando}
            aria-label={escuchando ? 'Escuchando' : 'Hablar'}
          >
            <MicFill className="me-2" />
            {escuchando ? 'Escuchando...' : 'Hablar'}
          </Button>
          <Button
            variant="secondary"
            onClick={onNueva}
            aria-label="Generar nueva palabra"
          >
            <ArrowRepeat className="me-2" />
            Nueva Palabra
          </Button>
        </div>
        {resultado && (
          <Alert variant={resultado.correcto ? 'success' : 'danger'} className="mt-3">
            {resultado.correcto
              ? `¡Correcto! Dijiste "${resultado.texto}"`
              : `Incorrecto. Dijiste "${resultado.texto}", pero la palabra era "${palabra}"`}
          </Alert>
        )}
        {error && (
          <Alert variant="warning" className="mt-3">
            {error}
          </Alert>
        )}
      </Card.Body>
    </Card>
  );
};

export default PalabraCard;