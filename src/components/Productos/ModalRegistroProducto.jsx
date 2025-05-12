import React, { useState } from "react";
import { Modal, Form, Button, InputGroup, Row, Col } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

const ModalRegistroProducto = ({
  showModal,
  setShowModal,
  nuevoProducto,
  handleInputChange,
  handleAddProducto,
  categorias,
  isLoading,
}) => {
  const [previewImage, setPreviewImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState(null); // Nuevo estado para errores

  const validateForm = () => {
    const newErrors = {};
    if (!nuevoProducto.nombreProducto.trim()) {
      newErrors.nombreProducto = "El nombre del producto es requerido";
    }
    if (!nuevoProducto.precio || nuevoProducto.precio <= 0) {
      newErrors.precio = "El precio debe ser mayor a 0";
    }
    if (!nuevoProducto.categoria) {
      newErrors.categoria = "Debes seleccionar una categoría";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevenir comportamiento por defecto del formulario
    if (!validateForm()) return;

    setSubmitError(null); // Limpiar errores previos
    try {
      await handleAddProducto();
      handleClose(); // Cerrar el modal solo si el guardado es exitoso
    } catch (error) {
      setSubmitError("Error al guardar el producto. Intenta de nuevo.");
      console.error("Error en handleSubmit:", error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("La imagen no debe superar los 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        handleInputChange({
          target: { name: "imagen", value: reader.result },
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setShowModal(false);
      setPreviewImage(null); // Limpiar vista previa
      setErrors({}); // Limpiar errores
      setSubmitError(null); // Limpiar mensaje de error
    }
  };

  return (
    <Modal
      show={showModal}
      onHide={handleClose}
      size="lg"
      centered
      className="modal-registro-producto"
      backdrop="static"
    >
      <Modal.Header closeButton className="border-0 pb-2">
        <Modal.Title className="fw-bold">
          <i className="bi bi-box-seam me-2"></i>
          Agregar Nuevo Producto
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="pt-3 pb-4">
        <Form onSubmit={handleSubmit}>
          {submitError && (
            <div className="alert alert-danger" role="alert">
              {submitError}
            </div>
          )}
          <Row className="g-3">
            <Col xs={12} md={6}>
              <Form.Group>
                <Form.Label className="fw-semibold">
                  <i className="bi bi-tag me-2"></i>
                  Nombre del Producto
                </Form.Label>
                <Form.Control
                  type="text"
                  name="nombreProducto"
                  value={nuevoProducto.nombreProducto}
                  onChange={handleInputChange}
                  placeholder="Ingresa el nombre del producto"
                  className={`form-control-lg ${errors.nombreProducto ? "is-invalid" : ""}`}
                  disabled={isLoading}
                />
                {errors.nombreProducto && (
                  <div className="invalid-feedback">{errors.nombreProducto}</div>
                )}
              </Form.Group>
            </Col>
            <Col xs={12} md={6}>
              <Form.Group>
                <Form.Label className="fw-semibold">
                  <i className="bi bi-currency-dollar me-2"></i>
                  Precio
                </Form.Label>
                <InputGroup className="input-group-lg">
                  <InputGroup.Text className="bg-light border-end-0">
                    <i className="bi bi-currency-dollar"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="number"
                    name="precio"
                    value={nuevoProducto.precio}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    className={`border-start-0 ${errors.precio ? "is-invalid" : ""}`}
                    disabled={isLoading}
                  />
                </InputGroup>
                {errors.precio && (
                  <div className="invalid-feedback">{errors.precio}</div>
                )}
              </Form.Group>
            </Col>
            <Col xs={12}>
              <Form.Group>
                <Form.Label className="fw-semibold">
                  <i className="bi bi-grid me-2"></i>
                  Categoría
                </Form.Label>
                <Form.Select
                  name="categoria"
                  value={nuevoProducto.categoria}
                  onChange={handleInputChange}
                  className={`form-select-lg ${errors.categoria ? "is-invalid" : ""}`}
                  disabled={isLoading}
                >
                  <option value="" className="text-muted">
                    Selecciona una categoría
                  </option>
                  {categorias.map((categoria) => (
                    <option
                      key={categoria.id}
                      value={categoria.nombreCategoria}
                      className="text-dark"
                    >
                      {categoria.nombreCategoria}
                    </option>
                  ))}
                </Form.Select>
                {errors.categoria && (
                  <div className="invalid-feedback">{errors.categoria}</div>
                )}
              </Form.Group>
            </Col>
            <Col xs={12}>
              <Form.Group>
                <Form.Label className="fw-semibold">
                  <i className="bi bi-image me-2"></i>
                  Imagen del Producto
                </Form.Label>
                <div className="d-flex flex-column flex-md-row align-items-md-center gap-3">
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="form-control-lg"
                    disabled={isLoading}
                  />
                  {previewImage && (
                    <div className="preview-image-container mt-2 mt-md-0">
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="preview-image"
                      />
                      <Button
                        variant="outline-danger"
                        size="sm"
                        className="preview-remove-btn"
                        onClick={() => {
                          setPreviewImage(null);
                          handleInputChange({
                            target: { name: "imagen", value: "" },
                          });
                        }}
                        disabled={isLoading}
                      >
                        <i className="bi bi-x-lg"></i>
                      </Button>
                    </div>
                  )}
                </div>
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer className="border-0 pt-0">
        <Button
          variant="light"
          onClick={handleClose}
          className="px-4"
          disabled={isLoading}
        >
          Cancelar
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          className="px-4"
          style={{ backgroundColor: "#0093E9", borderColor: "#0093E9" }}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Guardando
            </>
          ) : (
            <>
              <i className="bi bi-plus-circle me-2"></i>
              Agregar Producto
            </>
          )}
        </Button>
      </Modal.Footer>

      <style jsx>{`
        .modal-registro-producto .modal-content {
          border-radius: 10px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .preview-image-container {
          position: relative;
          display: inline-block;
        }
        .preview-image {
          max-width: 100px;
          max-height: 100px;
          object-fit: cover;
          border-radius: 5px;
        }
        .preview-remove-btn {
          position: absolute;
          top: -10px;
          right: -10px;
          padding: 2px 6px;
        }
        @media (max-width: 767px) {
          .modal-registro-producto .modal-dialog {
            margin: 1rem;
          }
          .preview-image {
            max-width: 80px;
            max-height: 80px;
          }
        }
      `}</style>
    </Modal>
  );
};

export default ModalRegistroProducto;