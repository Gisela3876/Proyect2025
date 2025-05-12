import React, { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

const ModalEdicionLibro = ({
  showEditModal,
  setShowEditModal,
  libroEditado,
  handleEditInputChange,
  handleEditPdfChange,
  setLibroEditado,
  setPdfFile,
  handleEditLibro
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!libroEditado?.nombre?.trim()) {
      newErrors.nombre = "El nombre del libro es requerido";
    }
    if (!libroEditado?.autor?.trim()) {
      newErrors.autor = "El autor es requerido";
    }
    if (!libroEditado?.genero?.trim()) {
      newErrors.genero = "El género es requerido";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      await handleEditLibro();
      setShowEditModal(false);
    } catch (error) {
      console.error("Error al editar libro:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!libroEditado) return null;

  return (
    <Modal 
      show={showEditModal} 
      onHide={() => !isLoading && setShowEditModal(false)}
      centered
      className="modal-edicion-libro"
      backdrop="static"
    >
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold">
          <i className="bi bi-pencil-square me-2"></i>
          Editar Libro
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
              value={libroEditado.nombre}
              onChange={handleEditInputChange}
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
              value={libroEditado.autor}
              onChange={handleEditInputChange}
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
              value={libroEditado.genero}
              onChange={handleEditInputChange}
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
            <div className="position-relative">
              {libroEditado.pdfUrl ? (
                <div className="border rounded p-3 mb-2">
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                      <i className="bi bi-file-pdf text-danger me-2 fs-4"></i>
                      <div>
                        <a href={libroEditado.pdfUrl} target="_blank" rel="noopener noreferrer" className="text-decoration-none">
                          Ver PDF actual
                        </a>
                        <div className="text-muted small">Haz clic para ver el PDF</div>
                      </div>
                    </div>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => {
                        setLibroEditado(prev => ({ ...prev, pdfUrl: "" }));
                        setPdfFile(null);
                      }}
                    >
                      <i className="bi bi-x-lg"></i>
                    </Button>
                  </div>
                </div>
              ) : (
                <Form.Control
                  type="file"
                  accept=".pdf"
                  onChange={handleEditPdfChange}
                  className="form-control-lg"
                  disabled={isLoading}
                />
              )}
            </div>
            {!libroEditado.pdfUrl && (
              <div className="text-muted small mt-1">
                Selecciona un nuevo PDF para reemplazar el actual
              </div>
            )}
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer className="border-0 pt-0">
        <Button
          variant="light"
          onClick={() => setShowEditModal(false)}
          className="px-4"
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
              Actualizando cambios...
            </>
          ) : (
            <>
              <i className="bi bi-check-circle me-2"></i>
              Actualizar Cambios
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEdicionLibro;