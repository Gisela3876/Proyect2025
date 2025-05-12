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
import TablaCategorias from "../components/Categorias/TablaCategorias";
import ModalRegistroCategoria from "../components/Categorias/ModalRegistroCategoria";
import ModalEdicionCategoria from "../components/Categorias/ModalEdicionCategoria";
import ModalEliminacionCategoria from "../components/Categorias/ModalEliminacionCategoria";
import AnimacionEliminacion from "../components/Categorias/AnimacionEliminacion";
import AnimacionRegistro from "../components/Categorias/AnimacionRegistro";
import { useAuth } from "../assets/database/authcontext";
import { useNavigate } from "react-router-dom";
import CuadroBusquedas from "../components/Busquedas/CuadroBusquedas";
import Paginacion from "../components/Ordenamiento/Paginacion";

const Categorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [filteredCategorias, setFilteredCategorias] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAnimacionRegistro, setShowAnimacionRegistro] = useState(false);
  const [showAnimacionEliminacion, setShowAnimacionEliminacion] = useState(false);
  const [nuevaCategoria, setNuevaCategoria] = useState({
    nombreCategoria: "",
    descripcionCategoria: "",
  });
  const [categoriaEditada, setCategoriaEditada] = useState(null);
  const [categoriaAEliminar, setCategoriaAEliminar] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  // Detectar conexión/desconexión
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "categorias"));
      const categoriasData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log("Categorías cargadas:", categoriasData);
      setCategorias(categoriasData);
      setFilteredCategorias(categoriasData);
    } catch (error) {
      console.error("Error al obtener categorías:", error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSearchChange = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    if (!term.trim()) {
      setFilteredCategorias(categorias);
    } else {
      const filtered = categorias.filter(
        (categoria) =>
          categoria.nombreCategoria.toLowerCase().includes(term) ||
          categoria.descripcionCategoria.toLowerCase().includes(term)
      );
      setFilteredCategorias(filtered);
    }
  };

  const handleAddCategoria = async () => {
    if (!isLoggedIn) {
      alert("Debes iniciar sesión para agregar una categoría.");
      navigate("/login");
      return;
    }
    if (!nuevaCategoria.nombreCategoria || !nuevaCategoria.descripcionCategoria) {
      alert("Por favor, completa todos los campos.");
      return;
    }
    try {
      setShowAnimacionRegistro(true);
      await addDoc(collection(db, "categorias"), nuevaCategoria);
      setShowModal(false);
      setNuevaCategoria({ nombreCategoria: "", descripcionCategoria: "" });
      await fetchData();
    } catch (error) {
      console.error("Error al agregar categoría:", error);
      alert("Error al agregar la categoría.");
    } finally {
      setShowAnimacionRegistro(false);
    }
  };

  const handleEditCategoria = async () => {
    if (!isLoggedIn) {
      alert("Debes iniciar sesión para editar una categoría.");
      navigate("/login");
      return;
    }
    if (!categoriaEditada || !categoriaEditada.id) {
      alert("No hay una categoría seleccionada para editar.");
      return;
    }
    if (!categoriaEditada.nombreCategoria || !categoriaEditada.descripcionCategoria) {
      alert("Completa todos los campos.");
      return;
    }
    try {
      setShowAnimacionRegistro(true);
      const categoriaRef = doc(db, "categorias", categoriaEditada.id);
      await updateDoc(categoriaRef, {
        nombreCategoria: categoriaEditada.nombreCategoria,
        descripcionCategoria: categoriaEditada.descripcionCategoria,
      });
      setShowEditModal(false);
      await fetchData();
    } catch (error) {
      console.error("Error al editar categoría:", error);
      alert("Error al editar la categoría.");
    } finally {
      setShowAnimacionRegistro(false);
    }
  };

  const handleDeleteCategoria = async () => {
    if (!isLoggedIn) {
      alert("Debes iniciar sesión para eliminar una categoría.");
      navigate("/login");
      return;
    }
    if (!categoriaAEliminar || !categoriaAEliminar.id) {
      alert("No hay una categoría seleccionada para eliminar.");
      return;
    }
    try {
      setShowAnimacionEliminacion(true);
      const categoriaRef = doc(db, "categorias", categoriaAEliminar.id);
      await deleteDoc(categoriaRef);
      setShowDeleteModal(false);
      setCategoriaAEliminar(null);
      await fetchData();
    } catch (error) {
      console.error("Error al eliminar categoría:", error);
      alert("Error al eliminar la categoría.");
    } finally {
      setShowAnimacionEliminacion(false);
    }
  };

  const handleOpenEditModal = (categoria) => {
    setCategoriaEditada(categoria);
    setShowEditModal(true);
  };

  const handleOpenDeleteModal = (categoria) => {
    setCategoriaAEliminar(categoria);
    setShowDeleteModal(true);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCategorias = filteredCategorias.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <>
      <Container className="mt-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Categorías</h2>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            Agregar Categoría
          </Button>
        </div>

        <CuadroBusquedas
          searchText={searchTerm}
          handleSearchChange={handleSearchChange}
          placeholder="Buscar categoría..."
        />

        {isOffline && (
          <div className="alert alert-warning text-center" role="alert">
            Estás sin conexión. Trabajando en modo offline.
          </div>
        )}

        <TablaCategorias
          categorias={currentCategorias}
          openEditModal={handleOpenEditModal}
          openDeleteModal={handleOpenDeleteModal}
        />

        <Paginacion
          itemsPerPage={itemsPerPage}
          totalItems={filteredCategorias.length}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />

        <ModalRegistroCategoria
          show={showModal}
          handleClose={() => setShowModal(false)}
          handleSave={handleAddCategoria}
          categoria={nuevaCategoria}
          setCategoria={setNuevaCategoria}
        />

        <ModalEdicionCategoria
          show={showEditModal}
          handleClose={() => setShowEditModal(false)}
          handleSave={handleEditCategoria}
          categoria={categoriaEditada}
          setCategoria={setCategoriaEditada}
        />

        <ModalEliminacionCategoria
          show={showDeleteModal}
          handleClose={() => setShowDeleteModal(false)}
          handleConfirm={handleDeleteCategoria}
          categoria={categoriaAEliminar}
        />

        <AnimacionRegistro show={showAnimacionRegistro} />
        <AnimacionEliminacion show={showAnimacionEliminacion} />
      </Container>
    </>
  );
};

export default Categorias;
