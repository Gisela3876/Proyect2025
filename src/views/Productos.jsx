import React, { useState, useEffect, useCallback } from "react";
import { Container, Button } from "react-bootstrap";
import { db } from "../assets/database/firebaseconfig";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import TablaProductos from "../components/Productos/TablaProductos";
import ModalRegistroProducto from "../components/Productos/ModalRegistroProducto";
import ModalEdicionProducto from "../components/Productos/ModalEdicionProducto";
import ModalEliminacionProducto from "../components/Productos/ModalEliminacionProducto";
import AnimacionEliminacion from "../components/Productos/AnimacionEliminacion";
import { useAuth } from "../assets/database/authcontext";
import { useNavigate } from "react-router-dom";
import CuadroBusquedas from "../components/Busquedas/CuadroBusquedas";
import Paginacion from "../components/Ordenamiento/Paginacion";

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [filteredProductos, setFilteredProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAnimacionEliminacion, setShowAnimacionEliminacion] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [nuevoProducto, setNuevoProducto] = useState({
    nombreProducto: "",
    precio: "",
    categoria: "",
    imagen: "",
  });
  const [productoEditado, setProductoEditado] = useState(null);
  const [productoAEliminar, setProductoAEliminar] = useState(null);

  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const productosCollection = collection(db, "productos");
  const categoriasCollection = collection(db, "categorias");

  const handleAddProducto = async () => {
    if (!isLoggedIn) {
      alert("Debes iniciar sesión para agregar un producto.");
      navigate("/login");
      return;
    }

    if (!nuevoProducto.nombreProducto || !nuevoProducto.precio || !nuevoProducto.categoria) {
      alert("Por favor, completa todos los campos requeridos.");
      return;
    }
    setIsLoading(true);
    try {
      await addDoc(productosCollection, nuevoProducto);
      setShowModal(false);
      setNuevoProducto({
        nombreProducto: "",
        precio: "",
        categoria: "",
        imagen: "",
      });
      await fetchData();
    } catch (error) {
      console.error("Error al agregar producto:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditProducto = async () => {
    if (!isLoggedIn) {
      alert("Debes iniciar sesión para editar un producto.");
      navigate("/login");
      return;
    }

    if (!productoEditado.nombreProducto || !productoEditado.precio || !productoEditado.categoria) {
      alert("Por favor, completa todos los campos requeridos.");
      return;
    }
    setIsLoading(true);
    try {
      const productoRef = doc(db, "productos", productoEditado.id);
      await updateDoc(productoRef, productoEditado);
      setShowEditModal(false);
      await fetchData();
    } catch (error) {
      console.error("Error al actualizar producto:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProducto = async () => {
    if (!isLoggedIn) {
      alert("Debes iniciar sesión para eliminar un producto.");
      navigate("/login");
      return;
    }

    if (productoAEliminar) {
      try {
        setShowAnimacionEliminacion(true);
        const productoRef = doc(db, "productos", productoAEliminar.id);
        await deleteDoc(productoRef);
        setShowDeleteModal(false);
        await fetchData();
      } catch (error) {
        console.error("Error al eliminar producto:", error);
      } finally {
        setShowAnimacionEliminacion(false);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevoProducto((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setProductoEditado((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const openEditModal = (producto) => {
    setProductoEditado(producto);
    setShowEditModal(true);
  };

  const openDeleteModal = (producto) => {
    setProductoAEliminar(producto);
    setShowDeleteModal(true);
  };

  const fetchData = useCallback(async () => {
    try {
      const querySnapshot = await getDocs(productosCollection);
      const fetchedProductos = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setProductos(fetchedProductos);
    } catch (error) {
      console.error("Error al obtener productos:", error);
    }
  }, [productosCollection]);

  const fetchCategorias = useCallback(async () => {
    try {
      const categoriasData = await getDocs(categoriasCollection);
      const fetchedCategorias = categoriasData.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setCategorias(fetchedCategorias);
    } catch (error) {
      console.error("Error al obtener categorías:", error);
    }
  }, [categoriasCollection]);

  useEffect(() => {
    const cargarDatos = async () => {
      await fetchData();
      await fetchCategorias();
    };
    cargarDatos();
  }, [fetchData, fetchCategorias]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredProductos(productos);
    } else {
      const filtered = productos.filter((producto) =>
        producto.nombreProducto.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProductos(filtered);
    }
  }, [searchTerm, productos]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const paginatedProductos = filteredProductos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Container className="mt-5">
      <br />
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Gestión de Productos</h2>
        {isLoggedIn && (
          <Button variant="primary" onClick={() => setShowModal(true)}>
            <i className="bi bi-plus-circle me-2"></i>
            Agregar Producto
          </Button>
        )}
      </div>

      <CuadroBusquedas
        searchText={searchTerm}
        handleSearchChange={handleSearchChange}
        placeholder="Buscar producto por nombre, categoría o precio..."
      />

      <TablaProductos
        productos={paginatedProductos}
        openEditModal={openEditModal}
        openDeleteModal={openDeleteModal}
      />

      <Paginacion
        itemsPerPage={itemsPerPage}
        totalItems={filteredProductos.length}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />

      <ModalRegistroProducto
        showModal={showModal}
        setShowModal={setShowModal}
        nuevoProducto={nuevoProducto}
        handleInputChange={handleInputChange}
        handleAddProducto={handleAddProducto}
        categorias={categorias}
        isLoading={isLoading}
      />
      <ModalEdicionProducto
        showEditModal={showEditModal}
        setShowEditModal={setShowEditModal}
        productoEditado={productoEditado}
        setProductoEditado={setProductoEditado}
        handleEditInputChange={handleEditInputChange}
        handleEditProducto={handleEditProducto}
        categorias={categorias}
        isLoading={isLoading}
      />
      <ModalEliminacionProducto
        showDeleteModal={showDeleteModal}
        setShowDeleteModal={setShowDeleteModal}
        handleDeleteProducto={handleDeleteProducto}
      />
      <AnimacionEliminacion
        show={showAnimacionEliminacion}
        onHide={() => setShowAnimacionEliminacion(false)}
      />
    </Container>
  );
};

export default Productos;