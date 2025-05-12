import React from "react";
import { Modal, Button } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

const ModalEliminacionProducto = ({
  showDeleteModal,
  setShowDeleteModal,
  handleDeleteProducto,
  isLoading, // Recibir isLoading desde Productos
}) => {
  const handleClose = () => {
    if (!isLoading) {
      setShowDeleteModal(false);
    }
  };

  return (
    <Modal
      show={showDeleteModal}
      onHide={handleClose}
      centered
      backdrop={isLoading ? "static" : true}
      keyboard={!isLoading}
    >
      <Modal.Header closeButton>
        <Modal.Title>Confirmar Eliminación</Modal.Title>
      </Modal.Header>
      <Modal.Body>¿Estás seguro de que deseas eliminar este producto?</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} disabled={isLoading}>
          Cancelar
        </Button>
        <Button variant="danger" onClick={handleDeleteProducto} disabled={isLoading}>
          {isLoading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Eliminando
            </>
          ) : (
            <>
              <i className="bi bi-trash me-2"></i>
              Eliminar
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEliminacionProducto;