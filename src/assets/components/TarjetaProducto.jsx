import React from 'react';
import { Card } from 'react-bootstrap';
import '../../App.css';

const TarjetaProducto = ({ imagen, titulo, precio, descripcion }) => {
  return (
    <Card className="producto-card shadow-lg border-0">
      <div className="imagen-container">
        <Card.Img 
          variant="top" 
          src={imagen} 
          className="producto-imagen"
          alt={titulo}
        />
        <div className="overlay">
          <div className="overlay-content">
            <h5 className="text-white fw-bold">{titulo}</h5>
            <p className="text-white mb-2">{descripcion}</p>
            <span className="precio">${precio}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TarjetaProducto; 