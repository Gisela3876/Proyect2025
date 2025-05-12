import React, { useState, useEffect, useCallback } from "react";
import { Container, Row, Form, Col } from "react-bootstrap";
import { db } from "../../assets/database/firebaseconfig";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import TarjetaProducto from "./TarjetaProducto";
import ModalEdicionProducto from "../Productos/ModalEdicionProducto";

const Catalogo = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todas");
  const [showEditModal, setShowEditModal] = useState(false);
  const [productoEditado, setProductoEditado] = useState(null);

  const productosCollection = collection(db, "productos");
  const categoriasCollection = collection(db, "categorias");

  const fetchData = useCallback(async () => {
    try {
      // Obtener productos
      const productosData = await getDocs(productosCollection);
      const fetchedProductos = productosData.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setProductos(fetchedProductos);

      // Obtener categorías
      const categoriasData = await getDocs(categoriasCollection);
      const fetchedCategorias = categoriasData.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setCategorias(fetchedCategorias);
    } catch (error) {
      console.error("Error al obtener datos:", error);
    }
  }, [productosCollection, categoriasCollection]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Función para abrir el modal de edición
  const openEditModal = (producto) => {
    console.log("Abriendo modal para:", producto);
    setProductoEditado({ ...producto });
    setShowEditModal(true);
  };

  // Manejador de cambios en inputs del formulario de edición
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setProductoEditado((prev) => ({ ...prev, [name]: value }));
  };

  // Función para actualizar un producto
  const handleEditProducto = async () => {
    if (!productoEditado.nombreProducto || !productoEditado.precio || !productoEditado.categoria) {
      alert("Por favor, completa todos los campos requeridos.");
      return Promise.reject("Campos incompletos");
    }
    try {
      const productoRef = doc(db, "productos", productoEditado.id);
      await updateDoc(productoRef, productoEditado);
      await fetchData();
      setShowEditModal(false);
      return Promise.resolve();
    } catch (error) {
      console.error("Error al actualizar producto:", error);
      return Promise.reject(error);
    }
  };

  // Filtrar productos por categoría
  const productosFiltrados = categoriaSeleccionada === "Todas"
    ? productos
    : productos.filter((producto) => producto.categoria === categoriaSeleccionada);

  return (
    <Container className="mt-5">
      <br />
      <h4>Catálogo de Productos</h4>
      {/* Filtro de categorías */}
      <Row>
        <Col lg={3} md={3} sm={6}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">
              <i className="bi bi-funnel me-2"></i>
              Filtrar por categoría:
            </Form.Label>
            <Form.Select
              value={categoriaSeleccionada}
              onChange={(e) => setCategoriaSeleccionada(e.target.value)}
              className="form-select-lg"
              style={{
                backgroundColor: '#fff',
                color: '#212529',
                borderColor: '#dee2e6',
                cursor: 'pointer',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                border: '1px solid #dee2e6',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                transition: 'all 0.2s ease-in-out'
              }}
            >
              <option value="Todas" className="text-dark">Todas las categorías</option>
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
          </Form.Group>
        </Col>
      </Row>

      {/* Catálogo de productos filtrados */}
      <Row>
        {productosFiltrados.length > 0 ? (
          productosFiltrados.map((producto) => (
            <TarjetaProducto 
              key={producto.id} 
              producto={producto} 
              openEditModal={openEditModal}
            />
          ))
        ) : (
          <div className="text-center py-5">
            <i className="bi bi-search display-4 text-muted mb-3"></i>
            <p className="text-muted">No hay productos en esta categoría.</p>
          </div>
        )}
      </Row>

      {/* Modal de edición */}
      {productoEditado && (
        <ModalEdicionProducto
          showEditModal={showEditModal}
          setShowEditModal={setShowEditModal}
          productoEditado={productoEditado}
          handleEditInputChange={handleEditInputChange}
          handleEditProducto={handleEditProducto}
          categorias={categorias}
        />
      )}
    </Container>
  );
};

export default Catalogo;