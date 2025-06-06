import React from "react";
import { Table, Button } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

const TablaProductos = ({ productos, openEditModal, openDeleteModal, generarPDFDetalleProducto }) => {
  if (!productos || productos.length === 0) {
    return (
      <div className="text-center py-4">
        <i className="bi bi-inbox display-4 text-muted"></i>
        <p className="text-muted mt-2">No hay productos disponibles.</p>
      </div>
    );
  }

  const handleCopy = (producto) => {
    const rowData = `Nombre: ${producto.nombreProducto}\nPrecio: C$${parseFloat(producto.precio).toFixed(2)}\nCategoría: ${producto.categoria}`;

    navigator.clipboard
      .writeText(rowData)
      .then(() => {
        console.log("Datos de la fila copiados al portapapeles:\n" + rowData);
        alert("Datos del producto copiados al portapapeles.");
      })
      .catch((err) => {
        console.error("Error al copiar al portapapeles:", err);
        alert("Error al copiar al portapapeles. Por favor, intenta de nuevo.");
      });
  };

  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>Imagen</th>
          <th>Nombre</th>
          <th>Precio</th>
          <th>Categoría</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {productos.map((producto) => (
          <tr key={producto.id}>
            <td>
              {producto.imagen ? (
                <img
                  src={producto.imagen}
                  alt={producto.nombreProducto}
                  style={{ width: "50px", height: "50px", objectFit: "cover" }}
                />
              ) : (
                <span>Sin imagen</span>
              )}
            </td>
            <td>{producto.nombreProducto || "Sin nombre"}</td>
            <td>C${parseFloat(producto.precio || 0).toFixed(2)}</td>
            <td>{producto.categoria || "Sin categoría"}</td>
            <td>
              <Button
                variant="outline-warning"
                size="sm"
                className="me-2"
                onClick={() => openEditModal(producto)}
              >
                <i className="bi bi-pencil"></i>
              </Button>
              <Button
                variant="outline-danger"
                size="sm"
                className="me-2"
                onClick={() => openDeleteModal(producto)}
              >
                <i className="bi bi-trash"></i>
              </Button>
              <Button
                variant="outline-info"
                size="sm"
                className="me-2"
                onClick={() => handleCopy(producto)}
              >
                <i className="bi bi-clipboard"></i>
              </Button>
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => {
                  if (generarPDFDetalleProducto) {
                    generarPDFDetalleProducto(producto);
                  } else {
                    console.error("generarPDFDetalleProducto no está definido");
                    alert("Función para generar PDF no disponible.");
                  }
                }}
              >
                <i className="bi bi-file-earmark-pdf"></i>
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default TablaProductos;