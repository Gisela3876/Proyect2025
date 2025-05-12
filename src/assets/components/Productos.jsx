import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import TarjetaProducto from './TarjetaProducto';

const Productos = () => {
  // Ejemplo de productos
  const productos = [
    {
      id: 1,
      imagen: "https://via.placeholder.com/400x300",
      titulo: "Martillo Profesional",
      precio: 29.99,
      descripcion: "Martillo de acero forjado con mango ergonómico"
    },
    {
      id: 2,
      imagen: "https://via.placeholder.com/400x300",
      titulo: "Destornillador Set",
      precio: 39.99,
      descripcion: "Set de 6 destornilladores de diferentes tamaños"
    },
    {
      id: 3,
      imagen: "https://via.placeholder.com/400x300",
      titulo: "Taladro Eléctrico",
      precio: 89.99,
      descripcion: "Taladro inalámbrico de 18V con batería incluida"
    },
    {
      id: 4,
      imagen: "https://via.placeholder.com/400x300",
      titulo: "Sierra Circular",
      precio: 129.99,
      descripcion: "Sierra circular profesional con guía láser"
    }
  ];

  return (
    <Container className="py-5">
      <h2 className="text-center mb-4">Nuestros Productos</h2>
      <Row>
        {productos.map((producto) => (
          <Col key={producto.id} md={6} lg={3}>
            <TarjetaProducto
              imagen={producto.imagen}
              titulo={producto.titulo}
              precio={producto.precio}
              descripcion={producto.descripcion}
            />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Productos; 