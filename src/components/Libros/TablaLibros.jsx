import React from "react";
import { Table, Button } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

const TablaLibros = ({
  libros,
  openEditModal,
  openDeleteModal,
  openQRModal,
  handleCopy,
  isLoggedIn,
}) => {
  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Autor</th>
          <th>Género</th>
          <th>PDF</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {libros.map((libro) => (
          <tr key={libro.id}>
            <td>{libro.nombre}</td>
            <td>{libro.autor}</td>
            <td>{libro.genero}</td>
            <td>
              {libro.pdfUrl ? (
                <a href={libro.pdfUrl} target="_blank" rel="noopener noreferrer">
                  Ver PDF
                </a>
              ) : (
                <span>Sin PDF</span>
              )}
            </td>
            <td>
              {libro.pdfUrl ? (
                <Button
                  variant="outline-dark"
                  size="sm"
                  onClick={() => openQRModal(libro.pdfUrl)}
                  className="me-2"
                >
                  Ver QR
                </Button>
              ) : (
                <Button
                  variant="outline-dark"
                  size="sm"
                  disabled
                  className="me-2"
                >
                  Ver QR
                </Button>
              )}
              <Button
                variant="outline-info"
                size="sm"
                onClick={() => handleCopy(libro)}
                className="me-2"
              >
                <i className="bi bi-clipboard"></i>
              </Button>
              {isLoggedIn && (
                <>
                  <Button
                    variant="outline-warning"
                    size="sm"
                    onClick={() => openEditModal(libro)}
                    className="me-2"
                  >
                    <i className="bi bi-pencil"></i>
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => openDeleteModal(libro)}
                  >
                    <i className="bi bi-trash"></i>
                  </Button>
                </>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default TablaLibros;