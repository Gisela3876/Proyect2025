import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../assets/database/firebaseconfig';
import GraficosProductos from './GraficoProductos';

const Estadisticas = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true); // Estado para manejar la carga

  const productosCollection = collection(db, 'productos');

  useEffect(() => {
    setLoading(true); // Iniciar carga
    const unsubscribe = onSnapshot(
      productosCollection,
      (snapshot) => {
        const fetchedProductos = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setProductos(fetchedProductos);
        setLoading(false); // Finalizar carga
      },
      (error) => {
        console.error('Error al cargar productos:', error);
        alert('Error al cargar productos: ' + error.message);
        setLoading(false); // Finalizar carga incluso si hay error
      }
    );

    return () => unsubscribe(); // Cleanup al desmontar
  }, []); // Dependencias vacías para ejecutar solo al montar

  // Mapear los datos (usando nombreProducto y precio de Firebase)
  const nombres = productos.map((producto) => producto.nombreProducto || 'Sin nombre');
  const precios = productos.map((producto) => parseFloat(producto.precio) || 0);

  return (
    <Container className="mt-5">
      <h4>Estadísticas</h4>
      <Row className="mt-4">
        <Col xs={12} sm={12} md={12} lg={6} className="mb-4">
          {loading ? (
            <div className="text-center">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Cargando...</span>
              </Spinner>
              <p>Cargando datos...</p>
            </div>
          ) : productos.length === 0 ? (
            <p>No hay productos disponibles.</p>
          ) : (
            <GraficosProductos nombres={nombres} precios={precios} />
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Estadisticas;