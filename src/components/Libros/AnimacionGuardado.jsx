import React from 'react';
import { Modal } from 'react-bootstrap';
import '../../App.css';

const AnimacionGuardado = ({ show, onHide, tipo }) => {
  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      className="modal-guardado"
      backdrop="static"
    >
      <Modal.Body className="text-center py-5">
        <div className="animacion-guardado">
          {tipo === 'eliminar' ? (
            <i className="bi bi-trash3-fill"></i>
          ) : tipo === 'editar' ? (
            <i className="bi bi-pencil-fill"></i>
          ) : (
            <i className="bi bi-check-circle-fill"></i>
          )}
        </div>
        <h4 className="mt-4">
          {tipo === 'eliminar'
            ? 'Eliminando libro...'
            : tipo === 'editar'
            ? 'Actualizando libro...'
            : 'Guardando libro...'}
        </h4>
        <p className="text-muted">Por favor, espere un momento</p>
      </Modal.Body>
    </Modal>
  );
};

export default AnimacionGuardado;
