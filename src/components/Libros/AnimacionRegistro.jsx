import React from 'react';
import { Modal } from 'react-bootstrap';
import '../../App.css';

const AnimacionRegistro = ({ show, onHide, tipo = 'guardar' }) => {
  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      className="modal-registro"
      backdrop="static"
    >
      <Modal.Body className="text-center py-5">
        <div className="animacion-registro">
          <i className="bi bi-check-circle-fill text-success"></i>
        </div>
        <h4 className="mt-4">
          {tipo === 'editar' ? 'Actualizando libro...' : 'Guardando libro...'}
        </h4>
        <p className="text-muted">Por favor, espere un momento</p>
      </Modal.Body>
    </Modal>
  );
};

export default AnimacionRegistro;
