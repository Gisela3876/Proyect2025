import React from "react";
import { Modal, Form, Button } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

const ModalEdicionCategoria = ({
  show,
  handleClose,
  handleSave,
  categoria,
  setCategoria
}) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCategoria(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!categoria) {
    return null;
  }

  return (
    <Modal 
      show={show} 
      onHide={handleClose}
      size="lg"
      centered
    >
      <Modal.Header 
        closeButton 
        className="border-0 pb-0"
        style={{
          background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
          borderRadius: '8px 8px 0 0',
          padding: '1.5rem'
        }}
      >
        <Modal.Title className="h5 m-0">
          <div className="d-flex align-items-center">
            <div 
              className="me-3 p-2 rounded-circle"
              style={{
                background: 'rgba(0, 147, 233, 0.1)',
                color: '#0093E9'
              }}
            >
              <i className="bi bi-pencil-square fs-5"></i>
            </div>
            Editar Categoría
          </div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4">
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Nombre de la categoría</Form.Label>
            <Form.Control
              type="text"
              name="nombreCategoria"
              value={categoria.nombreCategoria || ''}
              onChange={handleInputChange}
              placeholder="Ingrese el nombre de la categoría"
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="descripcionCategoria"
              value={categoria.descripcionCategoria || ''}
              onChange={handleInputChange}
              placeholder="Ingrese la descripción de la categoría"
              required
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer className="border-0 pt-0">
        <Button variant="secondary" onClick={handleClose}>
          Cancelar
        </Button>
        <Button 
          variant="primary" 
          onClick={handleSave}
          disabled={!categoria.nombreCategoria || !categoria.descripcionCategoria}
        >
          Guardar Cambios
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEdicionCategoria;