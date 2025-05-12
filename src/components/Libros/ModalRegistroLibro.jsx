import React, { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

const ModalRegistroLibro = ({
  showModal,
  setShowModal,
  nuevoLibro,
  handleInputChange,
  handlePdfChange,
  handleAddLibro
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!nuevoLibro.nombre.trim()) {
      newErrors.nombre = "El nombre del libro es requerido";
    }
    if (!nuevoLibro.autor.trim()) {
      newErrors.autor = "El autor es requerido";
    }
    if (!nuevoLibro.genero.trim()) {
      newErrors.genero = "El género es requerido";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      await handleAddLibro();
      setShowModal(false);
    } catch (error) {
      console.error("Error al agregar libro:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal 
      show={showModal} 
      onHide={() => !isLoading && setShowModal(false)}
      centered
      className="modal-registro-libro"
      backdrop="static"
    >
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold">
          <i className="bi bi-book me-2"></i>
          Agregar Nuevo Libro
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="pt-4">
        <Form>
          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold">
              <i className="bi bi-book me-2"></i>
              Nombre del Libro
            </Form.Label>
            <Form.Control
              type="text"
              name="nombre"
              value={nuevoLibro.nombre}
              onChange={handleInputChange}
              placeholder="Ingresa el nombre del libro"
              className={`form-control-lg ${errors.nombre ? 'is-invalid' : ''}`}
              disabled={isLoading}
            />
            {errors.nombre && (
              <div className="invalid-feedback">{errors.nombre}</div>
            )}
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold">
              <i className="bi bi-person me-2"></i>
              Autor
            </Form.Label>
            <Form.Control
              type="text"
              name="autor"
              value={nuevoLibro.autor}
              onChange={handleInputChange}
              placeholder="Ingresa el autor"
              className={`form-control-lg ${errors.autor ? 'is-invalid' : ''}`}
              disabled={isLoading}
            />
            {errors.autor && (
              <div className="invalid-feedback">{errors.autor}</div>
            )}
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold">
              <i className="bi bi-tag me-2"></i>
              Género
            </Form.Label>
            <Form.Control
              type="text"
              name="genero"
              value={nuevoLibro.genero}
              onChange={handleInputChange}
              placeholder="Ingresa el género"
              className={`form-control-lg ${errors.genero ? 'is-invalid' : ''}`}
              disabled={isLoading}
            />
            {errors.genero && (
              <div className="invalid-feedback">{errors.genero}</div>
            )}
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold">
              <i className="bi bi-file-pdf me-2"></i>
              PDF del Libro
            </Form.Label>
            <Form.Control
              type="file"
              accept=".pdf"
              onChange={handlePdfChange}
              className="form-control-lg"
              disabled={isLoading}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer className="border-0 pt-0">
        <Button
          variant="secondary"
          onClick={() => setShowModal(false)}
          disabled={isLoading}
        >
          Cancelar
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          className="px-4"
          style={{ backgroundColor: '#0093E9', borderColor: '#0093E9' }}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Guardando...
            </>
          ) : (
            <>
              <i className="bi bi-plus-circle me-2"></i>
              Agregar Libro
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalRegistroLibro;