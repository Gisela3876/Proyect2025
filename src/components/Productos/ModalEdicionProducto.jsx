import React, { useState, useEffect } from "react";
import { Modal, Form, Button, InputGroup, Row, Col } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

const ModalEdicionProducto = ({
  showEditModal,
  setShowEditModal,
  productoEditado,
  handleEditInputChange,
  handleEditProducto,
  categorias,
  setProductoEditado,
  isLoading, // Recibir isLoading desde Productos
}) => {
  const [imagenLocal, setImagenLocal] = useState("");
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    if (productoEditado?.imagen) setImagenLocal(productoEditado.imagen);
  }, [productoEditado]);

  const validateForm = () => {
    const newErrors = {};
    if (!productoEditado.nombreProducto.trim()) newErrors.nombreProducto = "El nombre del producto es requerido";
    if (!productoEditado.precio || productoEditado.precio <= 0) newErrors.precio = "El precio debe ser mayor a 0";
    if (!productoEditado.categoria) newErrors.categoria = "Debes seleccionar una categoría";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setSubmitError(null);
    try {
      await handleEditProducto();
      handleClose();
    } catch (error) {
      setSubmitError("Error al actualizar el producto. Intenta de nuevo.");
      console.error("Error al actualizar producto:", error);
    }
  };

  const handleImagenChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("La imagen no debe superar los 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const nuevaImagen = reader.result;
        setImagenLocal(nuevaImagen);
        setProductoEditado((prev) => ({ ...prev, imagen: nuevaImagen }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImagen = () => {
    setImagenLocal("");
    setProductoEditado((prev) => ({ ...prev, imagen: "" }));
  };

  const handleClose = () => {
    if (!isLoading) {
      setShowEditModal(false);
      setErrors({});
      setSubmitError(null);
      if (productoEditado?.imagen) setImagenLocal(productoEditado.imagen);
    }
  };

  if (!productoEditado) return null;

  return (
    <Modal
      show={showEditModal}
      onHide={handleClose}
      size="lg"
      centered
      className="modal-registro-producto"
      backdrop={isLoading ? "static" : true}
      keyboard={!isLoading}
    >
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold">
          <i className="bi bi-pencil-square me-2"></i>
          Editar Producto
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="pt-4">
        <Form onSubmit={handleSubmit}>
          {submitError && <div className="alert alert-danger">{submitError}</div>}
          <Row>
            <Col md={6}>
              <Form.Group className="mb-4">
                <Form.Label className="fw-semibold">
                  <i className="bi bi-tag me-2"></i> Nombre del Producto
                </Form.Label>
                <Form.Control
                  type="text"
                  name="nombreProducto"
                  value={productoEditado?.nombreProducto || ""}
                  onChange={handleEditInputChange}
                  placeholder="Ingresa el nombre del producto"
                  className={`form-control-lg ${errors.nombreProducto ? "is-invalid" : ""}`}
                  disabled={isLoading}
                />
                {errors.nombreProducto && <div className="invalid-feedback">{errors.nombreProducto}</div>}
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-4">
                <Form.Label className="fw-semibold">
                  <i className="bi bi-currency-dollar me-2"></i> Precio
                </Form.Label>
                <InputGroup className="input-group-lg">
                  <InputGroup.Text className="bg-light border-end-0">
                    <i className="bi bi-currency-dollar"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="number"
                    name="precio"
                    value={productoEditado?.precio || ""}
                    onChange={handleEditInputChange}
                    placeholder="0.00"
                    className={`border-start-0 ${errors.precio ? "is-invalid" : ""}`}
                    disabled={isLoading}
                  />
                </InputGroup>
                {errors.precio && <div className="invalid-feedback">{errors.precio}</div>}
              </Form.Group>
            </Col>
          </Row>
          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold">
              <i className="bi bi-grid me-2"></i> Categoría
            </Form.Label>
            <Form.Select
              name="categoria"
              value={productoEditado?.categoria || ""}
              onChange={handleEditInputChange}
              className={`form-select-lg ${errors.categoria ? "is-invalid" : ""}`}
              disabled={isLoading}
            >
              <option value="" className="text-muted">Selecciona una categoría</option>
              {categorias.map((categoria) => (
                <option key={categoria.id} value={categoria.nombreCategoria} className="text-dark">
                  {categoria.nombreCategoria}
                </option>
              ))}
            </Form.Select>
            {errors.categoria && <div className="invalid-feedback">{errors.categoria}</div>}
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Imagen</Form.Label>
            <div className="position-relative">
              {imagenLocal ? (
                <div className="d-flex align-items-center border rounded p-3">
                  <img
                    src={imagenLocal}
                    alt="Vista previa"
                    style={{ maxWidth: "100px", maxHeight: "100px", objectFit: "contain" }}
                    className="me-3"
                  />
                  <div className="flex-grow-1">
                    <p className="mb-0">Imagen actual</p>
                    <small className="text-muted">Haz clic para ver la imagen</small>
                  </div>
                  <Button variant="outline-danger" size="sm" onClick={handleRemoveImagen} disabled={isLoading}>
                    <i className="bi bi-x-lg"></i>
                  </Button>
                </div>
              ) : (
                <>
                  <Form.Control type="file" accept="image/*" onChange={handleImagenChange} className="form-control-lg" disabled={isLoading} />
                  <div className="text-muted small mt-1">Selecciona una nueva imagen para reemplazar la actual</div>
                </>
              )}
            </div>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer className="border-0 pt-0">
        <Button variant="light" onClick={handleClose} className="px-4" disabled={isLoading}>
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
              Guardando cambios...
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

export default ModalEdicionProducto;